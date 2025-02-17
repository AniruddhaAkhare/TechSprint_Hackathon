import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function  EducationalDetails ()  {
    const [educationDetails, setEducationDetails] = useState([]);
    
    const addEducation = () => {
        setEducationDetails([...educationDetails, { level: '', institute: '', degree: '', branch: '', grade: '' }]);
    };

    const handleEducationChange = (index, field, value) => {
        const newEducationDetails = [...educationDetails];
        newEducationDetails[index][field] = value;
        setEducationDetails(newEducationDetails);
    };

    const deleteEducation = (index) => {
        const newEducationDetails = educationDetails.filter((_, i) => i !== index);
        setEducationDetails(newEducationDetails);
    };

    return (
        <div>
            {educationDetails.map((edu, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Level of Education"
                        value={edu.level}
                        onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Institute Name"
                        value={edu.institute}
                        onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Branch"
                        value={edu.branch}
                        onChange={(e) => handleEducationChange(index, 'branch', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Grade"
                        value={edu.grade}
                        onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                    />
                    <input
                        type="date"
                        placeholder="Passing Year"
                        value={edu.passingyr}
                        onChange={(e) => handleEducationChange(index, 'passingyr', e.target.value)}
                    />
                    <button onClick={() => deleteEducation(index)} style={{ backgroundColor: '#ff4d4f' }}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            ))}
            <button onClick={addEducation}>Add Education</button>
        </div>
    );
};

// export default EducationalDetails;
