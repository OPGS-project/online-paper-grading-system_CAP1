import React, { useState, useEffect } from 'react'; // Thêm import useState và useEffect từ react
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
// import { CDBPagination } from 'cdbreact';

export default function Class() {
    const [Class, setClass] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/class/')
            .then((res) => setClass(res.data.classData.rows))
            .catch((err) => console.error(err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/api/class/delete-class/' + id);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const ClassCount = Class.length;
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Thông tin lớp học</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <Link to="/home/class/createClass" className="btn btn-success  py-2">
                        + Thêm lớp học
                    </Link>
                    <p className="float-right"> ({ClassCount} lớp)</p>
                </div>
                <div className="card-body">
                    {/* <div class="dataTables_length" id="dataTable_length">
                        <label>
                            Show
                            <select
                                name="dataTable_length"
                                aria-controls="dataTable"
                                class="custom-select custom-select-sm form-control form-control-sm"
                            >
                                <option value="3">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            entries
                        </label>
                    </div> */}
                    <div id="dataTable_filter" class="filteredData">
                        <label>
                            Tìm Kiếm:
                            <input
                                type="search"
                                class="form-control form-control-sm"
                                placeholder=""
                                aria-controls="dataTable"
                            />
                        </label>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover  " id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr className="text-center">
                                    <th>Tên lớp</th>
                                    <th>Sĩ số</th>
                                    <th>Ngày tạo</th>
                                    <th>Ghi chú</th>
                                    <th>Danh sách</th>
                                    <th>Tùy chỉnh</th>
                                </tr>
                            </thead>

                            {
                                <tbody>
                                    {Class?.map((data, i) => (
                                        <tr key={i} className="text-center">
                                            <td>{data.class_name}</td>
                                            <td>{data.total_students}</td>
                                            <td>{moment(data.createdAt).format('DD-MM-YYYY')}</td>
                                            <td>{data.status}</td>
                                            <td>
                                                <Link
                                                    to={`/home/class/get-student/${data.id}`}
                                                    className="btn btn-primary"
                                                >
                                                    Xem học sinh
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/home/class/update-class/${data.id}`}
                                                    className="bi bi-pencil-square mr-3"
                                                ></Link>
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
