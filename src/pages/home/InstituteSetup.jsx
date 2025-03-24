// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { db } from '../../config/firebase';
// // // // // import { collection, addDoc, getDocs } from 'firebase/firestore';
// // // // // import './InstituteSetup.css';
// // // // // import { FaBook } from 'react-icons/fa';

// // // // // const InstituteSetup = () => {
// // // // //   const [formData, setFormData] = useState({
// // // // //     instituteName: '',
// // // // //     instituteType: '',
// // // // //     address: '',
// // // // //     city: '',
// // // // //     state: '',
// // // // //     pincode: '',
// // // // //   });

// // // // //   const [activeStep, setActiveStep] = useState('Basic Information');

// // // // //   // Fetch data from Firebase on component mount
// // // // //   useEffect(() => {
// // // // //     const fetchData = async () => {
// // // // //       const querySnapshot = await getDocs(collection(db, 'instituteSetup'));
// // // // //       if (!querySnapshot.empty) {
// // // // //         const data = querySnapshot.docs[0].data();
// // // // //         setFormData(data);
// // // // //       }
// // // // //     };
// // // // //     fetchData();
// // // // //   }, []);

// // // // //   // Handle form input changes
// // // // //   const handleChange = (e) => {
// // // // //     const { name, value } = e.target;
// // // // //     setFormData((prev) => ({ ...prev, [name]: value }));
// // // // //   };

// // // // //   // Handle form submission
// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     try {
// // // // //       await addDoc(collection(db, 'instituteSetup'), formData);
// // // // //       alert('Data saved successfully!');
// // // // //     } catch (error) {
// // // // //       console.error('Error saving data: ', error);
// // // // //       alert('Error saving data');
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="institute-setup">
// // // // //       <div className="header">
// // // // //         <FaBook className="header-icon" />
// // // // //         <h1>Institute Setup</h1>
// // // // //       </div>

// // // // //       <div className="content">
// // // // //         <div className="steps">
// // // // //           <h2>Onboarding Steps</h2>
// // // // //           <p>Complete these steps to set up your institute</p>
// // // // //           <ul>
// // // // //             <li className={activeStep === 'Basic Information' ? 'active' : ''}>1 Basic Information</li>
// // // // //             <li>2 Logo Upload</li>
// // // // //             <li>3 Branch Setup</li>
// // // // //             <li>4 Contact Information</li>
// // // // //             <li>5 System Configuration</li>
// // // // //           </ul>
// // // // //         </div>

// // // // //         <div className="form-section">
// // // // //           <h2>Basic Information</h2>
// // // // //           <p>Enter your institute's basic details</p>
// // // // //           <form onSubmit={handleSubmit}>
// // // // //             <div className="form-row">
// // // // //               <div className="form-group">
// // // // //                 <label>Institute Name *</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   name="instituteName"
// // // // //                   value={formData.instituteName}
// // // // //                   onChange={handleChange}
// // // // //                   placeholder="Enter institute name"
// // // // //                   required
// // // // //                 />
// // // // //               </div>
// // // // //               <div className="form-group">
// // // // //                 <label>Institute Type *</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   name="instituteType"
// // // // //                   value={formData.instituteType}
// // // // //                   onChange={handleChange}
// // // // //                   placeholder="School, College, University, etc."
// // // // //                   required
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //             <div className="form-group">
// // // // //               <label>Address</label>
// // // // //               <input
// // // // //                 type="text"
// // // // //                 name="address"
// // // // //                 value={formData.address}
// // // // //                 onChange={handleChange}
// // // // //                 placeholder="Enter address"
// // // // //               />
// // // // //             </div>
// // // // //             <div className="form-row">
// // // // //               <div className="form-group">
// // // // //                 <label>City</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   name="city"
// // // // //                   value={formData.city}
// // // // //                   onChange={handleChange}
// // // // //                   placeholder="Enter city"
// // // // //                 />
// // // // //               </div>
// // // // //               <div className="form-group">
// // // // //                 <label>State</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   name="state"
// // // // //                   value={formData.state}
// // // // //                   onChange={handleChange}
// // // // //                   placeholder="Enter state"
// // // // //                 />
// // // // //               </div>
// // // // //               <div className="form-group">
// // // // //                 <label>Pincode</label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   name="pincode"
// // // // //                   value={formData.pincode}
// // // // //                   onChange={handleChange}
// // // // //                   placeholder="Enter pincode"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //             <button type="submit" className="next-btn">
// // // // //               Next →
// // // // //             </button>
// // // // //           </form>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default InstituteSetup;

// // // // import React, { useState, useEffect } from 'react';
// // // // import { db } from '../../config/firebase';
// // // // import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// // // // import './InstituteSetup.css';
// // // // import { FaBook, FaEdit, FaTrash } from 'react-icons/fa';

// // // // const InstituteSetup = () => {
// // // //   const [activeStep, setActiveStep] = useState('Basic Information');
// // // //   const [formData, setFormData] = useState({
// // // //     instituteName: '',
// // // //     instituteType: '',
// // // //     address: '',
// // // //     city: '',
// // // //     state: '',
// // // //     pincode: '',
// // // //   });
// // // //   const [branches, setBranches] = useState([]);
// // // //   const [showModal, setShowModal] = useState(false);
// // // //   const [currentBranch, setCurrentBranch] = useState(null);
// // // //   const [branchForm, setBranchForm] = useState({
// // // //     name: '',
// // // //     address: '',
// // // //     status: 'Active',
// // // //   });

// // // //   // Fetch institute data
// // // //   useEffect(() => {
// // // //     const fetchInstituteData = async () => {
// // // //       const querySnapshot = await getDocs(collection(db, 'instituteSetup'));
// // // //       if (!querySnapshot.empty) {
// // // //         const data = querySnapshot.docs[0].data();
// // // //         setFormData(data);
// // // //       }
// // // //     };
// // // //     fetchInstituteData();
// // // //   }, []);

// // // //   // Fetch branches
// // // //   useEffect(() => {
// // // //     const fetchBranches = async () => {
// // // //       const querySnapshot = await getDocs(collection(db, 'branches'));
// // // //       const branchList = querySnapshot.docs.map((doc) => ({
// // // //         id: doc.id,
// // // //         ...doc.data(),
// // // //       }));
// // // //       setBranches(branchList);
// // // //     };
// // // //     fetchBranches();
// // // //   }, []);

// // // //   // Handle institute form input changes
// // // //   const handleChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setFormData((prev) => ({ ...prev, [name]: value }));
// // // //   };

// // // //   // Handle branch form input changes
// // // //   const handleBranchChange = (e) => {
// // // //     const { name, value } = e.target;
// // // //     setBranchForm((prev) => ({ ...prev, [name]: value }));
// // // //   };

// // // //   // Handle institute form submission
// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     try {
// // // //       await addDoc(collection(db, 'instituteSetup'), formData);
// // // //       alert('Institute data saved successfully!');
// // // //       setActiveStep('Branch Setup'); // Move to the next step
// // // //     } catch (error) {
// // // //       console.error('Error saving institute data: ', error);
// // // //       alert('Error saving institute data');
// // // //     }
// // // //   };

// // // //   // Handle branch form submission (add/edit)
// // // //   const handleBranchSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     try {
// // // //       if (currentBranch) {
// // // //         // Update existing branch
// // // //         const branchRef = doc(db, 'branches', currentBranch.id);
// // // //         await updateDoc(branchRef, branchForm);
// // // //         alert('Branch updated successfully!');
// // // //       } else {
// // // //         // Add new branch
// // // //         await addDoc(collection(db, 'branches'), branchForm);
// // // //         alert('Branch added successfully!');
// // // //       }
// // // //       setShowModal(false);
// // // //       setBranchForm({ name: '', address: '', status: 'Active' });
// // // //       setCurrentBranch(null);
// // // //       // Refresh branches
// // // //       const querySnapshot = await getDocs(collection(db, 'branches'));
// // // //       const branchList = querySnapshot.docs.map((doc) => ({
// // // //         id: doc.id,
// // // //         ...doc.data(),
// // // //       }));
// // // //       setBranches(branchList);
// // // //     } catch (error) {
// // // //       console.error('Error saving branch: ', error);
// // // //       alert('Error saving branch');
// // // //     }
// // // //   };

// // // //   // Handle branch edit
// // // //   const handleEditBranch = (branch) => {
// // // //     setCurrentBranch(branch);
// // // //     setBranchForm(branch);
// // // //     setShowModal(true);
// // // //   };

// // // //   // Handle branch delete
// // // //   const handleDeleteBranch = async (branchId) => {
// // // //     if (window.confirm('Are you sure you want to delete this branch?')) {
// // // //       try {
// // // //         await deleteDoc(doc(db, 'branches', branchId));
// // // //         setBranches(branches.filter((branch) => branch.id !== branchId));
// // // //         alert('Branch deleted successfully!');
// // // //       } catch (error) {
// // // //         console.error('Error deleting branch: ', error);
// // // //         alert('Error deleting branch');
// // // //       }
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="institute-setup">
// // // //       <div className="header">
// // // //         <FaBook className="header-icon" />
// // // //         <h1>Institute Setup</h1>
// // // //       </div>

// // // //       <div className="content">
// // // //         <div className="steps">
// // // //           <h2>Onboarding Steps</h2>
// // // //           <p>Complete these steps to set up your institute</p>
// // // //           <ul>
// // // //             <li
// // // //               className={activeStep === 'Basic Information' ? 'active' : ''}
// // // //               onClick={() => setActiveStep('Basic Information')}
// // // //             >
// // // //               1 Basic Information
// // // //             </li>
// // // //             <li
// // // //               className={activeStep === 'Logo Upload' ? 'active' : ''}
// // // //               onClick={() => setActiveStep('Logo Upload')}
// // // //             >
// // // //               2 Logo Upload
// // // //             </li>
// // // //             <li
// // // //               className={activeStep === 'Branch Setup' ? 'active' : ''}
// // // //               onClick={() => setActiveStep('Branch Setup')}
// // // //             >
// // // //               3 Branch Setup
// // // //             </li>
// // // //             <li
// // // //               className={activeStep === 'Contact Information' ? 'active' : ''}
// // // //               onClick={() => setActiveStep('Contact Information')}
// // // //             >
// // // //               4 Contact Information
// // // //             </li>
// // // //             <li
// // // //               className={activeStep === 'System Configuration' ? 'active' : ''}
// // // //               onClick={() => setActiveStep('System Configuration')}
// // // //             >
// // // //               5 System Configuration
// // // //             </li>
// // // //           </ul>
// // // //         </div>

// // // //         <div className="form-section">
// // // //           {activeStep === 'Basic Information' && (
// // // //             <>
// // // //               <h2>Basic Information</h2>
// // // //               <p>Enter your institute's basic details</p>
// // // //               <form onSubmit={handleSubmit}>
// // // //                 <div className="form-row">
// // // //                   <div className="form-group">
// // // //                     <label>Institute Name *</label>
// // // //                     <input
// // // //                       type="text"
// // // //                       name="instituteName"
// // // //                       value={formData.instituteName}
// // // //                       onChange={handleChange}
// // // //                       placeholder="Enter institute name"
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label>Institute Type *</label>
// // // //                     <input
// // // //                       type="text"
// // // //                       name="instituteType"
// // // //                       value={formData.instituteType}
// // // //                       onChange={handleChange}
// // // //                       placeholder="School, College, University, etc."
// // // //                       required
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //                 <div className="form-group">
// // // //                   <label>Address</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     name="address"
// // // //                     value={formData.address}
// // // //                     onChange={handleChange}
// // // //                     placeholder="Enter address"
// // // //                   />
// // // //                 </div>
// // // //                 <div className="form-row">
// // // //                   <div className="form-group">
// // // //                     <label>City</label>
// // // //                     <input
// // // //                       type="text"
// // // //                       name="city"
// // // //                       value={formData.city}
// // // //                       onChange={handleChange}
// // // //                       placeholder="Enter city"
// // // //                     />
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label>State</label>
// // // //                     <input
// // // //                       type="text"
// // // //                       name="state"
// // // //                       value={formData.state}
// // // //                       onChange={handleChange}
// // // //                       placeholder="Enter state"
// // // //                     />
// // // //                   </div>
// // // //                   <div className="form-group">
// // // //                     <label>Pincode</label>
// // // //                     <input
// // // //                       type="text"
// // // //                       name="pincode"
// // // //                       value={formData.pincode}
// // // //                       onChange={handleChange}
// // // //                       placeholder="Enter pincode"
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //                 <button type="submit" className="next-btn">
// // // //                   Next →
// // // //                 </button>
// // // //               </form>
// // // //             </>
// // // //           )}

// // // //           {activeStep === 'Branch Setup' && (
// // // //             <>
// // // //               <h2>Branch Management</h2>
// // // //               <p>Set up branches for your institute</p>
// // // //               <button
// // // //                 className="add-branch-btn"
// // // //                 onClick={() => {
// // // //                   setShowModal(true);
// // // //                   setCurrentBranch(null);
// // // //                   setBranchForm({ name: '', address: '', status: 'Active' });
// // // //                 }}
// // // //               >
// // // //                 + Add Branch
// // // //               </button>
// // // //               <div className="branch-table">
// // // //                 <div className="table-header">
// // // //                   <span>Name</span>
// // // //                   <span>Address</span>
// // // //                   <span>Status</span>
// // // //                   <span>Actions</span>
// // // //                 </div>
// // // //                 {branches.map((branch) => (
// // // //                   <div key={branch.id} className="table-row">
// // // //                     <span>{branch.name}</span>
// // // //                     <span>{branch.address}</span>
// // // //                     <span className="status">
// // // //                       <span
// // // //                         className={`status-dot ${
// // // //                           branch.status === 'Active' ? 'active' : 'inactive'
// // // //                         }`}
// // // //                       ></span>
// // // //                       {branch.status}
// // // //                     </span>
// // // //                     <span className="actions">
// // // //                       <FaEdit
// // // //                         className="action-icon"
// // // //                         onClick={() => handleEditBranch(branch)}
// // // //                       />
// // // //                       <FaTrash
// // // //                         className="action-icon delete"
// // // //                         onClick={() => handleDeleteBranch(branch.id)}
// // // //                       />
// // // //                     </span>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //               <button
// // // //                 className="next-btn"
// // // //                 onClick={() => setActiveStep('Contact Information')}
// // // //               >
// // // //                 Next →
// // // //               </button>
// // // //             </>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Modal for Add/Edit Branch */}
// // // //       {showModal && (
// // // //         <div className="modal">
// // // //           <div className="modal-content">
// // // //             <h2>{currentBranch ? 'Edit Branch' : 'Add Branch'}</h2>
// // // //             <form onSubmit={handleBranchSubmit}>
// // // //               <div className="form-group">
// // // //                 <label>Name *</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   name="name"
// // // //                   value={branchForm.name}
// // // //                   onChange={handleBranchChange}
// // // //                   placeholder="Enter branch name"
// // // //                   required
// // // //                 />
// // // //               </div>
// // // //               <div className="form-group">
// // // //                 <label>Address *</label>
// // // //                 <input
// // // //                   type="text"
// // // //                   name="address"
// // // //                   value={branchForm.address}
// // // //                   onChange={handleBranchChange}
// // // //                   placeholder="Enter branch address"
// // // //                   required
// // // //                 />
// // // //               </div>
// // // //               <div className="form-group">
// // // //                 <label>Status *</label>
// // // //                 <select
// // // //                   name="status"
// // // //                   value={branchForm.status}
// // // //                   onChange={handleBranchChange}
// // // //                   required
// // // //                 >
// // // //                   <option value="Active">Active</option>
// // // //                   <option value="Inactive">Inactive</option>
// // // //                 </select>
// // // //               </div>
// // // //               <div className="modal-actions">
// // // //                 <button type="button" onClick={() => setShowModal(false)}>
// // // //                   Cancel
// // // //                 </button>
// // // //                 <button type="submit">{currentBranch ? 'Update' : 'Add'}</button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default InstituteSetup;


// // // import React, { useState, useEffect } from 'react';
// // // import { db } from '../../config/firebase';
// // // import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// // // import './InstituteSetup.css';
// // // import { FaBook, FaEdit, FaTrash } from 'react-icons/fa';

// // // const InstituteSetup = () => {
// // //   const [activeStep, setActiveStep] = useState('Basic Information');
// // //   const [formData, setFormData] = useState({
// // //     instituteName: '',
// // //     instituteType: '',
// // //     address: '',
// // //     city: '',
// // //     state: '',
// // //     pincode: '',
// // //   });
// // //   const [branches, setBranches] = useState([]);
// // //   const [showModal, setShowModal] = useState(false);
// // //   const [currentBranch, setCurrentBranch] = useState(null);
// // //   const [branchForm, setBranchForm] = useState({
// // //     name: '',
// // //     addressLine1: '',
// // //     addressLine2: '',
// // //     city: '',
// // //     state: '',
// // //     postalCode: '',
// // //     country: 'India',
// // //     isActive: true,
// // //   });

// // //   // Fetch institute data
// // //   useEffect(() => {
// // //     const fetchInstituteData = async () => {
// // //       const querySnapshot = await getDocs(collection(db, 'instituteSetup'));
// // //       if (!querySnapshot.empty) {
// // //         const data = querySnapshot.docs[0].data();
// // //         setFormData(data);
// // //       }
// // //     };
// // //     fetchInstituteData();
// // //   }, []);

// // //   // Fetch branches
// // //   useEffect(() => {
// // //     const fetchBranches = async () => {
// // //       const querySnapshot = await getDocs(collection(db, 'branches'));
// // //       const branchList = querySnapshot.docs.map((doc) => ({
// // //         id: doc.id,
// // //         ...doc.data(),
// // //       }));
// // //       setBranches(branchList);
// // //     };
// // //     fetchBranches();
// // //   }, []);

// // //   // Handle institute form input changes
// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prev) => ({ ...prev, [name]: value }));
// // //   };

// // //   // Handle branch form input changes
// // //   const handleBranchChange = (e) => {
// // //     const { name, value, type, checked } = e.target;
// // //     setBranchForm((prev) => ({
// // //       ...prev,
// // //       [name]: type === 'checkbox' ? checked : value,
// // //     }));
// // //   };

// // //   // Handle institute form submission
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       await addDoc(collection(db, 'instituteSetup'), formData);
// // //       alert('Institute data saved successfully!');
// // //       setActiveStep('Branch Setup');
// // //     } catch (error) {
// // //       console.error('Error saving institute data: ', error);
// // //       alert('Error saving institute data');
// // //     }
// // //   };

// // //   // Handle branch form submission (add/edit)
// // //   const handleBranchSubmit = async (e) => {
// // //     e.preventDefault();
// // //     try {
// // //       if (currentBranch) {
// // //         // Update existing branch
// // //         const branchRef = doc(db, 'branches', currentBranch.id);
// // //         await updateDoc(branchRef, branchForm);
// // //         alert('Branch updated successfully!');
// // //       } else {
// // //         // Add new branch
// // //         await addDoc(collection(db, 'branches'), branchForm);
// // //         alert('Branch added successfully!');
// // //       }
// // //       setShowModal(false);
// // //       setBranchForm({
// // //         name: '',
// // //         addressLine1: '',
// // //         addressLine2: '',
// // //         city: '',
// // //         state: '',
// // //         postalCode: '',
// // //         country: 'India',
// // //         isActive: true,
// // //       });
// // //       setCurrentBranch(null);
// // //       // Refresh branches
// // //       const querySnapshot = await getDocs(collection(db, 'branches'));
// // //       const branchList = querySnapshot.docs.map((doc) => ({
// // //         id: doc.id,
// // //         ...doc.data(),
// // //       }));
// // //       setBranches(branchList);
// // //     } catch (error) {
// // //       console.error('Error saving branch: ', error);
// // //       alert('Error saving branch');
// // //     }
// // //   };

// // //   // Handle branch edit
// // //   const handleEditBranch = (branch) => {
// // //     setCurrentBranch(branch);
// // //     setBranchForm(branch);
// // //     setShowModal(true);
// // //   };

// // //   // Handle branch delete
// // //   const handleDeleteBranch = async (branchId) => {
// // //     if (window.confirm('Are you sure you want to delete this branch?')) {
// // //       try {
// // //         await deleteDoc(doc(db, 'branches', branchId));
// // //         setBranches(branches.filter((branch) => branch.id !== branchId));
// // //         alert('Branch deleted successfully!');
// // //       } catch (error) {
// // //         console.error('Error deleting branch: ', error);
// // //         alert('Error deleting branch');
// // //       }
// // //     }
// // //   };

// // //   return (
// // //     <div className="institute-setup">
// // //       <div className="header">
// // //         <FaBook className="header-icon" />
// // //         <h1>Institute Setup</h1>
// // //       </div>

// // //       <div className="content">
// // //         <div className="steps">
// // //           <h2>Onboarding Steps</h2>
// // //           <p>Complete these steps to set up your institute</p>
// // //           <ul>
// // //             <li
// // //               className={activeStep === 'Basic Information' ? 'active' : ''}
// // //               onClick={() => setActiveStep('Basic Information')}
// // //             >
// // //               1 Basic Information
// // //             </li>
// // //             <li
// // //               className={activeStep === 'Logo Upload' ? 'active' : ''}
// // //               onClick={() => setActiveStep('Logo Upload')}
// // //             >
// // //               2 Logo Upload
// // //             </li>
// // //             <li
// // //               className={activeStep === 'Branch Setup' ? 'active' : ''}
// // //               onClick={() => setActiveStep('Branch Setup')}
// // //             >
// // //               3 Branch Setup
// // //             </li>
// // //             <li
// // //               className={activeStep === 'Contact Information' ? 'active' : ''}
// // //               onClick={() => setActiveStep('Contact Information')}
// // //             >
// // //               4 Contact Information
// // //             </li>
// // //             <li
// // //               className={activeStep === 'System Configuration' ? 'active' : ''}
// // //               onClick={() => setActiveStep('System Configuration')}
// // //             >
// // //               5 System Configuration
// // //             </li>
// // //           </ul>
// // //         </div>

// // //         <div className="form-section">
// // //           {activeStep === 'Basic Information' && (
// // //             <>
// // //               <h2>Basic Information</h2>
// // //               <p>Enter your institute's basic details</p>
// // //               <form onSubmit={handleSubmit}>
// // //                 <div className="form-row">
// // //                   <div className="form-group">
// // //                     <label>Institute Name *</label>
// // //                     <input
// // //                       type="text"
// // //                       name="instituteName"
// // //                       value={formData.instituteName}
// // //                       onChange={handleChange}
// // //                       placeholder="Enter institute name"
// // //                       required
// // //                     />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label>Institute Type *</label>
// // //                     <input
// // //                       type="text"
// // //                       name="instituteType"
// // //                       value={formData.instituteType}
// // //                       onChange={handleChange}
// // //                       placeholder="School, College, University, etc."
// // //                       required
// // //                     />
// // //                   </div>
// // //                 </div>
// // //                 <div className="form-group">
// // //                   <label>Address</label>
// // //                   <input
// // //                     type="text"
// // //                     name="address"
// // //                     value={formData.address}
// // //                     onChange={handleChange}
// // //                     placeholder="Enter address"
// // //                   />
// // //                 </div>
// // //                 <div className="form-row">
// // //                   <div className="form-group">
// // //                     <label>City</label>
// // //                     <input
// // //                       type="text"
// // //                       name="city"
// // //                       value={formData.city}
// // //                       onChange={handleChange}
// // //                       placeholder="Enter city"
// // //                     />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label>State</label>
// // //                     <input
// // //                       type="text"
// // //                       name="state"
// // //                       value={formData.state}
// // //                       onChange={handleChange}
// // //                       placeholder="Enter state"
// // //                     />
// // //                   </div>
// // //                   <div className="form-group">
// // //                     <label>Pincode</label>
// // //                     <input
// // //                       type="text"
// // //                       name="pincode"
// // //                       value={formData.pincode}
// // //                       onChange={handleChange}
// // //                       placeholder="Enter pincode"
// // //                     />
// // //                   </div>
// // //                 </div>
// // //                 <button type="submit" className="next-btn">
// // //                   Next →
// // //                 </button>
// // //               </form>
// // //             </>
// // //           )}

// // //           {activeStep === 'Branch Setup' && (
// // //             <>
// // //               <h2>Branch Management</h2>
// // //               <p>Set up branches for your institute</p>
// // //               <button
// // //                 className="add-branch-btn"
// // //                 onClick={() => {
// // //                   setShowModal(true);
// // //                   setCurrentBranch(null);
// // //                   setBranchForm({
// // //                     name: '',
// // //                     addressLine1: '',
// // //                     addressLine2: '',
// // //                     city: '',
// // //                     state: '',
// // //                     postalCode: '',
// // //                     country: 'India',
// // //                     isActive: true,
// // //                   });
// // //                 }}
// // //               >
// // //                 + Add Branch
// // //               </button>
// // //               <div className="branch-table">
// // //                 <div className="table-header">
// // //                   <span>Name</span>
// // //                   <span>Address</span>
// // //                   <span>Status</span>
// // //                   <span>Actions</span>
// // //                 </div>
// // //                 {branches.map((branch) => (
// // //                   <div key={branch.id} className="table-row">
// // //                     <span>{branch.name}</span>
// // //                     <span>
// // //                       {branch.addressLine1}, {branch.city}, {branch.state},{' '}
// // //                       {branch.postalCode}
// // //                     </span>
// // //                     <span className="status">
// // //                       <span
// // //                         className={`status-dot ${
// // //                           branch.isActive ? 'active' : 'inactive'
// // //                         }`}
// // //                       ></span>
// // //                       {branch.isActive ? 'Active' : 'Inactive'}
// // //                     </span>
// // //                     <span className="actions">
// // //                       <FaEdit
// // //                         className="action-icon"
// // //                         onClick={() => handleEditBranch(branch)}
// // //                       />
// // //                       <FaTrash
// // //                         className="action-icon delete"
// // //                         onClick={() => handleDeleteBranch(branch.id)}
// // //                       />
// // //                     </span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //               <button
// // //                 className="next-btn"
// // //                 onClick={() => setActiveStep('Contact Information')}
// // //               >
// // //                 Next →
// // //               </button>
// // //             </>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Modal for Add/Edit Branch */}
// // //       {showModal && (
// // //         <div className="modal">
// // //           <div className="modal-content">
// // //             <h2>{currentBranch ? 'Edit Branch' : 'Add Branch'}</h2>
// // //             <form onSubmit={handleBranchSubmit}>
// // //               <div className="form-group">
// // //                 <label>
// // //                   Branch Name <span className="required">*</span>
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   name="name"
// // //                   value={branchForm.name}
// // //                   onChange={handleBranchChange}
// // //                   placeholder="Enter branch name"
// // //                   required
// // //                 />
// // //               </div>
// // //               <div className="form-group">
// // //                 <label>
// // //                   Address Line 1 <span className="required">*</span>
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   name="addressLine1"
// // //                   value={branchForm.addressLine1}
// // //                   onChange={handleBranchChange}
// // //                   placeholder="Enter address line 1"
// // //                   required
// // //                 />
// // //               </div>
// // //               <div className="form-group">
// // //                 <label>Address Line 2</label>
// // //                 <input
// // //                   type="text"
// // //                   name="addressLine2"
// // //                   value={branchForm.addressLine2}
// // //                   onChange={handleBranchChange}
// // //                   placeholder="Enter address line 2"
// // //                 />
// // //               </div>
// // //               <div className="form-row">
// // //                 <div className="form-group">
// // //                   <label>
// // //                     City <span className="required">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="city"
// // //                     value={branchForm.city}
// // //                     onChange={handleBranchChange}
// // //                     placeholder="Enter city"
// // //                     required
// // //                   />
// // //                 </div>
// // //                 <div className="form-group">
// // //                   <label>
// // //                     State <span className="required">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="state"
// // //                     value={branchForm.state}
// // //                     onChange={handleBranchChange}
// // //                     placeholder="Enter state"
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <div className="form-row">
// // //                 <div className="form-group">
// // //                   <label>
// // //                     Postal Code <span className="required">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="postalCode"
// // //                     value={branchForm.postalCode}
// // //                     onChange={handleBranchChange}
// // //                     placeholder="Enter postal code"
// // //                     required
// // //                   />
// // //                 </div>
// // //                 <div className="form-group">
// // //                   <label>
// // //                     Country <span className="required">*</span>
// // //                   </label>
// // //                   <input
// // //                     type="text"
// // //                     name="country"
// // //                     value={branchForm.country}
// // //                     onChange={handleBranchChange}
// // //                     placeholder="Enter country"
// // //                     required
// // //                   />
// // //                 </div>
// // //               </div>
// // //               <div className="form-group">
// // //                 <label>
// // //                   <input
// // //                     type="checkbox"
// // //                     name="isActive"
// // //                     checked={branchForm.isActive}
// // //                     onChange={handleBranchChange}
// // //                   />
// // //                   Branch is active
// // //                 </label>
// // //               </div>
// // //               <div className="modal-actions">
// // //                 <button type="button" onClick={() => setShowModal(false)}>
// // //                   Cancel
// // //                 </button>
// // //                 <button type="submit">Save Branch</button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default InstituteSetup;


// // import React, { useState, useEffect } from 'react';
// // import { db } from '../../config/firebase';
// // import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// // import './InstituteSetup.css';
// // import { FaBook, FaEdit, FaTrash } from 'react-icons/fa';

// // const InstituteSetup = () => {
// //   const [activeStep, setActiveStep] = useState('Basic Information');
// //   const [formData, setFormData] = useState({
// //     instituteName: '',
// //     instituteType: '',
// //     address: '',
// //     city: '',
// //     state: '',
// //     pincode: '',
// //     email: '',
// //     phoneNumber: '',
// //     website: '',
// //   });
// //   const [branches, setBranches] = useState([]);
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentBranch, setCurrentBranch] = useState(null);
// //   const [branchForm, setBranchForm] = useState({
// //     name: '',
// //     addressLine1: '',
// //     addressLine2: '',
// //     city: '',
// //     state: '',
// //     postalCode: '',
// //     country: 'India',
// //     isActive: true,
// //   });

// //   // Fetch institute data
// //   useEffect(() => {
// //     const fetchInstituteData = async () => {
// //       const querySnapshot = await getDocs(collection(db, 'instituteSetup'));
// //       if (!querySnapshot.empty) {
// //         const data = querySnapshot.docs[0].data();
// //         setFormData(data);
// //       }
// //     };
// //     fetchInstituteData();
// //   }, []);

// //   // Fetch branches
// //   useEffect(() => {
// //     const fetchBranches = async () => {
// //       const querySnapshot = await getDocs(collection(db, 'branches'));
// //       const branchList = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setBranches(branchList);
// //     };
// //     fetchBranches();
// //   }, []);

// //   // Handle institute form input changes
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // Handle branch form input changes
// //   const handleBranchChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setBranchForm((prev) => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value,
// //     }));
// //   };

// //   // Handle institute form submission (Basic Information and Contact Information)
// //   const handleSubmit = async (e, nextStep) => {
// //     e.preventDefault();
// //     try {
// //       await addDoc(collection(db, 'instituteSetup'), formData);
// //       alert('Data saved successfully!');
// //       setActiveStep(nextStep);
// //     } catch (error) {
// //       console.error('Error saving data: ', error);
// //       alert('Error saving data');
// //     }
// //   };

// //   // Handle branch form submission (add/edit)
// //   const handleBranchSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       if (currentBranch) {
// //         const branchRef = doc(db, 'branches', currentBranch.id);
// //         await updateDoc(branchRef, branchForm);
// //         alert('Branch updated successfully!');
// //       } else {
// //         await addDoc(collection(db, 'branches'), branchForm);
// //         alert('Branch added successfully!');
// //       }
// //       setShowModal(false);
// //       setBranchForm({
// //         name: '',
// //         addressLine1: '',
// //         addressLine2: '',
// //         city: '',
// //         state: '',
// //         postalCode: '',
// //         country: 'India',
// //         isActive: true,
// //       });
// //       setCurrentBranch(null);
// //       const querySnapshot = await getDocs(collection(db, 'branches'));
// //       const branchList = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setBranches(branchList);
// //     } catch (error) {
// //       console.error('Error saving branch: ', error);
// //       alert('Error saving branch');
// //     }
// //   };

// //   // Handle branch edit
// //   const handleEditBranch = (branch) => {
// //     setCurrentBranch(branch);
// //     setBranchForm(branch);
// //     setShowModal(true);
// //   };

// //   // Handle branch delete
// //   const handleDeleteBranch = async (branchId) => {
// //     if (window.confirm('Are you sure you want to delete this branch?')) {
// //       try {
// //         await deleteDoc(doc(db, 'branches', branchId));
// //         setBranches(branches.filter((branch) => branch.id !== branchId));
// //         alert('Branch deleted successfully!');
// //       } catch (error) {
// //         console.error('Error deleting branch: ', error);
// //         alert('Error deleting branch');
// //       }
// //     }
// //   };

// //   return (
// //     <div className="institute-setup">
// //       <div className="header">
// //         <FaBook className="header-icon" />
// //         <h1>Institute Setup</h1>
// //       </div>

// //       <div className="content">
// //         <div className="steps">
// //           <h2>Onboarding Steps</h2>
// //           <p>Complete these steps to set up your institute</p>
// //           <ul>
// //             <li
// //               className={activeStep === 'Basic Information' ? 'active' : ''}
// //               onClick={() => setActiveStep('Basic Information')}
// //             >
// //               1 Basic Information
// //             </li>
// //             <li
// //               className={activeStep === 'Logo Upload' ? 'active' : ''}
// //               onClick={() => setActiveStep('Logo Upload')}
// //             >
// //               2 Logo Upload
// //             </li>
// //             <li
// //               className={activeStep === 'Branch Setup' ? 'active' : ''}
// //               onClick={() => setActiveStep('Branch Setup')}
// //             >
// //               3 Branch Setup
// //             </li>
// //             <li
// //               className={activeStep === 'Contact Information' ? 'active' : ''}
// //               onClick={() => setActiveStep('Contact Information')}
// //             >
// //               4 Contact Information
// //             </li>
// //             <li
// //               className={activeStep === 'System Configuration' ? 'active' : ''}
// //               onClick={() => setActiveStep('System Configuration')}
// //             >
// //               5 System Configuration
// //             </li>
// //           </ul>
// //         </div>

// //         <div className="form-section">
// //           {activeStep === 'Basic Information' && (
// //             <>
// //               <h2>Basic Information</h2>
// //               <p>Enter your institute's basic details</p>
// //               <form onSubmit={(e) => handleSubmit(e, 'Branch Setup')}>
// //                 <div className="form-row">
// //                   <div className="form-group">
// //                     <label>Institute Name *</label>
// //                     <input
// //                       type="text"
// //                       name="instituteName"
// //                       value={formData.instituteName}
// //                       onChange={handleChange}
// //                       placeholder="Enter institute name"
// //                       required
// //                     />
// //                   </div>
// //                   <div className="form-group">
// //                     <label>Institute Type *</label>
// //                     <input
// //                       type="text"
// //                       name="instituteType"
// //                       value={formData.instituteType}
// //                       onChange={handleChange}
// //                       placeholder="School, College, University, etc."
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="form-group">
// //                   <label>Address</label>
// //                   <input
// //                     type="text"
// //                     name="address"
// //                     value={formData.address}
// //                     onChange={handleChange}
// //                     placeholder="Enter address"
// //                   />
// //                 </div>
// //                 <div className="form-row">
// //                   <div className="form-group">
// //                     <label>City</label>
// //                     <input
// //                       type="text"
// //                       name="city"
// //                       value={formData.city}
// //                       onChange={handleChange}
// //                       placeholder="Enter city"
// //                     />
// //                   </div>
// //                   <div className="form-group">
// //                     <label>State</label>
// //                     <input
// //                       type="text"
// //                       name="state"
// //                       value={formData.state}
// //                       onChange={handleChange}
// //                       placeholder="Enter state"
// //                     />
// //                   </div>
// //                   <div className="form-group">
// //                     <label>Pincode</label>
// //                     <input
// //                       type="text"
// //                       name="pincode"
// //                       value={formData.pincode}
// //                       onChange={handleChange}
// //                       placeholder="Enter pincode"
// //                     />
// //                   </div>
// //                 </div>
// //                 <button type="submit" className="next-btn">
// //                   Next →
// //                 </button>
// //               </form>
// //             </>
// //           )}

// //           {activeStep === 'Branch Setup' && (
// //             <>
// //               <h2>Branch Management</h2>
// //               <p>Set up branches for your institute</p>
// //               <button
// //                 className="add-branch-btn"
// //                 onClick={() => {
// //                   setShowModal(true);
// //                   setCurrentBranch(null);
// //                   setBranchForm({
// //                     name: '',
// //                     addressLine1: '',
// //                     addressLine2: '',
// //                     city: '',
// //                     state: '',
// //                     postalCode: '',
// //                     country: 'India',
// //                     isActive: true,
// //                   });
// //                 }}
// //               >
// //                 + Add Branch
// //               </button>
// //               <div className="branch-table">
// //                 <div className="table-header">
// //                   <span>Name</span>
// //                   <span>Address</span>
// //                   <span>Status</span>
// //                   <span>Actions</span>
// //                 </div>
// //                 {branches.map((branch) => (
// //                   <div key={branch.id} className="table-row">
// //                     <span>{branch.name}</span>
// //                     <span>
// //                       {branch.addressLine1}, {branch.city}, {branch.state},{' '}
// //                       {branch.postalCode}
// //                     </span>
// //                     <span className="status">
// //                       <span
// //                         className={`status-dot ${
// //                           branch.isActive ? 'active' : 'inactive'
// //                         }`}
// //                       ></span>
// //                       {branch.isActive ? 'Active' : 'Inactive'}
// //                     </span>
// //                     <span className="actions">
// //                       <FaEdit
// //                         className="action-icon"
// //                         onClick={() => handleEditBranch(branch)}
// //                       />
// //                       <FaTrash
// //                         className="action-icon delete"
// //                         onClick={() => handleDeleteBranch(branch.id)}
// //                       />
// //                     </span>
// //                   </div>
// //                 ))}
// //               </div>
// //               <button
// //                 className="next-btn"
// //                 onClick={() => setActiveStep('Contact Information')}
// //               >
// //                 Next →
// //               </button>
// //             </>
// //           )}

// //           {activeStep === 'Contact Information' && (
// //             <>
// //               <h2>Contact Information</h2>
// //               <p>Add contact details for your institute</p>
// //               <form onSubmit={(e) => handleSubmit(e, 'System Configuration')}>
// //                 <div className="form-row">
// //                   <div className="form-group">
// //                     <label>
// //                       Email Address <span className="required">*</span>
// //                     </label>
// //                     <input
// //                       type="email"
// //                       name="email"
// //                       value={formData.email}
// //                       onChange={handleChange}
// //                       placeholder="Enter email"
// //                       required
// //                     />
// //                   </div>
// //                   <div className="form-group">
// //                     <label>
// //                       Phone Number <span className="required">*</span>
// //                     </label>
// //                     <input
// //                       type="tel"
// //                       name="phoneNumber"
// //                       value={formData.phoneNumber}
// //                       onChange={handleChange}
// //                       placeholder="Enter phone number"
// //                       required
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="form-group">
// //                   <label>Website</label>
// //                   <input
// //                     type="url"
// //                     name="website"
// //                     value={formData.website}
// //                     onChange={handleChange}
// //                     placeholder="Enter website URL"
// //                   />
// //                 </div>
// //                 <button type="submit" className="next-btn">
// //                   Next →
// //                 </button>
// //               </form>
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       {/* Modal for Add/Edit Branch */}
// //       {showModal && (
// //         <div className="modal">
// //           <div className="modal-content">
// //             <h2>{currentBranch ? 'Edit Branch' : 'Add Branch'}</h2>
// //             <form onSubmit={handleBranchSubmit}>
// //               <div className="form-group">
// //                 <label>
// //                   Branch Name <span className="required">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="name"
// //                   value={branchForm.name}
// //                   onChange={handleBranchChange}
// //                   placeholder="Enter branch name"
// //                   required
// //                 />
// //               </div>
// //               <div className="form-group">
// //                 <label>
// //                   Address Line 1 <span className="required">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="addressLine1"
// //                   value={branchForm.addressLine1}
// //                   onChange={handleBranchChange}
// //                   placeholder="Enter address line 1"
// //                   required
// //                 />
// //               </div>
// //               <div className="form-group">
// //                 <label>Address Line 2</label>
// //                 <input
// //                   type="text"
// //                   name="addressLine2"
// //                   value={branchForm.addressLine2}
// //                   onChange={handleBranchChange}
// //                   placeholder="Enter address line 2"
// //                 />
// //               </div>
// //               <div className="form-row">
// //                 <div className="form-group">
// //                   <label>
// //                     City <span className="required">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="city"
// //                     value={branchForm.city}
// //                     onChange={handleBranchChange}
// //                     placeholder="Enter city"
// //                     required
// //                   />
// //                 </div>
// //                 <div className="form-group">
// //                   <label>
// //                     State <span className="required">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="state"
// //                     value={branchForm.state}
// //                     onChange={handleBranchChange}
// //                     placeholder="Enter state"
// //                     required
// //                   />
// //                 </div>
// //               </div>
// //               <div className="form-row">
// //                 <div classSystem Configuration="form-group">
// //                   <label>
// //                     Postal Code <span className="required">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="postalCode"
// //                     value={branchForm.postalCode}
// //                     onChange={handleBranchChange}
// //                     placeholder="Enter postal code"
// //                     required
// //                   />
// //                 </div>
// //                 <div className="form-group">
// //                   <label>
// //                     Country <span className="required">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="country"
// //                     value={branchForm.country}
// //                     onChange={handleBranchChange}
// //                     placeholder="Enter country"
// //                     required
// //                   />
// //                 </div>
// //               </div>
// //               <div className="form-group">
// //                 <label>
// //                   <input
// //                     type="checkbox"
// //                     name="isActive"
// //                     checked={branchForm.isActive}
// //                     onChange={handleBranchChange}
// //                   />
// //                   Branch is active
// //                 </label>
// //               </div>
// //               <div className="modal-actions">
// //                 <button type="button" onClick={() => setShowModal(false)}>
// //                   Cancel
// //                 </button>
// //                 <button type="submit">Save Branch</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default InstituteSetup;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection after setup completion
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './InstituteSetup.css';
import { FaBook, FaEdit, FaTrash } from 'react-icons/fa';

const InstituteSetup = () => {
  const navigate = useNavigate(); // For redirecting after setup completion
  const [activeStep, setActiveStep] = useState('Basic Information');
  const [formData, setFormData] = useState({
    instituteName: '',
    instituteType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    phoneNumber: '',
    website: '',
    academicYearStart: '',
    academicYearEnd: '',
    timezone: '',
  });
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branchForm, setBranchForm] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isActive: true,
  });

  // Fetch institute data
  useEffect(() => {
    const fetchInstituteData = async () => {
      const querySnapshot = await getDocs(collection(db, 'instituteSetup'));
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setFormData(data);
      }
    };
    fetchInstituteData();
  }, []);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      const querySnapshot = await getDocs(collection(db, 'branches'));
      const branchList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBranches(branchList);
    };
    fetchBranches();
  }, []);

  // Handle institute form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle branch form input changes
  const handleBranchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBranchForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle institute form submission
  const handleSubmit = async (e, nextStep) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'instituteSetup'), formData);
      alert('Data saved successfully!');
      if (nextStep) {
        setActiveStep(nextStep);
      } else {
        // On final step, redirect to dashboard or another page
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error saving data: ', error);
      alert('Error saving data');
    }
  };

  // Handle branch form submission (add/edit)
  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBranch) {
        const branchRef = doc(db, 'branches', currentBranch.id);
        await updateDoc(branchRef, branchForm);
        alert('Branch updated successfully!');
      } else {
        await addDoc(collection(db, 'branches'), branchForm);
        alert('Branch added successfully!');
      }
      setShowModal(false);
      setBranchForm({
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isActive: true,
      });
      setCurrentBranch(null);
      const querySnapshot = await getDocs(collection(db, 'branches'));
      const branchList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBranches(branchList);
    } catch (error) {
      console.error('Error saving branch: ', error);
      alert('Error saving branch');
    }
  };

  // Handle branch edit
  const handleEditBranch = (branch) => {
    setCurrentBranch(branch);
    setBranchForm(branch);
    setShowModal(true);
  };

  // Handle branch delete
  const handleDeleteBranch = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteDoc(doc(db, 'branches', branchId));
        setBranches(branches.filter((branch) => branch.id !== branchId));
        alert('Branch deleted successfully!');
      } catch (error) {
        console.error('Error deleting branch: ', error);
        alert('Error deleting branch');
      }
    }
  };

  return (
    <div className="institute-setup p-20">
      <div className="header">
        <FaBook className="header-icon" />
        <h1>Institute Setup</h1>
      </div>

      <div className="content">
        <div className="steps">
          <h2>Onboarding Steps</h2>
          <p>Complete these steps to set up your institute</p>
          <ul>
            <li
              className={activeStep === 'Basic Information' ? 'active' : ''}
              onClick={() => setActiveStep('Basic Information')}
            >
              1 Basic Information
            </li>
            <li
              className={activeStep === 'Logo Upload' ? 'active' : ''}
              onClick={() => setActiveStep('Logo Upload')}
            >
              2 Logo Upload
            </li>
            <li
              className={activeStep === 'Branch Setup' ? 'active' : ''}
              onClick={() => setActiveStep('Branch Setup')}
            >
              3 Branch Setup
            </li>
            <li
              className={activeStep === 'Contact Information' ? 'active' : ''}
              onClick={() => setActiveStep('Contact Information')}
            >
              4 Contact Information
            </li>
            <li
              className={activeStep === 'System Configuration' ? 'active' : ''}
              onClick={() => setActiveStep('System Configuration')}
            >
              5 System Configuration
            </li>
          </ul>
        </div>

        <div className="form-section">
          {activeStep === 'Basic Information' && (
            <>
              <h2>Basic Information</h2>
              <p>Enter your institute's basic details</p>
              <form onSubmit={(e) => handleSubmit(e, 'Branch Setup')}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Institute Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="instituteName"
                      value={formData.instituteName}
                      onChange={handleChange}
                      placeholder="Enter institute name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Institute Type <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="instituteType"
                      value={formData.instituteType}
                      onChange={handleChange}
                      placeholder="School, College, University, etc."
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                    />
                  </div>
                </div>
                <button type="submit" className="next-btn">
                  Next →
                </button>
              </form>
            </>
          )}

          {activeStep === 'Branch Setup' && (
            <>
              <h2>Branch Management</h2>
              <p>Set up branches for your institute</p>
              <button
                className="add-branch-btn"
                onClick={() => {
                  setShowModal(true);
                  setCurrentBranch(null);
                  setBranchForm({
                    name: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'India',
                    isActive: true,
                  });
                }}
              >
                + Add Branch
              </button>
              <div className="branch-table">
                <div className="table-header">
                  <span>Name</span>
                  <span>Address</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {branches.map((branch) => (
                  <div key={branch.id} className="table-row">
                    <span>{branch.name}</span>
                    <span>
                      {branch.addressLine1}, {branch.city}, {branch.state},{' '}
                      {branch.postalCode}
                    </span>
                    <span className="status">
                      <span
                        className={`status-dot ${
                          branch.isActive ? 'active' : 'inactive'
                        }`}
                      ></span>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="actions">
                      <FaEdit
                        className="action-icon"
                        onClick={() => handleEditBranch(branch)}
                      />
                      <FaTrash
                        className="action-icon delete"
                        onClick={() => handleDeleteBranch(branch.id)}
                      />
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="next-btn"
                onClick={() => setActiveStep('Contact Information')}
              >
                Next →
              </button>
            </>
          )}

          {activeStep === 'Contact Information' && (
            <>
              <h2>Contact Information</h2>
              <p>Add contact details for your institute</p>
              <form onSubmit={(e) => handleSubmit(e, 'System Configuration')}>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Enter website URL"
                  />
                </div>
                <button type="submit" className="next-btn">
                  Next →
                </button>
              </form>
            </>
          )}

          {activeStep === 'System Configuration' && (
            <>
              <h2>System Configuration</h2>
              <p>Configure the system settings for your needs</p>
              <form onSubmit={(e) => handleSubmit(e, null)}>
                <div className="section">
                  <h3>Academic Year</h3>
                  <p>
                    Configure your academic year settings for better organization
                    of courses and batches.
                  </p>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Academic Year Start</label>
                      <input
                        type="date"
                        name="academicYearStart"
                        value={formData.academicYearStart}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Academic Year End</label>
                      <input
                        type="date"
                        name="academicYearEnd"
                        value={formData.academicYearEnd}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="section">
                  <h3>System Preferences</h3>
                  <p>
                    Set up your system preferences for notifications and other
                    settings.
                  </p>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                    >
                      <option value="">Select timezone</option>
                      <option value="UTC">UTC</option>
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                      {/* Add more timezones as needed */}
                    </select>
                  </div>
                </div>
                <button type="submit" className="complete-btn">
                  Complete Setup
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Branch */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{currentBranch ? 'Edit Branch' : 'Add Branch'}</h2>
            <form onSubmit={handleBranchSubmit}>
              <div className="form-group">
                <label>
                  Branch Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={branchForm.name}
                  onChange={handleBranchChange}
                  placeholder="Enter branch name"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Address Line 1 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={branchForm.addressLine1}
                  onChange={handleBranchChange}
                  placeholder="Enter address line 1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={branchForm.addressLine2}
                  onChange={handleBranchChange}
                  placeholder="Enter address line 2"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={branchForm.city}
                    onChange={handleBranchChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    State <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={branchForm.state}
                    onChange={handleBranchChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Postal Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={branchForm.postalCode}
                    onChange={handleBranchChange}
                    placeholder="Enter postal code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    Country <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={branchForm.country}
                    onChange={handleBranchChange}
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={branchForm.isActive}
                    onChange={handleBranchChange}
                  />
                  Branch is active
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteSetup;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { db } from '../../config/firebase';
// import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import './InstituteSetup.css';
// import { FaBook, FaEdit, FaTrash } from 'react-icons/fa';
// import s3 from '../../config/aws-config'; // Import the configured S3 instance

// const InstituteSetup = () => {
//   const navigate = useNavigate();
//   const [activeStep, setActiveStep] = useState('Basic Information');
//   const [formData, setFormData] = useState({
//     instituteName: '',
//     instituteType: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     email: '',
//     phoneNumber: '',
//     website: '',
//     academicYearStart: '',
//     academicYearEnd: '',
//     timezone: '',
//     logoUrl: '', // Add logo URL to store the S3 link
//   });
//   const [branches, setBranches] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentBranch, setCurrentBranch] = useState(null);
//   const [branchForm, setBranchForm] = useState({
//     name: '',
//     addressLine1: '',
//     addressLine2: '',
//     city: '',
//     state: '',
//     postalCode: '',
//     country: 'India',
//     isActive: true,
//   });
//   const [logoFile, setLogoFile] = useState(null); // State for the logo file

//   // Fetch institute data
//   useEffect(() => {
//     const fetchInstituteData = async () => {
//       const querySnapshot = await getDocs(collection(db, 'instituteSetup'));
//       if (!querySnapshot.empty) {
//         const data = querySnapshot.docs[0].data();
//         setFormData(data);
//       }
//     };
//     fetchInstituteData();
//   }, []);

//   // Fetch branches
//   useEffect(() => {
//     const fetchBranches = async () => {
//       const querySnapshot = await getDocs(collection(db, 'branches'));
//       const branchList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setBranches(branchList);
//     };
//     fetchBranches();
//   }, []);

//   // Handle institute form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle logo file change
//   const handleLogoChange = (e) => {
//     setLogoFile(e.target.files[0]);
//   };

//   // Upload logo to S3
//   const uploadLogoToS3 = async () => {
//     if (!logoFile) return null;

//     const params = {
//       Bucket: process.env.REACT_APP_S3_BUCKET,
//       Key: `logos/${Date.now()}_${logoFile.name}`, // Unique key for the file
//       Body: logoFile,
//       ACL: 'public-read', // Make the file publicly accessible
//       ContentType: logoFile.type,
//     };

//     try {
//       const { Location } = await s3.upload(params).promise();
//       return Location; // Return the S3 URL
//     } catch (error) {
//       console.error('Error uploading logo to S3:', error);
//       throw new Error('Failed to upload logo');
//     }
//   };

//   // Handle institute form submission
//   const handleSubmit = async (e, nextStep) => {
//     e.preventDefault();
//     try {
//       let updatedFormData = { ...formData };

//       // If in Logo Upload step, upload the logo to S3
//       if (activeStep === 'Logo Upload' && logoFile) {
//         const logoUrl = await uploadLogoToS3();
//         updatedFormData.logoUrl = logoUrl;
//         setFormData(updatedFormData);
//       }

//       await addDoc(collection(db, 'instituteSetup'), updatedFormData);
//       alert('Data saved successfully!');
//       if (nextStep) {
//         setActiveStep(nextStep);
//       } else {
//         navigate('/dashboard');
//       }
//     } catch (error) {
//       console.error('Error saving data: ', error);
//       alert('Error saving data');
//     }
//   };

//   // Handle branch form input changes
//   const handleBranchChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setBranchForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   // Handle branch form submission (add/edit)
//   const handleBranchSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentBranch) {
//         const branchRef = doc(db, 'branches', currentBranch.id);
//         await updateDoc(branchRef, branchForm);
//         alert('Branch updated successfully!');
//       } else {
//         await addDoc(collection(db, 'branches'), branchForm);
//         alert('Branch added successfully!');
//       }
//       setShowModal(false);
//       setBranchForm({
//         name: '',
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         state: '',
//         postalCode: '',
//         country: 'India',
//         isActive: true,
//       });
//       setCurrentBranch(null);
//       const querySnapshot = await getDocs(collection(db, 'branches'));
//       const branchList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setBranches(branchList);
//     } catch (error) {
//       console.error('Error saving branch: ', error);
//       alert('Error saving branch');
//     }
//   };

//   // Handle branch edit
//   const handleEditBranch = (branch) => {
//     setCurrentBranch(branch);
//     setBranchForm(branch);
//     setShowModal(true);
//   };

//   // Handle branch delete
//   const handleDeleteBranch = async (branchId) => {
//     if (window.confirm('Are you sure you want to delete this branch?')) {
//       try {
//         await deleteDoc(doc(db, 'branches', branchId));
//         setBranches(branches.filter((branch) => branch.id !== branchId));
//         alert('Branch deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting branch: ', error);
//         alert('Error deleting branch');
//       }
//     }
//   };

//   return (
//     <div className="institute-setup">
//       <div className="header">
//         <FaBook className="header-icon" />
//         <h1>Institute Setup</h1>
//       </div>

//       <div className="content">
//         <div className="steps">
//           <h2>Onboarding Steps</h2>
//           <p>Complete these steps to set up your institute</p>
//           <ul>
//             <li
//               className={activeStep === 'Basic Information' ? 'active' : ''}
//               onClick={() => setActiveStep('Basic Information')}
//             >
//               1 Basic Information
//             </li>
//             <li
//               className={activeStep === 'Logo Upload' ? 'active' : ''}
//               onClick={() => setActiveStep('Logo Upload')}
//             >
//               2 Logo Upload
//             </li>
//             <li
//               className={activeStep === 'Branch Setup' ? 'active' : ''}
//               onClick={() => setActiveStep('Branch Setup')}
//             >
//               3 Branch Setup
//             </li>
//             <li
//               className={activeStep === 'Contact Information' ? 'active' : ''}
//               onClick={() => setActiveStep('Contact Information')}
//             >
//               4 Contact Information
//             </li>
//             <li
//               className={activeStep === 'System Configuration' ? 'active' : ''}
//               onClick={() => setActiveStep('System Configuration')}
//             >
//               5 System Configuration
//             </li>
//           </ul>
//         </div>

//         <div className="form-section">
//           {activeStep === 'Basic Information' && (
//             <>
//               <h2>Basic Information</h2>
//               <p>Enter your institute's basic details</p>
//               <form onSubmit={(e) => handleSubmit(e, 'Logo Upload')}>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>
//                       Institute Name <span className="required">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="instituteName"
//                       value={formData.instituteName}
//                       onChange={handleChange}
//                       placeholder="Enter institute name"
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>
//                       Institute Type <span className="required">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="instituteType"
//                       value={formData.instituteType}
//                       onChange={handleChange}
//                       placeholder="School, College, University, etc."
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label>Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="Enter address"
//                   />
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>City</label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       placeholder="Enter city"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>State</label>
//                     <input
//                       type="text"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleChange}
//                       placeholder="Enter state"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Pincode</label>
//                     <input
//                       type="text"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleChange}
//                       placeholder="Enter pincode"
//                     />
//                   </div>
//                 </div>
//                 <button type="submit" className="next-btn">
//                   Next →
//                 </button>
//               </form>
//             </>
//           )}

//           {activeStep === 'Logo Upload' && (
//             <>
//               <h2>Logo Upload</h2>
//               <p>Upload your institute's logo</p>
//               <form onSubmit={(e) => handleSubmit(e, 'Branch Setup')}>
//                 <div className="form-group">
//                   <label>Upload Logo</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleLogoChange}
//                   />
//                   {formData.logoUrl && (
//                     <div className="logo-preview">
//                       <img
//                         src={formData.logoUrl}
//                         alt="Institute Logo"
//                         style={{ maxWidth: '200px', marginTop: '10px' }}
//                       />
//                     </div>
//                   )}
//                 </div>
//                 <button type="submit" className="next-btn">
//                   Next →
//                 </button>
//               </form>
//             </>
//           )}

//           {activeStep === 'Branch Setup' && (
//             <>
//               <h2>Branch Management</h2>
//               <p>Set up branches for your institute</p>
//               <button
//                 className="add-branch-btn"
//                 onClick={() => {
//                   setShowModal(true);
//                   setCurrentBranch(null);
//                   setBranchForm({
//                     name: '',
//                     addressLine1: '',
//                     addressLine2: '',
//                     city: '',
//                     state: '',
//                     postalCode: '',
//                     country: 'India',
//                     isActive: true,
//                   });
//                 }}
//               >
//                 + Add Branch
//               </button>
//               <div className="branch-table">
//                 <div className="table-header">
//                   <span>Name</span>
//                   <span>Address</span>
//                   <span>Status</span>
//                   <span>Actions</span>
//                 </div>
//                 {branches.map((branch) => (
//                   <div key={branch.id} className="table-row">
//                     <span>{branch.name}</span>
//                     <span>
//                       {branch.addressLine1}, {branch.city}, {branch.state},{' '}
//                       {branch.postalCode}
//                     </span>
//                     <span className="status">
//                       <span
//                         className={`status-dot ${
//                           branch.isActive ? 'active' : 'inactive'
//                         }`}
//                       ></span>
//                       {branch.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                     <span className="actions">
//                       <FaEdit
//                         className="action-icon"
//                         onClick={() => handleEditBranch(branch)}
//                       />
//                       <FaTrash
//                         className="action-icon delete"
//                         onClick={() => handleDeleteBranch(branch.id)}
//                       />
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 className="next-btn"
//                 onClick={() => setActiveStep('Contact Information')}
//               >
//                 Next →
//               </button>
//             </>
//           )}

//           {activeStep === 'Contact Information' && (
//             <>
//               <h2>Contact Information</h2>
//               <p>Add contact details for your institute</p>
//               <form onSubmit={(e) => handleSubmit(e, 'System Configuration')}>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>
//                       Email Address <span className="required">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Enter email"
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>
//                       Phone Number <span className="required">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="Enter phone number"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="form-group">
//                   <label>Website</label>
//                   <input
//                     type="url"
//                     name="website"
//                     value={formData.website}
//                     onChange={handleChange}
//                     placeholder="Enter website URL"
//                   />
//                 </div>
//                 <button type="submit" className="next-btn">
//                   Next →
//                 </button>
//               </form>
//             </>
//           )}

//           {activeStep === 'System Configuration' && (
//             <>
//               <h2>System Configuration</h2>
//               <p>Configure the system settings for your needs</p>
//               <form onSubmit={(e) => handleSubmit(e, null)}>
//                 <div className="section">
//                   <h3>Academic Year</h3>
//                   <p>
//                     Configure your academic year settings for better organization
//                     of courses and batches.
//                   </p>
//                   <div className="form-row">
//                     <div className="form-group">
//                       <label>Academic Year Start</label>
//                       <input
//                         type="date"
//                         name="academicYearStart"
//                         value={formData.academicYearStart}
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <label>Academic Year End</label>
//                       <input
//                         type="date"
//                         name="academicYearEnd"
//                         value={formData.academicYearEnd}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="section">
//                   <h3>System Preferences</h3>
//                   <p>
//                     Set up your system preferences for notifications and other
//                     settings.
//                   </p>
//                   <div className="form-group">
//                     <label>Timezone</label>
//                     <select
//                       name="timezone"
//                       value={formData.timezone}
//                       onChange={handleChange}
//                     >
//                       <option value="">Select timezone</option>
//                       <option value="UTC">UTC</option>
//                       <option value="Asia/Kolkata">Asia/Kolkata</option>
//                       <option value="America/New_York">America/New_York</option>
//                       <option value="Europe/London">Europe/London</option>
//                     </select>
//                   </div>
//                 </div>
//                 <button type="submit" className="complete-btn">
//                   Complete Setup
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Modal for Add/Edit Branch */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>{currentBranch ? 'Edit Branch' : 'Add Branch'}</h2>
//             <form onSubmit={handleBranchSubmit}>
//               <div className="form-group">
//                 <label>
//                   Branch Name <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={branchForm.name}
//                   onChange={handleBranchChange}
//                   placeholder="Enter branch name"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>
//                   Address Line 1 <span className="required">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="addressLine1"
//                   value={branchForm.addressLine1}
//                   onChange={handleBranchChange}
//                   placeholder="Enter address line 1"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Address Line 2</label>
//                 <input
//                   type="text"
//                   name="addressLine2"
//                   value={branchForm.addressLine2}
//                   onChange={handleBranchChange}
//                   placeholder="Enter address line 2"
//                 />
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     City <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={branchForm.city}
//                     onChange={handleBranchChange}
//                     placeholder="Enter city"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>
//                     State <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={branchForm.state}
//                     onChange={handleBranchChange}
//                     placeholder="Enter state"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>
//                     Postal Code <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="postalCode"
//                     value={branchForm.postalCode}
//                     onChange={handleBranchChange}
//                     placeholder="Enter postal code"
//                     required
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>
//                     Country <span className="required">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="country"
//                     value={branchForm.country}
//                     onChange={handleBranchChange}
//                     placeholder="Enter country"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>
//                   <input
//                     type="checkbox"
//                     name="isActive"
//                     checked={branchForm.isActive}
//                     onChange={handleBranchChange}
//                   />
//                   Branch is active
//                 </label>
//               </div>
//               <div className="modal-actions">
//                 <button type="button" onClick={() => setShowModal(false)}>
//                   Cancel
//                 </button>
//                 <button type="submit">Save Branch</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InstituteSetup;