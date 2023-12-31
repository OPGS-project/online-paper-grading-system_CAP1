import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import moment from 'moment/moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { FaUndo, FaRedo, FaDownload } from 'react-icons/fa';
import '~~/pages/Grading.scss';
import { Link, useParams } from 'react-router-dom';
import { Collapse } from 'bootstrap';
// import { param } from 'jquery';

function Grading() {
    const navigate = useNavigate();
    const { assignment_id, student_id } = useParams();
    console.log("Student id: " + student_id);
    console.log("Assignment id: " + assignment_id);

    const { editor, onReady } = useFabricJSEditor();
    const [downloadLink, setDownloadLink] = useState('');
    const [downloadName, setDownloadName] = useState('');
    const [showAssignmentImage, setShowAssignmentImage] = useState(false);

    const [totalScore, setTotalScore] = useState(0);
    const [comment, setComment] = useState('');

    const [submission_id, setSubmission_id] = useState('');

    const history = [];
    const [color, setColor] = useState('#35363a');
    const [cropImage, setCropImage] = useState(true);

    //toggle tools
    var [toggle4, setToggle4] = useState(false);

    useEffect(() => {
        var myCollapse4 = document.getElementById('collapseTarget4');
        var bsCollapse4 = new Collapse(myCollapse4, { toggle: false });
        toggle4 ? bsCollapse4.show() : bsCollapse4.hide();
    });

    //Thông tin học sinh 
    const [studentName, setStudentName] = useState({
        student_name: '',
    });

    const [className, setClassName] = useState({
        class_name: '',
    });

    const [createdAt, setCreatedAt] = useState({
        createdAt: '',
    });

    //get api
    useEffect(() => {
        const fetchDataStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/submiss/${assignment_id}/${student_id}`);
                console.log(response)
                if (response.data.err === 0) {
                    const responseData = response.data.response[0];

                    const submission_id = responseData.id;
                    console.log("Submission id: " + submission_id);

                    const { student_name } = responseData.studentData;
                    const { class_name } = responseData.classData;
                    const createdAt = responseData.createdAt;

                    setStudentName({
                        student_name,
                    });

                    setSubmission_id(
                        submission_id,
                    );

                    setClassName({
                        class_name,
                    });

                    setCreatedAt({
                        createdAt,
                    });
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataStudent();
    }, [student_id]);

    //Hướng dẫn chấm bài
    const gradingInstruction = () => {
        const gradingInstructionLink = "https://youtu.be/KTwJn28WIak";
        window.open(gradingInstructionLink, '_blank');
    }

    //Xem đề bài
    const toggleAssignmentImage = async () => {
        try {
            if (!showAssignmentImage) {
                // Fetch data from the API using Axios
                const response = await axios.get(`http://localhost:8081/api/submiss/${assignment_id}/${student_id}`);

                // Kiểm tra xem yêu cầu có thành công không
                if (response.data.err === 0) {
                    // Lấy URL hình ảnh bài tập từ phản hồi API
                    const assignmentImageUrl = response.data.response[0].assignmentData.file_path;
                    // Mở hình ảnh bài tập trong cửa sổ hoặc tab mới
                    window.open(assignmentImageUrl, '_blank');
                } else {
                    console.error(response.data.message);
                }
            }

            setShowAssignmentImage(!showAssignmentImage);
        } catch (error) {
            console.error(error);
        }
    };
    //Hàm xử lý notify message
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
    const notifyError = (errorMessage) => {
        toast.error(errorMessage, {
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

    // Hàm chuyển đổi dữ liệu Base64 thành đối tượng File
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    //Lưu bài
    const saveGradedAssignment = async () => {
        try {
            const canvasDataURL = editor.canvas.toDataURL({ format: 'png' });
            console.log(canvasDataURL);

            const userComment = comment;

            // Chuyển đổi dữ liệu canvas thành đối tượng File
            const fileData = dataURLtoFile(canvasDataURL, 'gradedAssignments.png');
            console.log(fileData);

            //Chuyển đổi thành json
            const canvasJSON = editor.canvas.toJSON();
            console.log("canvasJSON: ");
            console.log(canvasJSON);
            const canvasJSONString = JSON.stringify(canvasJSON);

            console.log(canvasJSONString)

            // Tạo FormData để chứa dữ liệu
            const formData = new FormData();
            formData.append('submission_id', submission_id);
            formData.append('score_value', totalScore);
            formData.append('comments', userComment);
            formData.append('image', fileData);
            formData.append('canvas_json', canvasJSONString);
            formData.append('student_id', student_id);

            // Gọi API để lưu graded assignment
            const response = await axios.post('http://localhost:8081/api/grading/', formData);

            // Xử lý kết quả từ API (response)
            if (response.data.err === 0) {
                // Lưu thành công
                notifySuccess('Lưu kết quả chấm bài thành công!');
                setTimeout(() => {
                    navigate(`/home/assignment/submitted/${assignment_id}`);
                }, 2000);
                // console.log(response.data.mes);
            } else {
                // Lưu thất bại
                notifyError('Không thành công!');
                // console.error(response.data.mes);
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error(error);
        }
    };

    // ----------------------------------------------------- Xử lý thao tác chấm nhanh bằng bàn phím -------------------------------------

    //Trừ điểm nếu thực hiện ctrl + x ở ô score
    const subtractScore = (scoreValue) => {
        const inputValue = parseFloat(scoreValue);
        if (!isNaN(inputValue)) {
            const newTotalScore = totalScore - inputValue;
            setTotalScore(newTotalScore);
        }
    };

    // Hàm sao chép đối tượng đã chọn vào clipboard
    const copySelectedObject = () => {
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject) {
            clipboard = activeObject.toObject(['left', 'top', 'fontSize', 'width', 'angle', 'fill', 'text']); // Sao chép thuộc tính cần thiết
        }
    };

    // Hàm dán đối tượng từ clipboard lên canvas
    const pasteObject = () => {
        if (clipboard) {
            fabric.util.enlivenObjects([clipboard], (objects) => {
                const pastedObject = objects[0];
                pastedObject.set({
                    left: 100, // Vị trí xác định
                    top: 100,
                });
                editor.canvas.add(pastedObject);
                editor.canvas.renderAll();
            });
        }
    };

    let clipboard = null; // Lưu dữ liệu đối tượng đã sao chép

    // Hàm in đậm đối tượng đã chọn
    const setBold = () => {
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold');
            editor.canvas.renderAll();
        }
    };

    // Hàm in nghiêng đối tượng đã chọn
    const setItalic = () => {
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject) {
            activeObject.set('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic');
            editor.canvas.renderAll();
        }
    };

    // Hàm gạch chân đối tượng đã chọn
    const setUnderline = () => {
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
            activeObject.set('textDecoration', activeObject.textDecoration === 'underline' ? 'none' : 'underline');
            editor.canvas.renderAll();
        }
    };

    useEffect(() => {
        if (!editor || !fabric) {
            return;
        }

        // Thêm event listener cho sự kiện nhấn phím "X"
        const handleKeyPress = (event) => {
            if ((event.key === "x" || event.key === "X") && cropImage && !event.ctrlKey && !event.metaKey) {
                // Tạo đối tượng chữ "X" 
                const textX = new fabric.Text("\u2715", {
                    left: 460,
                    top: 100,
                    fill: "red",
                    fontWeight: 550
                });
                editor.canvas.add(textX);

                editor.canvas.renderAll();
            }

            // Kiểm tra xem phím "X" và phím Ctrl (hoặc Command trên macOS) đang được nhấn
            if ((event.key === 'x' || event.key === 'X') && (event.ctrlKey || event.metaKey) && cropImage) {
                // Xóa đối tượng được select trên canvas
                const activeObject = editor.canvas.getActiveObject();
                if (activeObject && activeObject.textboxType === 'score') {
                    // Nếu đối tượng xóa là điểm số, thì gọi hàm subtractScore để trừ điểm
                    subtractScore(activeObject.text);
                }
                editor.canvas.remove(activeObject);
                editor.canvas.renderAll();
            }

            //Thao tác Ctrl trên window, Command trên Mac
            if (event.ctrlKey || event.metaKey) {
                if (event.key === 'c' || event.key === 'C') {
                    // Ctrl + C (Copy)
                    copySelectedObject();
                } else if (event.key === 'v' || event.key === 'V') {
                    // Ctrl + V (Paste)
                    pasteObject();
                } else if (event.key === 'b' || event.key === 'B') {
                    // Ctrl + B (Bold)
                    setBold();
                } else if (event.key === 'i' || event.key === 'I') {
                    // Ctrl + I (Italic)
                    setItalic();
                } else if (event.key === 'u' || event.key === 'U') {
                    // Ctrl + U (Underline)
                    setUnderline();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            // Xóa event listener khi component bị unmount
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [editor, cropImage]);

    // ----------------------------------------------------- Xử lý thao tác chấm nhanh bằng bàn phím -------------------------------------

    useEffect(() => {
        if (!editor || !fabric) {
            return;
        }

        if (cropImage) {
            editor.canvas.__eventListeners = {};
            return;
        }

        if (!editor.canvas.__eventListeners['mouse:wheel']) {
            editor.canvas.on('mouse:wheel', function (opt) {
                var delta = opt.e.deltaY;
                var zoom = editor.canvas.getZoom();
                zoom *= 0.999 ** delta;
                if (zoom > 20) zoom = 20;
                if (zoom < 0.01) zoom = 0.01;
                editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            });
        }

        if (!editor.canvas.__eventListeners['mouse:down']) {
            editor.canvas.on('mouse:down', function (opt) {
                var evt = opt.e;
                if (evt.ctrlKey === true) {
                    this.isDragging = true;
                    this.selection = false;
                    this.lastPosX = evt.clientX;
                    this.lastPosY = evt.clientY;
                }
            });
        }

        if (!editor.canvas.__eventListeners['mouse:move']) {
            editor.canvas.on('mouse:move', function (opt) {
                if (this.isDragging) {
                    var e = opt.e;
                    var vpt = this.viewportTransform;
                    vpt[4] += e.clientX - this.lastPosX;
                    vpt[5] += e.clientY - this.lastPosY;
                    this.requestRenderAll();
                    this.lastPosX = e.clientX;
                    this.lastPosY = e.clientY;
                }
            });
        }

        if (!editor.canvas.__eventListeners['mouse:up']) {
            editor.canvas.on('mouse:up', function (opt) {
                this.setViewportTransform(this.viewportTransform);
                this.isDragging = false;
                this.selection = true;
            });
        }

        console.log(editor);

        editor.canvas.renderAll();
    }, [editor]);

    //Update handle image
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [responseData, setResponseData] = useState(null);

    const addBackground = (imageUrl) => {
        if (!editor || !fabric) {
            return;
        }
        fabric.Image.fromURL(
            imageUrl,
            (image) => {
                const scaleX = editor.canvas.width / image.width;
                const scaleY = editor.canvas.height / image.height;
                const scale = Math.min(scaleX, scaleY);

                image.scaleX = scale;
                image.scaleY = scale;

                image.left = (editor.canvas.width - image.width * scale) / 2;
                image.top = (editor.canvas.height - image.height * scale) / 2;

                editor.canvas.setBackgroundImage(image, editor.canvas.renderAll.bind(editor.canvas));
            },
            { crossOrigin: 'anonymous' }
        );
    };

    const showPreviousImage = () => {
        //Ảnh hợp lệ, nó là 1 mảng và lớn hơn 0
        if (responseData && responseData.image && currentImageIndex > 0) {
            const newIndex = currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            addBackground(responseData.image[newIndex]);
        }
    };

    const showNextImage = () => {
        //Ảnh hợp lệ, nó là 1 mảng và nhỏ hơn thứ tự lớn nhất trong mảng
        if (responseData && responseData.image && currentImageIndex < responseData.image.length - 1) {
            const newIndex = currentImageIndex + 1;
            setCurrentImageIndex(newIndex);
            addBackground(responseData.image[newIndex]);
        }
    };

    const processImageData = (responseData, addBackground) => {
        if (Array.isArray(responseData.image)) {
            responseData.image.forEach((imageUrl) => {
                addBackground(imageUrl);
                console.log("Image: " + imageUrl);
            });
        } else {
            console.error("Invalid image data");
        }
    };

    const fetchDataImage = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/submiss/${assignment_id}/${student_id}`);
            if (response.data.err === 0) {
                const responseData = response.data.response[0];
                setResponseData(responseData);
                processImageData(responseData, addBackground);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDataImage();
    }, []);

    useEffect(() => {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas.setHeight(850);
        editor.canvas.setWidth(900);

        //dbclick => câu đúng
        if (!editor.canvas.__eventListeners['mouse:dblclick']) {
            editor.canvas.on('mouse:dblclick', (opt) => {
                // Lấy thông tin vị trí chuột từ đối tượng sự kiện
                var pointer = editor.canvas.getPointer(opt.e);
                const textV = new fabric.Text('\u2713', {
                    left: pointer.x,
                    top: pointer.y - 10,
                    fill: 'red',
                    fontWeight: 550
                });

                editor.canvas.add(textV);

                // --------------------------------------------------------------- Xử lý nhập ô điểm
                const score = new fabric.Textbox('0', {
                    left: pointer.x + 50, // Đặt vị trí phù hợp với chữ 'V'
                    top: pointer.y,
                    width: 40,
                    fontSize: 30,
                    fill: 'red',
                    textboxType: 'score', // Đặt thuộc tính để xác định loại ô
                });

                //cộng điểm
                score.on('changed', function () {
                    // Kiểm tra nếu giá trị nhập vào không phải số, thì đặt lại giá trị thành 0
                    const inputValue = parseFloat(score.text);
                    if (isNaN(inputValue) || inputValue > 10 || inputValue < 0) {
                        score.text = '0';
                        editor.canvas.renderAll();
                    } else {
                        // Tính tổng mới bằng cộng giá trị mới với totalScore hiện tại
                        const newTotalScore = totalScore + inputValue;

                        if (newTotalScore <= 10) {
                            // Cập nhật totalScore nếu tổng mới không vượt quá 10
                            setTotalScore(newTotalScore);
                        } else {
                            // Nếu tổng mới vượt quá 10, thông báo lỗi và đặt totalScore về 0
                            alert('Tổng điểm không thể vượt quá 10! Vui lòng kiểm tra lại thao tác nhập điểm vừa rồi!');
                            setTotalScore(0);
                        }
                    }
                });

                //Xóa điểm
                score.on('cleared', function () {
                    // Xử lý khi người dùng xóa nội dung ô điểm số
                    const inputValue = 0; // Đặt giá trị vào 0
                    // Trừ giá trị được xóa ra khỏi tổng điểm
                    const newTotalScore = totalScore - inputValue;
                    setTotalScore(newTotalScore);
                });

                editor.canvas.add(score);
                // --------------------------------------------------------------- Đánh giá
                const commentV = new fabric.Textbox('Nhập đánh giá', {
                    left: pointer.x + 90, // Đặt vị trí phù hợp với chữ 'V'
                    top: pointer.y + 2,
                    width: 200,
                    fontSize: 26,
                    fill: 'red',
                });

                editor.canvas.add(commentV);
                //-------------------------------------------------------------------------
                editor.canvas.renderAll();
            })
        }

        // Check và thêm hình ảnh nếu có
        if (responseData && responseData.image) {
            //lấy URL của ảnh từ mảng responseData.image ứng với chỉ số hiện tại currentImageIndex. 
            const imageUrl = responseData.image[currentImageIndex];
            addBackground(imageUrl);
        }

    }, [editor, fabric, responseData, currentImageIndex]);
    //-------------------------------------

    useEffect(() => {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas.freeDrawingBrush.color = color;
        editor.setStrokeColor(color);
    }, [color]);

    //TOOLS
    const addText = () => {
        const comment = new fabric.Textbox('Nhập đánh giá', {
            left: 150,
            top: 110,
            width: 160,
            fontSize: 26,
            fill: "red",
        });
        editor.canvas.add(comment);
    };

    const toggleDraw = () => {
        editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    };

    const undo = () => {
        if (editor.canvas._objects.length > 0) {
            history.push(editor.canvas._objects.pop());
        }
        editor.canvas.renderAll();
    };

    const redo = () => {
        if (history.length > 0) {
            editor.canvas.add(history.pop());
        }
    };

    const clear = () => {
        editor.canvas._objects.splice(0, editor.canvas._objects.length);
        history.splice(0, history.length);
        setTotalScore(0);
        editor.canvas.renderAll();
    };

    const removeSelectedObject = () => {
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject && activeObject.textboxType === 'score') {
            // Nếu đối tượng xóa là điểm số, thì gọi hàm subtractScore để trừ điểm
            subtractScore(activeObject.text);
        }
        editor.canvas.remove(activeObject);
        editor.canvas.renderAll();
    };

    const exportPNG = () => {
        setDownloadLink(
            editor.canvas.toDataURL({
                format: 'png',
            }),
        );
        setDownloadName('assignment_graded.png');
        //test convert image to json
        const testJson = editor.canvas.toJSON();
        console.log(testJson);

        // const canvasJSON = editor.canvas.toJSON();
        // console.log(canvasJSON);
        // const canvasJSONString = JSON.stringify(canvasJSON);
        // console.log(canvasJSONString);
    };

    return (
        <div className="container-fluid m-0 ">
            <div className="content-container">
                <div className="assignment-info-box col-10 ">
                    <div className="assignment-info ">
                        <p>Tên: {studentName.student_name}</p>
                        <p>Lớp: {className.class_name}</p>
                        <p>Thời gian nộp bài: {moment(createdAt.createdAt).format('DD-MM-YYYY HH:mm a')}</p>
                    </div>
                    <div className="assigment-images">
                        <i style={{ marginRight: 10 }} onClick={showPreviousImage} className="fa-solid fa-chevron-left"></i>
                        <p style={{ margin: 0 }}>Hình ảnh bài nộp</p>
                        <i style={{ marginLeft: 10 }} onClick={showNextImage} className="fa-solid fa-chevron-right"></i>
                    </div>
                    <div className="image-container">
                        <FabricJSCanvas onReady={onReady} />
                    </div>
                </div>

                <div className=" card shadow flex-1 col-3 ">
                    <div className="card mt-2">
                        <button className="btn-primary btn btn-success" onClick={gradingInstruction}>
                            Hướng dẫn chấm bài
                        </button>
                    </div>
                    <div className="card mt-2">
                        <button className="btn-primary btn" onClick={toggleAssignmentImage}>
                            Xem đề bài
                        </button>
                    </div>
                    <div className="card shadow my-2 ">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-danger text-center">Nhận Xét</h6>
                        </div>
                        <div className="card-body">
                            <div className="input-container">
                                <textarea
                                    className="textarea "
                                    placeholder="Nhập nội dung ở đây..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                >
                                </textarea>
                            </div>
                            <div
                                className=" my-3 d-flex align-items-center text-danger justify-content-center"
                            >
                                Tổng
                                <input
                                    className="col-3 mx-2 form-control "
                                    type="number"
                                    value={totalScore}
                                    onChange={(e) => setTotalScore(e.target.value)}
                                />
                                điểm
                            </div>
                            <div className="text-center">
                                <button
                                    className="btn btn-outline-success px-5 py-2 mt-3"
                                    onClick={saveGradedAssignment}
                                    disabled={!cropImage}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card shadow my-4 ">
                        <Link
                            className="d-block card-header py-3"
                            style={{ textDecoration: 0 }}
                            onClick={() => setToggle4((toggle4) => !toggle4)}
                        >
                            <h6 className="m-0 font-weight-bold  text-danger text-center">Công Cụ Chấm Bài</h6>
                        </Link>

                        <div className="collapse show" id="collapseTarget4">
                            <div className="card-body">
                                <div className="text-center mb-2">
                                    <button
                                        className=" addText-btn btn btn-success "
                                        style={{ width: 150, height: 40 }}
                                        onClick={addText}
                                        disabled={!cropImage}
                                    >
                                        <i class="fa fa-font"></i>
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="toggle-draw-btn btn btn-success "
                                        style={{ width: 150, Height: 40 }}
                                        onClick={toggleDraw}
                                        disabled={!cropImage}
                                    >
                                        <i class="fa fa-pencil"></i>
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="clear-btn btn btn-success"
                                        style={{ width: 150, height: 40 }}
                                        onClick={clear}
                                        disabled={!cropImage}
                                    >
                                        Dọn dẹp
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="undo-btn btn btn-success"
                                        style={{ width: 150, height: 40 }}
                                        onClick={undo}
                                        disabled={!cropImage}
                                    >
                                        <FaUndo />
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="redo-btn btn btn-success"
                                        style={{ width: 150, height: 40 }}
                                        onClick={redo}
                                        disabled={!cropImage}
                                    >
                                        <FaRedo />
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="delete-btn btn btn-success"
                                        style={{ width: 150, height: 40 }}
                                        onClick={removeSelectedObject}
                                        disabled={!cropImage}
                                    >
                                        Xóa
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <input
                                        style={{ width: 150, height: 40 }}
                                        disabled={!cropImage}
                                        type="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="toSVG-btn btn btn-success"
                                        style={{ width: 150, height: 40 }}
                                        onClick={exportPNG}
                                        disabled={!cropImage}
                                    >
                                        <a href={downloadLink} download={downloadName}>
                                            <FaDownload style={{ color: 'white' }} />
                                        </a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Grading;
