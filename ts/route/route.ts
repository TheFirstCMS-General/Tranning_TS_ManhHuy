import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import classRoutes from './class';
import studentRoutes from './student';

const app = express();
const port = 3000;

// Sử dụng middleware cors
app.use(cors());

// Cài đặt middleware để parse JSON
app.use(bodyParser.json()); // Hoặc dùng express.json() nhưng không cần cả hai
// app.use(express.json()); // Bạn chỉ cần sử dụng một trong hai

app.get('/', (req, res) => {
    try {
        res.json({ message: "test abc" });
    } catch (error) {
        console.error('Error fetching grade data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});

// Định nghĩa các route cho /class
app.use('/class', classRoutes);

// Định nghĩa các route cho /class
app.use('/student', studentRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
