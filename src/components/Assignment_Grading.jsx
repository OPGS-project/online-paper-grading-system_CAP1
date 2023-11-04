import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import "../css/Assignment_Grading.css";

function Assignment_Grading() {
  const { editor, onReady } = useFabricJSEditor();
  const [downloadLink, setDownloadLink] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [showAssignmentImage, setShowAssignmentImage] = useState(false);

  const [totalScore, setTotalScore] = useState(0);

  const history = [];
  const [color, setColor] = useState("#35363a");
  const [cropImage, setCropImage] = useState(true);

  const toggleAssignmentImage = () => {
    if (!showAssignmentImage) {
      // Mở hình ảnh bài tập trong cửa sổ hoặc tab mới
      const assignmentImageUrl = "https://image.vtc.vn/files/ctv.phianam/2019/11/12/1-6-0927005.jpg";
      window.open(assignmentImageUrl, "_blank");
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
      if ((event.key === "x" || event.key === "X") && cropImage && !event.ctrlKey && !event.metaKey) {
        // Tạo đối tượng chữ "X" 
        const textX = new fabric.Text("X", {
          left: 460,
          top: 100,
          fill: "red",
        });
        editor.canvas.add(textX);

        const commentX = new fabric.Textbox("Nhập đánh giá", {
          left: 520,
          top: 110,
          width: 200,
          fontSize: 26,
          fill: "red",
        });

        editor.canvas.add(commentX);
        editor.canvas.renderAll();
      }

      // Thêm event listener cho sự kiện nhấn phím "V"
      if ((event.key === "v" || event.key === "V") && cropImage && !event.ctrlKey && !event.metaKey) {
        // Tạo đối tượng chữ "V" 
        const textV = new fabric.Text("V", {
          left: 60,
          top: 100,
          fill: "green",
        });

        editor.canvas.add(textV);

        // --------------------------------------------------------------- Xử lý nhập ô điểm
        const score = new fabric.Textbox("0", {
          left: 110,
          top: 106,
          width: 40,
          fontSize: 30,
          fill: "green",
          textboxType: "score", // Đặt thuộc tính để xác định loại ô
        });

        //cộng điểm
        score.on("changed", function () {
          // Kiểm tra nếu giá trị nhập vào không phải số, thì đặt lại giá trị thành 0
          const inputValue = parseFloat(score.text);
          if (isNaN(inputValue) || inputValue > 10 || inputValue < 0) {
            score.text = "0";
            editor.canvas.renderAll();
          } else {
            // Tính tổng mới bằng cộng giá trị mới với totalScore hiện tại
            const newTotalScore = totalScore + inputValue;

            if (newTotalScore <= 10) {
              // Cập nhật totalScore nếu tổng mới không vượt quá 10
              setTotalScore(newTotalScore);
            } else {
              // Nếu tổng mới vượt quá 10, thông báo lỗi và đặt totalScore về 0
              alert("Tổng điểm không thể vượt quá 10! Vui lòng kiểm tra lại thao tác nhập điểm vừa rồi!");
              setTotalScore(0);
            }
          }
        });

        //Xóa điểm
        score.on("cleared", function () {
          // Xử lý khi người dùng xóa nội dung ô điểm số
          const inputValue = 0; // Đặt giá trị vào 0
          // Trừ giá trị được xóa ra khỏi tổng điểm
          const newTotalScore = totalScore - inputValue;
          setTotalScore(newTotalScore);
        });

        editor.canvas.add(score);
        // --------------------------------------------------------------- Đánh giá
        const commentV = new fabric.Textbox("Nhập đánh giá", {
          left: 150,
          top: 110,
          width: 200,
          fontSize: 26,
          fill: "green",
        });

        editor.canvas.add(commentV);
        //-------------------------------------------------------------------------

        editor.canvas.renderAll();
      }

      // Kiểm tra xem phím "X" và phím Ctrl (hoặc Command trên macOS) đang được nhấn
      if ((event.key === "x" || event.key === "X") && (event.ctrlKey || event.metaKey) && cropImage) {
        // Xóa đối tượng được select trên canvas
        const activeObject = editor.canvas.getActiveObject();
        if (activeObject && activeObject.textboxType === "score") {
          // Nếu đối tượng xóa là điểm số, thì gọi hàm subtractScore để trừ điểm
          subtractScore(activeObject.text);
        }
        editor.canvas.remove(activeObject);
        editor.canvas.renderAll();
      }

      //Thao tác Ctrl trên window, Command trên Mac
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "c" || event.key === "C") {
          // Ctrl + C (Copy)
          copySelectedObject();
        } else if (event.key === "v" || event.key === "V") {
          // Ctrl + V (Paste)
          pasteObject();
        } else if (event.key === "b" || event.key === "B") {
          // Ctrl + B (Bold)
          setBold();
        } else if (event.key === "i" || event.key === "I") {
          // Ctrl + I (Italic)
          setItalic();
        } else if (event.key === "u" || event.key === "U") {
          // Ctrl + U (Underline)
          setUnderline();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      // Xóa event listener khi component bị unmount
      window.removeEventListener("keydown", handleKeyPress);
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
    setTotalScore(0);
    editor.canvas.renderAll();
  };

  const removeSelectedObject = () => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject && activeObject.textboxType === "score") {
      // Nếu đối tượng xóa là điểm số, thì gọi hàm subtractScore để trừ điểm
      subtractScore(activeObject.text);
    }
    editor.canvas.remove(activeObject);
    editor.canvas.renderAll();
  };

  const addText = (e) => {
    const comment = new fabric.Textbox("Nhập đánh giá", {
      left: 150,
      top: 110,
      width: 160,
      fontSize: 26,
      // fill: "green",
    });

    editor.canvas.add(comment);
  };

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
              <input
                type="number"
                value={totalScore}
                onChange={(e) => setTotalScore(e.target.value)}
              />
            </div>
            <button>Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assignment_Grading;