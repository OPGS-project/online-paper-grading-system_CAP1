import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '~~/pages/assignment/Assignment.scss';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FiSearch } from '@react-icons/all-files//fi/FiSearch';
import { FcInspection, FcViewDetails } from 'react-icons/fc';

import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const Assignment = () => {
    const navigate = useNavigate();
    const [state, setState] = useState({
        assignment: [],
        offset: 0,
        perPage: 7,
        pageCount: 0,
        searchTerm: '',
        originalAssignment: [],
    });
    const [updateCheck, setUpdateCheck] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/assignment/')
            .then((res) => {
                // const  limit = 7,
                // const page: queries.page,
                // if (res.data.err === 0) {
                //     setState(res.data.assignmentData.rows);
                //     // setCount(res.data.assignmentData.count);
                // }
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

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/assignment/')
            .then((res) => {
                setState(res.data.assignmentData.rows);
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

    //

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
        return state.assignment.slice(state.offset, state.offset + state.perPage).map((data, i) => (
            <tr key={i} className="text-center">
                <td>{data.assignment_name}</td>
                <td>{moment(data.start_date).format('DD-MM-YYYY')}</td>
                <td>{moment(data.deadline).format('DD-MM-YYYY')}</td>
                <td>{data.of_class}</td>
                <td>20</td>
                <td>
                    <Link className="btn " to={`/home/assignment/submitted/${data.id}`}>
                        <FcViewDetails />
                    </Link>
                </td>
                <td>
                    <Link className="btn" to={`/home/assignment/edit-assignment/${data.id}`}>
                        <i className="fa-solid fa-pen-to-square icon-edit"></i>
                    </Link>
                </td>
                <td>
                    <button className="btn" onClick={() => handleDelete(data.id, data.assignment_name)}>
                        <i className="fa-solid fa-trash icon-delete"></i>
                    </button>
                </td>
            </tr>
        ));
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
            <div id="dataTable_filter" className="filteredData mb-2">
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
            </div>
            <div className="card shadow mb-4 height-table">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Bài Tập Đã Giao</h6>
                </div>
                <div className="card-body">
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
                        <tbody>{generateRows()}</tbody>
                    </table>
                    <div className="pagination">
                        <button className="btn btn-primary mr-3" onClick={handlePrevious}>
                            <i className="fa fa-angle-left"></i> PRE
                        </button>
                        <button className="btn btn-primary" onClick={handleNext}>
                            NEXT <i className="fa fa-angle-right"></i>
                        </button>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default Assignment;
