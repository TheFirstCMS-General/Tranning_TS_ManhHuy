import { BaseResponse } from "../response/BaseResponse";
import { AttendanceSessionDto } from "../dto/AttendanceSessionDto";

export interface IAttendanceSessionService {
    getAll(): Promise<BaseResponse<AttendanceSessionDto[]>>;
    insertRecord(record: AttendanceSessionDto): Promise<BaseResponse<AttendanceSessionDto>>;
}
