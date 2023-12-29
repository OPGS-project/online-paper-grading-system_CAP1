import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { CSVLink } from 'react-csv';
import { Button, Modal } from 'react-bootstrap';
import { FaRegCircleUser } from 'react-icons/fa6';
import { Collapse } from 'bootstrap';
import { data } from 'jquery';

export default function Student() {
    const [dataClass, setDataClass] = useState({});
    const [state, setState] = useState({
        student: [],
        offset: 0,
        perPage: 7,
        pageCount: 0,
        searchTerm: '',
        originalStudent: [],
        showConfirmationModal: false,
        studentToDelete: null,
    });

    const [isImporting, setIsImporting] = useState(false);
    const params = useParams();

    const [update, setUpdate] = useState(false);
    const render = useCallback(() => {
        setUpdate(!update);
    }, [update]);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/class/${params.classID}`)
            .then((res) => {
                const classData = res.data.response[0];
                const studentData = res.data.response[0].studentData.map((data) => ({
                    ...data,
                    username: data.username,
                    password: data.password,
                }));

                setState((prevState) => ({
                    ...prevState,
                    student: studentData,
                    originalStudent: studentData,
                    pageCount: Math.ceil(studentData.length / prevState.perPage),
                }));
                setDataClass(classData);
            })
            .catch((err) => console.error(err));
    }, [params, update]);
    // console.log(dataClass.class_name);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setState((prevState) => ({
            ...prevState,
            offset: selectedPage * prevState.perPage,
        }));
    };

    const handleDelete = async (id) => {
        setState((prevState) => ({
            ...prevState,
            showConfirmationModal: true,
            studentToDelete: id,
        }));
    };

    const handleSearch = () => {
        const { originalStudent, searchTerm, perPage } = state;
        if (searchTerm === '') {
            setState((prevState) => ({
                ...prevState,
                student: originalStudent,
                pageCount: Math.ceil(originalStudent.length / perPage),
                offset: 0,
            }));
        } else {
            const filteredStudent = originalStudent.filter((data) =>
                data.student_name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
            setState((prevState) => ({
                ...prevState,
                student: filteredStudent,
                pageCount: Math.ceil(filteredStudent.length / perPage),
                offset: 0,
            }));
        }
    };

    //
    const navigate = useNavigate();
    const generateRows = () => {
        return state.student.length > 0 ? (
            state.student.slice(state.offset, state.offset + state.perPage).map((data, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} className="text-center ">
                    <td className="text-left pl-5">{data.student_name}</td>
                    <td>{data.gender}</td>
                    <td>{moment(data.birthday).format('DD-MM-YYYY')}</td>

                    <td>{data.address}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                        <Link
                            onClick={(e) => e.stopPropagation()}
                            to={`/home/student/updateStudent/${params.classID}/${data.id}`}
                            state={{ studentData: data }}
                        >
                            <i className="bi bi-pencil-square mr-3"></i>
                        </Link>
                        <i
                            className="bi bi-trash-fill text-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                return handleDelete(data.id);
                            }}
                            style={{ cursor: 'pointer' }}
                        ></i>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={9} className="text-center">
                    Hiện tại chưa có học sinh nào <FaRegCircleUser />
                    {/* return state.student.slice(state.offset, state.offset + state.perPage).map((data, i) => (
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
                    ></i> */}
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
        handleSearch();
    };

    const csvData = [
        ['Họ và tên', 'Giới tính', 'Ngày sinh', 'Quê quán', 'Số điện thoại', 'classID', 'username', 'password'],
        ...state.student.map((data) => [
            data.student_name,
            data.gender,
            moment(data.birthday, 'YYYY-MM-DD').format('YYYY/MM/DD'),
            data.address,
            data.phone,
            params.classID,
            data.username, // Thêm username vào mảng
            data.password, // Thêm password vào mảng
        ]),
    ];

    const handleImport = async (e) => {
        if (isImporting) {
            return;
        }

        setIsImporting(true);

        const file = e.target.files[0];

        const csvData = [
            ['Họ và tên', 'Giới tính', 'Ngày sinh', 'Quê quán'],
            ...state.student.map((data) => [
                data.student_name,
                data.gender,
                moment(data.birthday, 'YYYY-MM-DD').format('DD-MM-YYYY'), // Định dạng ngày sinh thành "DD-MM-YYYY"
                data.address,
            ]),
        ];
        if (file) {
            const formData = new FormData();
            formData.append('csvFile', file);

            try {
                await axios.post(`http://localhost:8081/api/student/upload-csv`, formData);
                alert('CSV file uploaded successfully!');
                render();
            } catch (error) {
                console.error(error);
                alert('Error uploading CSV file. Please try again.');
            } finally {
                setIsImporting(false);
            }
        } else {
            alert('Please select a CSV file to upload.');
            setIsImporting(false);
        }
    };
    const handleConfirmationModalClose = () => {
        setState((prevState) => ({
            ...prevState,
            showConfirmationModal: false,
            studentToDelete: null,
        }));
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.delete(`http://localhost:8081/api/student/delete-student/${state.studentToDelete}`);
            setState((prevState) => ({
                ...prevState,
                student: prevState.student.filter((item) => item.id !== state.studentToDelete),
                originalStudent: prevState.originalStudent.filter((item) => item.id !== state.studentToDelete),
            }));
        } catch (err) {
            console.log(err);
        } finally {
            handleConfirmationModalClose();
        }
    };
    //
    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="h3 mb-2 text-center">Danh sách học sinh lớp {dataClass.class_name}</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <Link className="btn btn-success" to={`/home/student/createStudent/${params.classID}`}>
                        + Thêm học sinh
                    </Link>
                    <label htmlFor="import" className="btn btn-warning ml-5 mt-2">
                        <i class="fa-solid fa-file-import"></i> Import
                    </label>
                    <input type="file" id="import" onChange={handleImport} hidden />
                    <CSVLink data={csvData} filename={'student_data.csv'} className="btn btn-primary ml-2">
                        <i class="fa-solid fa-file-arrow-down"></i> Export
                    </CSVLink>
                    <p className="float-right">Sỉ số: ({state.student.length} học sinh)</p>
                </div>
                <div className="card-body">
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
                    <div className="table-responsive">
                        <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr className="text-center">
                                    <th style={{ width: 300 }}>Họ và tên</th>
                                    <th>Giới tính</th>
                                    <th>Ngày sinh</th>
                                    <th>Quê quán</th>
                                    <th>Tùy chỉnh</th>
                                </tr>
                            </thead>
                            <tbody className="accordion" id="accordionExample">
                                {generateRows()}
                            </tbody>
                        </table>
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
            </div>

            {/* Confirmation Modal */}
            <Modal show={state.showConfirmationModal} onHide={handleConfirmationModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn xóa học sinh này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleConfirmationModalClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
