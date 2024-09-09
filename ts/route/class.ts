import express from 'express';
import { ClassServicelmpl } from '../service/impl/ClassServicelmpl';
const router = express.Router();

const classService = new ClassServicelmpl();

// Chuyển hàm route handler thành async
router.get('/', async (req, res) => {
    try {
       
        const classStudent = await classService.showAll();
       
        res.json(classStudent);
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error fetching student data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});


export default router;
