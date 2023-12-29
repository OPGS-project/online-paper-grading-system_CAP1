import '~~/pages/assignment/AddAssignment.scss';
import { useNavigate } from 'react-router-dom';
import { FcList } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function AddAssignment() {
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
    const notifyError = (errorMessage) => {
        toast.error(errorMessage, {
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
    const { token } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const [values, setValues] = useState({
        assignment_name: '',
        of_class: '',
        start_date: moment().format('YYYY-MM-DDTHH:mm'),
        deadline: moment().add(2, 'days').format('YYYY-MM-DDTHH:mm'),
        content_text: '',
        file_path: '',
    });

    const [error, setError] = useState({
        errName: null,
        errClass: null,
        errFinish: null,
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    // get class
    const [classData, setClassData] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8081/api/class/', {
                headers: {
                    authorization: token,
                },
            })
            .then((res) => setClassData(res.data.classData.rows))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        if (values.assignment_name === '' || values.assignment_name.length < 0) {
            return setError((prev) => ({
                ...prev,
                errName: 'Tên bài tập không được để trống',
            }));
        }
        if (values.of_class === '' || values.of_class.length < 0) {
            return setError((prev) => ({
                ...prev,
                errClass: 'Vui lòng chọn lớp học',
            }));
        }
        if (values.deadline < values.start_date) {
            return setError((prev) => ({
                ...prev,
                errFinish: 'Ngày kết thúc không hợp lệ',
            }));
        }
        if (error.errName === null && error.errClass === null && error.errFinish === null) {
            for (let i of Object.entries(values)) {
                if (i[1] === '') continue;
                if (i[1] === null) continue;
                formData.append(i[0], i[1]);
            }
        }

        axios({
            method: 'post',
            url: 'http://localhost:8081/api/assignment/',
            headers: {
                authorization: token,
            },
            data: formData,
        })
            .then((res) => {
                console.log(res);

                if (res.data.err === 0) {
                    notifySuccess('Thêm bài tập thành công!');
                    setTimeout(() => {
                        navigate('/home/assignment');
                    }, 2000);
                } else {
                    notifyError('Vui lòng nhập đúng dữ liệu');
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        // thêm bài tập
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <h1 className="h3 mb-4 text-gray-800 text-center">
                <FcList className="mr-3" />
                Thêm bài tập
            </h1>

            <form className="user" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        tên bài tập
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-user"
                        id="name-bt"
                        style={{ fontSize: 16 }}
                        name="assignment_name"
                        placeholder="Nhập tên bài tập"
                        onChange={(e) => {
                            setError((prev) => ({
                                ...prev,
                                errName: null,
                            }));
                            handleChange(e);
                        }}
                    />
                </div>
                {error.errName && <small className="text-danger ml-3">{error?.errName}</small>}
                <div className="form-group ">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Lớp
                    </label>

                    <select
                        className="custom-select "
                        style={{ height: 50, borderRadius: 100 }}
                        id="validationTooltip04"
                        required
                        onChange={(e) => {
                            setError((prev) => ({ ...prev, errClass: null }));
                            setValues((prev) => ({ ...prev, of_class: e.target.value }));
                        }}
                    >
                        <option selected disabled value="Chọn lớp">
                            Chọn lớp
                        </option>
                        {classData?.map((data, i) => (
                            <option key={i} name="of_class">
                                {data.class_name}
                            </option>
                        ))}
                    </select>
                </div>
                {error?.errClass && <small className="text-danger ml-3">{error?.errClass}</small>}

                <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                        <label htmlFor="from" className="text-capitalize font-weight-bold pl-2">
                            Từ
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control form-control-user"
                            id="from"
                            name="start_date"
                            value={values.start_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-sm-6">
                        <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                            Đến
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control form-control-user"
                            id="to"
                            name="deadline"
                            value={values.deadline}
                            onChange={(e) => {
                                setError((prev) => ({
                                    ...prev,
                                    errFinish: null,
                                }));
                                handleChange(e);
                            }} //
                        />
                    </div>
                    {error?.errFinish !== null && <small className="text-danger ml-3">{error?.errFinish}</small>}
                </div>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Nội dung
                    </label>

                    {/* <div className="custom-file mb-2 file-bt ">
                        <input type="file" className="custom-file-input" id="file" />
                        <label className="custom-file-label " for="file">
                            Thêm file bài tập
                        </label>
                    </div> */}
                    <textarea
                        type="textariea"
                        className="form-control content-bt"
                        id="name-bt"
                        name="content_text"
                        onChange={handleChange}
                        style={{ height: 100 }}
                    />
                    <div className="custom-file my-2 file-bt ">
                        <input
                            id="file"
                            type="file"
                            className="custom-file-input "
                            name="file_path"
                            // onChange={handleFile}

                            onChange={async (file) => {
                                setValues((prev) => ({
                                    ...prev,
                                    file_path: file.target.files[0],
                                }));
                            }}
                        />

                        <label className="custom-file-label " htmlFor="file">
                            {values.file_path?.name}
                        </label>
                    </div>
                </div>
                <button className="btn btn-success px-5 py-2 float-right">Lưu Bài Tập</button>
            </form>
            <ToastContainer />
        </div>
    );
}
