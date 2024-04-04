// validation.js
export const validateFields = (values, inputValueTitle, inputValueDescription, items, error) => {
    let isValid = true;
    const errors = {
        errClass: null,
        // errStart: null,
        errFinish: null,
        errTitle: null,
        errDescription: null,
        errQuestion: {},
        errGrade: null,
    };

    // Kiểm tra lớp học
    if (values.of_class === '' || values.of_class.length < 0) {
        isValid = false;
        errors.errClass = 'Vui lòng chọn lớp học';
    }

    // Kiểm tra ngày bắt đầu
    const startDate = new Date(values.start_date);

    // Kiểm tra ngày kết thúc
    const endDate = new Date(values.deadline);
    if (endDate <= startDate) {
        isValid = false;
        errors.errFinish = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
    }

    // Kiểm tra tiêu đề
    if (inputValueTitle.trim() === '' || inputValueTitle === 'Tên bài tập') {
        isValid = false;
        errors.errTitle = 'Vui lòng nhập tiêu đề';
    }

    // Kiểm tra mô tả
    if (inputValueDescription === null) {
        isValid = false;
        errors.errDescription = 'Vui lòng nhập mô tả';
    }

    // Kiểm tra câu hỏi
    items.forEach(item => {
        if (item.title.trim() === '' || item.title === 'Nhập câu hỏi') {
            isValid = false;
            errors.errQuestion[item.id] = 'Vui lòng nhập câu hỏi';
        }
    });

    // Kiểm tra điểm
    if (items.some(item => isNaN(item.grade) || item.grade < 0 || item.grade > 10)) {
        isValid = false;
        errors.errGrade = 'Vui lòng nhập điểm từ 0 đến 10';
    }

    // Set state cho thông tin lỗi
    error(errors);

    return isValid;
};
