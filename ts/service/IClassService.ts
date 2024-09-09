
import { ClassDto } from "../dto/ClassDto";
import { Baseresponse } from "../response/Baseresponse";


export interface IClassService {
    showAll(): Promise<Baseresponse<ClassDto[]>>;
}

