import { SERVER_HOST } from "../constant.js";
import { get } from "./method.js";

function creatClass(){
    get(SERVER_HOST + '/class').then(data => {
         console.log(data);
         const tableClass = document.getElementById('class-table');
         const classData = data.data;
         classData.forEach((classStudent, index) => {
            let row =
                `<tr>
            <td>${index + 1}</td>
            <td>${classStudent.name}</td>
            <td>
                <a href="../student/index.html?class=${classStudent.id}" type="button" class="btn btn-primary">Chi tiết</a>
                <a href="./index.html" type="button" class="btn btn-danger">Xóa</a>
            </td>
        </tr>`
        tableClass.innerHTML += row;
        });
    })
}

window.onload = creatClass;