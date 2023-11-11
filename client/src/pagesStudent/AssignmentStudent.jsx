import React, { useEffect, useState } from 'react';
import { FaAngellist } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { apiGetOne } from '~/apis/userService';
function AssignmentStudent() {
    // const navigate = useNavigate();
    // const { isLoggedIn, token } = useSelector((state) => state.auth);

    // const [userData, setUserData] = useState({});
    // console.log(userData);
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const response = await apiGetOne(token);
    //         // console.log(response);
    //         if (response?.data.err === 0) {
    //             setUserData(response.data?.response);
    //         } else {
    //             setUserData({});
    //         }
    //     };
    //     token && fetchUser();
    // }, [token]);

    return (
        <div className="container-fluid">
            <div className="card shadow">
                <div className="text-left">
                    <h3 className="p-3  d-flex align-items-center" style={{ color: '#F3B664' }}>
                        <FaAngellist />
                        <span className=" ml-3"> Chào bạn !</span>
                    </h3>
                </div>
                <div className="">
                    <h3 className="card-header p-3 d-flex align-items-center">Bạn đang có .. bài tập</h3>
                    <div
                        className="card-body row justify-content-between m-3 shadow"
                        style={{ backgroundColor: '#87C4FF', color: '#001B79', borderRadius: 50 }}
                    >
                        <div className="col-3">
                            <h6 className="p-2">Bài Tập Giữa Kỳ</h6>
                        </div>
                        <div className="col-3">
                            <h6>Giáo Viên : Hanhan</h6>
                            <h6>Hạn Nộp : dd/mm/yyyy 12:00:00</h6>
                        </div>
                        <Link
                            to="/student/view-assignment-of-student"
                            className="col-3 nav-link "
                            style={{ fontWeight: 500 }}
                        >
                            Xem bài tập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssignmentStudent;
