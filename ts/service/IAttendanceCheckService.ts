import { BaseResponse } from "../response/BaseResponse";
import { AttendanceCheckDto } from "../dto/AttendanceCheckDto";
import { AttendanceCheckRequestFilter } from "../request/AttendanceCheckFilterRequest";

export interface IAttendanceCheckService {
    getAll(filterRequest: AttendanceCheckRequestFilter): Promise<BaseResponse<AttendanceCheckDto[]>>;
    insertRecord(records: AttendanceCheckDto[]): Promise<BaseResponse<any>>;
}
