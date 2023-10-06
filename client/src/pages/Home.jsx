import { Link } from 'react-router-dom';
import '~~/pages/HomePage.scss';

function Home() {
    return (
        <div>
            <div className="container-fluid">
                <div className="greeting_homePage">
                    <div className="center-content">
                        <h1 className="text-color">
                            Chào mừng bạn đến với OPGS ! <br />
                            Bạn có thể tạo bài tập, đề thi bên dưới
                        </h1>
                        <Link to="/add-assignment" className="nav-link collapsed border-add">
                            <div className="p-3 rounded-pill add-exam ">
                                <i className="icon fas fa-pencil"></i>
                                <span className="fontsize30 "> Tạo bài tập hoặc đề thi</span>
                            </div>
                        </Link>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
