import { StudentDto } from "../../dto/StudentDto";
import { IStudentService } from "../IStudentService";
import { BaseResponse } from "../../response/BaseResponse";
import fs from 'fs/promises'; // Sử dụng fs/promises cho Promise-based API
import path from 'path';
import { Gender } from "../../enum/gender";
import { StudentFilterRequest } from "../../request/StudentFilterRequest";

const pathJson = path.join(__dirname, "../../../data/student.json");

export class StudentServiceImpl implements IStudentService {
    async getAll(filterRequest: StudentFilterRequest): Promise<BaseResponse<StudentDto[]>> {
        const response = new BaseResponse<StudentDto[]>();

        try {
           
            const data = await fs.readFile(pathJson, 'utf8');
            const studentData = JSON.parse(data); 
            const students: StudentDto[] = studentData.map((item: any) => {
                const genderKey = item.gender as keyof typeof Gender;
                const gender = Gender[genderKey] || Gender.OTHER; 
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

            const filteredStudents = students.filter(student => {
                const classIdMatches =  student.getClassId() === filterRequest.getClassId();

                const nameMatches = !filterRequest.getCode() || student.getCode().toLowerCase().includes(filterRequest.getCode().toLowerCase());

                return classIdMatches && nameMatches;
            });

            response.setCode(200);
            response.setMessage('Lấy danh sách sinh viên thành công');
            response.setData(filteredStudents);
        } catch (err) {
            response.setCode(500);
            response.setMessage('Lấy danh sách sinh viên không thành công');
            response.setData([]);
        }

        return response;
    }
}

export default StudentServiceImpl;
