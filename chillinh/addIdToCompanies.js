import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn tới file data_test.json
const dataTestPath = path.join(__dirname, "mock-api", "data_test.json");

// Đọc file data_test.json
const dataTest = JSON.parse(fs.readFileSync(dataTestPath, "utf-8"));

// Thêm id cho từng công ty
const updatedData = dataTest.map((company, index) => ({
  id: (index + 1).toString(), // Tạo id dạng chuỗi, bắt đầu từ "1"
  ...company,
}));

// Ghi lại file data_test.json với dữ liệu đã thêm id
fs.writeFileSync(dataTestPath, JSON.stringify(updatedData, null, 2), "utf-8");

console.log("Đã thêm id cho từng công ty trong data_test.json!");