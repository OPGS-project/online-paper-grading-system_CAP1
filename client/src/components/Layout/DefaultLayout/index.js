import { Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

function DefaultLayout({ children }) {
    const { isLoggedIn, token } = useSelector((state) => state.auth);
    if (!isLoggedIn || !token) return <Navigate to={`/login`} replace={true} />;
    else
        return (
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Header />
                        <div className="content">{children}</div>
                    </div>
                </div>
            </div>
        );
}

export default DefaultLayout;
