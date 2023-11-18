import React, { useEffect, useState } from 'react';
import DropFileInput from './DropFileInput';
import { ToastContainer } from 'react-toastify';
import '~~/student/ViewAssignment.scss';
function ViewAssignment() {
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

    const [submitted, setSubmitted] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onFileChange = (files) => {
        setUploadedFiles(files);
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-between">
                <div className="col-5"> Đề Bài</div>
                <div className="col-5">
                    <div className="box">
                        <h2 className="header">Tải lên bài tập của bạn!</h2>
                        <DropFileInput onFileChange={onFileChange} />

                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewAssignment;
