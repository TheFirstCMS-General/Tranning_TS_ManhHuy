import { SERVER_HOST } from "../constant.js";
import { post, getParam } from "../method.js";
const classId = getParam("class");
const attendanceSessionId = getParam("id");

function renderAttentionHistory() {
    const body = {};
    body.attendance_session_id = attendanceSessionId;
    post(SERVER_HOST + '/class/attendance-check', body).then(data => {
        const attendanceCheck = data.data; // Dữ liệu attendanceCheck từ server
        let countPresent = 0, countTady = 0, countExcusedAbsence = 0, countUnxcusedAbsence = 0;

        attendanceCheck.forEach(item => {
            const status = item.status_code;
            const studentId = item.student_id;

            // Lấy tất cả các radio buttons cho sinh viên cụ thể
            const radioRecords = document.querySelectorAll(`input[name="status_attendance_${studentId}"]`);

            // Kiểm tra và đặt trạng thái checked
            radioRecords.forEach(radio => {
                if (radio.value === status) {
                    radio.checked = true; // Đặt thuộc tính checked cho radio button đúng
                } else {
                    radio.checked = false; // Đảm bảo các radio button khác không được chọn
                }
            });

            document.getElementById("note_" + studentId).value = item.note;
            if (item.status_code === "PRESENT") {
                countPresent++;
            }
            if (item.status_code  === "TARDY") {
                countTady++;
            }
            if (item.status_code  === "EXCUSED_ABSENCE") {
                countExcusedAbsence++;
            }
            if (item.status_code  === "UNEXCUSED_ABSENCE") {
                countUnxcusedAbsence++;
            }
        });

        renderCountStatus(countPresent, countTady, countExcusedAbsence, countUnxcusedAbsence);
    });
}
function renderStudent() {
    const body = {};
    body.class_id = classId;
    post(SERVER_HOST + '/student', body).then(data => {
        const studentData = data.data;
        const tableClass = document.getElementById('attendance-student');
        studentData.forEach((student, index) => {
            let row =
                `<tr>
                    <td>${index + 1}</td>
                    <td>${student.code}</td>
                    <td>${student.name}</td>
                    <td>TEST</td>   
                    <td><input class="form-check-input" type="radio" data-student =${student.id} name="status_attendance_${student.id}" value="PRESENT"></td>
                    <td><input class="form-check-input" type="radio" data-student =${student.id} name="status_attendance_${student.id}" value="TARDY"></td>
                    <td><input class="form-check-input" type="radio" data-student =${student.id} name="status_attendance_${student.id}" value="EXCUSED_ABSENCE"></td>
                    <td><input class="form-check-input" type="radio" data-student =${student.id} name="status_attendance_${student.id}" value="UNEXCUSED_ABSENCE"></td>
                    <td><textarea class="form-control" data-student =${student.id} id="note_${student.id}" ></textarea></td>
                    </tr>`;
            tableClass.innerHTML += row;
        });
        renderAttentionHistory();
        const attendanceData = attendance();  // Lấy dữ liệu attendanceData
        document.getElementById('submit-attendance').onclick = function () {
            submitAttendance(attendanceData);  // Gửi dữ liệu khi nhấn nút submit
        }
    });
}


function attendance() {
    // Khởi tạo mảng attendanceData
    let attendanceData = [];

    // Gán sự kiện cho radio buttons và update attendanceData
    attendanceData = assignRadioButtonChangeEvent(attendanceData);

    // Gán sự kiện cho textareas và update attendanceData
    attendanceData = assignTextareaChangeEvent(attendanceData);

    // In dữ liệu attendanceData ra console
    return attendanceData;
}

function assignRadioButtonChangeEvent(attendanceData) {
    // Lấy tất cả các radio buttons
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    allRadioButtons.forEach((radio) => {
        if (radio.checked) {
            const studentId = radio.dataset.student;  // Lấy giá trị data-student
            const note = document.getElementById("note_" + studentId)?.value || null;

            // Tạo đối tượng attendanceItem từ radio button được chọn
            const attendanceItem = {
                "id": null,
                "attendance_session_id": attendanceSessionId,  // Giả sử attendanceSessionId được khai báo trước đó
                "student_id": studentId,
                "status": radio.value,
                "note": note,
                "deleted": 0
            };

            checkExist(attendanceData, attendanceItem, studentId)
        }
        radio.addEventListener('change', (event) => {
            const studentId = event.target.dataset.student;  // Lấy giá trị data-student
            const note = document.getElementById("note_" + studentId)?.value || null;

            const attendanceItem = {
                "id": null,
                "attendance_session_id": attendanceSessionId,  // Giả sử attendanceSessionId được khai báo trước đó
                "student_id": studentId,
                "status": event.target.value,
                "note": note,
                "deleted": 0
            };
            checkExist(attendanceData, attendanceItem, studentId);
            countCheckedRadioButtons()
        });
    });

    return attendanceData;
}

function assignTextareaChangeEvent(attendanceData) {
    // Lấy tất cả các textareas
    const allTextareas = document.querySelectorAll('textarea');
    allTextareas.forEach((textarea) => {
        textarea.addEventListener('change', (event) => {
            const studentId = event.target.dataset.student;  // Lấy giá trị data-student

            const attendanceStatus = getCheckedRadioValue("status_attendance_" + studentId);

            const attendanceItem = {
                "id": null,
                "attendance_session_id": attendanceSessionId,  // Giả sử attendanceSessionId được khai báo trước đó
                "student_id": studentId,
                "status": attendanceStatus,
                "note": event.target.value,
                "deleted": 0
            };

            checkExist(attendanceData, attendanceItem, studentId)
        });
    });

    return attendanceData;
}


function submitAttendance(data) {
    post(SERVER_HOST + '/class/new-attendance-check', data).
        then(data => {
            console.log(data);
            alert("Đã lưu điểm danh");
        });
}


function getCheckedRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;  // Trả về giá trị của radio button được chọn
        }
    }
    return null;  // Trả về null nếu không có radio button nào được chọn
}

function checkExist(attendanceData, attendanceItem, studentId) {
    // Kiểm tra xem sinh viên đã có trong mảng attendanceData chưa
    const existingIndex = attendanceData.findIndex(item => item.student_id === studentId);

    if (existingIndex === -1) {
        // Nếu sinh viên chưa có trong mảng, thêm mới
        attendanceData.push(attendanceItem);
    } else {
        // Nếu sinh viên đã có, cập nhật dữ liệu
        attendanceData[existingIndex] = attendanceItem;
    }
}

function countCheckedRadioButtons() {
    // Lấy tất cả các radio buttons
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    let countPresent = 0, countTady = 0, countExcusedAbsence = 0, countUnxcusedAbsence = 0;

    allRadioButtons.forEach(radio => {
        if (radio.checked && radio.value === "PRESENT") {
            countPresent++;
        }
        if (radio.checked && radio.value === "TARDY") {
            countTady++;
        }
        if (radio.checked && radio.value === "EXCUSED_ABSENCE") {
            countExcusedAbsence++;
        }
        if (radio.checked && radio.value === "UNEXCUSED_ABSENCE") {
            countUnxcusedAbsence++;
        }
    });

    renderCountStatus(countPresent, countTady, countExcusedAbsence, countUnxcusedAbsence);
}

function renderCountStatus(countPresent, countTady, countExcusedAbsence, countUnxcusedAbsence) {
    document.getElementById("card-status").innerHTML =
        `<div class="col-md-3">
                                <div class="card bg-success text-white">
                                    <div class="card-body">
                                        <h5 class="card-title color">Có mặt</h5>
                                        <p class="card-text" id="count-present">${countPresent}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-warning text-white">
                                    <div class="card-body">
                                        <h5 class="card-title color">Đi Muộn</h5>
                                        <p class="card-text" id="count-tardy">${countTady}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-info text-white">
                                    <div class="card-body">
                                        <h5 class="card-title color">Nghỉ Có Phép</h5>
                                        <p class="card-text" id="count-excused-absence">${countExcusedAbsence}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-danger text-white">
                                    <div class="card-body">
                                        <h5 class="card-title color">Nghỉ Không Phép</h5>
                                        <p class="card-text" id="count-unexcused-absence">${countUnxcusedAbsence}</p>
                                    </div>
                                </div>
                            </div>`
}

window.onload = renderStudent
