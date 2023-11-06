import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { CSVLink, CSVDownload } from "react-csv";

export default function Student() {
    const [state, setState] = useState({
        student: [],
        offset: 0,
        perPage: 5,
        pageCount: 0,
        searchTerm: '',
        originalStudent: [],
    });
    const params = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/class/${params.classID}`)
            .then((res) => {
                const studentData = res.data.response[0].studentData;
                setState((prevState) => ({
                    ...prevState,
                    student: studentData,
                    originalStudent: studentData,
                    pageCount: Math.ceil(studentData.length / prevState.perPage),
                }));
            })
            .catch((err) => console.error(err));
    }, [params]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setState((prevState) => ({
            ...prevState,
            offset: selectedPage * prevState.perPage,
        }));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/student/delete-student/${id}`);
            // Remove the deleted item from the state
            setState((prevState) => ({
                ...prevState,
                student: prevState.student.filter((item) => item.id !== id),
                originalStudent: prevState.originalStudent.filter((item) => item.id !== id),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = () => {
        const { originalStudent, searchTerm, perPage } = state;
        if (searchTerm === '') {
            // Nếu không có từ khóa tìm kiếm, hiển thị toàn bộ danh sách học sinh từ danh sách gốc
            setState((prevState) => ({
                ...prevState,
                student: originalStudent,
                pageCount: Math.ceil(originalStudent.length / perPage),
                offset: 0,
            }));
        } else {
            // Nếu có từ khóa tìm kiếm, tạo mảng học sinh mới dựa trên kết quả tìm kiếm
            const filteredStudent = originalStudent.filter((data) =>
                data.student_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setState((prevState) => ({
                ...prevState,
                student: filteredStudent,
                pageCount: Math.ceil(filteredStudent.length / perPage),
                offset: 0,
            }));
        }
    };

    const generateRows = () => {
        return state.student
            .slice(state.offset, state.offset + state.perPage)
            .map((data, i) => (
                <tr key={i} className="text-center">
                    <td>{data.student_name}</td>
                    <td>{data.gender}</td>
                    <td>{moment(data.birthday).format('DD-MM-YYYY')}</td>
                    <td>{data.address}</td>
                    <td>
                        <Link to={`/home/student/updateStudent/${params.classID}/${data.id}`} state={{ studentData: data }}>
                            <i className="bi bi-pencil-square mr-3"></i>
                        </Link>
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
        if (state.offset + state.perPage < state.student.length) {
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

    const csvData = [
        ["Họ và tên", "Giới tính", "Ngày sinh", "Quê quán"],
        ...state.student.map((data) => [
            data.student_name,
            data.gender,
            moment(data.birthday, "YYYY-MM-DD").format('DD-MM-YYYY'), // Định dạng ngày sinh thành "DD-MM-YYYY"
            data.address,
        ]),
    ];

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Danh sách học sinh lớp </h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <Link className="btn btn-success" to={`/home/student/createStudent/${params.classID}`}>
                        + Thêm học sinh
                    </Link>
                    <label htmlFor="import" className='btn btn-warning ml-5 mt-2'> <i class="fa-solid fa-file-import"></i> Import</label>
                    <input type="file" id='import' hidden />
                    <CSVLink
                        data={csvData}
                        filename={"student_data.csv"}
                        className="btn btn-primary ml-2"
                    >
                        <i class="fa-solid fa-file-arrow-down"></i> Export
                    </CSVLink>
                    <p className="float-right">Sỉ số: ({state.student.length} học sinh)</p>

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
                                    <th>Họ và tên</th>
                                    <th>Giới tính</th>
                                    <th>Ngày sinh</th>
                                    <th>Quê quán</th>
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
