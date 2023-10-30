import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcList } from 'react-icons/fc';

export default function UpdateStudent() {
    const location = useLocation();
    console.log(location.state)
    const navigate = useNavigate();
    const { studentID, classID } = useParams();
    console.log(studentID, classID)
    const [studentData, setStudentData] = useState({
      student_name: '',
      gender: '',
      address: '',

    });
  
      const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios({
          method: 'put',
          url: `http://localhost:8081/api/student/update-student/${classID}/${studentID}`,
          data: studentData,
        });
    
        // Handle response or any additional logic
      }; 
      return (
        <div className="container-fluid">
          <h1 className="h3 mb-4 text-gray-800 text-center">
            Cập nhật học sinh
            <small className="d-block mt-2">(Điền thông tin lớp vào biểu mẫu dưới đây)</small>
          </h1>
          <form className="mt-5" onSubmit={handleSubmit}>
            <h4 className="h4 mb-4 text-gray-800">Biểu mẫu:</h4>
            <div className="form-row">
              <div className="col-12">
                <label htmlFor="className">Tên học sinh:</label>
                <input
                  type="text"
                  placeholder="Nhập tên lớp"
                  className="form-control form-control-lg"
                  onChange={(e) => setStudentData({ ...studentData, student_name: e.target.value })}
                  value={studentData.student_name}
                  id="className"
                  required
                />
                <p className="err2"></p>
              </div>
            </div>
            <div className="form-row">
            <div className="col-6">
                        <label className='text-capitalize font-weight-bold pl-2'>Giới tính: (Bắt buộc)</label>
                        <select
                            className="form-control mt-2"
                            onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
                            value={studentData.gender}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
              <div className="col-6">
                <label htmlFor="status">Quê quán:</label>
                <input
                  type="text"
                  placeholder="Nhập ghi chú"
                  className="form-control form-control-lg"
                  onChange={(e) => setStudentData({ ...studentData, address: e.target.value })}
                  value={studentData.address}
                  id="content"
                  required
                />
                <p className="err3"></p>
              </div>
            </div>
            <div className="text-center mt-5">
              <button type="submit" className="btn-lg btn-primary">
                Cập nhật học sinh
              </button>
            </div>
          </form>
        </div>
      );
} 
