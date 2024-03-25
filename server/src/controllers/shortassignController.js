import * as authServices from "../services";


// Add short assignment
export const addShortAssignment = async (req, res) => {
    try {
        const { assignment_name, question_name } = req.body;

        const { id} = req.user;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, error: 'Xác thực không thành công.' });
        }

        // Kiểm tra xem assignment_name và short_answers đã được cung cấp hay chưa
        if (!assignment_name || !question_name) {
            return res.status(400).json({ success: false, error: 'Vui lòng cung cấp đầy đủ thông tin.' });
        }

        // Gọi hàm addShortAssignment từ service để thêm bài tập ngắn
        const message = await authServices.addShortAssignmentService({ assignment_name, question_name }, id);
        
        // Kiểm tra kết quả trả về từ service và phản hồi cho client tương ứng
        if (message && message.err === 0) {
            return res.status(200).json({ success: true, message: message.mes });
        } else {
            return res.status(500).json({ success: false, error: 'Thêm bài tập ngắn thất bại.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Lỗi máy chủ .' });
    }
};
