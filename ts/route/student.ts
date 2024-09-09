import express from 'express';
import StudentServiceImpl from '../service/impl/StudentServiceImpl';
import { StudentFilterRequest } from '../request/StudentFilterRequest';

const router = express.Router();
const studentService = new StudentServiceImpl();

// Chuyển hàm route handler thành async
router.post('/', async (req, res) => {
    try {
        // Sử dụng await để chờ kết quả từ phương thức showAll
        const body = req.body;

        const filterRequest = new StudentFilterRequest(
            body.class_id,
            body.code
        );
        const students = await studentService.showAll(filterRequest);

        // Gửi phản hồi JSON về kết quả
        res.json(students);
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error fetching student data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});


export default router;
