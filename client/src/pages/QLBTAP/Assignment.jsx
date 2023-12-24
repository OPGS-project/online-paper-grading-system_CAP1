import '~~/pages/assignment/Assignment.scss';
import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import { FcFolder, FcViewDetails } from 'react-icons/fc';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { AiFillRead } from 'react-icons/ai';
import { useSelector } from 'react-redux';

export default function Assignment() {
    const [updateCheck, setUpdateCheck] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [state, setState] = useState({
        assignment: [],
        offset: 0,
        perPage: 7,
        pageCount: 0,
        searchTerm: '',
        originalAssignment: [],
    });

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/assignment/', {
                headers: {
                    authorization: token,
                },
            })
            .then((res) => {
                // console.log(res.data.assignmentData.rows);
                const assignmentData = res.data.assignmentData.rows;
                setState((prevState) => ({
                    ...prevState,
                    assignment: assignmentData,
                    originalAssignment: assignmentData,
                    pageCount: Math.ceil(assignmentData.length / prevState.perPage),
                }));
            })
            .catch((err) => console.error(err));
    }, []);
    // console.log(deadline);
    useEffect(() => {
        axios
            .get('http://localhost:8081/api/assignment/', {
                headers: {
                    authorization: token,
                },
            })
            .then((res) => {
                const assignmentData = res.data.assignmentData.rows;
                setState((prevState) => ({
                    ...prevState,
                    assignment: assignmentData,
                    originalAssignment: assignmentData,
                    pageCount: Math.ceil(assignmentData.length / prevState.perPage),
                }));
                setUpdateCheck(false);
            })
            .catch((err) => console.error(err));
    }, [updateCheck]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setState((prevState) => ({
            ...prevState,
            offset: selectedPage * prevState.perPage,
        }));
    };

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
                axios
                    .delete('http://localhost:8081/api/assignment/' + aid, {
                        headers: {
                            authorization: token,
                        },
                    })
                    .then((res) => {
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

    const handleSearch = () => {
        const { originalAssignment, searchTerm, perPage } = state;
        if (searchTerm === '') {
            // Nếu không có từ khóa tìm kiếm, hiển thị toàn bộ danh sách học sinh từ danh sách gốc
            setState((prevState) => ({
                ...prevState,
                assignment: originalAssignment,
                pageCount: Math.ceil(originalAssignment.length / perPage),
                offset: 0,
            }));
        } else {
            // Nếu có từ khóa tìm kiếm, tạo mảng học sinh mới dựa trên kết quả tìm kiếm
            const filteredAssignment = originalAssignment.filter((data) =>
                data.assignment_name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
            setState((prevState) => ({
                ...prevState,
                assignment: filteredAssignment,
                pageCount: Math.ceil(filteredAssignment.length / perPage),
                offset: 0,
            }));
        }
    };

    const generateRows = () => {
        return state.assignment.length > 0 ? (
            state.assignment.slice(state.offset, state.offset + state.perPage).map((data, i) => (
                <tr
                    key={i}
                    className="text-center"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        return navigate(`/home/assignment/submitted/${data.id}`);
                    }}
                >
                    <td>
                        <FcFolder size={20} />
                    </td>
                    <td className="text-left pl-3 text-capitalize">{data.assignment_name}</td>
                    <td>{moment(data.start_date).format('DD-MM-YYYY HH:mm ')}</td>
                    <td>{moment(data.deadline).format('DD-MM-YYYY HH:mm ')}</td>
                    <td>{data.classData?.class_name}</td>
                    {moment(new Date()) > moment(data.deadline) ? (
                        <td className="text-danger">Đã Đóng</td>
                    ) : (
                        <td>Đang Mở</td>
                    )}

                    {/* <td>
                        <Link className="btn " to={}>
                            <FcViewDetails />
                        </Link>
                    </td> */}
                    <td onClick={(e) => e.stopPropagation()}>
                        <Link className="btn" to={`/home/assignment/edit-assignment/${data.id}`}>
                            <i className="fa-solid fa-pen-to-square icon-edit"></i>
                        </Link>
                        <button className="btn" onClick={() => handleDelete(data.id, data.assignment_name)}>
                            <i className="fa-solid fa-trash icon-delete"></i>
                        </button>
                    </td>
                    {/* <td onClick={(e) => e.stopPropagation()}>
                        
                    </td> */}
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={9} className="text-center">
                    Hiện tại chưa có bài tập nào <AiFillRead />
                </td>
            </tr>
        );
    };

    const handlePrevious = () => {
        if (state.offset - state.perPage >= 0) {
            setState((prevState) => ({
                ...prevState,
                offset: prevState.offset - prevState.perPage,
            }));
        }
    };

    const handleNext = () => {
        if (state.offset + state.perPage < state.assignment.length) {
            setState((prevState) => ({
                ...prevState,
                offset: prevState.offset + prevState.perPage,
            }));
        }
    };

    const handleClearSearch = () => {
        setState((prevState) => ({
            ...prevState,
            searchTerm: '',
        }));
        handleSearch(); // Gọi lại tìm kiếm để hiển thị toàn bộ danh sách học sinh
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Bài tập đã Giao</h1>

            <div className="card shadow mb-4 height-table">
                <div className="card-header py-3 d-flex justify-content-between">
                    <Link className="btn btn-success" to="/home/assignment/add-assignment">
                        + Thêm bài tập
                    </Link>
                    {state.assignment.length > 0 ? (
                        <p className="float-right"> ( {state.assignment.length} bài tập )</p>
                    ) : null}
                </div>
                <div className="card-body">
                    <label className="mr-3">
                        Tìm Kiếm:
                        <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder=""
                            aria-controls="dataTable"
                            value={state.searchTerm}
                            onChange={(e) =>
                                setState({
                                    ...state,
                                    searchTerm: e.target.value,
                                })
                            }
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                    </label>
                    <button className="btn btn-primary" onClick={handleSearch}>
                        <i className="fas fa-search"></i>
                    </button>
                    <button className="btn btn-danger ml-2" onClick={handleClearSearch}>
                        X
                    </button>

                    <div className="table-responsive">
                        <table className="table table-hover" id="dataTable" width={100}>
                            <thead className="text-center">
                                <tr>
                                    <th></th>
                                    <th style={{ width: 200 }}>Tên</th>
                                    <th>Từ Ngày</th>
                                    <th>Đến Ngày</th>
                                    <th>Giao Cho</th>
                                    <th>Trạng Thái</th>
                                    <th>Tùy Chỉnh</th>
                                </tr>
                            </thead>
                            <tbody>{generateRows()}</tbody>
                        </table>
                    </div>
                </div>
                <div className="pagination d-flex m-3 justify-content-center">
                    <button className="btn btn-primary mr-3" onClick={handlePrevious}>
                        <i className="fa fa-angle-left"></i>
                    </button>
                    <button className="btn btn-primary" onClick={handleNext}>
                        <i className="fa fa-angle-right"></i>
                    </button>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
