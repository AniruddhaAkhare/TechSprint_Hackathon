// // // // // // // import { useState } from "react";
// // // // // // // import Button  from '../../../components/ui/Button'
// // // // // // // import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../../../components/ui/Table";
// // // // // // // import { MoreVertical } from "lucide-react";

// // // // // // // const Roles = () => {
// // // // // // //   const [roles, setRoles] = useState([
// // // // // // //     { id: 1, name: "Super Admin", description: "This role will give access to all functionalities of the platform", type: "DEFAULT", usersAssigned: 1 },
// // // // // // //     { id: 2, name: "Admin", description: "Branch level admins with access to all functionalities within their branches", type: "DEFAULT", usersAssigned: 0 },
// // // // // // //     { id: 3, name: "Instructor", description: "They can create and start sessions but have no configuration access", type: "DEFAULT", usersAssigned: 0 },
// // // // // // //   ]);

// // // // // // //   return (
// // // // // // //     <div className="flex-col w-screen ml-80 p-4">
// // // // // // //       <div className="flex justify-between items-center mb-4">
// // // // // // //         <h2 className="text-xl font-semibold">Roles & Permissions</h2>
// // // // // // //         <Button className="bg-blue-600 text-white">+ New Role</Button>
// // // // // // //       </div>
// // // // // // //       <Table>
// // // // // // //         <TableHead>
// // // // // // //           <TableRow>
// // // // // // //             <TableHeader>#</TableHeader>
// // // // // // //             <TableHeader>Role Name</TableHeader>
// // // // // // //             <TableHeader>Description</TableHeader>
// // // // // // //             <TableHeader>Type</TableHeader>
// // // // // // //             <TableHeader>Users Assigned</TableHeader>
// // // // // // //             <TableHeader>Actions</TableHeader>
// // // // // // //           </TableRow>
// // // // // // //         </TableHead>
// // // // // // //         <TableBody>
// // // // // // //           {roles.map((role, index) => (
// // // // // // //             <TableRow key={role.id}>
// // // // // // //               <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
// // // // // // //               <TableCell>{role.name}</TableCell>
// // // // // // //               <TableCell>{role.description}</TableCell>
// // // // // // //               <TableCell>
// // // // // // //                 <span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span>
// // // // // // //               </TableCell>
// // // // // // //               <TableCell>{role.usersAssigned}</TableCell>
// // // // // // //               <TableCell>
// // // // // // //                 <MoreVertical className="cursor-pointer" />
// // // // // // //               </TableCell>
// // // // // // //             </TableRow>
// // // // // // //           ))}
// // // // // // //         </TableBody>
// // // // // // //       </Table>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default Roles;


// // // // // // import { useState } from "react";
// // // // // // import Button from '../../../components/ui/Button';
// // // // // // import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "../../../components/ui/Table";
// // // // // // import { MoreVertical } from "lucide-react";
// // // // // // import CreateRoleModal from "./CreateRoleModal"; // Import modal

// // // // // // const Roles = () => {
// // // // // //   const [roles, setRoles] = useState([
// // // // // //     { id: 1, name: "Super Admin", description: "This role will give access to all functionalities of the platform", type: "DEFAULT", usersAssigned: 1 },
// // // // // //     { id: 2, name: "Admin", description: "Branch level admins with access to all functionalities within their branches", type: "DEFAULT", usersAssigned: 0 },
// // // // // //     { id: 3, name: "Instructor", description: "They can create and start sessions but have no configuration access", type: "DEFAULT", usersAssigned: 0 },
// // // // // //   ]);

// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // // // // //   return (
// // // // // //     <div className="flex-col w-screen ml-80 p-4">
// // // // // //       <div className="flex justify-between items-center mb-4">
// // // // // //         <h2 className="text-xl font-semibold">Roles & Permissions</h2>
// // // // // //         <Button className="bg-blue-600 text-white" onClick={() => setIsModalOpen(true)}>+ New Role</Button>
// // // // // //       </div>

// // // // // //       <Table>
// // // // // //         <TableHead>
// // // // // //           <TableRow>
// // // // // //             <TableHeader>#</TableHeader>
// // // // // //             <TableHeader>Role Name</TableHeader>
// // // // // //             <TableHeader>Description</TableHeader>
// // // // // //             <TableHeader>Type</TableHeader>
// // // // // //             <TableHeader>Users Assigned</TableHeader>
// // // // // //             <TableHeader>Actions</TableHeader>
// // // // // //           </TableRow>
// // // // // //         </TableHead>
// // // // // //         <TableBody>
// // // // // //           {roles.map((role, index) => (
// // // // // //             <TableRow key={role.id}>
// // // // // //               <TableCell>{String(index + 1).padStart(2, '0')}</TableCell>
// // // // // //               <TableCell>{role.name}</TableCell>
// // // // // //               <TableCell>{role.description}</TableCell>
// // // // // //               <TableCell>
// // // // // //                 <span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span>
// // // // // //               </TableCell>
// // // // // //               <TableCell>{role.usersAssigned}</TableCell>
// // // // // //               <TableCell>
// // // // // //                 <MoreVertical className="cursor-pointer" />
// // // // // //               </TableCell>
// // // // // //             </TableRow>
// // // // // //           ))}
// // // // // //         </TableBody>
// // // // // //       </Table>

// // // // // //       {/* Modal */}
// // // // // //       <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default Roles;



// // // // // import { useState, useEffect } from "react";
// // // // // import Button from '../../../components/ui/Button';
// // // // // import { db } from "../../../config/firebase";
// // // // // import { collection, getDocs } from "firebase/firestore";
// // // // // import CreateRoleModal from "./CreateRoleModal";
// // // // // import { MoreVertical } from "lucide-react";

// // // // // const Roles = () => {
// // // // //   const [roles, setRoles] = useState([]);
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);

// // // // //   const fetchRoles = async () => {
// // // // //     const querySnapshot = await getDocs(collection(db, "roles"));
// // // // //     const rolesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // // //     setRoles(rolesList);
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchRoles();
// // // // //   }, []);

// // // // //   return (
// // // // //     <div className="flex-col w-screen ml-80 p-4">
// // // // //       <div className="flex justify-between items-center mb-4">
// // // // //         <h2 className="text-xl font-semibold">Roles & Permissions</h2>
// // // // //         <Button className="bg-blue-600 text-white" onClick={() => setIsModalOpen(true)}>+ New Role</Button>
// // // // //       </div>

// // // // //       <table className="w-full border">
// // // // //         <thead>
// // // // //           <tr className="bg-gray-100">
// // // // //             <th className="p-2 border">#</th>
// // // // //             <th className="p-2 border">Role Name</th>
// // // // //             <th className="p-2 border">Description</th>
// // // // //             <th className="p-2 border">Type</th>
// // // // //             <th className="p-2 border">Users Assigned</th>
// // // // //             <th className="p-2 border">Actions</th>
// // // // //           </tr>
// // // // //         </thead>
// // // // //         <tbody>
// // // // //           {roles.map((role, index) => (
// // // // //             <tr key={role.id} className="text-center border">
// // // // //               <td className="p-2 border">{index + 1}</td>
// // // // //               <td className="p-2 border">{role.name}</td>
// // // // //               <td className="p-2 border">{role.description}</td>
// // // // //               <td className="p-2 border"><span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span></td>
// // // // //               <td className="p-2 border">{role.usersAssigned}</td>
// // // // //               <td className="p-2 border">
// // // // //                 <MoreVertical className="cursor-pointer" />
// // // // //               </td>
// // // // //             </tr>
// // // // //           ))}
// // // // //         </tbody>
// // // // //       </table>

// // // // //       {/* Modal */}
// // // // //       <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRoles} />
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Roles;


// // // // import { useState, useEffect } from "react";
// // // // import Button from '../../../components/ui/Button';
// // // // import { db } from "../../../config/firebase";
// // // // import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// // // // import CreateRoleModal from "./CreateRoleModal";
// // // // import { MoreVertical } from "lucide-react";

// // // // const Roles = () => {
// // // //   const [roles, setRoles] = useState([]);
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [selectedRole, setSelectedRole] = useState(null);
// // // //   const [dropdownOpen, setDropdownOpen] = useState(null);

// // // //   // Fetch roles from Firestore
// // // //   const fetchRoles = async () => {
// // // //     const querySnapshot = await getDocs(collection(db, "roles"));
// // // //     const rolesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // // //     setRoles(rolesList);
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchRoles();
// // // //   }, []);

// // // //   // Open edit modal
// // // //   const handleEdit = (role) => {
// // // //     setSelectedRole(role);
// // // //     setIsModalOpen(true);
// // // //     setDropdownOpen(null);
// // // //   };

// // // //   // Delete role from Firestore
// // // //   const handleDelete = async (roleId) => {
// // // //     if (window.confirm("Are you sure you want to delete this role?")) {
// // // //       await deleteDoc(doc(db, "roles", roleId));
// // // //       fetchRoles(); // Refresh roles
// // // //       setDropdownOpen(null);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="flex-col w-screen ml-80 p-4">
// // // //       <div className="flex justify-between items-center mb-4">
// // // //         <h2 className="text-xl font-semibold">Roles & Permissions</h2>
// // // //         <Button className="bg-blue-600 text-white" onClick={() => { setSelectedRole(null); setIsModalOpen(true); }}>
// // // //           + New Role
// // // //         </Button>
// // // //       </div>

// // // //       <table className="w-full border">
// // // //         <thead>
// // // //           <tr className="bg-gray-100">
// // // //             <th className="p-2 border">#</th>
// // // //             <th className="p-2 border">Role Name</th>
// // // //             <th className="p-2 border">Description</th>
// // // //             <th className="p-2 border">Type</th>
// // // //             <th className="p-2 border">Users Assigned</th>
// // // //             <th className="p-2 border">Actions</th>
// // // //           </tr>
// // // //         </thead>
// // // //         <tbody>
// // // //           {roles.map((role, index) => (
// // // //             <tr key={role.id} className="text-center border">
// // // //               <td className="p-2 border">{index + 1}</td>
// // // //               <td className="p-2 border">{role.name}</td>
// // // //               <td className="p-2 border">{role.description}</td>
// // // //               <td className="p-2 border"><span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span></td>
// // // //               <td className="p-2 border">{role.usersAssigned}</td>
// // // //               <td className="p-2 border relative">
// // // //                 <button onClick={() => setDropdownOpen(dropdownOpen === role.id ? null : role.id)}>
// // // //                   <MoreVertical className="cursor-pointer" />
// // // //                 </button>
// // // //                 {dropdownOpen === role.id && (
// // // //                   <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg">
// // // //                     <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleEdit(role)}>Edit</button>
// // // //                     <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100" onClick={() => handleDelete(role.id)}>Delete</button>
// // // //                   </div>
// // // //                 )}
// // // //               </td>
// // // //             </tr>
// // // //           ))}
// // // //         </tbody>
// // // //       </table>

// // // //       {/* Modal for Create/Edit Role */}
// // // //       <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRoles} selectedRole={selectedRole} />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Roles;

// // // import { useState, useEffect } from "react";
// // // import Button from '../../../components/ui/Button';
// // // import { db } from "../../../config/firebase";
// // // import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// // // import CreateRoleModal from "./CreateRoleModal";
// // // import { MoreVertical } from "lucide-react";

// // // const Roles = () => {
// // //   const [roles, setRoles] = useState([]);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [selectedRole, setSelectedRole] = useState(null);
// // //   const [dropdownOpen, setDropdownOpen] = useState(null);

// // //   // Fetch roles from Firestore
// // //   const fetchRoles = async () => {
// // //     try {
// // //       const querySnapshot = await getDocs(collection(db, "roles"));
// // //       const rolesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// // //       setRoles(rolesList);
// // //     } catch (error) {
// // //       console.error("Error fetching roles:", error);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchRoles();
// // //   }, []);

// // //   // Open Create Role Modal
// // //   const handleNewRole = () => {
// // //     setSelectedRole(null);  // Reset previous selection
// // //     setIsModalOpen(true);
// // //   };

// // //   // Open edit modal
// // //   const handleEdit = (role) => {
// // //     setSelectedRole(role);
// // //     setIsModalOpen(true);
// // //     setDropdownOpen(null);
// // //   };

// // //   // Delete role from Firestore
// // //   const handleDelete = async (roleId) => {
// // //     if (window.confirm("Are you sure you want to delete this role?")) {
// // //       await deleteDoc(doc(db, "roles", roleId));
// // //       fetchRoles(); // Refresh roles
// // //       setDropdownOpen(null);
// // //     }
// // //   };

// // //   return (
// // //     <div className="flex-col w-screen ml-80 p-4">
// // //       <div className="flex justify-between items-center mb-4">
// // //         <h2 className="text-xl font-semibold">Roles & Permissions</h2>
// // //         <Button className="bg-blue-600 text-white" onClick={handleNewRole}>
// // //           + New Role
// // //         </Button>
// // //       </div>

// // //       <table className="w-full border">
// // //         <thead>
// // //           <tr className="bg-gray-100">
// // //             <th className="p-2 border">#</th>
// // //             <th className="p-2 border">Role Name</th>
// // //             <th className="p-2 border">Description</th>
// // //             <th className="p-2 border">Type</th>
// // //             <th className="p-2 border">Users Assigned</th>
// // //             <th className="p-2 border">Actions</th>
// // //           </tr>
// // //         </thead>
// // //         <tbody>
// // //           {roles.map((role, index) => (
// // //             <tr key={role.id} className="text-center border">
// // //               <td className="p-2 border">{index + 1}</td>
// // //               <td className="p-2 border">{role.name}</td>
// // //               <td className="p-2 border">{role.description}</td>
// // //               <td className="p-2 border">
// // //                 <span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span>
// // //               </td>
// // //               <td className="p-2 border">{role.usersAssigned || 0}</td>
// // //               <td className="p-2 border relative">
// // //                 <button onClick={() => setDropdownOpen(dropdownOpen === role.id ? null : role.id)}>
// // //                   <MoreVertical className="cursor-pointer" />
// // //                 </button>
// // //                 {dropdownOpen === role.id && (
// // //                   <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
// // //                     <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleEdit(role)}>
// // //                       Edit
// // //                     </button>
// // //                     <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100" onClick={() => handleDelete(role.id)}>
// // //                       Delete
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //               </td>
// // //             </tr>
// // //           ))}
// // //         </tbody>
// // //       </table>

// // //       {/* Modal for Create/Edit Role */}
// // //       <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRoles} selectedRole={selectedRole} />
// // //     </div>
// // //   );
// // // };

// // // export default Roles;


// // import { useState, useEffect } from "react";
// // import Button from '../../../components/ui/Button';
// // import { db } from "../../../config/firebase";
// // import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// // import CreateRoleModal from "./CreateRoleModal";
// // import { MoreVertical } from "lucide-react";

// // const Roles = () => {
// //   const [roles, setRoles] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [selectedRole, setSelectedRole] = useState(null);
// //   const [dropdownOpen, setDropdownOpen] = useState(null);

// //   // Fetch roles and count assigned users dynamically
// //   const fetchRolesWithUserCount = async () => {
// //     try {
// //       const rolesSnapshot = await getDocs(collection(db, "roles"));
// //       let rolesList = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), usersAssigned: 0 }));

// //       // Fetch all instructors
// //       const instructorsSnapshot = await getDocs(collection(db, "Instructor"));
// //       const instructors = instructorsSnapshot.docs.map(doc => doc.data());

// //       // Count how many instructors are assigned to each role
// //       rolesList = rolesList.map(role => ({
// //         ...role,
// //         usersAssigned: instructors.filter(instructor => instructor.role === role.name).length
// //       }));

// //       setRoles(rolesList);
// //     } catch (error) {
// //       console.error("Error fetching roles with user count:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRolesWithUserCount();
// //   }, []);

// //   // Open Create Role Modal
// //   const handleNewRole = () => {
// //     setSelectedRole(null); // Reset previous selection
// //     setIsModalOpen(true);
// //   };

// //   // Open edit modal
// //   const handleEdit = (role) => {
// //     setSelectedRole(role);
// //     setIsModalOpen(true);
// //     setDropdownOpen(null);
// //   };

// //   // Delete role from Firestore
// //   const handleDelete = async (roleId) => {
// //     if (window.confirm("Are you sure you want to delete this role?")) {
// //       await deleteDoc(doc(db, "roles", roleId));
// //       fetchRolesWithUserCount(); // Refresh roles
// //       setDropdownOpen(null);
// //     }
// //   };

// //   return (
// //     <div className="flex-col w-screen ml-80 p-4">
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-xl font-semibold">Roles & Permissions</h2>
// //         <Button className="bg-blue-600 text-white" onClick={handleNewRole}>
// //           + New Role
// //         </Button>
// //       </div>

// //       <table className="w-full border">
// //         <thead>
// //           <tr className="bg-gray-100">
// //             <th className="p-2 border">#</th>
// //             <th className="p-2 border">Role Name</th>
// //             <th className="p-2 border">Description</th>
// //             <th className="p-2 border">Type</th>
// //             <th className="p-2 border">Users Assigned</th>
// //             <th className="p-2 border">Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {roles.map((role, index) => (
// //             <tr key={role.id} className="text-center border">
// //               <td className="p-2 border">{index + 1}</td>
// //               <td className="p-2 border">{role.name}</td>
// //               <td className="p-2 border">{role.description}</td>
// //               <td className="p-2 border">
// //                 <span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span>
// //               </td>
// //               <td className="p-2 border">{role.usersAssigned}</td>
// //               <td className="p-2 border relative">
// //                 <button onClick={() => setDropdownOpen(dropdownOpen === role.id ? null : role.id)}>
// //                   <MoreVertical className="cursor-pointer" />
// //                 </button>
// //                 {dropdownOpen === role.id && (
// //                   <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
// //                     <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleEdit(role)}>
// //                       Edit
// //                     </button>
// //                     <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100" onClick={() => handleDelete(role.id)}>
// //                       Delete
// //                     </button>
// //                   </div>
// //                 )}
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       {/* Modal for Create/Edit Role */}
// //       <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRolesWithUserCount} selectedRole={selectedRole} />
// //     </div>
// //   );
// // };

// // export default Roles;


// import { useState, useEffect } from "react";
// import Button from '../../../components/ui/Button';
// import { db } from "../../../config/firebase";
// import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import CreateRoleModal from "./CreateRoleModal";
// import { MoreVertical } from "lucide-react";
// import useUserRole from "./useUserRole";  // Import hook

// const PERMISSIONS = {
//   Admin: ["create", "edit", "delete"],
//   Manager: ["edit", "view"],
//   Instructor: ["view"]
// };

// const Roles = () => {
//   const [roles, setRoles] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedRole, setSelectedRole] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const { userRole, loading } = useUserRole();  

//   // Fetch roles and count assigned users dynamically
//   const fetchRolesWithUserCount = async () => {
//     try {
//       const rolesSnapshot = await getDocs(collection(db, "roles"));
//       let rolesList = rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), usersAssigned: 0 }));

//       // Fetch all instructors
//       const instructorsSnapshot = await getDocs(collection(db, "Instructor"));
//       const instructors = instructorsSnapshot.docs.map(doc => doc.data());

//       // Count how many instructors are assigned to each role
//       for (let role of rolesList) {
//         const assignedCount = instructors.filter(instructor => instructor.role === role.name).length;

//         // Update Firestore if count has changed
//         if (role.usersAssigned !== assignedCount) {
//           await updateDoc(doc(db, "roles", role.id), { usersAssigned: assignedCount });
//         }

//         role.usersAssigned = assignedCount;
//       }

//       setRoles(rolesList);
//     } catch (error) {
//       console.error("Error fetching roles with user count:", error);
//     }
//   };

//   useEffect(() => {
//     fetchRolesWithUserCount();
//   }, []);

//   // Open Create Role Modal
//   const handleNewRole = () => {
//     setSelectedRole(null); // Reset previous selection
//     setIsModalOpen(true);
//   };

//   // Open edit modal
//   const handleEdit = (role) => {
//     setSelectedRole(role);
//     setIsModalOpen(true);
//     setDropdownOpen(null);
//   };

//   // Delete role from Firestore
//   const handleDelete = async (roleId) => {
//     if (window.confirm("Are you sure you want to delete this role?")) {
//       await deleteDoc(doc(db, "roles", roleId));
//       fetchRolesWithUserCount(); // Refresh roles
//       setDropdownOpen(null);
//     }
//   };

//   return (
//     <div className="flex-col w-screen ml-80 p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Roles & Permissions</h2>
//         <Button className="bg-blue-600 text-white" onClick={handleNewRole}>
//           + New Role
//         </Button>
//       </div>

//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2 border">#</th>
//             <th className="p-2 border">Role Name</th>
//             <th className="p-2 border">Description</th>
//             <th className="p-2 border">Type</th>
//             <th className="p-2 border">Users Assigned</th>
//             <th className="p-2 border">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {roles.map((role, index) => (
//             <tr key={role.id} className="text-center border">
//               <td className="p-2 border">{index + 1}</td>
//               <td className="p-2 border">{role.name}</td>
//               <td className="p-2 border">{role.description}</td>
//               <td className="p-2 border">
//                 <span className="bg-gray-200 px-2 py-1 rounded text-xs">{role.type}</span>
//               </td>
//               <td className="p-2 border">{role.usersAssigned}</td>
//               <td className="p-2 border relative">
//                 <button onClick={() => setDropdownOpen(dropdownOpen === role.id ? null : role.id)}>
//                   <MoreVertical className="cursor-pointer" />
//                 </button>
//                 {dropdownOpen === role.id && (
//                   <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10">
//                     <button className="block w-full px-4 py-2 text-left hover:bg-gray-100" onClick={() => handleEdit(role)}>
//                       Edit
//                     </button>
//                     <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100" onClick={() => handleDelete(role.id)}>
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal for Create/Edit Role */}
//       <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRolesWithUserCount} selectedRole={selectedRole} />
//     </div>
//   );
// };

// export default Roles;


import { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth } from "../../../config/firebase"; // Import Firebase Auth
import CreateRoleModal from "./CreateRoleModal";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch roles from Firestore
  const fetchRoles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "roles"));
      const rolesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRoles(rolesList);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch user role & permissions from Firestore
  const fetchUserRole = async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, "Instructor", auth.currentUser.email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
        setUserPermissions(userData.permissions || {});
      }
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUserRole();
  }, []);

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Roles & Permissions</h2>
        
        {/* Hide "New Role" button if user doesn't have permission */}
        {userPermissions["New Enrollment"] && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(true)}>
            + New Role
          </button>
        )}
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Role Name</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id} className="text-center border">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{role.roleName}</td>
              <td className="p-2 border">{role.description}</td>
              <td className="p-2 border">
                {/* Hide Edit/Delete buttons if user doesn't have permission */}
                {userPermissions["Courses"] && (
                  <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                )}
                {userPermissions["Reports"] && (
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Role Modal */}
      <CreateRoleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fetchRoles={fetchRoles} />
    </div>
  );
};

export default Roles;
