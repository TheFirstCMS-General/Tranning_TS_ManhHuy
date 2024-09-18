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

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const deleteStudentResponse = await studentService.deleteId(id); 
        res.json(deleteStudentResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi khi xóa sinh viên.');
    }
});


router.post('/newStudent', async (req, res) => {
    try {
        const studentp = req.body; // Lấy student từ request body

        // Kiểm tra nếu không có student
        if (!studentp) {
            return res.status(400).json({
                code: '400',
                message: 'Thông tin sinh viên không được bỏ trống'
            });
        }

        // Truyền đối tượng sinh viên cho hàm newStudent
        const moreStudent = await studentService.newStudent(studentp);
        res.json(moreStudent);
        
    } catch (e) {
        console.error('Error adding student', e);
        res.status(500).json({
            code: '500',
            message: 'Lỗi khi thêm sinh viên'
        });
    }
});


export default router;
