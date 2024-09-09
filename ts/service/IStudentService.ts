import { StudentDto } from "../dto/StudentDto";
import { Baseresponse } from "../response/Baseresponse";
import { StudentFilterRequest } from "../request/StudentFilterRequest";

export interface IStudentService {
    showAll(filterRequest: StudentFilterRequest): Promise<Baseresponse<StudentDto[]>>;
}
