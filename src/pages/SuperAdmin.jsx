import { useNavigate } from "react-router-dom";
import React from 'react';

export default function SuperAdmin() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex">
                <div className="superadmin">
                    <div className="shadow-sm p-3 mb-5 bg-body-tertiary rounded"></div>
                    <div className="superadmin_header">
                        <div className="superadmin_header_left">
                            <div className="up">
                                <i className="fa-solid fa-chevron-left"></i>
                                <h5>Yash</h5>
                                <div className="alertAdmin text-danger" role="alert">
                                    SUPER ADMIN
                                </div>
                            </div>
                            <div className="down">
                                <p>yashhardly16@gmail.com</p>
                                <p>0123456789</p>
                            </div>
                        </div>
                        <div className="superadmin_header_right">
                            <button type="button" className="btn btn-outline-primary m-2">View Calendar</button>
                            <button type="button" className="btn btn-outline-primary">Actions</button>
                        </div>
                    </div>

                    <div className="second_header">
                        <table className="data table">
                            <thead className="table-secondary">
                                <tr>
                                    <th>Added on</th>
                                    <th>Branches</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>01/11/2024</td>
                                    <td>i-tech</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                            <a className="icon-link icon-link-hover links" href="/classesTaught">Classes taught &nbsp;</a>
                            <a className="icon-link icon-link-hover links" href="/profile">Profile</a>
                        </div>

                        {/* <button type="button" className="btn btn-outline-danger m-2" onClick={() => navigate('/courses')}>Courses</button>
                        <button type="button" className="btn btn-outline-danger" onClick={() => navigate('/batches')}>Batches</button> */}
                    </div>
                </div>
            </div>
        </>
    );
}