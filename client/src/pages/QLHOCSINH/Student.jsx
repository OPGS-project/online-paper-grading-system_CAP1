import React, { useState, useEffect } from 'react'; // Thêm import useState và useEffect từ react
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment/moment';

export default function Student() {
    const [student, setStudent] = useState([]);

    const params = useParams();
    console.log(params);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/class/${params.classID}`)
            .then((res) => {
                // console.log(res.data.response[0].studentData);
                setStudent(res.data.response[0].studentData);
            })
            .catch((err) => console.error(err));
    }, [params]);

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/api/student/delete-student/' + id);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };
    console.log(student);
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Danh sách học sinh lớp </h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <Link className="btn btn-success" to={'/home/student/createStudent'}>
                        + Thêm học sinh
                    </Link>
                    <p className="float-right">( lớp)</p>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr className="text-center">
                                    <th>Họ và tên</th>
                                    <th>Giới tính</th>
                                    <th>Ngày sinh</th>
                                    <th>Số điện thoại</th>
                                    <th>Quê quán</th>
                                    <th>Tùy chỉnh</th>
                                </tr>
                            </thead>
                            {
                                <tbody>
                                    {student?.map((data, i) => (
                                        <tr key={i} className="text-center">
                                            <td>{data.student_name}</td>
                                            <td>{data.gender}</td>
                                            <td>{moment(data.birthday).format('DD-MM-YYYY')}</td>
                                            <td>{data.phone}</td>
                                            <td>{data.address}</td>
                                            <td>
                                                <Link to={`/student/updateStudent/`}>
                                                    <i className="bi bi-pencil-square mr-3"></i>
                                                </Link>
                                                <i
                                                    className="bi bi-trash-fill text-danger"
                                                    onClick={() => handleDelete(data.id)}
                                                    style={{ cursor: 'pointer' }}
                                                ></i>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
