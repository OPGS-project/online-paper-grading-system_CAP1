import { Link, useNavigate } from 'react-router-dom';
import { FaBookReader } from 'react-icons/fa';
import '~~/pages/Introduction.scss';

function Introduce() {
    const navigate = useNavigate();
    return (
        <div className="container-fluid bg-color">
            <div className="row justify-content-between intro">
                <div className="col-md-5 ">
                    <div className="d-flex align-items-center my-1">
                        <FaBookReader className="icon-intro" />
                        <span className="title ml-5"> O P G S</span>
                    </div>
                    <div className="text-intro mt-5">Hệ thống chấm bài và quản lý </div>
                </div>
                <div className="col-md-5 form-intro">
                    <div className="d-flex flex-column mt-4 p-3 box-intro ">
                        <button className="btn  btn-primary p-3 my-3 btn-intro" onClick={() => navigate('/login')}>
                            Đăng Nhập
                        </button>
                        <button className="btn  btn-google p-3 my-3 btn-intro" onClick={() => navigate('/choose-role')}>
                            Đăng Ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Introduce;
