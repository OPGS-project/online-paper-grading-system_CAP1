import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiGetOne, apiGetStudent, apiUpdateStudent, apiUpdateUser } from '~/apis/userService';

import { ToastContainer, toast } from 'react-toastify';
import { getBase64 } from '~/utils/helper';

function ProfileStudent() {
    const { token } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState({
        student_name: '',

        phone: '',
        address: '',
        avatar: '',
    });
    const [error, setError] = useState({
        errName: null,
        errPhone: null,
    });

    const [preview, setPreview] = useState({
        avatar: null,
        avatarWeb: null,
    });
    const [updateCheck, setUpdateCheck] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiGetStudent(token);
            console.log(response);
            if (response?.data.err === 0) {
                setUserData({
                    student_name: response.data.response.student_name,
                    phone: response.data.response.phone,
                    address: response.data.response.address,
                    avatar: response.data.response.avatar,
                });
                setUpdateCheck(false);
            } else {
                setUserData({});
            }
        };
        token && fetchUser();
    }, [token]);

    //
    const notifySuccess = (errorMessage) => {
        toast.success(errorMessage, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };
    const phonePattern = 'd{10}$ ';
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // if (typeof userData.avatar === 'object') formData.append('avatar', userData.avatar);
        if (userData.name === '')
            setError((prev) => ({
                ...prev,
                errName: 'Họ tên không được để trống',
            }));
        if (userData.phone !== phonePattern)
            setError((prev) => ({
                ...prev,
                errPhone: 'Số điện thoại không hợp lệ',
            }));
        for (let i of Object.entries(userData)) {
            if (i[1] === '') continue;
            if (i[1] === null) continue;
            if (i[0] === 'avatar' && typeof i[1] === 'string') continue;
            formData.append(i[0], i[1]);
        }
        if (error.errName === null && error.errPhone === null) {
            const response = await apiUpdateStudent(token, formData);
            // console.log(response);
            if (response?.data.err === 0) {
                notifySuccess('Cập nhật thành công !');
            } else {
                alert('Lỗi');
            }
        }
    };

    return (
        <div class="container-fluid">
            <div className="d-flex mb-3">
                <h3 className="text-center ml-5 ">Thông tin cá nhân</h3>
            </div>
            <ToastContainer />
            <form className="user mt-5">
                <div className="row justify-content-around">
                    <div className="col-md-5 flex-grow-1">
                        <div className="form-group">
                            <label htmlFor="name-bt" className="pl-2">
                                Họ và Tên
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-user  "
                                value={userData.student_name}
                                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            {error.errName && <small className="text-danger pl-3">{error.errName}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="name-bt" className="pl-2">
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-user"
                                value={userData.phone}
                                name="phone"
                                onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                            />
                            {error.errPhone && <small className="text-danger pl-3">{error.errPhone}</small>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="name-bt" className="pl-2">
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-user"
                                name="address"
                                value={userData.address}
                                onChange={(e) => setUserData((prev) => ({ ...prev, address: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="col-md-3  mt-5 ">
                        {preview.avatarWeb ? (
                            <div className="border shadow mb-5" style={{ width: 200, height: 200 }}>
                                <img
                                    className=" object-fit-cover "
                                    style={{ width: 200, height: 200 }}
                                    src={preview.avatarWeb}
                                    alt="avatar user"
                                />
                            </div>
                        ) : (
                            <div className="border shadow mb-5" style={{ width: 200, height: 200 }}>
                                <img
                                    className=" object-fit-cover "
                                    style={{ width: 200, height: 200 }}
                                    src={userData.avatar}
                                    alt="avatar user"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={async (file) => {
                                const base64Image = await getBase64(file.target.files[0]);
                                setPreview((prev) => ({
                                    ...prev,
                                    // avatar: file.target.files[0],
                                    avatarWeb: base64Image,
                                }));
                                setUserData((prev) => ({
                                    ...prev,
                                    avatar: file.target.files[0],
                                }));
                            }}
                        />
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <button type="submit" className="btn btn-success px-5 py-2" onClick={handleSubmit}>
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileStudent;
