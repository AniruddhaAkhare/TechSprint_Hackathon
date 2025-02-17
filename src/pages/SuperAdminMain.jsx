import { useNavigate } from "react-router-dom";
import React from 'react';
import Instructor from "./Instructor";

export default function SuperAdminMain() {
    const navigate = useNavigate();

    return (
        <>
            <div className="main-content">
                <div className="content-header">
                    <div className="nav-left">
                        <h1 className="content-title">Admins & Instructors</h1>
                        <p className="content-description">Create and manage users with different roles on the platform</p>
                    </div>
                    <div className="nav-right">
                        <div className="input-group">
                            <input type="search" className="form-control rounded" placeholder="search by Name, Email, Mobile..." aria-label="Search" aria-describedby="search-addon" />
                            {/* <button type="button" className="btn btn-outline-primary" onClick={<Instructor/>}>+ Add Instructors</button> */}
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => navigate('/instructor')}
                            >
                                + Add Instructors
                            </button>

                        </div>
                    </div>
                </div>

                <div className="content-box">
                    <div className="content-controls">
                        <div className="active-users">
                            <a href="/active_users">Active users </a>
                            <a href="/active_users"><i className="fa-solid fa-angle-down"></i></a>
                            <span className="active-count">01</span>
                        </div>
                        <i className="fa-thin fa-circle-down"></i>
                        <div className="inactive-users">
                            <button type="button" className="btn btn-outline-primary">Export</button>
                        </div>
                    </div>
                </div>

                <table className="data-table table">
                    <thead className="table-secondary">
                        <tr>
                            <th>Sr</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Contact Details</th>
                            <th>Date added</th>
                            <th>Branch</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01</td>
                            <td>yash</td>
                            <td>
                                <button type="button" className="btn btn-outline-danger" onClick={() => navigate('/superadmin')}>Super Admin</button>
                            </td>
                            <td>yashhardly16@gmail.com<br />9172570794</td>
                            <td>Jan 10, 2025</td>
                            <td>i-tech</td>
                            <td><i className="fas fa-ellipsis-h"></i></td>
                        </tr>
                    </tbody>
                </table>
                <div className="pagination">
                    <div className="pagination-controls">
                        <button className="pagination-btn"><i className="fas fa-chevron-left"></i></button>
                        <span className="page-number">1</span>
                        <button className="pagination-btn"><i className="fas fa-chevron-right"></i></button>
                    </div>
                    <select className="page-size">
                        <option>50 / page</option>
                    </select>
                </div>
            </div>
        </>
    );
}
