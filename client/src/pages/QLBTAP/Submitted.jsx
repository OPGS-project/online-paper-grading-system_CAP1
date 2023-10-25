import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '~~/pages/assignment/Assignment.scss';
import { useNavigate, Link } from 'react-router-dom';
import { FiSearch } from '@react-icons/all-files//fi/FiSearch';
import moment from 'moment/moment';

const Submitted = () => {
    const navigate = useNavigate();
    const [Class, setClass] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/student/')
            .then((res) => setClass(res.data.student.rows))
            .catch((err) => console.error(err));
    }, []);

    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete('http://localhost:8081/api/student/delete-student/' + id);
    //         window.location.reload();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    return (
        <div className="container-fluid">
            <div class="card shadow mb-4 height-table">
                <div class="card-header py-3 d-flex justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Bài Tập Đã Nộp</h6>
                    <h6 class="m-0 font-weight-bold text-primary">Lớp</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive"></div>
                    <table class="table table-hover" id="dataTable" width="100%" cellspacing="0">
                        <thead className="text-center">
                            <th>Tên học sinh</th>
                            <th>Trạng Thái</th>
                            <th></th>
                        </thead>
                        <tbody className="text-center">
                            {Class?.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.student_name}</td>
                                    <td>Đã nộp</td>
                                    <td>
                                        <Link to="/grading" className="btn btn-outline-success">
                                            Chấm bài
                                        </Link>
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

export default Submitted;
