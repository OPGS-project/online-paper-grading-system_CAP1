import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { FaUndo, FaRedo, FaDownload } from 'react-icons/fa';
import '~~/pages/Grading.scss';

function Grading() {
    const { editor, onReady } = useFabricJSEditor();
    const [downloadLink, setDownloadLink] = useState('');
    const [downloadName, setDownloadName] = useState('');
    const [showAssignmentImage, setShowAssignmentImage] = useState(false);

    const [textToAdd, setTextToAdd] = useState('');

    const history = [];
    const [color, setColor] = useState('#35363a');
    const [cropImage, setCropImage] = useState(true);

    const toggleAssignmentImage = () => {
        setShowAssignmentImage(!showAssignmentImage); // Khi nhấn vào nút "Xem đề bài", đảo ngược giá trị của state
    };
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
        editor.addText('Enter text');
    };
    //   const text = window.prompt("Enter text (or number to accumulate):");
    //   if (text) {
    //     // Check if the input is a number
    //     const isNumber = !isNaN(parseFloat(text)) && isFinite(text);

    //     if (isNumber) {
    //       const numberObject = new fabric.Text(text, {
    //         left: 100,
    //         top: 100,
    //       });
    //       editor.canvas.add(numberObject);
    //       editor.canvas.renderAll();
    //     } else {
    //       const textObject = new fabric.Text(text, {
    //         left: 100,
    //         top: 100,
    //       });
    //       editor.canvas.add(textObject);
    //       editor.canvas.renderAll();
    //     }

    //     console.log("Text entered:", text);
    //   }
    // };
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
        editor.canvas.renderAll();
    };

    const removeSelectedObject = () => {
        editor.canvas.remove(editor.canvas.getActiveObject());
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
                <div className="assignment-info-box col-9 ">
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
                    {showAssignmentImage && ( // Hiển thị hình ảnh đề bài khi showAssignmentImage là true
                        <img
                            src="https://image.vtc.vn/files/ctv.phianam/2019/11/12/1-6-0927005.jpg"
                            alt="Đề bài"
                            className="assignment-image mt-2 "
                            Height={300}
                        />
                    )}
                    <div className="card shadow my-4 ">
                        <a
                            href="/#"
                            className="d-block card-header py-3"
                            data-toggle="collapse"
                            role="button"
                            data-target="#collapseTools"
                            aria-expanded="true"
                            aria-controls="collapseTools"
                        >
                            <h6 className="m-0 font-weight-bold text-danger text-center">Công Cụ Chấm Bài</h6>
                        </a>

                        <div className="collapse show" id="collapseTools">
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
                                        Bút
                                    </button>
                                </div>
                                <div className="text-center mb-2">
                                    <button
                                        className="clear-btn btn btn-success"
                                        style={{ width: 150, height: 40 }}
                                        onClick={clear}
                                        disabled={!cropImage}
                                    >
                                        Làm mới
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
                    <div className="card shadow mb-3 ">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-danger text-center">Nhận Xét</h6>
                        </div>
                        <div className="card-body">
                            <div className="input-container">
                                <textarea className="textarea " placeholder="Nhập nội dung ở đây..."></textarea>
                            </div>
                            <div
                                className="mx-3 my-3 row align-items-center text-danger  "
                                style={{ height: 50, width: 300 }}
                            >
                                {/* <h6 className="text-danger mr-3 col-3">Tổng</h6> */}
                                Tổng
                                <input className="col-3 mx-3 form-control form-control-sm" />
                                Điểm
                                {/* <h6 className="text-danger mr-3 col-4">Điểm</h6> */}
                            </div>
                            <button className="btn btn-outline-success px-5 py-2 mt-3 float-right ">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Grading;
