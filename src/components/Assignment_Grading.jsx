import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import "../css/Assignment_Grading.css";

function Assignment_Grading() {
  const { editor, onReady } = useFabricJSEditor();
  const [downloadLink, setDownloadLink] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [showAssignmentImage, setShowAssignmentImage] = useState(false);

  const [textToAdd, setTextToAdd] = useState("");

  const history = [];
  const [color, setColor] = useState("#35363a");
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

    if (!editor.canvas.__eventListeners["mouse:wheel"]) {
      editor.canvas.on("mouse:wheel", function (opt) {
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

    if (!editor.canvas.__eventListeners["mouse:down"]) {
      editor.canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.ctrlKey === true) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;
        }
      });
    }

    if (!editor.canvas.__eventListeners["mouse:move"]) {
      editor.canvas.on("mouse:move", function (opt) {
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

    if (!editor.canvas.__eventListeners["mouse:up"]) {
      editor.canvas.on("mouse:up", function (opt) {
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
    const url = "https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg";
    fabric.Image.fromURL(
      url,
      (image) => {
        editor.canvas.setBackgroundImage(
          image,
          editor.canvas.renderAll.bind(editor.canvas),
        );
      },
      { crossOrigin: "anonymous" }
    );
  };

  useEffect(() => {
    if (!editor || !fabric) {
      return;
    }
    editor.canvas.setHeight(754);
    editor.canvas.setWidth(695);
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

  const addText = (e) => {
    editor.addText("Enter text");
  };

  // const addText = () => {
  //   if (!editor) {
  //     return;
  //   }
  
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

  const exportPNG = () => {
    //   const svg = canvas.current.toSVG();
    setDownloadLink(editor.canvas.toDataURL({
        format: "png"
    }));

    setDownloadName("assignment_graded.png");
}

  return (
    <div className="grading-container">
      <div
        className="assignment-grading"
        style={{
          // border: `3px ${!cropImage ? "dotted" : "solid"} Green`,
          // width: "500px",
          // height: "500px",
        }}
      >
        <div className="header-info_asg">
        <p className="heading-content">Chấm bài tập</p>
        <button onClick={toggleAssignmentImage}><p>Xem đề bài</p></button>
        </div>
        <div className="assignment-info">
          <p>Tên: Nguyễn Văn A</p>
          <p>Lớp: CMU TPM1</p>
          <p>Thời gian nộp bài: 2023-08-28 14:30:00</p>
        </div>
        <div className="assigment-images">
          <p>Hình ảnh bài tập</p>
          <i className="fa-solid fa-chevron-left"></i>
          <span>1/2</span>
          <i className="fa-solid fa-chevron-right"></i>
        </div>
        <FabricJSCanvas className="sample-canvas container" onReady={onReady} />
      </div>
      <div className="tools">
      {showAssignmentImage && (
          // Hiển thị hình ảnh đề bài khi showAssignmentImage là true
          <img
            src="https://image.vtc.vn/files/ctv.phianam/2019/11/12/1-6-0927005.jpg"
            alt="Đề bài"
            className="assignment-image"
          />
        )} 
      <h1 className="grading-tools">Công cụ chấm bài</h1>
      <button title="Thêm chữ" className="addText-btn public-btn" onClick={addText} disabled={!cropImage}>
        <p>Add Text</p>
      </button>
      <button title="Vẽ" className="toggle-draw-btn public-btn" onClick={toggleDraw} disabled={!cropImage}>
      <p>Draw</p>
      </button>
      <button title="Dọn dẹp" className="clear-btn public-btn" onClick={clear} disabled={!cropImage}>
      <p>Clear</p>
      </button>
      <button title="Hoàn tác" className="undo-btn public-btn" onClick={undo} disabled={!cropImage}>
      <p>Undo</p>
      </button>
      <button title="Quay lại" className="redo-btn public-btn" onClick={redo} disabled={!cropImage}>
      <p>Redo</p>
      </button>
      <button title="Xóa" className="delete-btn public-btn" onClick={removeSelectedObject} disabled={!cropImage}>
      <p>Delete</p>
      </button>
      <label title="Chọn màu sắc" disabled={!cropImage} className="public-btn">
        <input
          disabled={!cropImage}
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <button title="Xuất hình ảnh" className="toPNG-btn public-btn" onClick={exportPNG} disabled={!cropImage}>
        {" "}
      <a href={downloadLink} download={downloadName}><p>Export</p></a>
      </button>
      <div className="grading-result">
         <div className="comment-box">
            <p>Nhận xét bài tập</p>
            <div className="input-container">
                <textarea placeholder="Nhập nội dung ở đây..." rows="4"></textarea>
            </div>
         </div>
       <div className="result-container">
         <div className="result-box">
            <p>Tổng điểm</p>
            <input type="number" value="0"/>
         </div>
         <button>Lưu</button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Assignment_Grading;
