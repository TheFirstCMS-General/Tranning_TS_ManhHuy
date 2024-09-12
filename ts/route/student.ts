import express from 'express';
import StudentServiceImpl from '../service/impl/StudentServiceImpl';
import { StudentFilterRequest } from '../request/StudentFilterRequest';

const router = express.Router();
const studentService = new StudentServiceImpl();

router.post('/', async (req, res) => {
    try {
        const body = req.body;

        const filterRequest = new StudentFilterRequest(
            body.class_id,
            body.code
        );
        const response = await studentService.getAll(filterRequest);

        res.json(response);
    } catch (error) {
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});


export default router;
