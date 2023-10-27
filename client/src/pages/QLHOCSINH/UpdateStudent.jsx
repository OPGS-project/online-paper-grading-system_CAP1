import 'react-datepicker/dist/react-datepicker.css';
// import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcHighPriority } from 'react-icons/fc';
import { FcList } from 'react-icons/fc';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

export default function UpdateStudent() {
    const navigate = useNavigate();

    // const notifyError = (errorMessage) => {
    //     toast.error(errorMessage, {
    //       position: 'top-right',
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: 'light',
    //     });
    //   };
    //   const notifySuccess = (errorMessage) => {
    //     toast.success(errorMessage, {
    //       position: "top-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //       });
    // };
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 text-center">
                <i className="fa-regular fa-pen-to-square"></i> Cập nhập học sinh
            </h1>
            <form className="mt-3 user mx-5">
                <div className="form-row ">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Mã giáo viên</label>
                        <input type="text" readOnly className="form-control form-control-user" />
                    </div>
                    <div className="col-6 ">
                        <label className="text-capitalize font-weight-bold pl-2">
                            Họ và tên <FcHighPriority />
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập tên học sinh"
                            className="form-control form-control-user"
                            required
                        />
                    </div>
                </div>
                <div className="form-row mt-3">
                    <div className="col-6 ">
                        <label className="text-capitalize font-weight-bold pl-2">
                            Lớp <FcHighPriority />
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập ID lớp"
                            className="form-control form-control-user"
                            required
                        />
                    </div>
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Email</label>
                        <input
                            type="text"
                            placeholder="Nhập email học sinh"
                            className="form-control form-control-user"
                        />
                    </div>
                </div>
                <div className="form-row mt-3">
                    <div className="col-6 ">
                        <label className="text-capitalize font-weight-bold pl-2">
                            Giới tính <FcHighPriority />
                        </label>
                        <select className="form-control form-control-lg" style={{ borderRadius: 50 }} required>
                            <option selected value="">
                                Chọn giới tính
                            </option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Số điện thoại</label>
                        <input
                            type="text"
                            placeholder="Nhập số điện thoại"
                            className="form-control form-control-user"
                        />
                    </div>
                </div>
                <div className="form-row mt-3">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Quê quán</label>
                        <input type="text" placeholder="Nhập quê quán" className="form-control form-control-user" />
                    </div>
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Ngày sinh</label>
                        <div>
                            <DatePicker
                                placeholderText="Chọn ngày sinh"
                                dateFormat="yyyy-MM-dd"
                                className="form-control form-control-user"
                                wrapperClassName="custom-datepicker-wrapper form-control form-control-l" // loại bỏ class mặc định của input DatePicker
                            />
                        </div>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <button type="submit" className="btn btn-success px-5 py-2">
                        Lưu
                    </button>
                    <button type="submit" className="btn btn-light px-5 py-2 ml-3">
                        Hủy
                    </button>
                </div>
            </form>
            {/* <ToastContainer /> */}
        </div>
    );
}
