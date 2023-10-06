import '~~/pages/assignment/AddAssignment.scss';
import { useNavigate } from 'react-router-dom';
import Criteria from './Criteria';

export default function AddAssignment() {
    const navigate = useNavigate();
    return (
        // thêm bài tập
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/add-assignment');
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div className="text-center text-uppercase font-italic">
                <h1 className="h5 text-gray-900 mb-4">
                    <i className="fa-regular fa-pen-to-square"></i> Tạo bài tập mới
                </h1>
            </div>
            <form>
                <div className="row space-row">
                    <div className="col-md-4 d-none d-lg-block px-3 ">
                        <form className="user">
                            <div className="form-group">
                                <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                                    tên bài tập
                                </label>
                                <input type="text" className="form-control form-control-user" id="name-bt" />
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
                                        placeholder="Password"
                                    />
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                                        Đến
                                    </label>
                                    <input type="date" className="form-control form-control-user" id="to" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                                    Nội dung
                                </label>

                                <div className="custom-file mb-2 file-bt ">
                                    <input type="file" className="custom-file-input" id="file" />
                                    <label className="custom-file-label " for="file">
                                        Thêm file bài tập
                                    </label>
                                </div>
                                <textarea type="textariea" className="form-control content-bt" id="name-bt" />
                            </div>
                            <div className="form-group d-flex justify-content-between row">
                                <div className="col-5">
                                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                                        Cho xem kết Quả
                                    </label>
                                </div>
                                <div className="col-5 d-flex justify-content-between">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="yes"
                                        />
                                        <label className="form-check-label" for="flexRadioDefault1">
                                            Có
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="flexRadioDefault"
                                            id="no"
                                            checked
                                        />
                                        <label className="form-check-label" for="flexRadioDefault2">
                                            Không
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* tiêu chí */}
                    <Criteria />
                </div>
                <button className="btn btn-outline-success float-right ">Tạo Bài Tập</button>
            </form>
        </div>
    );
}
