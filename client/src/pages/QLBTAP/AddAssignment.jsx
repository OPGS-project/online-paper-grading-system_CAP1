import '~~/pages/assignment/AddAssignment.scss';
import { useNavigate } from 'react-router-dom';
import { FcList } from 'react-icons/fc';

import Criteria from './Criteria';

export default function AddAssignment() {
    const navigate = useNavigate();
    return (
        // thêm bài tập
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/assignment');
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <h1 className="h3 mb-4 text-gray-800 text-center">
                <FcList className="mr-3" />
                Thêm bài tập
            </h1>

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
                        <input type="date" className="form-control form-control-user" id="from" />
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
                <button className="btn btn-success px-5 py-2 float-right">Lưu Bài Tập</button>
            </form>
        </div>
    );
}
