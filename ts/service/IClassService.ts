
import { ClassDto } from "../dto/ClassDto";
import { Baseresponse } from "../response/Baseresponse";


export interface IClassService {
    showAll(): Promise<Baseresponse<ClassDto[]>>;
    deleteById(id: number): Promise<Baseresponse<ClassDto | null>>;
    addClass(name: string): Promise<Baseresponse<ClassDto>>
}

