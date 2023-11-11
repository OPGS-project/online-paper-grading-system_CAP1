import { useNavigate } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';
import { FaBookReader } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import '~~/pages/ChooseRole.scss';

function ChooseRoleLogin() {
    const navigate = useNavigate();
    return (
        <div className="container-fluid ">
            <div className="d-flex align-items-center my-1">
                <FaBookReader style={{ width: 50, height: 50, color: '#517ed1' }} />
                <span className=" ml-3" style={{ fontSize: 30, fontWeight: 700, color: '#517ed1' }}>
                    {' '}
                    O P G S
                </span>
            </div>
            <div className="row mx-auto m150 flex-column box-role p-5 " style={{ maxWidth: 600 }}>
                <p className="text-center my-3" style={{ fontSize: 30, fontWeight: 500, color: 'black' }}>
                    Bạn là học sinh hay giáo viên?
                </p>
                <div className="d-flex justify-content-center">
                    <button
                        className="col-md-5 box-role  btn-light my-3 zoom-in"
                        style={{ width: 150, height: 150 }}
                        onClick={() => navigate('/login-student')}
                    >
                        <div className="d-flex  my-1  ">
                            <FaGraduationCap style={{ width: 60, height: 50 }} />
                            <div className="mt-2 ml-2" style={{ fontSize: 16, fontWeight: 500 }}>
                                Học sinh
                            </div>
                        </div>
                    </button>
                    <button
                        className="col-md-5 box-role   ml-5 btn-light my-3"
                        style={{ width: 150, height: 150 }}
                        onClick={() => navigate('/login-teacher')}
                    >
                        <div className="d-flex align-items-center my-1">
                            <GiTeacher style={{ width: 60, height: 50 }} />
                            <div className="mt-2 ml-2" style={{ fontSize: 16, fontWeight: 500 }}>
                                Giáo Viên
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChooseRoleLogin;
