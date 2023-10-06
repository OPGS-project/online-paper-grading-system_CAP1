import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '~~/pages/assignment/Assignment.scss';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from '@react-icons/all-files//fi/FiSearch';

const Assignment = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/assignment');
            setValues(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row header-bt">
                <input className="form-control form-control-user date " type="date"></input>
                <i class="fa-solid fa-arrow-right "></i>
                <input className="form-control form-control-user date" type="date"></input>
                <div>
                    <form className="form-inline mr-auto w-100 navbar-search">
                        <div className="input-group position-relative">
                            <input
                                type="text"
                                className="form-control bg-light small input-search"
                                placeholder="Tìm kiếm"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                            />
                            <div className="input-group-append">
                                <button className="btn position-absolute icon-search" type="button">
                                    <FiSearch />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card shadow mb-4 height-table">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Bài Tập Đã Giao</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive"></div>
                    <table class="table table-hover" id="dataTable" width="100%" cellspacing="0">
                        <thead className="text-center">
                            <th></th>
                            <th>Tên</th>
                            <th>Từ Ngày</th>
                            <th>Đến Ngày</th>
                            <th>Giao Cho</th>
                            <th>Số Bài Đã Nộp</th>
                            <th>Tổng Số Bài</th>
                            <th>Trạng Thái</th>
                            <th></th>
                            <th></th>
                        </thead>
                        <tbody className="text-center">
                            {values.map((assignment, i) => (
                                <tr key={i}>
                                    <td>
                                        <i class="fa-solid fa-folder icon-folder"></i>
                                    </td>
                                    <td>{assignment.assignment_name}</td>
                                    <td>{assignment.start_date}</td>
                                    <td>{assignment.deadline}</td>
                                    <td>{assignment.class_id}</td>
                                    <td>20</td>
                                    <td>30</td>
                                    <td>aa</td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                navigate('/edit-assignment');
                                            }}
                                        >
                                            <i class="fa-solid fa-pen-to-square icon-edit"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn">
                                            <i class="fa-solid fa-trash icon-delete"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Assignment;
