import '~~/pages/assignment/AddAssignment.scss';
import { useNavigate } from 'react-router-dom';
import { FcList } from 'react-icons/fc';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

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
    const [classData, setClassData] = useState([]);
    const navigate = useNavigate();
    const [values, setValues] = useState({
        assignment_name: '',
        of_class: '',
        start_date: '',
        deadline: '',
        content_text: '',
    });
    // const [time, setTime] = useState({
    //     startDate: moment().format("YYYY-MM-DD"),
    //     startTime: moment().format("hh:mm"),
    //     finishDate: moment().format("YYYY-MM-DD"),
    //     finishTime: moment().format("hh:mm"),
    //   });
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    //
    useEffect(() => {
        axios
            .get('http://localhost:8081/api/class/')
            .then((res) => setClassData([...res.data.classData.rows]))
            .catch((err) => console.error(err));
    }, []);
    console.log(classData);
    // console.log(Class);

    // setValues((prev) => ({ ...prev, of_class: e.target.value }))
    console.log(values);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:8081/api/assignment/', values)
            .then((res) => {
                console.log(res);
                notifySuccess('Thêm bài tập thành công!');
                setTimeout(() => {
                    navigate('/home/assignment');
                }, 2000);
            })
            .catch((err) => console.log(err));
    };
    return (
        // thêm bài tập
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/home/assignment');
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
                        name="assignment_name"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Lớp
                    </label>

                    <select
                        className="custom-select "
                        style={{ height: 50, borderRadius: 100 }}
                        id="validationTooltip04"
                        required
                        onChange={(e) => setValues((prev) => ({ ...prev, of_class: e.target.value }))}
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
                <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                        <label htmlFor="from" className="text-capitalize font-weight-bold pl-2">
                            Từ
                        </label>
                        <input
                            type="date"
                            className="form-control form-control-user"
                            id="from"
                            name="start_date"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                            Đến
                        </label>
                        <input
                            type="date"
                            className="form-control form-control-user"
                            id="to"
                            name="deadline"
                            onChange={handleChange}
                        />
                    </div>
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
                        style={{ height: 300 }}
                    />
                </div>
                <button className="btn btn-success px-5 py-2 float-right">Lưu Bài Tập</button>
            </form>
            <ToastContainer />
        </div>
    );
}
