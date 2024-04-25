import { Navigate } from 'react-router-dom';
import Header from './HeaderStudent';
import Sidebar from './SidebarStudent';
import { useSelector } from 'react-redux';

function DefaultLayoutST({ children }) {
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

export default DefaultLayoutST;
