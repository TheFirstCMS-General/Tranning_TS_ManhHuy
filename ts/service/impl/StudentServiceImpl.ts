import { StudentDto } from "../../dto/StudentDto";
import { IStudentService } from "../IStudentService";
import { Baseresponse } from "../../response/Baseresponse";
import fs from 'fs/promises'; // Sử dụng fs/promises cho Promise-based API
import path from 'path';
import { Gender } from "../../enum/gender";
import { StudentFilterRequest } from "../../request/StudentFilterRequest";

const pathJson = path.join(__dirname, "../../../data/student.json");

export class StudentServiceImpl implements IStudentService {
    // Phương thức được chuyển thành async để sử dụng await
    async showAll(filterRequest: StudentFilterRequest): Promise<Baseresponse<StudentDto[]>> {
        const response = new Baseresponse<StudentDto[]>();

        try {
            // Đọc dữ liệu từ file JSON
            const data = await fs.readFile(pathJson, 'utf8');
            const studentData = JSON.parse(data); // Phân tích dữ liệu JSON thành đối tượng
            // Tạo mảng các đối tượng StudentDto từ dữ liệu JSON
            const students: StudentDto[] = studentData.map((item: any) => {
                const genderKey = item.gender as keyof typeof Gender;
                const gender = Gender[genderKey] || Gender.OTHER; // Lấy giá trị enum tương ứng hoặc giá trị mặc định
                return new StudentDto(
                    item.id,
                    item.code,
                    item.name,
                    new Date(item.birthday),
                    gender,
                    item.address,
                    item.phone_number,
                    item.class_id,
                    item.deleted
                )
            });

            // Lọc các học sinh theo classId
            const filteredStudents = students.filter(student => {
                // Điều kiện cho classId
                const classIdMatches =  student.getClassId() === filterRequest.getClassId();

                // Điều kiện cho name
                const nameMatches = !filterRequest.getCode() || student.getCode().toLowerCase().includes(filterRequest.getCode().toLowerCase());

                // Chỉ trả về những sinh viên thỏa mãn cả hai điều kiện
                return classIdMatches && nameMatches;
            });

            // Cập nhật response nếu không có lỗi
            response.setCode('200');
            response.setMessage('Lấy danh sách học sinh thành công');
            response.setData(filteredStudents);
        } catch (err) {
            // Xử lý lỗi và cập nhật response
            console.error('Lỗi đọc file hoặc parse JSON:', err);
            response.setCode('500');
            response.setMessage('Lỗi khi đọc dữ liệu JSON');
            response.setData([]);
        }

        return response;
    }
}

export default StudentServiceImpl;
