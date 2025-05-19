import { useState, useEffect, useRef } from "react";
import "./ProfileForm.css";
import defaultAvatar from "../../assets/default-avatar.svg";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../../api/profileAPI";

// Predefined options
const PREDEFINED_OPTIONS = {
  universities: [
    "Đại học Bách Khoa Hà Nội",
    "Đại học Kinh tế Quốc dân",
    "Đại học Ngoại thương",
    "Đại học FPT",
    "Đại học Công nghệ - ĐHQG Hà Nội",
    "Đại học Khoa học Tự nhiên - ĐHQG Hà Nội",
    "Đại học Khoa học Xã hội và Nhân văn - ĐHQG Hà Nội",
    "Đại học Thương mại",
    "Đại học Sư phạm Hà Nội",
    "Đại học Y Hà Nội",
    "Đại học Bách Khoa TP.HCM",
    "Đại học Kinh tế TP.HCM",
    "Đại học Công nghệ Thông tin - ĐHQG TP.HCM",
    "Đại học Khoa học Tự nhiên - ĐHQG TP.HCM",
    "Đại học Khoa học Xã hội và Nhân văn - ĐHQG TP.HCM",
    "Đại học Sư phạm TP.HCM",
    "Đại học Y Dược TP.HCM",
    "Đại học Cần Thơ",
    "Đại học Đà Nẵng",
    "Đại học Huế"
  ],
  majors: [
    "Logistics",
    "Quản lý công nghiệp",
    "Kinh tế vận tải",
    "Không yêu cầu chuyên ngành",
    "Kinh tế",
    "Quản trị Kinh doanh",
    "Bất động sản",
    "Marketing",
    "Công nghệ thông tin",
    "Thiết kế đồ họa",
    "Kiến trúc",
    "Thiết kế nội thất",
    "Dược",
    "Hóa học",
    "Quản trị kinh doanh",
    "Khoa học máy tính",
    "Tâm lý học",
    "Tài chính",
    "Dịch vụ khách hàng",
    "Quản lý dự án",
    "Thương mại điện tử",
    "Quản lý chuỗi cung ứng",
    "Xây dựng",
    "Môi trường",
    "Kỹ thuật môi trường",
    "Kỹ thuật năng lượng",
    "Kỹ thuật điện",
    "Tài chính ngân hàng",
    "Quản lý rủi ro",
    "Kỹ thuật phần mềm",
    "Sư phạm",
    "Ngôn ngữ học",
    "Quản trị nhân sự",
    "Truyền thông",
    "Kinh doanh",
    "Quản lý kho",
    "Cơ khí",
    "Điện tử",
    "Công nghệ kỹ thuật",
    "Quản lý kỹ thuật",
    "Kỹ thuật công nghiệp",
    "Điều dưỡng",
    "Y học",
    "Kỹ thuật sản xuất",
    "Công nghệ phần mềm",
    "Toán tin",
    "Kế toán",
    "Kiểm toán",
    "Ưu tiên ngành Quản trị kinh doanh",
    "Mỹ thuật ứng dụng",
    "Ưu tiên ngành Kinh doanh",
    "Truyền thông đa phương tiện",
    "Mỹ thuật đa phương tiện",
    "Công nghệ thực phẩm",
    "Quản trị nhà hàng khách sạn",
    "Nhà hàng",
    "Dịch vụ ăn uống",
    "PR",
    "Hệ thống thông tin quản lý",
    "Kinh tế xây dựng",
    "Kỹ thuật xây dựng",
    "Điện - Điện tử",
    "Cơ điện tử",
    "Quản trị dự án",
    "Hành chính văn phòng",
    "Kinh tế đối ngoại",
    "Xuất nhập khẩu",
    "Tài chính doanh nghiệp",
    "Ngân hàng",
    "Quản trị nhân lực",
    "Quản trị vận hành",
    "Hệ thống thông tin",
    "Quản trị rủi ro",
    "Dược học",
    "Công nghệ sinh học",
    "Không yêu cầu",
    "Thống kê",
    "Công nghệ dệt may",
    "Khoa học dữ liệu",
    "Trí tuệ nhân tạo",
    "Tự động hóa",
    "Năng lượng tái tạo",
    "Báo chí",
    "Kinh doanh quốc tế",
    "Xây dựng dân dụng và công nghiệp",
    "Quản lý xây dựng",
    "Sư phạm Tiếng Anh",
    "Ngôn ngữ Anh",
    "Sư phạm Toán",
    "Toán học",
    "Quản lý chất lượng",
  ],
  skills: [
    "Quản lý chuỗi cung ứng",
    "Excel",
    "Phần mềm logistics",
    "Sử dụng ứng dụng định vị",
    "Hiểu biết địa lý thành phố",
    "Hiểu biết thị trường BĐS",
    "CRM",
    "Kỹ năng tư vấn",
    "Digital marketing",
    "SEO",
    "Thiết kế cơ bản",
    "AutoCAD",
    "3Ds Max",
    "SketchUp",
    "Vray",
    "Kỹ năng bán hàng",
    "Kỹ năng đàm phán",
    "Quản lý dược phẩm",
    "Kiến thức về thuốc",
    "Kiểm tra chất lượng",
    "Quản lý vận hành",
    "Phần mềm quản lý logistics",
    "Java",
    "React",
    "Node.js",
    "HTML/CSS",
    "Hệ thống CRM",
    "Giao tiếp qua chat/email",
    "Tư vấn tài chính",
    "Quản lý tài sản",
    "Phân tích tài chính",
    "Đầu tư chứng khoán",
    "Tư vấn sản phẩm",
    "Kỹ năng chăm sóc khách hàng",
    "Giải quyết vấn đề",
    "Python",
    "C++",
    "SQL",
    "Quản lý dự án",
    "Kỹ năng lãnh đạo",
    "Kỹ năng giải quyết vấn đề",
    "Thương mại điện tử",
    "Quản lý sản phẩm online",
    "Marketing trực tuyến",
    "Quản lý chiến lược",
    "SEO/SEM",
    "Chăm sóc khách hàng",
    "Quản lý logistics",
    "Kiểm soát tồn kho",
    "Phân tích dữ liệu logistics",
    "Thiết kế nội thất",
    "Phần mềm thiết kế (AutoCAD, SketchUp)",
    "Quản lý đội nhóm",
    "Phân tích tiến độ dự án",
    "Kỹ thuật môi trường",
    "Năng lượng tái tạo",
    "Xử lý chất thải",
    "Kỹ thuật điện",
    "Phân tích dữ liệu",
    "Phân tích thị trường",
    "Tính toán tài chính",
    "Kỹ năng sử dụng phần mềm phân tích",
    "Lập kế hoạch",
    "Kiến thức về ngân hàng",
    "Sử dụng phần mềm ngân hàng",
    "Phân tích rủi ro",
    "Quản lý rủi ro",
    "Lập trình Java",
    "Cấu trúc dữ liệu",
    "Phát triển ứng dụng web",
    "Sáng tạo nội dung",
    "Soạn thảo bài giảng",
    "Kỹ năng biên tập",
    "Kỹ năng giảng dạy",
    "Tổ chức lớp học",
    "Tạo giáo án",
    "Thiết kế chương trình giảng dạy",
    "Biên soạn tài liệu học",
    "Kiến thức về giáo dục",
    "Quản lý nội dung",
    "Google Ads",
    "Facebook Ads",
    "Quản lý vận tải",
    "Giám sát giao nhận",
    "Xử lý tình huống",
    "Kinh doanh logistics",
    "Thương thảo hợp đồng",
    "Quản lý kho",
    "Giám sát hàng hóa",
    "Kiểm soát chất lượng",
    "Đọc hiểu bản vẽ kỹ thuật",
    "Sử dụng thiết bị đo lường",
    "Tin học văn phòng",
    "Quản lý hồ sơ kỹ thuật",
    "Quản lý kho hàng",
    "Sử dụng phần mềm quản lý kho",
    "Kiến thức y tế cơ bản",
    "Phản ứng nhanh trong các tình huống khẩn cấp",
    "Quản lý sản xuất",
    "Digital Marketing",
    "Lập trình Java/ Python",
    "Kiến trúc microservices",
    "Quản lý cơ sở dữ liệu",
    "Kỹ năng quản lý khách hàng",
    "Sử dụng CRM",
    "Kỹ năng thuyết phục",
    "Phân tích dữ liệu bán hàng",
    "Telesales",
    "Lãnh đạo đội nhóm",
    "Quản lý đối tác",
    "Hiểu biết ngành ô tô",
    "MySQL",
    "Spring Framework",
    "Spring Boot",
    "Vue.js",
    "C#",
    ".NET",
    "SQL Server",
    "Web Crawling",
    "Kế toán tài chính",
    "Excel nâng cao",
    "Phân tích số liệu",
    "Giao tiếp khách hàng",
    "Sử dụng phần mềm CRM",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Thiết kế đồ họa",
    "Sales",
    "Kế toán",
    "Phần mềm kế toán",
    "Facebook Business",
    "Illustrator",
    "Thiết kế banner",
    "ISO 22000",
    "Vận hành thiết bị công nghiệp",
    "Quản lý vận hành F&B",
    "Kiểm soát chi phí",
    "Báo cáo doanh thu",
    "Vận hành ca",
    "Quản lý kho nguyên liệu",
    "Account management",
    "Data analytics",
    "Lập báo cáo",
    "Adobe Premiere",
    "After Effects",
    "Quay phim cơ bản",
    "Dự toán G8 hoặc Eta",
    "Thiết kế MEP",
    "Đọc bản vẽ kỹ thuật",
    "Am hiểu hệ thống điện công nghiệp",
    "Kỹ năng lưu trữ hồ sơ",
    "Biết đọc bản vẽ là lợi thế",
    "Khai báo hải quan",
    "Phần mềm ECUS",
    "Quy trình xuất nhập khẩu",
    "Kiến thức về vận tải biên mậu",
    "Giao tiếp tiếng Trung là lợi thế",
    "Kế toán tổng hợp",
    "IFRS",
    "Phần mềm kế toán MISA hoặc tương đương",
    "Hiểu biết sản phẩm tài chính",
    "Sử dụng nền tảng tư vấn trực tuyến (Zoom, MS Teams)",
    "CRM, quản lý dữ liệu khách hàng",
    "Google Workspace / MS Office",
    "Tổng hợp và phân tích dữ liệu",
    "Quy trình mở tài khoản, xử lý tiền mặt",
    "Sử dụng ứng dụng ngân hàng số",
    "Kế toán tài sản cố định",
    "Quản lý vận hành nội bộ",
    "Quy trình mua sắm, đấu thầu",
    "Tài chính doanh nghiệp",
    "Đánh giá hồ sơ tín dụng",
    "Kỹ thuật phân tích tài chính",
    "Thẩm định tín dụng",
    "Tư vấn tài chính cá nhân",
    "Django/Flask",
    "Viết test case",
    "SQL cơ bản",
    "Kiểm thử thủ công",
    "Test case design",
    "JIRA/TestRail",
    "Automation testing là lợi thế",
    "Phân tích tín dụng",
    "Excel/CRM",
    "Nghiệp vụ ngân hàng",
    "Hệ thống core banking",
    "Hiểu biết tiêu chuẩn WHO-GMP",
    "Phân tích mẫu",
    "Hiểu biết về dược phẩm",
    "Lái xe container",
    "Bảo dưỡng xe cơ bản",
    "Hiểu biết luật giao thông",
    "Hiểu biết thị trường vốn",
    "Bloomberg Terminal",
    "Python cơ bản",
    "Vận hành máy may công nghiệp",
    "Kỹ thuật may cơ bản",
    "Hiểu biết quy trình dệt may",
    "Kế toán sản xuất",
    "Phần mềm kế toán (MISA)",
    "Machine Learning",
    "Xử lý dữ liệu lớn",
    "Lập trình nhúng",
    "IoT protocols (MQTT, CoAP)",
    "C/C++",
    "Agile/Scrum",
    "Hiểu biết công nghệ AI/IoT",
    "Kỹ năng giao dịch ngân hàng",
    "Excel cơ bản",
    "Quản lý sản phẩm",
    "Hiểu biết công nghệ ngân hàng",
    "Bảo trì tua-bin gió",
    "Hệ thống SCADA",
    "Hiểu biết sản phẩm điện máy",
    "Sử dụng POS",
    "Quản lý bán lẻ",
    "Lập kế hoạch kinh doanh",
    "Kiểm toán",
    "React.js",
    "JavaScript",
    "Viết nội dung",
    "Quản lý mạng xã hội",
    "Sản xuất nội dung",
    "Chỉnh sửa video (Premiere, Canva)",
    "Phân tích dữ liệu (Google Analytics)",
    "Giám sát xây dựng",
    "Quản lý công trình",
    "Lập kế hoạch thi công",
    "Hiểu biết luật xây dựng",
    "Giảng dạy Tiếng Anh",
    "Sử dụng nền tảng học trực tuyến",
    "Kỹ năng sư phạm",
    "Giảng dạy Toán",
    "Hiểu biết về ô tô Mazda",
    "Quản lý bán hàng",
    "Hiểu biết thị trường ô tô",
    "Hiểu biết logistics",
    "Quản lý chất lượng",
    "Hiểu biết sản phẩm bảo hiểm",
    "Kỹ năng bán bảo hiểm",
    "Phân tích nhu cầu khách hàng",
    "Hiểu biết sản phẩm ngân hàng",
    "Tư vấn tài chính doanh nghiệp",
    "Lập trình (Java, Python, C++)",
    "Kiến trúc phần mềm",
    "Cloud (AWS, Azure)",
    "Quản lý dự án (Agile, Scrum)",
    "Lập kế hoạch dự án",
    "Hiểu biết công nghệ IT",
    "Phần mềm kế toán (SAP, MISA)",
  ],
  personal_traits: [
    "Kỷ luật",
    "Tổ chức tốt",
    "Trách nhiệm",
    "Cẩn thận",
    "Tự tin",
    "Chịu áp lực tốt",
    "Chủ động",
    "Tư duy chiến lược",
    "Thẩm mỹ tốt",
    "Chịu được áp lực công việc",
    "Chịu áp lực công việc",
    "Chịu trách nhiệm",
    "Kỹ năng tổ chức",
    "Chịu được áp lực",
    "Sáng tạo",
    "Tận tâm",
    "Nhiệt tình",
    "Kiên nhẫn",
    "Chú ý đến chi tiết",
    "Chịu áp lực",
    "Làm việc nhóm tốt",
    "Tinh thần làm việc nhóm",
    "Thân thiện",
    "Tỉ mỉ",
    "Thẩm mỹ cao",
    "Tổ chức",
    "Tinh thần trách nhiệm",
    "Tinh thần cầu tiến",
    "Làm việc độc lập",
    "Chuyên nghiệp",
    "Tính cẩn thận",
    "Chịu áp lực cao",
    "Khả năng truyền đạt",
    "Năng động",
    "Khả năng làm việc dưới cường độ cao",
    "Trung thực",
    "Tinh thần trách nhiệm cao",
    "Tính trung thực",
    "Chịu khó",
    "Ham học hỏi",
    "Kiên trì",
    "Có trách nhiệm cao",
    "Khả năng thích ứng",
    "Nhiệt huyết",
    "Chăm chỉ",
    "Linh hoạt",
    "Quyết đoán",
    "Trách nhiệm cao",
    "Chi tiết",
    "Tinh thần học hỏi",
    "Kỹ năng làm việc độc lập",
    "Cầu tiến",
    "Chính xác",
    "Tư duy dịch vụ",
    "Tư duy hệ thống",
    "Kỹ lưỡng",
    "Ngăn nắp",
    "Chủ động học hỏi",
    "Cẩn trọng",
    "Nhạy bén thương mại",
    "Độc lập",
    "Học hỏi nhanh",
    "Chú ý chi tiết",
    "Đam mê sáng tạo",
    "Tư duy phân tích",
    "Đam mê giảng dạy",
    "Nhanh nhẹn",
    "Tư duy khách hàng",
  ],
  industry_interest: [
    "Logistics",
    "Công nghệ thông tin",
    "Sản xuất",
    "Thương mại điện tử",
    "Tài chính",
    "Bán lẻ",
    "Xuất nhập khẩu",
    "Vận tải",
    "Kho vận",
    "Quản lý chuỗi cung ứng",
    "Phát triển phần mềm",
    "Phân tích dữ liệu",
    "Trí tuệ nhân tạo",
    "An ninh mạng",
    "Công nghệ Blockchain",
    "Công nghệ IoT",
    "Công nghệ Cloud",
    "Công nghệ AR/VR",
    "Công nghệ Mobile",
    "Công nghệ Web",
    "Game",
    "EdTech",
    "HealthTech",
    "Fintech",
    "Robotics",
  ],
  field_interest: [
    "Logistics",
    "Giao nhận",
    "Kho vận",
    "Vận tải",
    "Quản lý chuỗi cung ứng",
    "Phân tích dữ liệu",
    "Phát triển phần mềm",
    "Quản lý dự án",
    "Tư vấn",
    "Nghiên cứu",
    "Kiểm thử phần mềm",
    "Lập trình Web",
    "Lập trình Mobile",
    "Lập trình nhúng",
    "Lập trình Game",
    "Thiết kế UI/UX",
    "Quản trị hệ thống",
    "Quản trị mạng",
    "Khoa học dữ liệu",
    "Machine Learning",
    "Deep Learning",
    "DevOps",
    "Cloud Computing",
    "Blockchain",
    "IoT",
    "AR/VR",
    "An ninh mạng",
    "Tự động hóa",
    "Big Data",
    "AI",
    "ERP",
    "GIS",
  ],
  language_levels: [
    "Tiếng Anh cơ bản",
    "Tiếng Anh - IELTS < 6.0",
    "Tiếng Anh - IELTS 7.0 - 8.0",
    "Tiếng Anh - IELTS > 8.0",
    "Tiếng Nhật - N1",
    "Tiếng Nhật - N2",
    "Tiếng Nhật - N3",
    "Tiếng Nhật - N4",
    "Tiếng Nhật - N5",
    "Tiếng Trung - HSK 1",
    "Tiếng Trung - HSK 2",
    "Tiếng Trung - HSK 3",
    "Tiếng Trung - HSK 4",
    "Tiếng Trung - HSK 5",
    "Tiếng Trung - HSK 6",
    "Tiếng Hàn - TOPIK 1",
    "Tiếng Hàn - TOPIK 2",
    "Tiếng Hàn - TOPIK 3",
    "Tiếng Hàn - TOPIK 4",
    "Tiếng Hàn - TOPIK 5",
    "Tiếng Hàn - TOPIK 6",
  ],
};

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    university: "",
    graduation_year: "",
    majors: [],
    skills: [],
    personal_traits: [],
    working_type_preference: "",
    working_mode_preference: "",
    salary_expectation: "",
    industry_interest: [],
    language_level: "",
    field_interest: [],
  });

  // State for temporary input values
  const [tempInputs, setTempInputs] = useState({
    major: "",
    skill: "",
    trait: "",
    industry: "",
    field: "",
    university: "",
  });

  const [suggestions, setSuggestions] = useState({
    major: [],
    skill: [],
    trait: [],
    industry: [],
    field: [],
    university: [],
  });

  // Create separate refs for each field
  const majorRef = useRef(null);
  const skillRef = useRef(null);
  const traitRef = useRef(null);
  const industryRef = useRef(null);
  const fieldRef = useRef(null);
  const universityRef = useRef(null);

  // Add click outside handler for each field
  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = {
        major: majorRef,
        skill: skillRef,
        trait: traitRef,
        industry: industryRef,
        field: fieldRef,
        university: universityRef,
      };

      Object.entries(refs).forEach(([field, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setSuggestions(prev => ({
            ...prev,
            [field]: []
          }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [toastVisible, setToastVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile("user01");
        setFormData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTempInputChange = (e) => {
    const { name, value } = e.target;
    setTempInputs({
      ...tempInputs,
      [name]: value,
    });

    // Update suggestions based on input
    const fieldMap = {
      major: "majors",
      skill: "skills",
      trait: "personal_traits",
      industry: "industry_interest",
      field: "field_interest",
      university: "universities",
    };

    const suggestions = PREDEFINED_OPTIONS[fieldMap[name]]
      .filter(
        (option) =>
          option.toLowerCase().includes(value.toLowerCase()) &&
          !formData[fieldMap[name]]?.includes(option)
      )
      .slice(0, 5);

    setSuggestions((prev) => ({
      ...prev,
      [name]: suggestions,
    }));
  };

  const handleAddItem = (field, tempField) => {
    if (tempInputs[tempField].trim()) {
      setFormData({
        ...formData,
        [field]: [...formData[field], tempInputs[tempField].trim()],
      });
      setTempInputs({
        ...tempInputs,
        [tempField]: "",
      });
      setSuggestions((prev) => ({
        ...prev,
        [tempField]: [],
      }));
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleSuggestionClick = (field, tempField, suggestion) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], suggestion],
    });
    setTempInputs({
      ...tempInputs,
      [tempField]: "",
    });
    setSuggestions((prev) => ({
      ...prev,
      [tempField]: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData.id, formData);
      setSuccessMessage("Cập nhật hồ sơ thành công!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1700); // bắt đầu ẩn
      setTimeout(() => setSuccessMessage(""), 2200); // xóa hẳn sau khi ẩn
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserProfile(formData.id);
      console.log("Profile deleted successfully");
      setFormData({
        id: "",
        name: "",
        university: "",
        graduation_year: "",
        majors: [],
        skills: [],
        personal_traits: [],
        working_type_preference: "",
        working_mode_preference: "",
        salary_expectation: "",
        industry_interest: [],
        language_level: "",
        field_interest: [],
      });
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className="profile-form-container">
      {successMessage && (
        <div
          className={`profile-form-toast${!toastVisible ? " toast-hide" : ""}`}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.15" />
            <path
              d="M7 13l3 3 7-7"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {successMessage}
        </div>
      )}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <img src={defaultAvatar} alt="Profile" />
          </div>
          <div className="profile-details">
            <h2>Thông tin cá nhân</h2>
            <p>{formData.university}</p>
          </div>
        </div>
        <button className="sign-out-button">Đăng xuất</button>
      </div>

      <form onSubmit={handleSubmit}>
        <section className="form-section">
          <h3>Thông tin cá nhân</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Họ tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="university">Trường đại học</label>
              <div className="array-input-group" ref={universityRef}>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={tempInputs.university}
                  onChange={handleTempInputChange}
                  placeholder="Nhập hoặc chọn trường đại học"
                />
                {suggestions.university.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.university.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            university: suggestion,
                          });
                          setTempInputs({
                            ...tempInputs,
                            university: suggestion,
                          });
                          setSuggestions((prev) => ({
                            ...prev,
                            university: [],
                          }));
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="graduation_year">Năm tốt nghiệp</label>
              <select
                id="graduation_year"
                name="graduation_year"
                value={formData.graduation_year}
                onChange={handleChange}
              >
                <option value="">-- Chọn năm --</option>
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3>Thông tin học vấn và kỹ năng</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Chuyên ngành</label>
              <div className="array-input-group" ref={majorRef}>
                <input
                  type="text"
                  name="major"
                  value={tempInputs.major}
                  onChange={handleTempInputChange}
                  placeholder="Nhập hoặc chọn chuyên ngành"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem("majors", "major")}
                >
                  +
                </button>
                {suggestions.major.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.major.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() =>
                          handleSuggestionClick("majors", "major", suggestion)
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="array-items">
                {formData.majors.map((major, index) => (
                  <div key={index} className="array-item">
                    <span>{major}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("majors", index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Kỹ năng</label>
              <div className="array-input-group" ref={skillRef}>
                <input
                  type="text"
                  name="skill"
                  value={tempInputs.skill}
                  onChange={handleTempInputChange}
                  placeholder="Nhập hoặc chọn kỹ năng"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem("skills", "skill")}
                >
                  +
                </button>
                {suggestions.skill.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.skill.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() =>
                          handleSuggestionClick("skills", "skill", suggestion)
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="array-items">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="array-item">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("skills", index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tính cách</label>
              <div className="array-input-group" ref={traitRef}>
                <input
                  type="text"
                  name="trait"
                  value={tempInputs.trait}
                  onChange={handleTempInputChange}
                  placeholder="Nhập hoặc chọn tính cách"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem("personal_traits", "trait")}
                >
                  +
                </button>
                {suggestions.trait.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.trait.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() =>
                          handleSuggestionClick(
                            "personal_traits",
                            "trait",
                            suggestion
                          )
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="array-items">
                {formData.personal_traits.map((trait, index) => (
                  <div key={index} className="array-item">
                    <span>{trait}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("personal_traits", index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3>Mục tiêu nghề nghiệp</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="working_type_preference">
                Loại hình làm việc
              </label>
              <select
                id="working_type_preference"
                name="working_type_preference"
                value={formData.working_type_preference}
                onChange={handleChange}
              >
                <option value="">-- Chọn loại hình --</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="working_mode_preference">
                Hình thức làm việc
              </label>
              <select
                id="working_mode_preference"
                name="working_mode_preference"
                value={formData.working_mode_preference}
                onChange={handleChange}
              >
                <option value="">-- Chọn hình thức --</option>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary_expectation">Mức lương mong muốn</label>
              <select
                id="salary_expectation"
                name="salary_expectation"
                value={formData.salary_expectation}
                onChange={handleChange}
              >
                <option value="">-- Chọn mức lương --</option>
                <option value="0 - 1,000,000 VND">0 - 1,000,000 VND</option>
                <option value="1,000,000 - 3,000,000 VND">
                  1,000,000 - 3,000,000 VND
                </option>
                <option value="3,000,000 - 5,000,000 VND">
                  3,000,000 - 5,000,000 VND
                </option>
                <option value="5,000,000 - 7,000,000 VND">
                  5,000,000 - 7,000,000 VND
                </option>
                <option value="7,000,000+ VND">7,000,000+ VND</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h3>Sở thích và ngôn ngữ</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Lĩnh vực quan tâm</label>
              <div className="array-input-group" ref={industryRef}>
                <input
                  type="text"
                  name="industry"
                  value={tempInputs.industry}
                  onChange={handleTempInputChange}
                  placeholder="Nhập hoặc chọn lĩnh vực quan tâm"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem("industry_interest", "industry")}
                >
                  +
                </button>
                {suggestions.industry.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.industry.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() =>
                          handleSuggestionClick(
                            "industry_interest",
                            "industry",
                            suggestion
                          )
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="array-items">
                {formData.industry_interest.map((industry, index) => (
                  <div key={index} className="array-item">
                    <span>{industry}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem("industry_interest", index)
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Lĩnh vực chuyên môn</label>
              <div className="array-input-group" ref={fieldRef}>
                <input
                  type="text"
                  name="field"
                  value={tempInputs.field}
                  onChange={handleTempInputChange}
                  placeholder="Nhập hoặc chọn lĩnh vực chuyên môn"
                />
                <button
                  type="button"
                  onClick={() => handleAddItem("field_interest", "field")}
                >
                  +
                </button>
                {suggestions.field.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.field.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() =>
                          handleSuggestionClick(
                            "field_interest",
                            "field",
                            suggestion
                          )
                        }
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="array-items">
                {formData.field_interest.map((field, index) => (
                  <div key={index} className="array-item">
                    <span>{field}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("field_interest", index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="language_level">Trình độ ngoại ngữ</label>
              <select
                id="language_level"
                name="language_level"
                value={formData.language_level}
                onChange={handleChange}
              >
                <option value="">-- Chọn trình độ --</option>
                {PREDEFINED_OPTIONS.language_levels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            Xóa tất cả
          </button>
          <button type="submit" className="submit-button">
            Xác nhận
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
