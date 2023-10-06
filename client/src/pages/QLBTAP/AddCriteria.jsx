import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '~~/pages/assignment/AddCriteria.scss';

export default function AddCriteria() {
    const navigate = useNavigate();
    const [inputdata, SetInputdata] = useState({
        correct_answer: '',
        max_score: '',
    });
    const handleChange = (e) => {
        SetInputdata({ ...inputdata, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            axios.post('http://localhost:8081/add-criteria', inputdata);
            navigate('/add-assignment');
        } catch (err) {
            console.log(err);
        }
    };
    console.log(inputdata);
    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/add-assignment');
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <form className="user card-body m-200 rounded-bottom text-capitalize fw-bold" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nametc" className="pl-3 mt-3">
                        Nội dung tiêu chí
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-user"
                        id="nametc"
                        name="correct_answer"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="diemtc" className="pl-3">
                        Điểm số
                    </label>
                    <input
                        type="number"
                        className="form-control form-control-user"
                        id="diemtc"
                        name="max_score"
                        onChange={handleChange}
                    />
                </div>
                <button className="btn btn-success btn-user btn-block btn-tc mb-3">Thêm</button>
            </form>
        </div>
    );
}
