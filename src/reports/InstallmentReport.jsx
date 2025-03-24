import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query, Timestamp, updateDoc, doc } from "firebase/firestore";

export default function InstallmentReport() {
    const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("thisMonth");


    useEffect(() => {
       
        const fetchAllInstallments = async () => {
            try {
                const studentsQuery = query(collection(db, "student"));
                const studentsSnapshot = await getDocs(studentsQuery);
                const allInstallments = [];

                for (const studentDoc of studentsSnapshot.docs) {
                    const installmentsRef = collection(db, "student", studentDoc.id, "installments");
                    const installmentsSnapshot = await getDocs(installmentsRef);

                    installmentsSnapshot.forEach((installmentDoc) => {
                        allInstallments.push({
                            id: installmentDoc.id,
                            studentId: studentDoc.id,
                            studentData: studentDoc.data(),
                            ...installmentDoc.data(),
                        });
                    });
                }

                setInstallments(allInstallments);
                console.log(allInstallments);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching installments:", error);
                setLoading(false);
            }
        };

        fetchAllInstallments();
    }, []);

    const handleUpdate = async (installment, field, value) => {
        try {
            const updates = { [field]: value };
            const installmentRef = doc(db, "student", installment.studentId, "installments", installment.id);
            await updateDoc(installmentRef, updates);

            setInstallments(prev => prev.map(item =>
                item.id === installment.id ? { ...item, ...updates } : item
            ));
        } catch (error) {
            console.error("Error updating installment:", error);
        }
    };

      const filterInstallments = () => {
        console.log("filterInstallments called with filter:", filter); 
        console.log("Installments before filter:", installments); 

        const now = new Date();
        let startDate, endDate;

        switch (filter) {
            case "thisMonth":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                console.log("thisMonth: startDate =", startDate, "endDate =", endDate);
                break;
            case "lastMonth":
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                console.log("lastMonth: startDate =", startDate, "endDate =", endDate);
                break;
            case "nextMonth":
                startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                console.log("nextMonth: startDate =", startDate, "endDate =", endDate);
                break;
            case "thisYear":
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                console.log("thisYear: startDate =", startDate, "endDate =", endDate);
                break;
            case "lastYear":
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, 11, 31);
                console.log("lastYear: startDate =", startDate, "endDate =", endDate);
                break;
            default:
                console.log("default: returning all installments");
                return installments;
        }

        if (loading) {
            console.log("Loading is true, returning empty array");
            return [];
        }

        const filtered = installments.filter((installment) => {
            const dueDate = installment.dueDate instanceof Timestamp
                ? installment.dueDate.toDate()
                : new Date(installment.dueDate);
            const isInRange = dueDate >= startDate && dueDate <= endDate;
            console.log("dueDate =", dueDate, "isInRange =", isInRange, "installment =", installment); // Check each installment

            return isInRange;
        });

        console.log("Filtered installments:", filtered); // Check filtered result
        return filtered;
    };

    if (loading) return <div>Loading installments...</div>;

    const filteredInstallments = filterInstallments();
    const totalAmount = filteredInstallments.reduce((acc, installment) => acc + Number(installment.dueAmount), 0);

    return (
        <div className="p-20">
            <h1 className="text-2xl font-bold mb-4">Installment Report</h1>
            <div className="mb-4">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="nextMonth">Next Month</option>
                    <option value="thisYear">This Year</option>
                    <option value="lastYear">Last Year</option>
                    <option value="all">All</option>
                    
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Student Name</th>
                            <th className="px-4 py-2">Installment No</th>
                            <th className="px-4 py-2">Due Date</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Paid Date</th>
                            <th className="px-4 py-2">Received By</th>
                            <th className="px-4 py-2">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstallments.map((installment) => {
                            const dueDate = installment.dueDate instanceof Timestamp
                                ? installment.dueDate.toDate()
                                : new Date(installment.dueDate);

                            const paidDate = installment.paidDate instanceof Timestamp
                                ? installment.paidDate.toDate()
                                : installment.paidDate ? new Date(installment.paidDate) : null;


                            return (
                                <tr key={installment.id} className="border-b">
                                    <td className="px-4 py-2 text-center">
                                        {installment.studentData.first_name} {installment.studentData.last_name}
                                    </td>
                                    <td className="px-4 py-2 text-center">{installment.number}</td>
                                    <td className="px-4 py-2 text-center">
                                        {dueDate.toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-center">₹{installment.dueAmount}</td>
                                    <td className="px-4 py-2 text-center">
                                        <select
                                            value={installment.paid ? "Paid" : "Pending"}
                                            onChange={(e) => handleUpdate(
                                                installment,
                                                "paid",
                                                e.target.value === "Paid"
                                            )}
                                            className="p-1 border rounded"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="date"
                                            value={paidDate ? paidDate.toISOString().split('T')[0] : ""}
                                            onChange={(e) => handleUpdate(
                                                installment,
                                                "paidDate",
                                                Timestamp.fromDate(new Date(e.target.value))
                                            )}
                                            className="p-1 border rounded"
                                            disabled={!installment.paid}
                                        />
                                    </td>

                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="text"
                                            value={installment.receivedBy || ""}
                                            onChange={(e) => handleUpdate(
                                                installment, 
                                                "receivedBy",
                                                e.target.value
                                            )}
                                            className="p-1 border rounded w-32"
                                            disabled={!installment.paid}
                                        />
                                    </td>


                                    <td className="px-4 py-2 text-center">
                                        <input
                                            type="text"
                                            value={installment.remarks || ""}
                                            onChange={(e) => handleUpdate(
                                                installment,
                                                "remarks",
                                                e.target.value
                                            )}
                                            className="p-1 border rounded w-48"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                        <tr className="bg-gray-100">
                            <td colSpan="3" className="px-4 py-2 font-bold text-right">Total:</td>
                            <td className="px-4 py-2 font-bold text-center">₹{totalAmount}</td>
                            <td colSpan="4"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
