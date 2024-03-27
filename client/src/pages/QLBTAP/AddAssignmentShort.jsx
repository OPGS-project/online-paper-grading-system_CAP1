import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoDuplicateOutline } from 'react-icons/io5';
import '~~/pages/assignment/AddAssignmentShort.scss';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function AddAssignmentShort() {
  const [inputValueTitle, setInputValueTitle] = useState('Tên bài tập');
  const [inputValueDescription, setInputValueDescription] = useState('Mô tả');
  const [inputValueTitleQuestion, setInputValueTitleQuestion] = useState('Nhập câu hỏi');
  const [classList, setClassList] = useState([]);
  const [values, setValues] = useState({
    of_class: '',
    start_date: moment().format('YYYY-MM-DDTHH:mm'),
    deadline: moment().add(2, 'days').format('YYYY-MM-DDTHH:mm'),
  });
  const navigate = useNavigate();

  const [newItems, setNewItems] = useState([]);
  const [items, setItems] = useState([
    {
      id: 0,
      title: 'Nhập câu hỏi',
      grade: 0,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false); // State để kiểm soát việc hiển thị loading

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: inputValueTitleQuestion,
      grade: 0,
    };
    setNewItems((prevItems) => [...prevItems, newItem]);
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleTitleChange = (e) => {
    setInputValueTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setInputValueDescription(e.target.value);
  };

  const handleTitleQuestionChange = (e, id) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, title: e.target.value };
      }
      return item;
    });
    setItems(newItems);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bắt đầu hiển thị loading khi bắt đầu xử lý dữ liệu

    if (values.of_class === '' || values.of_class.length < 0) {
      setIsLoading(false); // Tắt hiển thị loading khi có lỗi
      return setError((prev) => ({
        ...prev,
        errClass: 'Vui lòng chọn lớp học',
      }));
    }

    const jsonQuestions = {
      questions: items.map((item) => ({
        title: item.title,
        grade: item.grade,
      })),
    };

    const formData = new FormData();
    formData.append('assignment_name', inputValueTitle);
    formData.append('description', inputValueDescription);
    formData.append('question_name', JSON.stringify(jsonQuestions));
    formData.append('of_class', values.of_class);
    formData.append('file_path', selectedFile);
    formData.append('start_date', values.start_date);
    formData.append('deadline', values.deadline);


    try {
      const response = await axios.post(
        'http://localhost:8081/api/short-assignment/add-short-assignment',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: token,
          },
        }
      );
      navigate('/home/assignment');
      console.log('Response from server:', response.data);
      setIsLoading(false); // Tắt hiển thị loading khi xử lý hoàn thành
    } catch (error) {
      console.error('Error occurred while sending data to server:', error);
      setIsLoading(false); // Tắt hiển thị loading khi có lỗi
    }
  };

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const handleDuplicateItem = (id) => {
    const selectedItem = items.find((item) => item.id === id);
    if (selectedItem) {
      const newItem = { ...selectedItem, id: Date.now() };
      setNewItems((prevItems) => [...prevItems, newItem]);
      setItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const handleGradeChange = (e) => {
    const inputGrade = parseFloat(e.target.value);
    const id = parseInt(e.target.dataset.id, 10);

    // Tính tổng lại tất cả các điểm
    const totalGrade = items.reduce((total, currentItem) => {
      if (currentItem.id === id) {
        return total + inputGrade;
      } else {
        return total + currentItem.grade;
      }
    }, 0);

    // Kiểm tra nếu tổng điểm vượt quá 10
    if (totalGrade > 10) {
      alert('Tổng điểm của tất cả các câu hỏi không được vượt quá 10');
      e.target.value = '';
      return;
    }

    // Cập nhật điểm cho câu hỏi
    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, grade: inputGrade };
      }
      return item;
    });
    setItems(newItems);
  };

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/class/', {
        headers: {
          authorization: token,
        },
      })
      .then((res) => setClassList(res.data.classData.rows))
      .catch((err) => console.error(err));
  }, []);
  const [error, setError] = useState({
    errName: null,
    errClass: null,
    errFinish: null,
  });

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
      <div className="right-sidebar">
        <button className="add-new-button" onClick={handleAddItem}>
          <i className="bi bi-plus-circle-fill"></i>
        </button>
      </div>
      <div className="header-short-assignment">
        <h1 className="h3 mb-2 text-gray-800 font-weight">Thêm bài tập ngắn</h1>
        <div>
          <label style={{ marginRight: 20 }} htmlFor="import" className="btn btn-warning ml-5 mt-2">
            <i className="fa-solid fa-file-import"></i> Import
          </label>
          <input
            type="file"
            id="import"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            hidden
          />

          <select
            className="custom-select"
            style={{ height: 38, borderRadius: 6, width: 120 }}
            id="validationTooltip04"
            required
            value={values.of_class}
            onChange={(e) => {
              setError((prev) => ({ ...prev, errClass: null }));
              setValues((prev) => ({ ...prev, of_class: e.target.value }));
            }}
          >
            <option value="">Chọn lớp</option>
            {classList.map((classItem, index) => (
              <option key={index} value={classItem.class_name}>
                {classItem.class_name}
              </option>
            ))}
          </select>
          {error?.errClass && <small className="text-danger ml-3">{error?.errClass}</small>}
          <button
            style={{ marginLeft: 20 }}
            className="btn btn-primary"
            onClick={handleSaveQuestion}
            disabled={isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </button>

        </div>
      </div>
      <div className='select-class-deadline' style={{width:"60%" , display:"flex",marginTop:"20px"}}>
        <form style={{width:"100%" ,display:"flex",gap:"20px"}}>
          <div className='form-group' style={{width:"20%"}}>
            <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Lớp
            </label>
            <select
              className="custom-select"
              style={{ height: 50,}}
              id="validationTooltip04"
              required
              value={values.of_class}
              onChange={(e) => {
                setError((prev) => ({ ...prev, errClass: null }));
                setValues((prev) => ({ ...prev, of_class: e.target.value }));
              }}
            >
              <option value="">Chọn lớp</option>
              {classList.map((classItem, index) => (
                <option key={index} value={classItem.class_name}>
                  {classItem.class_name}
                </option>
              ))}
            </select>
          
            {error?.errClass && <small className="text-danger ">{error?.errClass}</small>}
          </div>
          <div className="form-group row" style={{width:"80%"}}>
                    <div className="col-sm-6 mb-3 mb-sm-0">
                        <label htmlFor="from" className="text-capitalize font-weight-bold pl-2">
                            Từ
                        </label>
                        <input
                            type="datetime-local"
                            style={{ height: 50,}}
                            className="form-control form-control-user"
                            id="from"
                            name="start_date"
                            value={values.start_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-sm-6">
                        <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                            Đến
                        </label>
                        <input
                            type="datetime-local"
                            style={{ height: 50,}}
                            className="form-control form-control-user"
                            id="to"
                            name="deadline"
                            value={values.deadline}
                            onChange={(e) => {
                                setError((prev) => ({
                                    ...prev,
                                    errFinish: null,
                                }));
                                handleChange(e);
                            }} //
                        />
                    </div>
                    {error?.errFinish !== null && <small className="text-danger ml-3">{error?.errFinish}</small>}
                </div>
        </form>
        

      </div>
        
      <div className="title-container shadow-sm">
        <div className="line"></div>
        <textarea
          type="text"
          value={inputValueTitle}
          onChange={handleTitleChange}
          className="mt-2 ml-2 title-text"
        />
        <br />
        <input
          type="text"
          value={inputValueDescription}
          onChange={handleDescriptionChange}
          className="description-text"
        />
      </div>

      {items.map((item) => (
        <div
          className={`content-add-item shadow-sm ${newItems.some((newItem) => newItem.id === item.id) ? 'add-item-animation' : ''
            }`}
          key={item.id}
        >
          <div className="line"></div>
          <textarea
            type="text"
            value={item.title}
            onChange={(e) => handleTitleQuestionChange(e, item.id)}
            className="title-question ml-2"
          />
          <hr />
          <div className="footer-question">
            <span>
              <i className="duplicate-question-icon mr-2" onClick={() => handleDuplicateItem(item.id)}>
                <IoDuplicateOutline />
              </i>
            </span>
            <span>
              <input
                type="number"
                min="0"
                max="10"
                className="grade-input"
                placeholder="Điểm"
                onChange={handleGradeChange}
                data-id={item.id}
              />
            </span>
            <span>
              <i
                className="bi bi-trash-fill delete-question-icon"
                onClick={() => handleDeleteItem(item.id)}
              ></i>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
