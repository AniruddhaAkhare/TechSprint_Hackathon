import os
import json
import re
import tempfile
import traceback
import fitz  # PyMuPDF
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, PermissionDenied
from paddleocr import PaddleOCR

# ================== APP CONFIG ==================
app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)

# ================== GEMINI CONFIG ==================
# os.environ["GEMINI_API_KEY"] = "AIzaSyDc8-ekj89YBcq3jopvbz2czQcBUioKIJM"
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-2.5-flash"

# ================== ASSIGNMENT GRADER SETUP ==================
ocr_model = PaddleOCR(use_textline_orientation=True, lang='en')

def convert_pdf_to_images(pdf_path):
    image_paths = []
    temp_dir = os.path.join(tempfile.gettempdir(), "assignment_images")
    os.makedirs(temp_dir, exist_ok=True)
    try:
        doc = fitz.open(pdf_path)
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=300)
            temp_image_path = os.path.join(temp_dir, f"page_{i}.png")
            pix.save(temp_image_path)
            image_paths.append(temp_image_path)
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
    return image_paths

def cleanup_images(image_paths):
    for img in image_paths:
        try:
            os.remove(img)
        except Exception as e:
            print(f"Warning: could not delete {img}: {e}")

def extract_text_from_pdf(pdf_path):
    extracted_text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            page_text = page.get_text().strip()
            if page_text:
                extracted_text += page_text + "\n"
    except Exception as e:
        print(f"Error opening PDF: {e}")
        return ""

    if not extracted_text.strip():
        print("No digital text found, using OCR...")
        image_paths = convert_pdf_to_images(pdf_path)
        for img_path in image_paths:
            try:
                result = ocr_model.predict(img_path)
                for line in result[0]:
                    extracted_text += line[1][0] + " "
                extracted_text += "\n"
            except Exception as e:
                print(f"OCR error on {img_path}: {e}")
        cleanup_images(image_paths)

    return extracted_text.strip()

def split_into_qa_pairs(text):
    if not text.strip():
        return [{"question": "Full Assignment", "answer": "No text extracted"}]

    pattern = re.compile(r"(?:Q\d+\.|Question\s*\d+|^\d+\.)", re.IGNORECASE | re.MULTILINE)
    parts = pattern.split(text)
    questions = pattern.findall(text)
    qa_pairs = []

    try:
        for i, q in enumerate(questions):
            question_text = q + " " + parts[i + 1].strip() if i + 1 < len(parts) else parts[i].strip()
            ans_split = re.split(r"(?:Answer:|Ans:)", question_text, flags=re.IGNORECASE)
            if len(ans_split) > 1:
                question = ans_split[0].strip()
                answer = ans_split[1].strip()
            else:
                question = question_text.strip()
                answer = "Not clearly found."
            qa_pairs.append({"question": question, "answer": answer})
    except Exception as e:
        print(f"Error splitting into Q&A: {e}")
        qa_pairs = [{"question": "Full Assignment", "answer": text}]

    if not qa_pairs:
        qa_pairs.append({"question": "Full Assignment", "answer": text})

    return qa_pairs

def assess_with_gemini_text(subject, qa_pairs):
    model = genai.GenerativeModel(MODEL_NAME)
    qa_block = ""
    for i, pair in enumerate(qa_pairs, 1):
        qa_block += f"""
Question {i}: {pair['question']}
Answer {i}: {pair['answer']}
"""

    prompt = f"""
You are an expert university assignment evaluator in {subject}.

Evaluate EACH question separately.

For every question, return the following fields exactly:
Accuracy:
Completeness:
Clarity:
Grammar:
Depth:
Suggested Answer:
Improvement:
Score (0-10):

Respond strictly in this format:

Q1:
Accuracy: ...
Completeness: ...
Clarity: ...
Grammar: ...
Depth: ...
Suggested Answer: ...
Improvement: ...
Score: ...

Q2:
...

DO NOT add extra explanations.

QUESTIONS AND ANSWERS:
{qa_block}
"""
    try:
        response = model.generate_content(prompt)
        assessment_text = response.text.strip()
    except Exception as e:
        print("Gemini API error:", e)
        traceback.print_exc()
        return {"questions": [], "overall_score": 0, "result": "Fail"}

    results = []
    total_score = 0
    question_blocks = re.split(r"\nQ\d+:\n", "\n" + assessment_text)[1:]

    for idx, block in enumerate(question_blocks):
        evaluation = {}
        fields = ["accuracy", "completeness", "clarity", "grammar", "depth", "suggested answer", "improvement", "score"]
        for f in fields:
            m = re.search(f"{f}\\s*:\\s*(.+)", block, re.IGNORECASE)
            evaluation[f.replace(" ", "_")] = m.group(1).strip() if m else "N/A"
        try:
            score = float(evaluation.get("score", 0))
            score = max(0, min(10, score))
        except:
            score = 0
        total_score += score
        results.append({
            "question": qa_pairs[idx]["question"],
            "answer": qa_pairs[idx]["answer"],
            "evaluation": evaluation,
            "score": score
        })

    overall_score = round((total_score / (len(results) * 10)) * 100, 2) if results else 0
    result_status = "Pass" if overall_score >= 50 else "Fail"

    return {"questions": results, "overall_score": overall_score, "result": result_status}

# ================== SAFE JSON HANDLER FOR RESUME ==================
def safe_json_from_ai(text):
    try:
        text = text.strip()

        # Remove markdown code fences if present
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        # First attempt: try parsing directly (BEST CASE)
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass  # fall back to cleanup

        # Extract JSON object
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            return None

        json_text = match.group(0)

        # Minimal safe cleanup (DO NOT touch quotes)
        json_text = re.sub(r",\s*}", "}", json_text)
        json_text = re.sub(r",\s*]", "]", json_text)

        return json.loads(json_text)

    except Exception as e:
        print("❌ JSON PARSE FAILED")
        print("🔴 RAW AI OUTPUT:\n", text)
        print("ERROR:", e)
        return None



# ================== HELPER FOR JSON EXTRACTION ==================
def extract_json(text):
    match = re.search(r"\{[\s\S]*\}", text)
    return match.group(0) if match else None

# ================== ROUTES ==================
# ----- ASSIGNMENT GRADER -----
@app.route("/evaluate", methods=["POST", "OPTIONS"])
def evaluate():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        if "file" not in request.files or "subject" not in request.form:
            return jsonify({"error": "Missing file or subject name"}), 400
        file = request.files["file"]
        subject = request.form["subject"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
            file.save(tmp_pdf.name)
        extracted_text = extract_text_from_pdf(tmp_pdf.name)
        qa_pairs = split_into_qa_pairs(extracted_text)
        assessment_result = assess_with_gemini_text(subject, qa_pairs)
        try:
            os.remove(tmp_pdf.name)
        except:
            pass
        return jsonify(assessment_result), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ----- QUIZ GENERATION & ASSESSMENT -----
@app.route("/generate-quiz", methods=["POST", "OPTIONS"])
def generate_quiz():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.json or {}
        subject = data.get("subject")
        num_questions = int(data.get("num_questions", 5))
        difficulty = data.get("difficulty", "medium")

        if not subject:
            return jsonify({"error": "Subject is required"}), 400

        model = genai.GenerativeModel(MODEL_NAME)

        prompt = f"""
Generate a {num_questions}-question multiple-choice quiz for engineering students on {subject}.
Difficulty level: {difficulty}.

STRICT RULES:
- Each question must have EXACTLY 4 options
- Label options as A, B, C, D
- Provide the correct answer letter
- Output ONLY valid JSON (no markdown, no explanation)

JSON FORMAT:
[
  {{
    "question": "Question text",
    "options": {{
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    }},
    "answer": "A"
  }}
]
"""

        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        if not raw_text:
            return jsonify({"error": "Empty response from Gemini"}), 500

        # ✅ FIX: remove markdown fences if present
        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        try:
            quiz = json.loads(raw_text)
        except json.JSONDecodeError:
            print("❌ Invalid JSON from Gemini:\n", raw_text)
            return jsonify({"error": "Invalid JSON from Gemini"}), 500

        return jsonify({"quiz": quiz}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/assess-quiz", methods=["POST", "OPTIONS"])
def assess_quiz():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.json or {}

        subject = data.get("subject")
        quiz = data.get("quiz")
        student_answers = data.get("student_answers")

        if not subject or not quiz or not student_answers:
            return jsonify({"error": "Missing subject, quiz, or student_answers"}), 400

        if len(quiz) != len(student_answers):
            return jsonify({"error": "Answer count mismatch"}), 400

        model = genai.GenerativeModel(MODEL_NAME)

        assessment_prompt = f"""
You are an expert university examiner in {subject}.

Evaluate the quiz answers.

Quiz:
{json.dumps(quiz)}

Student Answers:
{json.dumps(student_answers)}

STRICT OUTPUT JSON ONLY:
{{
  "questions": [
    {{
      "question": "...",
      "student_answer": "...",
      "correct_answer": "...",
      "correct": true,
      "explanation": "...",
      "score": 1
    }}
  ],
  "total_score": 5,
  "percentage": 80.0,
  "result": "Pass"
}}
"""

        response = model.generate_content(assessment_prompt)
        raw_text = response.text.strip()

        if not raw_text:
            return jsonify({"error": "Empty response from Gemini"}), 500

        assessment = safe_json_from_ai(raw_text)

        if not assessment:
            print("❌ Invalid JSON from Gemini:\n", raw_text)
            return jsonify({"error": "Invalid JSON from Gemini"}), 500

        #  FIX: map `questions` → `question_wise`
        question_wise = assessment.get("questions", [])

        return jsonify({
            "total_score": assessment.get("total_score", 0),
            "percentage": assessment.get("percentage", 0),
            "result": assessment.get("result", "Fail"),
            "question_wise": question_wise
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ----- JOB PREDICTION -----
@app.route("/predict-jobs", methods=["POST", "OPTIONS"])
def predict_jobs():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 200
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"error": "Invalid or missing JSON body"}), 400
        education_level = data.get("educationLevel")
        branch = data.get("branch")
        preferred_role = data.get("preferredRole")
        location = data.get("location")
        job_type = data.get("jobType")
        skills = data.get("skills", "")
        if not all([education_level, branch, preferred_role, location, job_type]):
            return jsonify({"error": "Missing required fields"}), 400
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
You are an expert career counselor for engineering students.

Candidate profile:
- Education Level: {education_level}
- Branch: {branch}
- Preferred Role: {preferred_role}
- Location: {location}
- Job Type: {job_type}
- Skills: {skills}

Generate 10–12 realistic job predictions.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanation
- No text outside JSON

FORMAT:
{{
  "predictions": [
    {{
      "company": "Company Name",
      "role": "Job Role",
      "location": "{location}",
      "job_type": "{job_type}",
      "salary": "₹X - ₹Y LPA",
      "experience": "0-2 years",
      "skills": ["Skill1", "Skill2", "Skill3"]
    }}
  ]
}}
"""
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        json_text = extract_json(raw_text)
        if not json_text:
            return jsonify({"error": "Invalid response format from AI"}), 500
        parsed = json.loads(json_text)
        if "predictions" not in parsed or not isinstance(parsed["predictions"], list):
            return jsonify({"error": "AI response missing predictions"}), 500
        return jsonify(parsed), 200
    except ResourceExhausted:
        return jsonify({"error": "Gemini API quota exceeded"}), 429
    except PermissionDenied:
        return jsonify({"error": "Gemini API key invalid or disabled."}), 403
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse Gemini response."}), 500
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ----- AI TUTOR -----
@app.route("/ai-tutor", methods=["POST"])
def ai_tutor():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        message = data.get("message")
        mode = data.get("mode")
        history = data.get("history", [])
        if not message or not mode:
            return jsonify({"error": "Missing message or mode"}), 400
        model = genai.GenerativeModel(MODEL_NAME)
        if mode == "ANSWER":
            system_prompt = f"""
You are an AI tutor.

Answer the student's question clearly and concisely.
Explain in simple language.
Avoid unnecessary verbosity.

Student question:
{message}
"""
        else:
            system_prompt = f"""
You are an AI tutor using the Socratic method.

RULES:
- DO NOT give direct answers
- Ask only ONE guiding question at a time
- Help the student reason step by step
- Encourage thinking
- When the student reaches the answer, summarize briefly

Conversation so far:
{history}

Student's question or response:
{message}
"""
        response = model.generate_content(system_prompt)
        reply = response.text.strip()
        return jsonify({"reply": reply}), 200
    except ResourceExhausted:
        return jsonify({"error": "Gemini quota exceeded"}), 429
    except PermissionDenied:
        return jsonify({"error": "Gemini API not enabled"}), 403
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ----- RESUME BUILDER -----
@app.route("/build-resume", methods=["POST", "OPTIONS"])
def build_resume():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
You are a professional resume writer.

Candidate Details:
{json.dumps(data, indent=2)}

STRICT RULES:
- Respond ONLY in valid JSON
- No markdown
- No explanation

JSON FORMAT:
{{
  "summary": "",
  "skills": [],
  "experience": [],
  "projects": [],
  "education": {{
    "degree": "",
    "institution": ""
  }}
}}
"""
        response = model.generate_content(prompt)
        result = safe_json_from_ai(response.text)
        if not result:
            return jsonify({"error": "Invalid AI resume response"}), 500
        return jsonify(result), 200
    except ResourceExhausted:
        return jsonify({"error": "Gemini quota exceeded"}), 429
    except PermissionDenied:
        return jsonify({"error": "Gemini permission denied"}), 403
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Resume generation failed"}), 500

@app.route("/analyze-ats", methods=["POST", "OPTIONS"])
def analyze_ats():

    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True)
        resume = data.get("resume")
        role = data.get("preferredRole")

        model = genai.GenerativeModel(MODEL_NAME)

        prompt = f"""
Analyze ATS compatibility for role: {role}

Resume:
{json.dumps(resume, indent=2)}

Return ONLY JSON:
{{
  "ats_score": 0,
  "strengths": [],
  "weaknesses": []
}}
"""

        response = model.generate_content(prompt)
        result = safe_json_from_ai(response.text)

        if not result:
            return jsonify({"error": "Invalid ATS response"}), 500

        return jsonify(result), 200

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "ATS analysis failed"}), 500

@app.route("/skill-gap", methods=["POST", "OPTIONS"])
def skill_gap():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json(silent=True)
        skills = data.get("skills")
        role = data.get("preferredRole")
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = f"""
Compare candidate skills with role: {role}

Candidate Skills:
{skills}

Respond ONLY in JSON:
{{
  "missing_skills": [],
  "recommended_skills": [],
  "learning_suggestions": []
}}
"""
        response = model.generate_content(prompt)
        result = safe_json_from_ai(response.text)
        if not result:
            return jsonify({"error": "Malformed AI response", "raw": response.text}), 500
        return jsonify(result), 200
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Skill gap analysis failed"}), 500

# ================== RUN APP ==================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
