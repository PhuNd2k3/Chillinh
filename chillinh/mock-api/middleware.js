import fs from "fs";
import path from "path";

export default (req, res, next) => {
  if (req.path === "/companies") {
    // Đọc dữ liệu từ db.json
    const dbPath = path.join(process.cwd(), "mock-api", "db.json");
    const dbData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    // Đọc dữ liệu từ data_test.json
    const dataTestPath = path.join(process.cwd(), "mock-api", "data_test.json");
    const dataTest = JSON.parse(fs.readFileSync(dataTestPath, "utf-8"));

    // Kết hợp dữ liệu từ db.json và data_test.json
    const combinedData = [...(dbData.companies || []), ...dataTest];

    // Trả về dữ liệu kết hợp
    res.json(combinedData);
  } else {
    next(); // Tiếp tục xử lý các route khác
  }
};