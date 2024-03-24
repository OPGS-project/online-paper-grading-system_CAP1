import * as authServices from "../services";


// Add short assignment
export const addShortAssignment = async (req, res) => {
    try {
        const { assignment_name, short_answers } = req.body;
        //chưa lấy được id teacher
        const { id} = req.user; 
        

        // Kiểm tra xem assignment_name và short_answers đã được cung cấp hay chưa
        if (!assignment_name || !short_answers) {
            return res.status(400).json({ success: false, error: 'Vui lòng cung cấp đầy đủ thông tin.' });
        }

        // Gọi hàm addShortAssignment từ service để thêm bài tập ngắn
        const message = await authServices.addShortAssignmentService({ assignment_name, short_answers }, id);
        
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
