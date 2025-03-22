import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const handleFileUpload = async (file, type) => {
  if (!selectedSection) return alert("No section selected");

  const fileRef = ref(storage, `curriculum/${curriculumId}/sections/${selectedSection.id}/${file.name}`);
  await uploadBytes(fileRef, file);
  const fileUrl = await getDownloadURL(fileRef);

  const sectionRef = doc(db, "curriculum", curriculumId, "sections", selectedSection.id);
  await updateDoc(sectionRef, {
    [type]: arrayUnion(fileUrl), // Store URLs in an array
  });

  alert(`${type} uploaded successfully!`);
};
