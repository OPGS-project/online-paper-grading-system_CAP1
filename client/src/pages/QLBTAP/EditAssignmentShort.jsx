import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoDuplicateOutline } from 'react-icons/io5';
import '~~/pages/assignment/AddAssignmentShort.scss';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';

export default function EditAssignmentShort() {
  const { token } = useSelector((state) => state.auth);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValueTitle, setInputValueTitle] = useState('');
  const [inputValueDescription, setInputValueDescription] = useState('');
  const [currentClass, setCurrentClass] = useState('');
  const [classList, setClassList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    of_class: '',
    start_date: moment().format('YYYY-MM-DDTHH:mm'),
    deadline: moment().add(2, 'days').format('YYYY-MM-DDTHH:mm'),
  });

  const [error, setError] = useState({
    errClass: null,
    errStart: null,
    errFinish: null,
    errTitle: null,
    errDescription: null,
    errQuestion: {},
    errAnswer: {},
    errGrade: null,
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/assignment/${params.assignmentId}`, {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        const assignmentData = res.data.response[0];
        if (assignmentData.question_name && typeof assignmentData.question_name === 'string') {
          const questionData = JSON.parse(assignmentData.question_name);
          setQuestions(questionData.questions);
        } else {
          console.error('Invalid question_name format');
        }

        setValues({
          of_class: assignmentData.of_class,
          start_date: moment(assignmentData.start_date).format('YYYY-MM-DDTHH:mm'),
          deadline: moment(assignmentData.deadline).format('YYYY-MM-DDTHH:mm'),
        });
        setInputValueTitle(assignmentData.assignment_name);
        setCurrentClass(assignmentData.classData.class_name);
        setInputValueDescription(assignmentData.description);
      })
      .catch((err) => console.error(err));
  }, [params.assignmentId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'start_date' && moment(value).isBefore(moment())) {
      setError((prevError) => ({ ...prevError, errStart: 'Thời gian mở không được trước thời điểm hiện tại' }));
    } else {
      setError((prevError) => ({ ...prevError, errStart: null }));
    }

    if (name === 'deadline' && moment(value).isBefore(moment(values.start_date))) {
      setError((prevError) => ({ ...prevError, errFinish: 'Hạn nộp không được trước thời gian mở' }));
    } else {
      setError((prevError) => ({ ...prevError, errFinish: null }));
    }

    setValues({ ...values, [name]: value });
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const validateQuestions = () => {
    const errors = {};
    let isValid = true;

    questions.forEach((question, index) => {
      if (question.title.trim() === '') {
        errors[index] = 'Vui lòng nhập câu hỏi';
        isValid = false;
        setError((prevError) => ({ ...prevError, errQuestion: errors }));
      }

      if (question.answer.trim() === '') {
        errors[index] = 'Vui lòng nhập đáp án';
        isValid = false;
        setError((prevError) => ({ ...prevError, errAnswer: errors }));
      }
    });

    return isValid;
  };

  const validateTitle = () => {
    if (inputValueTitle.trim() === '') {
      setError((prevError) => ({ ...prevError, errTitle: 'Vui lòng nhập tên bài tập' }));
      return false;
    }
    setError((prevError) => ({ ...prevError, errTitle: null }));
    return true;
  };

  const handleEditQuestion = async (e) => {
    e.preventDefault();

    if (!validateTitle() || !validateQuestions()) {
      return;
    }
    setIsLoading(true);

    const jsonQuestions = {
      questions: questions.map((question) => ({
        title: question.title,
        answer: question.answer,
        grade: question.grade,
      })),
    };

    const data = {
      assignment_name: inputValueTitle,
      description: inputValueDescription,
      question_name: JSON.stringify(jsonQuestions),
      of_class: values.of_class,
      start_date: values.start_date,
      deadline: values.deadline,
    };

    axios({
      method: 'put',
      url: `http://localhost:8081/api/short-assignment/edit-short-assignment/${params.assignmentId}`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    })
      .then((res) => {
        notifySuccess('Sửa bài tập thành công!');
        setTimeout(() => {
          navigate('/home/assignment');
        }, 2000);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleDeleteItem = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleDuplicateItem = (index) => {
    const selectedItem = questions[index];
    if (selectedItem) {
      const newItem = { ...selectedItem, id: uuidv4() };
      setQuestions((prevQuestions) => [...prevQuestions, newItem]);
    }
  };

  const handleGradeChange = (e, index) => {
    const newQuestions = [...questions];
    const inputGrade = parseFloat(e.target.value);
    newQuestions[index].grade = inputGrade;

    const totalGrade = newQuestions.reduce((total, currentItem) => {
      return total + parseFloat(currentItem.grade || 0);
    }, 0);

    if (totalGrade > 10) {
      alert('Tổng điểm của tất cả các câu hỏi không được vượt quá 10');
      e.target.value = '';
      return;
    }

    setQuestions(newQuestions);
  };

  const handleTitleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputValueTitle(inputValue);
    if (inputValue.trim() !== '') {
      setError((prevError) => ({ ...prevError, errTitle: null }));
    }
  };

  const handleDescriptionChange = (e) => {
    setInputValueDescription(e.target.value);
    setError((prevError) => ({ ...prevError, errDescription: null }));
  };

  const handleQuestionInputChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].title = e.target.value;
    setQuestions(newQuestions);

    setError((prevError) => ({ ...prevError, errQuestion: { ...prevError.errQuestion, [index]: null } }));
  };

  const handleAnswerInputChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = e.target.value;
    setQuestions(newQuestions);

    setError((prevError) => ({ ...prevError, errAnswer: { ...prevError.errAnswer, [index]: null } }));
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
  }, [token]);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('csvFile', file);
      try {
        const response = await axios.post(`http://localhost:8081/api/student/upload-short-csv`, formData);
        alert('CSV file uploaded successfully!');
        const results = response.data.results;
        const newQuestionsFromCSV = results.map((item) => ({
          id: uuidv4(),
          title: item.question,
          answer: item.answer,
          grade: 0,
        }));
        setQuestions((prevQuestions) => [...prevQuestions, ...newQuestionsFromCSV]);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Please select a CSV file to upload.');
    }
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
      <div className="right-sidebar">
        <button className="add-new-button" onClick={() => setQuestions([...questions, { id: uuidv4(), title: '', answer: '', grade: '' }])}>
          <i className="bi bi-plus-circle-fill"></i>
        </button>
      </div>
      <div className="header-short-assignment">
        <button className="btn btn-back ml" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="h3 mb-2 text-gray-800 font-weight">Chỉnh sửa bài tập ngắn</h1>
        <div>
          <label style={{ marginRight: 20 }} htmlFor="import" className="btn btn-warning mt-2">
            <i className="fa-solid fa-file-import"></i> Answer pdf
          </label>
          <input type="file" id="import" onChange={(e) => setSelectedFile(e.target.files[0])} hidden />
          <label htmlFor="importCsv" className="btn btn-success mt-2">
            <i className="fa-solid fa-file-import"></i> Import csv
          </label>
          <input type="file" id="importCsv" onChange={handleImport} hidden />
          <button style={{ marginLeft: 20 }} className="btn btn-primary" onClick={handleEditQuestion} disabled={isLoading}>
            {isLoading ? 'Đang chỉnh sửa...' : 'Chỉnh sửa'}
          </button>
        </div>
      </div>
      <div className='select-class-deadline' style={{ width: "60%", marginTop: 20 }}>
        <div className="form-group">
          <label htmlFor="of_class">Lớp học:</label>
          <select id="of_class" name="of_class" className={`form-control ${error?.errClass ? 'is-invalid' : ''}`} value={values.of_class} onChange={handleChange} disabled>
            <option value="">{currentClass}</option>
          </select>
          {error?.errClass && <div className="invalid-feedback">{error?.errClass}</div>}
        </div>
        <div className='row'>
          <div className='col'>
            <div className="form-group">
              <label htmlFor="start_date">Thời gian mở:</label>
              <input type="datetime-local" id="start_date" name="start_date" className={`form-control ${error?.errStart ? 'is-invalid' : ''}`} value={values.start_date} onChange={handleChange} />
              {error?.errStart && <div className="invalid-feedback">{error?.errStart}</div>}
            </div>
          </div>
          <div className='col'>
            <div className="form-group">
              <label htmlFor="deadline">Hạn nộp:</label>
              <input type="datetime-local" id="deadline" name="deadline" className={`form-control ${error?.errFinish ? 'is-invalid' : ''}`} value={values.deadline} onChange={handleChange} />
              {error?.errFinish && <div className="invalid-feedback">{error?.errFinish}</div>}
            </div>
          </div>
        </div>
      </div>
      <div className="title-container shadow-sm">
        <div className="line"></div>
        <textarea type="text" value={inputValueTitle} onChange={handleTitleInputChange} className={`ml-2 title-text ${error?.errTitle ? 'is-invalid' : ''}`} placeholder='Tên bài tập' />
        {error?.errTitle && <div className="invalid-feedback ml-2">{error?.errTitle}</div>}
        <input type="text" value={inputValueDescription} onChange={handleDescriptionChange} className="mt-2 ml-2 description-text" placeholder='Nhập mô tả' />
        {error?.errDescription && <div className="invalid-feedback ml-2">{error?.errDescription}</div>}
      </div>
      {questions.map((question, index) => (
        <div className="content-add-item shadow-sm" key={index}>
          <div className="line"></div>
          <textarea
            type="text"
            value={question.title}
            onChange={(e) => handleQuestionInputChange(e, index)}
            className={`title-question ml-2 ${error?.errQuestion[index] ? 'is-invalid' : ''}`}
            placeholder='Nhập câu hỏi'
          />
          {error?.errQuestion[index] && <div className="invalid-feedback ml-2">{error?.errQuestion[index]}</div>}
          <textarea
            type="text"
            value={question.answer}
            onChange={(e) => handleAnswerInputChange(e, index)}
            className={`answer-question ml-2 ${error?.errAnswer[index] ? 'is-invalid' : ''}`}
            placeholder='Đáp án (nếu có)'
          />
          {error?.errAnswer[index] && <div className="invalid-feedback ml-2">{error?.errAnswer[index]}</div>}
          <hr />
          <div className="footer-question">
            <span>
              <i className="duplicate-question-icon mr-2" onClick={() => handleDuplicateItem(index)}>
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
                onChange={(e) => handleGradeChange(e, index)}
                value={question.grade}
              />
            </span>
            <span>
              <i className="bi bi-trash-fill delete-question-icon" onClick={() => handleDeleteItem(index)}></i>
            </span>
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
}
