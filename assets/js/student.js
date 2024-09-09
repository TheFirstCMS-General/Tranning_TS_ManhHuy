import { post, getParam } from "./method.js"
import { SERVER_HOST } from "../constant.js";

function renderStudent() {
    const body = {};
    body.class_id = getParam('class');
    body.code = null;
    post(SERVER_HOST + '/student', body).
        then(data => {
            const tableData = document.getElementById('student-list');
            const studentData = data.data;
            tableData.innerHTML = '';
            studentData.forEach((student, index) => {
                let birthDay = new Date(student.birthday).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).replace(/\//g, ' - ');
                let row =
                    `<tr>
                <td>${index + 1}</td>
                <td>${student.code}</td>
                <td>${student.name}</td>
                <td>${student.gender}</td>
                <td>${birthDay}</td>
                <td>${student.address}</td>
                <td>${student.phoneNumber}</td>
                <td>
                    <a href="./index.html" type="button" class="btn btn-primary">Xem</a>
                    <a href="./index.html" type="button" class="btn btn-danger">Xóa</a>
                </td>
            </tr>`
                tableData.innerHTML += row;
            });
        });
}
window.onload = renderStudent;