
// // // import React from "react";
// // // import { Droppable, Draggable } from "@hello-pangea/dnd";
// // // import { FaCircle } from "react-icons/fa";

// // // const Column = ({ columnId, column, filteredEnquiries, canUpdate, handleViewEnquiry }) => {
// // //   return (
// // //     <Droppable droppableId={columnId}>
// // //       {(provided) => (
// // //         <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0" {...provided.droppableProps} ref={provided.innerRef}>
// // //           <div className="flex items-center gap-2 p-4 border-b border-gray-200">
// // //             {column.icon}
// // //             <div>
// // //               <h2 className="text-base font-medium truncate">{column.name}</h2>
// // //               <p className="text-sm text-gray-500">
// // //                 {column.count} (₹{column.totalAmount?.toLocaleString() || "0"})
// // //               </p>
// // //             </div>
// // //           </div>
// // //           <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
// // //             {column.items.length === 0 ? (
// // //               <p className="text-gray-500 text-center">No enquiries in this stage</p>
// // //             ) : (
// // //               filteredEnquiries.map((item, index) => (
// // //                 <Draggable key={item.id} draggableId={String(item.id)} index={index}>
// // //                   {(provided) => (
// // //                     <div
// // //                       className="bg-white border border-gray-200 rounded-md p-4 mb-2 shadow-sm"
// // //                       ref={provided.innerRef}
// // //                       {...provided.draggableProps}
// // //                       {...provided.dragHandleProps}
// // //                       onClick={() => handleViewEnquiry(item)}
// // //                       style={{ cursor: "pointer", ...provided.draggableProps.style }}
// // //                     >
// // //                       <p className="font-medium truncate">{item.name || "Unnamed"}</p>
// // //                       <p className="text-gray-700">₹{item.amount?.toLocaleString() || "0"}</p>
// // //                       <p className="text-gray-500 truncate">{item.phone || "No phone"}</p>
// // //                       <p className="text-gray-500 truncate">{item.email || "No email"}</p>
// // //                       <div className="flex flex-wrap gap-2 mt-2 min-h-[40px]">
// // //                         {item.tags?.map((tag) => (
// // //                           <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
// // //                             <FaCircle className="text-orange-500 text-xs" />
// // //                             {tag}
// // //                           </span>
// // //                         ))}
// // //                       </div>
// // //                     </div>
// // //                   )}
// // //                 </Draggable>
// // //               ))
// // //             )}
// // //             {provided.placeholder}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </Droppable>
// // //   );
// // // };

// // // export default Column;

// // import React from "react";
// // import { Droppable } from "@hello-pangea/dnd";
// // import { FaCircle } from "react-icons/fa";

// // const Column = ({ columnId, column, filteredEnquiries, canUpdate, handleViewEnquiry }) => {
// //   return (
// //     <div className="flex flex-col w-80 shrink-0">
// //       <div className="flex items-center justify-between p-4 bg-white rounded-t-lg shadow-md">
// //         <div className="flex items-center gap-2">
// //           {column.icon}
// //           <h2 className="text-lg font-semibold">{column.name}</h2>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <span className="text-sm text-gray-500">{filteredEnquiries.length}</span>
// //           <span className="text-sm text-gray-500">₹{column.totalAmount.toLocaleString()}</span>
// //         </div>
// //       </div>
// //       <Droppable droppableId={columnId} isDropDisabled={!canUpdate}>
// //         {(provided, snapshot) => (
// //           <div
// //             {...provided.droppableProps}
// //             ref={provided.innerRef}
// //             className={`flex-1 p-4 bg-gray-50 rounded-b-lg shadow-inner min-h-[100px] ${
// //               snapshot.isDraggingOver ? "bg-blue-50" : ""
// //             }`}
// //           >
// //             {filteredEnquiries.length === 0 ? (
// //               <p className="text-gray-500 text-center">No enquiries in this stage</p>
// //             ) : (
// //               filteredEnquiries.map((item, index) => (
// //                 <div
// //                   key={item.id}
// //                   draggable={canUpdate}
// //                   onClick={() => handleViewEnquiry(item)}
// //                   className="p-4 mb-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
// //                 >
// //                   <h3 className="text-md font-medium truncate">{item.name || "Unnamed"}</h3>
// //                   <p className="text-sm text-gray-500 truncate">{item.email || "No email"}</p>
// //                   <p className="text-sm text-gray-500">Owner: {item.addedBy || "Unknown"}</p>
// //                   <div className="flex flex-wrap gap-2 mt-2">
// //                     {item.tags?.map((tag) => (
// //                       <span
// //                         key={tag}
// //                         className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap"
// //                       >
// //                         <FaCircle className="text-orange-500 text-xs" />
// //                         {tag}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               ))
// //             )}
// //             {provided.placeholder}
// //           </div>
// //         )}
// //       </Droppable>
// //     </div>
// //   );
// // };

// // export default Column;


// import React from "react";
// import { Droppable, Draggable } from "@hello-pangea/dnd";
// import { FaCircle } from "react-icons/fa";

// const Column = ({ columnId, column, filteredEnquiries, canUpdate, handleViewEnquiry }) => {
//   return (
//     <Droppable droppableId={columnId}>
//       {(provided) => (
//         <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0" {...provided.droppableProps} ref={provided.innerRef}>
//           <div className="flex items-center gap-2 p-4 border-b border-gray-200">
//             {column.icon}
//             <div>
//               <h2 className="text-base font-medium truncate">{column.name}</h2>
//               <p className="text-sm text-gray-500">
//                 {column.count} (₹{column.totalAmount?.toLocaleString() || "0"})
//               </p>
//             </div>
//           </div>
//           <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
//             {column.items.length === 0 ? (
//               <p className="text-gray-500 text-center">No enquiries in this stage</p>
//             ) : (
//               filteredEnquiries.map((item, index) => (
//                 <Draggable key={item.id} draggableId={String(item.id)} index={index}>
//                   {(provided) => (
//                     <div
//                       className="bg-white border border-gray-200 rounded-md p-4 mb-2 shadow-sm"
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       onClick={() => handleViewEnquiry(item)}
//                       style={{ cursor: "pointer", ...provided.draggableProps.style }}
//                     >
//                       <p className="font-medium truncate">{item.name || "Unnamed"}</p>
//                       <p className="text-gray-700">₹{item.amount?.toLocaleString() || "0"}</p>
//                       <p className="text-gray-500 truncate">{item.phone || "No phone"}</p>
//                       <p className="text-gray-500 truncate">{item.email || "No email"}</p>
//                       <p className="text-gray-500 truncate">Owner: {item.assignTo || "Unknown"}</p>
//                       <div className="flex flex-wrap gap-2 mt-2 min-h-[40px]">
//                         {item.tags?.map((tag) => (
//                           <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
//                             <FaCircle className="text-orange-500 text-xs" />
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </Draggable>
//               ))
//             )}
//             {provided.placeholder}
//           </div>
//         </div>
//       )}
//     </Droppable>
//   );
// };

// export default Column;

import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { FaCircle, FaPlus } from "react-icons/fa";

const Column = ({ columnId, column, filteredEnquiries, canUpdate, handleViewEnquiry, handleAddNotes }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided) => (
        <div className="bg-white rounded-lg shadow-md w-72 flex-shrink-0" {...provided.droppableProps} ref={provided.innerRef}>
          <div className="flex items-center gap-2 p-4 border-b border-gray-200">
            {column.icon}
            <div>
              <h2 className="text-base font-medium truncate">{column.name}</h2>
              <p className="text-sm text-gray-500">
                {column.count} (₹{column.totalAmount?.toLocaleString() || "0"})
              </p>
            </div>
          </div>
          <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
            {column.items.length === 0 ? (
              <p className="text-gray-500 text-center">No enquiries in this stage</p>
            ) : (
              filteredEnquiries.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided) => (
                    <div
                      className="bg-white border border-gray-200 rounded-md p-4 mb-2 shadow-sm relative"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => handleViewEnquiry(item)}
                      style={{ cursor: "pointer", ...provided.draggableProps.style }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering handleViewEnquiry
                          handleAddNotes(item);
                        }}
                        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                      >
                        <FaPlus />
                      </button>
                      <p className="font-medium truncate">{item.name || "Unnamed"}</p>
                      <p className="text-gray-700">₹{item.amount?.toLocaleString() || "0"}</p>
                      <p className="text-gray-500 truncate">{item.phone || "No phone"}</p>
                      <p className="text-gray-500 truncate">{item.email || "No email"}</p>
                      <p className="text-gray-500 truncate">Owner: {item.assignTo || "Unassigned"}</p>
                      <div className="flex flex-wrap gap-2 mt-2 min-h-[40px]">
                        {item.tags?.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-orange-500 px-2 py-1 bg-orange-50 rounded-full text-sm whitespace-nowrap">
                            <FaCircle className="text-orange-500 text-xs" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Column;