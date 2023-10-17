import { FcList } from 'react-icons/fc';
export default function CreateClass() {
    return (
        <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800 text-center">
                <FcList className="mr-3" />
                Thêm lớp học
                <small className="d-block mt-2"></small>
            </h1>
            <form className="mt-5 user mx-5">
                <div className="form-row">
                    <label className="text-capitalize font-weight-bold pl-2">Tên lớp</label>
                    <input type="text" className="form-control form-control-lg form-control-user" required />
                </div>
                <div className="form-row mt-3">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Sĩ số</label>
                        <input type="text" className="form-control form-control-lg form-control-user" required />
                    </div>
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Ngày tạo lớp</label>
                        <input
                            type="date" // Use 'date' type for a date input
                            className="form-control form-control-lg form-control-user"
                            required
                        />
                    </div>
                </div>

                <div className="form-row mt-3">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Ghi chú
                    </label>
                    <textarea type="textariea" className="form-control content-bt" id="name-bt" />
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
        </div>
    );
}
