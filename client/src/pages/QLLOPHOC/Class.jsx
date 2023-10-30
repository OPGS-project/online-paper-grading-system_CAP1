import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';

export default function Class() {
    const [state, setState] = useState({
        Class: [],
        offset: 0,
        perPage: 5,
        pageCount: 0,
        searchTerm: '',
        originalClass: [],
    });

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/class/')
            .then((res) => {
                const classData = res.data.classData;
                setState((prevState) => ({
                    ...prevState,
                    Class: classData.rows,
                    originalClass: classData.rows,
                    pageCount: Math.ceil(classData.count / prevState.perPage),
                }));
            })
            .catch((err) => console.error(err));
    }, []);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setState((prevState) => ({
            ...prevState,
            offset: selectedPage * prevState.perPage,
        }));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/api/class/delete-class/' + id);
            // Remove the deleted item from the state
            setState((prevState) => ({
                ...prevState,
                Class: prevState.Class.filter((item) => item.id !== id),
                originalClass: prevState.originalClass.filter((item) => item.id !== id),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const generateRows = () => {
        return state.Class
            .slice(state.offset, state.offset + state.perPage)
            .map((data, i) => (
                <tr key={i} className="text-center">
                    <td>{data.class_name}</td>
                    <td>{data.total_students}</td>
                    <td>{moment(data.createdAt).format('DD-MM-YYYY')}</td>
                    <td>{data.content}</td>
                    <td>
                        <Link to={`/home/class/get-student/${data.id}`} className="btn btn-primary">
                            Xem học sinh
                        </Link>
                    </td>
                    <td>
                        <Link to={`/home/class/update-class/${data.id}`} className="bi bi-pencil-square mr-3"></Link>
                        <i
                            className="bi bi-trash-fill text-danger"
                            onClick={() => handleDelete(data.id)}
                            style={{ cursor: 'pointer' }}
                        ></i>
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
        if (state.offset + state.perPage < state.Class.length) {
            setState((prevState) => ({
                ...prevState,
                offset: prevState.offset + prevState.perPage,
            }));
        }
    };

    const handleSearch = () => {
        if (state.searchTerm === '') {
            setState((prevState) => ({
                ...prevState,
                Class: prevState.originalClass,
            }));
        } else {
            const filteredClass = state.originalClass.filter((data) =>
                data.class_name.toLowerCase().includes(state.searchTerm.toLowerCase())
            );
            setState((prevState) => ({
                ...prevState,
                Class: filteredClass,
            }));
        }
    };

    const handleClearSearch = () => {
        setState((prevState) => ({
            ...prevState,
            searchTerm: '',
            Class: prevState.originalClass,
        }));
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Thông tin lớp học</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <Link to="/home/class/createClass" className="btn btn-success py-2">
                        + Thêm lớp học
                    </Link>
                    <p className="float-right"> ({state.Class.length} lớp)</p>
                </div>
                <div className="card-body">
                    <div id="dataTable_filter" className="filteredData mb-2">
                        <label className='mr-3'>
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
                    <div className="table-responsive">
                        <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
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
                            <tbody>{generateRows()}</tbody>
                        </table>
                    </div>
                    <div className="pagination">
                        <button className="btn btn-primary mr-3" onClick={handlePrevious}>
                            <i className="fa fa-angle-left"></i> PRE
                        </button>
                        <button className="btn btn-primary" onClick={handleNext}>
                            NEXT <i className="fa fa-angle-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
