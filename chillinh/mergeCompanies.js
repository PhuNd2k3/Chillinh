import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn tới file db.json và data_test.json
const dbPath = path.join(__dirname, "mock-api", "db.json");
const dataTestPath = path.join(__dirname, "mock-api", "data_test.json");

// Đọc file db.json
const dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

// Đọc file data_test.json
const dataTest = JSON.parse(fs.readFileSync(dataTestPath, "utf-8"));

// Kiểm tra xem key "companies" có tồn tại trong db.json không
if (!dbData.companies) {
  dbData.companies = []; // Nếu không có, tạo một mảng rỗng
}

// Thêm dữ liệu từ data_test.json vào key "companies"
dbData.companies = dbData.companies.concat(dataTest);

// Ghi lại file db.json với dữ liệu mới
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), "utf-8");

console.log("Dữ liệu từ data_test.json đã được thêm vào key 'companies' trong db.json!");