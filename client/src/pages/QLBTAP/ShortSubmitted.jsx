import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import moment from 'moment/moment';

const ShortSubmitted = () => {
    const navigate = useNavigate();
    const [dataSubmit ,setDataSubmit] = useState([])
    const params = useParams()
    console.log(dataSubmit)


    useEffect(() =>{
        axios
            .get(`http://localhost:8081/api/studentSubmitted/short/${params.assignmentId}`)
            .then((res) =>{
                setDataSubmit(res.data.response)
                console.log(res)

            })
    },[])
    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/home/assignment');
                }}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="card shadow mb-4 height-table">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Bài Tập Đã Nộp</h6>
                    <div>
                        {/* <CSVLink data={true} filename={'Score_Student_data.csv'} className="btn btn-primary ml-2">
                            <i className="fa-solid fa-file-arrow-down"></i> Export csv
                        </CSVLink> */}
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive"></div>
                    <table className="table table-hover" id="dataTable" width="100%" cellspacing="0">
                        <thead className="text-center">
                            <th>Tên học sinh</th>
                          
                            <th>Thời gian nộp</th>
                            <th>Thời gian chấm</th>
                            <th>Điểm</th>
                            <th></th>
                        </thead>
                        <tbody className="text-center">
                            {dataSubmit.length > 0 ? (
                                dataSubmit?.map((data, i) => (
                                    <tr key={i}>
                                        <td>{data.student_name}</td>
                                        
                                        <td>{moment(data.createdAt).format('DD-MM-YYYY HH:mm ')}</td>
                                        <td>
                                            {data.gradeData && data.gradeData.createdAt
                                                ? moment(data.gradeData.createdAt).format('DD-MM-YYYY HH:mm ')
                                                : 'Chưa chấm'}
                                        </td>
                                        <td>
                                            {data.gradeData ? (
                                                <Link
                                                    to={`/home/GradedAssignment/${data.id}/${data.student_name}`}
                                                    className=""
                                                    style={{
                                                        color: 'red',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {data.gradeData.score_value}
                                                </Link>
                                            ) : (
                                                'Chưa chấm'
                                            )}
                                        </td>
                                        <td>
                                            {data.submission_status === 'Đã chấm' ? (
                                                <Link
                                                    to={`/home/GradedAssignment/${data.id}/${data.student_name}`}
                                                    className="btn btn-outline-success"
                                                >
                                                    {data.submission_status}
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/home/grading-short/${data.assignment_id}/${data.student_id}`}
                                                    className="btn btn-outline-success"
                                                >
                                                    {data.submission_status}
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>Hiện tại chưa có học sinh nào nộp bài</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default ShortSubmitted;
