import express from 'express';
import { ClassServicelmpl } from '../service/impl/ClassServicelmpl';
import { AttendanceSessionDto } from '../dto/AttendanceSessionDto';
import { AttendanceSessionServiceImpl } from '../service/impl/AttendanceSessionServiceImpl';
import { AttendanceCheckDto } from '../dto/AttendanceCheckDto';
import { AttendanceCheckService } from '../service/impl/AttendanceCheckService';
import { AttendanceCheckRequestFilter } from '../request/AttendanceCheckFilterRequest';
const router = express.Router();

const classService = new ClassServicelmpl();
const attendanceSessionService = new AttendanceSessionServiceImpl();
const attendanceCheckService = new AttendanceCheckService();

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

// Chuyển hàm route handler thành async
router.post('/new-attendance-session', async (req, res) => {
    try {
        const body = req.body;
        const attendanceSession = new AttendanceSessionDto();
        attendanceSession.setClassId(body.class_id);
        attendanceSession.setShiftId(body.shift_id);
        const response = await attendanceSessionService.insertRecord(attendanceSession);
        res.json(response)
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error fetching student data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});

// Chuyển hàm route handler thành async
router.post('/new-attendance-check', async (req, res) => {
    try {
        const body: any[] = req.body;
        const attendanceCheckDtoArray: AttendanceCheckDto[] = [];
        body.forEach(item => {
            // Tạo một đối tượng AttendanceCheckDto mới từ dữ liệu
            const attendanceCheckDto = new AttendanceCheckDto(
                item.id ?? null, // Dùng toán tử ?? để cung cấp giá trị mặc định nếu item.id không có
                Number(item.attendance_session_id),
                Number(item.student_id), // Chuyển đổi student_id từ chuỗi sang số và cung cấp giá trị mặc định nếu không hợp lệ
                item.status,
                null,
                item.note,
                Number(item.deleted) // Chuyển đổi deleted từ số sang chuỗi và cung cấp giá trị mặc định nếu không có
            );
            attendanceCheckDtoArray.push(attendanceCheckDto);
        });
        const response = attendanceCheckService.insertRecord(attendanceCheckDtoArray);
        res.json(response);

    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error fetching student data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});

// Chuyển hàm route handler thành async
router.post('/attendance-check', async (req, res) => {
    try {
        const body = req.body;

        const filterRequest = new AttendanceCheckRequestFilter(
            body.attendance_session_id
        );
        const response = await attendanceCheckService.getAll(filterRequest);

        res.json(response);

    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error fetching student data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});

// Chuyển hàm route handler thành async
router.get('/attendance-session', async (req, res) => {
    try {
        const attendanceSession = await attendanceSessionService.getAll();
        res.json(attendanceSession);
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error fetching student data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});


export default router;
