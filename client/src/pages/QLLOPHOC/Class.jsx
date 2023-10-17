import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Class() {
    const action_delete = (e) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            }
        });
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Thông tin lớp học</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <button to="/CreateClass" className="btn btn-success  py-2">
                        + Thêm lớp học
                    </button>
                    <p className="float-right"> ( Số lớp: 10 lớp)</p>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr className="text-center">
                                    <th>Tên lớp</th>
                                    <th>Tên giáo viên</th>
                                    <th>Sĩ số</th>
                                    <th>Ngày tạo</th>
                                    <th>Ghi chú</th>
                                    <th>Danh sách</th>
                                    <th>Tùy chỉnh</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="text-center align-middle">
                                    <td>CDIO 2</td>
                                    <td>Nguyễn Chiến Thắng</td>
                                    <td>30</td>
                                    <td>10/07/2023</td>
                                    <td>TPM1</td>
                                    <td>
                                        <div>
                                            <a href="/student" className="btn btn-primary">
                                                Xem học sinh
                                            </a>
                                        </div>
                                    </td>

                                    <td>
                                        <Link to={'/class/updateClass'} className="bi bi-pencil-square mr-3"></Link>

                                        <i className="bi bi-trash-fill text-danger " style={{ cursor: 'pointer' }}></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
