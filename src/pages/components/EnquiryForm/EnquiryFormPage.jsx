import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from "../../../config/firebase";
// import { db } from '../firebase'; // adjust path
import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';

const EnquiryFormPage=()=> {
  const { id } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [formTitle, setFormTitle] = useState('');

  useEffect(() => {
    const fetchFormFields = async () => {
      const docRef = doc(db, 'EnquiryForms', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormTitle(data.title || 'Enquiry Form');
        setFormFields(data.fields || []);
      }
    };
    fetchFormFields();
  }, [id]);

  const handleChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Store the filled data in Enquiries collection
    await addDoc(collection(db, 'Enquiries'), {
      formId: id,
      ...formData,
      submittedAt: new Date()
    });

    // Increment the enquiry count in EnquiryForms
    const formRef = doc(db, 'EnquiryForms', id);
    await updateDoc(formRef, {
      enquiryCount: increment(1)
    });

    alert('Enquiry submitted!');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
      <form onSubmit={handleSubmit}>
        {formFields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block font-medium">{field.label}</label>
            <input
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(e, field.name)}
              className="border p-2 w-full"
              required={field.required}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default EnquiryFormPage;
