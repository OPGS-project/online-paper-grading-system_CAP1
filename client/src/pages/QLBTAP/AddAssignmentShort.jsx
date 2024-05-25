import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoDuplicateOutline } from 'react-icons/io5';
import '~~/pages/assignment/AddAssignmentShort.scss';
import { validateFields } from '~/validation/validateShortAssignment.js';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

export default function AddAssignmentShort() {
  const { token } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [inputValueTitle, setInputValueTitle] = useState('Tên bài tập');
  const [inputValueDescription, setInputValueDescription] = useState(null);
  const [inputValueTitleQuestion, setInputValueTitleQuestion] = useState('Nhập câu hỏi');
  const [inputValueAnswerQuestion, setInputValueAnswerQuestion] = useState(null);
  const [classList, setClassList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    of_class: '',
    start_date: moment().format('YYYY-MM-DDTHH:mm'),
    deadline: moment().add(2, 'days').format('YYYY-MM-DDTHH:mm'),
  });

  const [newItems, setNewItems] = useState([]);
  const [items, setItems] = useState([
    {
      id: uuidv4(),
      title: 'Nhập câu hỏi',
      answer: null,
      grade: 0,
    },
  ]);

  const [error, setError] = useState({
    errClass: null,
    errStart: null,
    errFinish: null,
    errTitle: null,
    errDescription: null,
    errQuestion: {}, // Thay đổi từ null sang object để lưu thông tin lỗi theo id câu hỏi
    errAnswer: {},
    errGrade: null,
  }); // State để lưu thông tin về lỗi

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    const newItem = {
      id: uuidv4(),
      title: inputValueTitleQuestion,
      answer: inputValueAnswerQuestion,
      grade: 0,
    };
    setNewItems((prevItems) => [...prevItems, newItem]);
    setItems((prevItems) => [...prevItems, newItem]);
  };



  const handleSaveQuestion = async (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của các trường trước khi gửi dữ liệu
    if (!validateFields(values, inputValueTitle, inputValueDescription, items, setError)) {
      return;
    }

    setIsLoading(true); // Bắt đầu hiển thị loading khi bắt đầu xử lý dữ liệu

    const jsonQuestions = {
      questions: items.map((item) => ({
        title: item.title,
        answer: item.answer,
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
    formData.append('type_assignment', 1);

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
      const newItem = { ...selectedItem, id: uuidv4() };
      setNewItems((prevItems) => [...prevItems, newItem]);
      setItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const handleGradeChange = (e) => {
    const inputGrade = parseFloat(e.target.value);
    const id = e.target.dataset.id;
    // console.log(id);
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

  const handleTitleInputChange = (e) => {
    // Cập nhật giá trị của tiêu đề
    setInputValueTitle(e.target.value);
    // Ẩn thông báo lỗi nếu có
    setError((prevError) => ({ ...prevError, errTitle: null }));
  };

  const handleDescriptionChange = (e) => {
    setInputValueDescription(e.target.value);
    setError((prevError) => ({ ...prevError, errDescription: null }));
  };
  const handleQuestionInputChange = (e, id) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        // Cập nhật giá trị của câu hỏi
        const newValue = e.target.value;
        // Ẩn thông báo lỗi tương ứng nếu có
        const newError = { ...error };
        delete newError.errQuestion[id];
        setError(newError);
        return { ...item, title: newValue };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleAnswerInputChange = (e, id) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        // Cập nhật giá trị của câu hỏi
        const newValue = e.target.value;
        // Ẩn thông báo lỗi tương ứng nếu có
        const newError = { ...error };
        delete newError.errAnswer[id];
        setError(newError);
        return { ...item, answer: newValue };
      }
      return item;
    });
    setItems(newItems);
  };

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

  // Import CSV file
  const [isImporting, setIsImporting] = useState(false);
  const params = useParams();

  const [update, setUpdate] = useState(false);
  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const handleImport = async (e) => {
    if (isImporting) {
      return;
    }
    setIsImporting(true);

    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('csvFile', file);
      try {
        const response = await axios.post(`http://localhost:8081/api/student/upload-short-csv`, formData);
        alert('CSV file uploaded successfully!');
        // console.log(response.data.results);
        // Trích xuất thông tin từ tệp CSV từ phía server
        const results = response.data.results;
        // Tạo mới các mục câu hỏi và đáp án từ thông tin trích xuất được
        const newItemsFromCSV = results.map((item) => ({
          id: uuidv4(),
          title: item.question,
          answer: item.answer,
          grade: 0,
        }));
        // console.log('aaaa',newItemsFromCSV)
        // Cập nhật state với các mục mới từ CSV
        setItems((prevItems) => [...prevItems, ...newItemsFromCSV]);
        setIsImporting(false);
      } catch (error) {
        console.error(error);
        // alert('Error uploading CSV file. Please try again.');
      } finally {
        setIsImporting(false);
      }
    } else {
      alert('Please select a CSV file to upload.');
      setIsImporting(false);
    }
  };

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
          <label style={{ marginRight: 20 }} htmlFor="import" className="btn btn-warning mt-2">
            <i className="fa-solid fa-file-import"></i> Answer pdf
          </label>
          <input
            type="file"
            id="import"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            hidden
          />
          <label htmlFor="importCsv" className="btn btn-success mt-2">
            <i className="fa-solid fa-file-import"></i> Import csv
          </label>
          <input type="file" id="importCsv" onChange={handleImport} hidden />
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
      <div className='select-class-deadline' style={{ width: "60%", display: "flex", marginTop: "20px" }}>
        <form style={{ width: "100%", display: "flex", gap: "20px" }}>
          <div className='form-group' style={{ width: "25%" }}>
            <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
              Lớp
            </label>
            <select
              className={`custom-select ${error.errClass ? 'is-invalid' : ''}`}
              style={{ height: 50, }}
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
            {error?.errClass && <div className="invalid-feedback">{error?.errClass}</div>}
          </div>
          <div className="form-group row" style={{ width: "auto" }}>
            <div className="col-sm-6 mb-3 mb-sm-0">
              <label htmlFor="from" className="text-capitalize font-weight-bold pl-2">
                Từ
              </label>
              <input
                type="datetime-local"
                style={{ height: 50, }}
                className={`form-control form-control-user ${error.errStart ? 'is-invalid' : ''}`}
                id="from"
                name="start_date"
                value={values.start_date}
                onChange={(e) => {
                  setError((prev) => ({
                    ...prev,
                    errStart: null,
                  }));
                  handleChange(e);
                }}
              />
              {error?.errStart !== null && <div className="invalid-feedback">{error?.errStart}</div>}
            </div>
            <div className="col-sm-6">
              <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                Đến
              </label>
              <input
                type="datetime-local"
                style={{ height: 50, }}
                className={`form-control form-control-user ${error.errFinish ? 'is-invalid' : ''}`}
                id="to"
                name="deadline"
                value={values.deadline}
                onChange={(e) => {
                  setError((prev) => ({
                    ...prev,
                    errFinish: null,
                  }));
                  handleChange(e);
                }}
              />
              {error?.errFinish !== null && <div className="invalid-feedback">{error?.errFinish}</div>}
            </div>
          </div>
        </form>
      </div>
      <div className="title-container shadow-sm">
        <div className="line"></div>
        <textarea
          type="text"
          value={inputValueTitle}
          onChange={handleTitleInputChange}
          className={`ml-2 title-text ${error?.errTitle ? 'is-invalid' : ''}`}
          placeholder='Tên bài tập'
        />
        {error?.errTitle && <div className="invalid-feedback ml-2">{error?.errTitle}</div>}

        <input
          type="text"
          value={inputValueDescription}
          onChange={handleDescriptionChange}
          className={`ml-2 description-text ${error?.errDescription ? 'is-invalid' : ''}`}
          placeholder='Nhập mô tả'
        />
        {error?.errDescription && <div className="invalid-feedback ml-2">{error?.errDescription}</div>}
      </div>
      {items.map((item) => (
        <div
          className={`content-add-item shadow-sm ${newItems.some((newItem) => newItem.id === item.id) ? 'add-item-animation' : ''}`}
          key={item.id}
        >
          <div className="line"></div>
          <textarea
            type="text"
            value={item.title}
            onChange={(e) => handleQuestionInputChange(e, item.id)}
            className={`title-question ml-2 ${error?.errQuestion[item.id] ? 'is-invalid' : ''}`}
            placeholder='Nhập câu hỏi'
          />
          {error?.errQuestion[item.id] && <div className="invalid-feedback ml-2">{error?.errQuestion[item.id]}</div>}
          <textarea
            type="text"
            value={item.answer}
            onChange={(e) => handleAnswerInputChange(e, item.id)}
            className={`answer-question ml-2 ${error?.errAnswer[item.id] ? 'is-invalid' : ''}`}
            placeholder='Đáp án (nếu có)'
          />
          {error?.errAnswer[item.id] && <div className="invalid-feedback ml-2">{error?.errAnswer[item.id]}</div>}
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
