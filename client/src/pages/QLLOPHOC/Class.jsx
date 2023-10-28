import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import ReactPaginate from 'react-paginate';

export default function Class() {
    const [Class, setClass] = useState([]);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [originalClass, setOriginalClass] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/class/')
            .then((res) => {
                const classData = res.data.classData;
                setClass(classData.rows);
                setOriginalClass(classData.rows);
                setPageCount(Math.ceil(classData.count / perPage));
            })
            .catch((err) => console.error(err));
    }, []);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setOffset(selectedPage * perPage);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/api/class/delete-class/' + id);
            // Remove the deleted item from the state
            setClass(Class.filter(item => item.id !== id));
            setOriginalClass(originalClass.filter(item => item.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const ClassCount = Class.length;

    const generateRows = () => {
        return Class
            .slice(offset, offset + perPage)
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
        if (offset - perPage >= 0) {
            setOffset(offset - perPage);
        }
    };

    const handleNext = () => {
        if (offset + perPage < Class.length) {
            setOffset(offset + perPage);
        }
    };

    const handleSearch = () => {
        if (searchTerm === '') {
            setClass(originalClass);
        } else {
            const filteredClass = originalClass.filter(data =>
                data.class_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setClass(filteredClass);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setClass(originalClass);
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Thông tin lớp học</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <Link to="/home/class/createClass" className="btn btn-success py-2">
                        + Thêm lớp học
                    </Link>
                    <p className="float-right"> ({ClassCount} lớp)</p>
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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>
                        <button className="btn btn-primary" onClick={handleSearch}>
                            Tìm
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
