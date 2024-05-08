import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoDuplicateOutline } from 'react-icons/io5';
import '~~/pages/assignment/AddAssignmentShort.scss';
import { validateFields } from '~/validation/validateShortAssignment.js';
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
  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState({});
  const [score, setScore] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    of_class: '',
    start_date: moment().format('YYYY-MM-DDTHH:mm'),
    deadline: moment().add(2, 'days').format('YYYY-MM-DDTHH:mm'),
  });

  const [items, setItems] = useState([
    {
      id: uuidv4(),
      title: '',
      answer: '',
      grade: '',
    },
  ]);

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
        console.log(assignmentData);
        setAssignment(assignmentData);

        if (assignmentData.question_name && typeof assignmentData.question_name === 'string') {
          const questionData = JSON.parse(assignmentData.question_name);
          setQuestion(questionData);
          setAnswer(questionData);
          setScore(questionData);
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
        // setItems(assignmentData.questions.map((question) => ({
        //   id: uuidv4(),
        //   title: question.title,
        //   answer: question.answer,
        //   grade: question.grade,
        // })));
      })
      .catch((err) => console.error(err));
  }, [params.assignmentId, token]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    const newItem = {
      id: uuidv4(),
      title: '',
      answer: '',
      grade: '',
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const notifySuccess = (errorMessage) => {
    toast.success(errorMessage, {
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

  const handleEditQuestion = async (e) => {
    e.preventDefault();

    setIsLoading(true);

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

    axios({
      method: 'put',
      url: `http://localhost:8081/api/short-assignment/edit-short-assignment/${params.assignmentId}`,
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: token,
      },
      data: formData,
    })
      .then((res) => {
        console.log(res);
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

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };

  const handleDuplicateItem = (id) => {
    const selectedItem = items.find((item) => item.id === id);
    if (selectedItem) {
      const newItem = { ...selectedItem, id: uuidv4() };
      setItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const handleGradeChange = (e) => {
    const inputGrade = parseFloat(e.target.value);
    const id = e.target.dataset.id;

    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, grade: inputGrade };
      }
      return item;
    });

    const totalGrade = newItems.reduce((total, currentItem) => {
      return total + parseFloat(currentItem.grade || 0);
    }, 0);

    if (totalGrade > 10) {
      alert('Tổng điểm của tất cả các câu hỏi không được vượt quá 10');
      e.target.value = '';
      return;
    }

    setItems(newItems);
  };

  const handleTitleInputChange = (e) => {
    setInputValueTitle(e.target.value);
    setError((prevError) => ({ ...prevError, errTitle: null }));
  };

  const handleDescriptionChange = (e) => {
    setInputValueDescription(e.target.value);
    setError((prevError) => ({ ...prevError, errDescription: null }));
  };

  const handleQuestionInputChange = (e, id) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const newValue = e.target.value;
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
        const newValue = e.target.value;
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
        const newItemsFromCSV = results.map((item) => ({
          id: uuidv4(),
          title: item.question,
          answer: item.answer,
          grade: 0,
        }));
        setItems((prevItems) => [...prevItems, ...newItemsFromCSV]);
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
        <button className="add-new-button" onClick={handleAddItem}>
          <i className="bi bi-plus-circle-fill"></i>
        </button>
      </div>
      <div className="header-short-assignment">
        <button
          className="btn btn-back ml"
          onClick={() => {
            navigate(-1);
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="h3 mb-2 text-gray-800 font-weight">Chỉnh sửa bài tập ngắn</h1>
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
            onClick={handleEditQuestion}
            disabled={isLoading}
          >
            {isLoading ? "Đang chỉnh sửa..." : "Chỉnh sửa"}
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
              <option>{currentClass}</option>
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
          className="mt-2 ml-2 description-text"
          placeholder='Nhập mô tả'
        />
        {error?.errDescription && <div className="invalid-feedback ml-2">{error?.errDescription}</div>}
      </div>
      {items.map((item) => (
        <div
          className={`content-add-item shadow-sm ${items.some((newItem) => newItem.id === item.id) ? 'add-item-animation' : ''}`}

          key={item.id}
        >
          <div className="line"></div>
          {
            Array.isArray(question.questions) && question.questions.map((q, index) => (
              <textarea
                key={index}
                type="text"
                defaultValue={q.title}
                onChange={(e) => handleQuestionInputChange(e, item.id)}
                className={'title-question ml-2'}
                placeholder='Nhập câu hỏi'
              />
            ))
          }
          {
            Array.isArray(answer.questions) && answer.questions.map((a, index) => (
              <textarea
                key={index}
                type="text"
                defaultValue={a.answer}
                onChange={(e) => handleAnswerInputChange(e, item.id)}
                className={'answer-question ml-2'}
                placeholder='Đáp án (nếu có)'
              />
            ))
          }
          <hr />
          <div className="footer-question">
            <span>
              <i className="duplicate-question-icon mr-2" onClick={() => handleDuplicateItem(item.id)}>
                <IoDuplicateOutline />
              </i>
            </span>
            <span>
              {
                Array.isArray(score.questions) && score.questions.map((s, index) => (
                  <input
                    key={index}
                    type="number"
                    min="0"
                    max="10"
                    className="grade-input"
                    placeholder="Điểm"
                    onChange={handleGradeChange}
                    data-id={item.id}
                    defaultValue={s.grade}
                  />
                ))
              }
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
