import { Link, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { FcHighPriority } from 'react-icons/fc';
import { FcList } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';

export default function CreateStudent({ classID }) {
    const [student_name, setStudentName] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [date_of_birth, setBirthday] = useState(''); // Khởi tạo biến birthday với giá trị ban đầu là chuỗi rỗng

    const navigate = useNavigate();
    const params = useParams();

    const [selectedDate, setSelectedDate] = useState(null); //React Hook

    const handleDateChange = (date) => { // cập nhật giá trị của selectedDate
        setSelectedDate(date);
    };

    const handleSubmit = (event) => {
        console.log(params.classID);
        event.preventDefault();
        axios
            .post('http://localhost:8081/api/student/', {
                classID: params.classID,

                student_name,
                gender,
                address,
            })
            .then((res) => {
                console.log(res);
                navigate('/home/class/get-student/' + params.classID); // thành công sẽ chuyển hướng
            })
            .catch((err) => console.log(err));

    };
    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate(-1); // Quay lại trang trước đó
                }}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="h3 mb-4 text-gray-800 text-center">
                <FcList className="mr-3" />
                Thêm học sinh
            </h1>
            <form className="mt-3 user mx-5" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Họ và tên: (Bắt buộc)</label>
                        <input type="text" placeholder='Nhập tên học sinh' className="form-control form-control-user"
                            onChange={text => setStudentName(text.target.value)} />
                    </div>
                    <div className="col-6">
                        <label htmlFor="">Ngày sinh:</label>
                        <div>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    handleDateChange(date); // Cập nhật selectedDate
                                    setBirthday(date?.toISOString().split('T')[0]); // Cập nhật birthday với ngày được chọn
                                }}
                                placeholderText='Chọn ngày sinh'
                                dateFormat="yyyy-MM-dd"
                                className="form-control form-control-lg"
                                wrapperClassName="custom-datepicker-wrapper form-control form-control-l" // loại bỏ class mặc định của input DatePicker
                            />
                        </div>

                    </div>
                </div>
                <div className="form-row mt-3">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Quê quán</label>
                        <input type="text" placeholder="Nhập quê quán" className="form-control form-control-user"
                            onChange={text => setAddress(text.target.value)} />
                    </div>
                    <div className="col-6">
                        <label className='text-capitalize font-weight-bold pl-2'>Giới tính: (Bắt buộc)</label>
                        <select
                            className="form-control mt-2"
                            value={gender}
                            onChange={text => setGender(text.target.value)}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <button type="submit" className="btn btn-success px-5 py-2">
                        Lưu
                    </button>
                    <button className="btn btn-light px-5 py-2 ml-3"
                        onClick={() => {
                            navigate(-1); // Quay lại trang trước đó
                        }} >Hủy</button>
                </div>

            </form>
            {/* <ToastContainer/> */}
        </div>
    );
}