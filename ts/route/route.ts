const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// Sử dụng middleware cors
app.use(cors());

app.use(bodyParser.json());

// Cài đặt middleware để parse JSON
app.use(express.json());

app.get('/', (req: any, res: any) => {
    try {
        res.json({ "message": "test aaa" });
    }
    catch (error) {
        console.error('Error fetching grade data:', error);
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
