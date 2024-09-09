export class StudentDto {
    private id: number;
    private code: string;
    private name: string;
    private birthday: Date;
    private gender: string;
    private address: string;
    private phoneNumber: string;
    private classId: number;
    private deleted: number;

    constructor(id: number, code: string, name: string, birthday: Date, gender: string, address: string, phoneNumber: string, classId: number, deleted: number) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.birthday = birthday;
        this.gender = gender;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.classId = classId;
        this.deleted = deleted;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getCode(): string {
        return this.code;
    }

    public setCode(code: string): void {
        this.code = code;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getBirthday(): Date {
        return this.birthday;
    }

    public setBirthday(birthday: Date): void {
        this.birthday = birthday;
    }

    public getGender(): string {
        return this.gender;
    }

    public setGender(gender: string): void {
        this.gender = gender;
    }

    public getAddress(): string {
        return this.address;
    }

    public setAddress(address: string): void {
        this.address = address;
    }

    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    public getClassId(): number {
        return this.classId;
    }

    public setClassId(classId: number): void {
        this.classId = classId;
    }

    public getDeleted(): number {
        return this.deleted;
    }

    public setDeleted(deleted: number): void {
        this.deleted = deleted;
    }
}
