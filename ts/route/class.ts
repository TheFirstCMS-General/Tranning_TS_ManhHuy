import express from 'express';
import StudentServiceImpl from '../service/impl/StudentServiceImpl';

const router = express.Router();
const studentService = new StudentServiceImpl();

// Chuyển hàm route handler thành async
router.get('/', async (req, res) => {
    try {
        // Sử dụng await để chờ kết quả từ phương thức showAll
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error fetching student data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});

export default router;
