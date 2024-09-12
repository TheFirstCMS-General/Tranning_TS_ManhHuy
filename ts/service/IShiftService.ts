import { BaseResponse } from "../response/BaseResponse";
import { ShiftDto } from "../dto/ShiftDto";

export interface IShiftService {
    getAll(): Promise<BaseResponse<ShiftDto[]>>;
}
