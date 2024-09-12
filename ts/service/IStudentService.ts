import { StudentDto } from "../dto/StudentDto";
import { BaseResponse } from "../response/BaseResponse";
import { StudentFilterRequest } from "../request/StudentFilterRequest";

export interface IStudentService {
    getAll(filterRequest: StudentFilterRequest): Promise<BaseResponse<StudentDto[]>>;
}
