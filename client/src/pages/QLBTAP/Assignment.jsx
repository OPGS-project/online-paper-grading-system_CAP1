import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '~~/pages/assignment/Assignment.scss';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FiSearch } from '@react-icons/all-files//fi/FiSearch';
import { FcInspection, FcViewDetails } from 'react-icons/fc';

import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Pagination } from '~/components/Pagination';

const Assignment = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [assignment, setAssignment] = useState([]);
    const [updateCheck, setUpdateCheck] = useState(false);
    const params = useParams();

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/assignment/')
            .then((res) => {
                // const  limit = 7,
                // const page: queries.page,
                if (res.data.err === 0) {
                    setAssignment(res.data.assignmentData.rows);
                    setCount(res.data.assignmentData.count);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/assignment/')
            .then((res) => {
                setAssignment(res.data.assignmentData.rows);
                setUpdateCheck(false);
            })
            .catch((err) => console.error(err));
    }, [updateCheck]);

    const handleDelete = (aid, name) => {
        Swal.fire({
            title: `Bạn muốn xóa ${name} này?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed)
                axios.delete('http://localhost:8081/api/assignment/' + aid).then((res) => {
                    if (+res.data.err === 0) {
                        toast.success('Xóa thành công', {
                            position: 'top-right',
                            autoClose: 1000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        });

                        setUpdateCheck(true);
                    }
                });
        });
    };

    return (
        <div className="container-fluid">
            <div className="row header-bt">
                <div className="ml-3">
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
                                <button className="btn btn-primary" type="button">
                                    <FiSearch />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="card shadow mb-4 height-table">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Bài Tập Đã Giao</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive"></div>
                    <table className="table table-hover" id="dataTable">
                        <thead className="text-center">
                            <tr>
                                <th></th>
                                <th>Tên</th>
                                <th>Từ Ngày</th>
                                <th>Đến Ngày</th>
                                <th>Giao Cho</th>
                                <th>Trạng Thái</th>
                                <th>Chi tiết</th>
                                {/* <th>Tiêu chí</th> */}
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {assignment?.map((data, i) => (
                                <tr key={i}>
                                    <td>
                                        <i className="fa-solid fa-folder icon-folder"></i>
                                    </td>
                                    <td>
                                        {/* {(+params.get('page') > 1 ? +params.get('page') - 1 : 0) *
                                            +import.meta.env.V  TE_REACT_APP_LIMIT +
                                            i +
                                            1} */}
                                        {data.assignment_name}
                                    </td>
                                    <td>{moment(data.start_date).format('DD-MM-YYYY')}</td>
                                    <td>{moment(data.deadline).format('DD-MM-YYYY')}</td>
                                    <td>{data.of_class}</td>
                                    <td>20</td>
                                    <td>
                                        <Link className="btn " to={`/home/assignment/submitted/${data.id}`}>
                                            <FcViewDetails />
                                        </Link>
                                    </td>
                                    {/* <td>
                                        <Link className="btn" to={`/home/assignment/criteria`}>
                                            <FcInspection />
                                        </Link>
                                    </td> */}

                                    <td>
                                        <Link className="btn" to={`/home/assignment/edit-assignment/${data.id}`}>
                                            <i className="fa-solid fa-pen-to-square icon-edit"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => handleDelete(data.id, data.assignment_name)}
                                        >
                                            <i className="fa-solid fa-trash icon-delete"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ToastContainer />
                    <div className="w-full mt-1">
                        <Pagination totalCount={count} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assignment;
