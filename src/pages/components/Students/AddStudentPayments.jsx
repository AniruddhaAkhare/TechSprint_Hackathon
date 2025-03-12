import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../config/firebase";

const AddStudentPayments = ({ admissionDate }) => {
    const [paymentType, setPaymentType] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [installmentDetails, setInstallmentDetails] = useState([]);
    const [discount, setDiscount] = useState("");
    const [total, setTotal] = useState("");
    const [feeTemplates, setFeeTemplates] = useState([]); // Initialize as an empty array

    useEffect(() => {
        fetchFeeTemplates();
    }, []);

    const fetchFeeTemplates = async () => {
        try {
            const templateCollection = collection(db, "feeTemplates");
            const templateSnapshot = await getDocs(templateCollection);
            
            if (templateSnapshot.empty) {
                alert("No fee templates found.");
                return;
            }

            const templates = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFeeTemplates(templates);
        } catch (error) {
            console.error("Error fetching fee templates:", error);
        }
    };

    const handleTemplateChange = (e) => {
        const selectedId = e.target.value;
        const template = feeTemplates.find(template => template.id === selectedId);
        setSelectedTemplate(template);

        if (template) {
            setInstallmentDetails(createInstallments(template));
        } else {
            setInstallmentDetails([]);
        }
    };

    const createInstallments = (template) => {
        return Array.from({ length: template.installments }, (_, index) => ({
            number: index + 1,
            dueAmount: '',
            dueDate: '',
            paidOn: '',
            amtPaid: '',
            modeOfPayment: '',
            pdcStatus: '',
            remark: ''
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, index] = name.split(".");
        const updatedInstallments = [...installmentDetails];

        updatedInstallments[index][field] = value;
        setInstallmentDetails(updatedInstallments);
    };

    const deleteInstallment = (index) => {
        const updatedInstallments = installmentDetails.filter((_, i) => i !== index);
        setInstallmentDetails(updatedInstallments);
    };

    const addInstallment = () => {
        if (selectedTemplate) {
            setInstallmentDetails([...installmentDetails, {
                number: installmentDetails.length + 1,
                dueAmount: '',
                dueDate: '',
                paidOn: '',
                amtPaid: '',
                modeOfPayment: '',
                pdcStatus: '',
                remark: ''
            }]);
        }
    };

    const handleFeeSummary = () => {
        const calculatedTotal = installmentDetails.reduce((sum, installment) => {
            return sum + (parseFloat(installment.dueAmount) || 0);
        }, 0);
        const discountedTotal = calculatedTotal - (calculatedTotal * (parseFloat(discount) / 100) || 0);
        setTotal(discountedTotal);
    };

    return (
        <div>
            <h3>Payments</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div>
                    <h4>Date Of Enrollments</h4>
                    <input readOnly value={admissionDate} />
                </div>

                <div>
                    <h4>Fees Scheme</h4>
                    <select name="payment-type" value={paymentType} onChange={handleTemplateChange}>
                        <option value="">--Select a Type--</option>
                        {feeTemplates.map((template) => (
                            <option key={template.id} value={template.id}>{template.templateName}</option>
                        ))}
                    </select>

                    {selectedTemplate && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-semibold">Fill Fee Details:</h3>
                        </div>
                    )}
                </div>

                <div>
                    <h2>Installment Details</h2>
                    {installmentDetails.map((installment, index) => (
                        <div key={index} className="course-group">
                            <input name={`number.${index}`} type="text" placeholder="Installment No.:" value={installment.number} readOnly />
                            <input name={`dueAmount.${index}`} type="text" placeholder="Due Amount" value={installment.dueAmount} onChange={handleChange} />
                            <input name={`dueDate.${index}`} type="date" placeholder="Due Date" value={installment.dueDate} onChange={handleChange} />
                            <input name={`paidOn.${index}`} type="date" placeholder="Paid On" value={installment.paidOn} onChange={handleChange} />
                            <input name={`amtPaid.${index}`} type="text" placeholder="Amount Paid" value={installment.amtPaid} onChange={handleChange} />
                            <select name={`modeOfPayment.${index}`} value={installment.modeOfPayment} onChange={handleChange}>
                                <option value="" disabled>Select Mode Of Payment</option>
                                <option value="m1">mode1</option>
                                <option value="m2">mode2</option>
                                <option value="m3">mode3</option>
                            </select>
                            <select name={`pdcStatus.${index}`} value={installment.pdcStatus} onChange={handleChange}>
                                <option value="" disabled>Select PDC Status</option>
                                <option value="s1">status1</option>
                                <option value="s2">status2</option>
                                <option value="s3">status3</option>
                            </select>
                            <input name={`remark.${index}`} type="text" placeholder="Remark" value={installment.remark} onChange={handleChange} />
                            <button type="button" onClick={() => deleteInstallment(index)} className="ml-2 btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addInstallment} className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Add Installment</button>

                    <label>Add Discount</label>
                    <input name='discount' value={discount} placeholder="Discount" onChange={(e) => setDiscount(e.target.value)} /> %Rup<br />
                    <button type="button" onClick={handleFeeSummary}>Apply Discount</button>

                    <h4>Fees Summary</h4>
                    Total: <input type="number" value={total} disabled />
                </div>
            </div>
        </div>
    );
};

export default AddStudentPayments;
