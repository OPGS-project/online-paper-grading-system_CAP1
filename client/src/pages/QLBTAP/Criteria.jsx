import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BsFillPencilFill } from 'react-icons/bs';
import { BsFillTrashFill } from 'react-icons/bs';

function Criteria() {
    const navigate = useNavigate();

    const [newCriteria, setNewCriteria] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:8081/criteria');
            setNewCriteria(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="col-md-7 flex1">
            <div className="text-center header-tc ">
                <h1 className="h5 text-capitalize font-weight-bold pl-2">nội dung tiêu chí</h1>
                <div className="btn-add">
                    <button
                        className="sub-btn p-2 btn-outline-success btn bg-gradient"
                        onClick={() => {
                            navigate('/add-criteria');
                        }}
                    >
                        Thêm tiêu chí
                    </button>
                </div>
            </div>

            <form className="container ">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="col-sm-8 text-capitalize font-weight-bold text-center th rounded-top">
                                Tiêu chí
                            </th>
                            <th className="col-sm-4 text-capitalize font-weight-bold text-center th rounded-top">
                                Điểm
                            </th>
                        </tr>
                    </thead>
                    {/* nội dung tiêu chí */}
                    <tbody>
                        {/* {newCriteria.map((grading_criteria, i) => ( key={i} */}
                        {/* <tr >
                                <td className="d-flex justify-content-between">
                                    <i className="fa-solid fa-check icon-check"></i>
                                    {grading_criteria.correct_answer}
                                    <button
                                        type="button"
                                        className="btn btn-dots"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    ><BsThreeDotsVertical/></button>
                                    <div className="dropdown-menu">
                                        <button className="dropdown-item" href="#">
                                            Xóa <BsFillTrashFill  className="ml-2"/>
                                        </button>
                                        <button className="dropdown-item" href="#">
                                            Sửa <BsFillPencilFill  className="ml-2" />
                                        </button>
                                    </div>
                                </td>
                                <td className="text-center ">{grading_criteria.max_score}</td>
                            </tr> */}
                        {/* ))} */}
                        <tr>
                            <td className="d-flex justify-content-between">
                                <i className="fa-solid fa-check icon-check"></i>
                                Rõ ràng , đúng ý
                                <button
                                    type="button"
                                    className="btn btn-dots"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    {' '}
                                    <BsThreeDotsVertical />
                                </button>
                                <div className="dropdown-menu">
                                    <button className="dropdown-item" href="#">
                                        Xóa <BsFillTrashFill className="ml-2" />
                                    </button>
                                    <button className="dropdown-item" href="#">
                                        Sửa <BsFillPencilFill className="ml-2" />
                                    </button>
                                </div>
                            </td>
                            <td className="text-center ">2</td>
                        </tr>
                        <tr>
                            <td className="d-flex justify-content-between">
                                <i className="fa-solid fa-check icon-check"></i>
                                Bài làm sạch sẽ
                                <button
                                    type="button"
                                    className="btn btn-dots"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <BsThreeDotsVertical />
                                </button>
                                <div className="dropdown-menu " style={{ minWidth: 50 }}>
                                    <button className="dropdown-item" href="#">
                                        Xóa
                                    </button>
                                    <button className="dropdown-item" href="#">
                                        Sửa
                                    </button>
                                </div>
                            </td>
                            <td className="text-center ">2</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default Criteria;
