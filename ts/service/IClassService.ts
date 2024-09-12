
import { ClassDto } from "../dto/ClassDto";
import { BaseResponse } from "../response/BaseResponse";


export interface IClassService {
    showAll(): Promise<BaseResponse<ClassDto[]>>;
}

