import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { Link } from 'react-router-dom';

export default function Student() {
    
    return(
        <div className="container-fluid">
                <h1 className="h3 mb-2 text-gray-800">Danh sách học sinh</h1>
        
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        
                        <Link className='btn btn-success' to={'/createStudent'}
                        >+ Thêm học sinh</Link>
                        <p className='float-right' >Sỉ số: 10 học sinh</p>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
                                <thead>
                                    <tr className='text-center'>
                                        <th>Mã số</th>
                                        <th>Lớp</th>
                                        <th>Họ và tên</th>
                                        <th>Giới tính</th>
                                        <th>Ngày sinh</th>
                                        <th>Số điện thoại</th>
                                        <th>Quê quán</th>
                                        <th>Tùy chỉnh</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                       
                                            <tr className='text-center'>
                                                <td>1</td>
                                                <td>TPM1</td>
                                                <td>Nguyễn Hữu Lĩnh</td>
                                                <td>Nam</td>
                                                <td>25/07/2002</td>
                                                <td>023456789</td>
                                                <td>Đà Nẵng</td>
                                                <td>
                                                <Link to={"/student/updateStudent"}>
                                                    <i className="bi bi-pencil-square mr-3"></i>
                                                </Link>
                                                    <i
                                                        className="bi bi-trash-fill text-danger"
                                                        // onClick={e => handleDelete(data.id)}
                                                        style={{ cursor: 'pointer' }} 
                                                    ></i>
                                                </td>
                                            </tr>
                                        
                                    }  
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
    );        
}