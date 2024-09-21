import { StudentDto } from "../../dto/StudentDto";
import { IStudentService } from "../IStudentService";
import { Baseresponse } from "../../response/Baseresponse";
import fs from 'fs/promises';
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
                return new StudentDto( item.id, item.code, item.name, new Date(item.birthday), gender, item.address, item.phoneNumber, item.class_id, item.deleted
                )
            });
            // Lọc các học sinh theo classId
            const filteredStudents = students.filter(student => {
                // Điều kiện cho classId
                const classIdMatches = student.getClassId() === filterRequest.getClassId();

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

    async deleteId(id: number): Promise<Baseresponse<StudentDto | null>> {
        const response = new Baseresponse<StudentDto | null>();
        try {
            const data = await fs.readFile(pathJson, 'utf8');
            const pamStudent: any[] = JSON.parse(data);
            const studentData: StudentDto[] = pamStudent.map(
                cls => new StudentDto(
                    cls.id, cls.code, cls.name, new Date(cls.birthday), cls.gender, cls.address, cls.phoneNumber, cls.class_id, cls.deleted)
            );
                 console.log(studentData)    
            const studentIndex = studentData.findIndex(student => student.getId() === id);
        
            if (studentIndex !== -1) {
                const [deletedStudent] = studentData.splice(studentIndex, 1);
                await fs.writeFile(pathJson, JSON.stringify(studentData, null, 2), 'utf8');
                
                response.setCode('200');
                response.setMessage('Xóa sinh viên thành công');
                response.setData(deletedStudent);
            } else {
                response.setCode('404');
                response.setMessage('Không tìm thấy sinh viên với ID đã cho');
                response.setData(null);
            }
        } catch (error) {
            console.error('Lỗi trong quá trình xóa sinh viên:', error);
            response.setCode('500');
            response.setMessage('bị lỗi khi xóa sinh viên');
            response.setData(null);
        }
        return response;
    }

    async newStudent(student: StudentDto): Promise<Baseresponse<any>> {
        const response = new Baseresponse<any>();
        
        try {
            const databa = await fs.readFile(pathJson, 'utf8'); 
            let studentData: StudentDto[] = [];
            
            if (databa) {
                const jsonData = JSON.parse(databa);
    
                // Chuyển đổi dữ liệu JSON thành các đối tượng StudentDto
                studentData = jsonData.map((item: any) => new StudentDto(
                    item.id, item.code, item.name, new Date(item.birthday), item.gender, item.address, item.phoneNumber, item.class_id, item.deleted
                ));
            }
    
            // Kiểm tra nếu student truyền vào không phải là instance của StudentDto
            if (!(student instanceof StudentDto)) {
                throw new Error('Đối tượng truyền vào không phải là instance của StudentDto');
            }
    
            // Xác định ID và mã sinh viên mới
            const studentId = studentData.length > 0 ? Math.max(...studentData.map(s => s.getId())) : 0;
            const newId = studentId + 1;
            const newCode = `S${newId.toString().padStart(3, '0')}`;
    
            // Tạo sinh viên mới với ID và mã mới
            const newStudent = new StudentDto(
                newId, newCode, student.getName(), student.getBirthday(), student.getGender(), student.getAddress(), student.getPhoneNumber(), student.getClassId(), 0
            );
            
            // Thêm sinh viên mới vào danh sách
            studentData.push(newStudent);
    
            // Ghi lại dữ liệu vào file JSON
            await fs.writeFile(pathJson, JSON.stringify(studentData, null, 2));
    
            // Thiết lập phản hồi thành công
            response.setCode('200');
            response.setMessage('Thêm sinh viên thành công vào hệ thống');
            response.setData(newStudent);
    
        } catch (e) {
            // Xử lý lỗi và trả về phản hồi thất bại
            response.setCode('500');
            response.setMessage('Thêm sinh viên vào hệ thống không thành công');
            console.error('Lỗi khi thêm sinh viên:', e);
        }
    
        return response;
    }
    
}

export default StudentServiceImpl;
