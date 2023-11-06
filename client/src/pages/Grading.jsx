import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { FaUndo, FaRedo, FaDownload } from 'react-icons/fa';
import '~~/pages/Grading.scss';
import { Link } from 'react-router-dom';
import { Collapse } from 'bootstrap';

function Grading() {
    const { editor, onReady } = useFabricJSEditor();
    const [downloadLink, setDownloadLink] = useState('');
    const [downloadName, setDownloadName] = useState('');
    const [showAssignmentImage, setShowAssignmentImage] = useState(false);

    const [totalScore, setTotalScore] = useState(0);

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

    //

    const toggleAssignmentImage = () => {
        if (!showAssignmentImage) {
            // Mở hình ảnh bài tập trong cửa sổ hoặc tab mới
            const assignmentImageUrl = 'https://image.vtc.vn/files/ctv.phianam/2019/11/12/1-6-0927005.jpg';
            window.open(assignmentImageUrl, '_blank');
        }
        setShowAssignmentImage(!showAssignmentImage);
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
            if ((event.key === 'x' || event.key === 'X') && cropImage && !event.ctrlKey && !event.metaKey) {
                // Tạo đối tượng chữ "X"
                const textX = new fabric.Text('X', {
                    left: 460,
                    top: 100,
                    fill: 'red',
                });
                editor.canvas.add(textX);

                const commentX = new fabric.Textbox('Nhập đánh giá', {
                    left: 520,
                    top: 110,
                    width: 200,
                    fontSize: 26,
                    fill: 'red',
                });

                editor.canvas.add(commentX);
                editor.canvas.renderAll();
            }

            // Thêm event listener cho sự kiện nhấn phím "V"
            if ((event.key === 'v' || event.key === 'V') && cropImage && !event.ctrlKey && !event.metaKey) {
                // Tạo đối tượng chữ "V"
                const textV = new fabric.Text('V', {
                    left: 60,
                    top: 100,
                    fill: 'green',
                });

                editor.canvas.add(textV);

                // --------------------------------------------------------------- Xử lý nhập ô điểm
                const score = new fabric.Textbox('0', {
                    left: 110,
                    top: 106,
                    width: 40,
                    fontSize: 30,
                    fill: 'green',
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
                    left: 150,
                    top: 110,
                    width: 200,
                    fontSize: 26,
                    fill: 'green',
                });

                editor.canvas.add(commentV);
                //-------------------------------------------------------------------------

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
                // on mouse up we want to recalculate new interaction
                // for all objects, so we call setViewportTransform
                this.setViewportTransform(this.viewportTransform);
                this.isDragging = false;
                this.selection = true;
            });
        }

        editor.canvas.renderAll();
    }, [editor]);

    const addBackground = () => {
        if (!editor || !fabric) {
            return;
        }
        const url = 'https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg';
        fabric.Image.fromURL(
            url,
            (image) => {
                editor.canvas.setBackgroundImage(image, editor.canvas.renderAll.bind(editor.canvas));
            },
            { crossOrigin: 'anonymous' },
        );
    };

    useEffect(() => {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas.setHeight(850);
        editor.canvas.setWidth(900);
        addBackground();
        editor.canvas.renderAll();
    }, [editor?.canvas.backgroundImage]);

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
            // fill: "green",
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
        //   const svg = canvas.current.toSVG();
        setDownloadLink(
            editor.canvas.toDataURL({
                format: 'png',
            }),
        );

        setDownloadName('assignment_graded.png');
    };

    ///
    // const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // const images = [
    //     'https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg',
    //     'https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg',
    // ];

    // useEffect(() => {
    //     const prevButton = document.querySelector('.fa-chevron-left');
    //     const nextButton = document.querySelector('.fa-chevron-right');

    //     const updateImage = () => {
    //         const image = document.getElementById('assignmentImage');
    //         image.src = images[currentImageIndex];
    //     };

    //     const handlePrevClick = () => {
    //         setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    //     };

    //     const handleNextClick = () => {
    //         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    //     };

    //     prevButton.addEventListener('click', handlePrevClick);
    //     nextButton.addEventListener('click', handleNextClick);

    //     updateImage();

    //     return () => {
    //         prevButton.removeEventListener('click', handlePrevClick);
    //         nextButton.removeEventListener('click', handleNextClick);
    //     };
    // }, [currentImageIndex, images]);
    return (
        <div className="container-fluid m-0 ">
            <div className="content-container">
                <div className="assignment-info-box col-10 ">
                    <div className="assignment-info ">
                        <p>Tên: Nguyễn Văn A</p>
                        <p>Lớp: CMU TPM1</p>
                        <p>Thời gian nộp bài: 2023-08-28 14:30:00</p>
                    </div>
                    <div className="assigment-images">
                        <i className="fa-solid fa-chevron-left"></i>
                        <span className="mx-3">1/2</span>
                        <i className="fa-solid fa-chevron-right"></i>
                    </div>
                    <div className="image-container ">
                        <FabricJSCanvas onReady={onReady} />
                    </div>
                </div>

                <div className=" card shadow flex-1 col-3 ">
                    <div className="card mt-3">
                        <button className="btn-primary btn" onClick={toggleAssignmentImage}>
                            Xem đề
                        </button>
                    </div>
                    <div className="card shadow my-2 ">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-danger text-center">Nhận Xét</h6>
                        </div>
                        <div className="card-body">
                            <div className="input-container">
                                <textarea className="textarea " placeholder="Nhập nội dung ở đây..."></textarea>
                            </div>
                            <div
                                className=" my-3 d-flex align-items-center text-danger justify-content-center"
                                // style={{ height: 100, width: 200 }}
                            >
                                {/* <h6 className="text-danger mr-3 col-3">Tổng</h6> */}
                                Tổng
                                <input
                                    className="col-3 mx-2 form-control "
                                    type="number"
                                    value={totalScore}
                                    onChange={(e) => setTotalScore(e.target.value)}
                                />
                                điểm
                                {/* <h6 className="text-danger mr-3 col-4">Điểm</h6> */}
                            </div>
                            <button className="btn btn-outline-success px-5 py-2 mt-3 float-right ">Lưu</button>
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
                                        Thêm chữ
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="toggle-draw-btn btn btn-success "
                                        style={{ width: 150, Height: 40 }}
                                        onClick={toggleDraw}
                                        disabled={!cropImage}
                                    >
                                        Vẽ
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
        </div>
    );
}

export default Grading;
