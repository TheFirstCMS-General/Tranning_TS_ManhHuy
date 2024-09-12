import { ClassDto } from "../../dto/ClassDto";
import { BaseResponse } from "../../response/BaseResponse";
import { IClassService } from "../IClassService";
import fs from 'fs/promises';
import path from 'path';


const pathJson = path.join(__dirname, "../../../data/class.json");


export class ClassServicelmpl implements IClassService {
    async showAll(): Promise<BaseResponse<ClassDto[]>> {
        const response = new BaseResponse<ClassDto[]>();

        try {
            const data = await fs.readFile(pathJson, 'utf8');
            const classData = JSON.parse(data);
            response.setCode(200);
            response.setMessage('Lấy danh sách lớp thành công');
            response.setData(classData);
        } catch (error) {
            response.setCode(500);
            response.setMessage('Lấy danh sách lớp học không thành công');
            response.setData([]);
        }

        return response;
    }

}
