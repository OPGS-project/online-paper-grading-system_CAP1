import React, { useEffect, useState } from 'react';
import { FaAngellist } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ClassOfStudent() {
    return (
        <div className="container-fluid">
            <div className="card shadow">
                <div className="text-left">
                    <h3 className="p-3  d-flex align-items-center" style={{ color: '#F3B664' }}>
                        <FaAngellist />
                        <span className=" ml-3"> Chào bạn </span>
                    </h3>
                </div>
                <div className="">
                    <h3 className="card-header p-3 d-flex align-items-center">Bạn đang có {} bài tập</h3>
                    <div
                        className="card-body row justify-content-between m-3 shadow"
                        style={{ backgroundColor: '#87C4FF', color: '#001B79', borderRadius: 50 }}
                    >
                        <div className="col-3">
                            <h6 className="p-2">Bài Tập Giữa Kỳ</h6>
                        </div>
                        <div className="col-3">
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

export default ClassOfStudent;
