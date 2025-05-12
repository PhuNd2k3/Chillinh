import { useState } from 'react';
import './ProfileForm.css';
import defaultAvatar from '../../assets/default-avatar.svg';

const ProfileForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        location: '',
        email: '',
        school: '',
        major: '',
        graduationYear: '',
        skills: '',
        language: '',
        desiredField: '',
        hoursPerWeek: '',
        internshipType: '',
        website: '',
        additionalInfo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Handle form submission here
    };

    const handleDelete = () => {
        // Handle profile deletion
        console.log("Profile deleted");
    };

    return (
        <div className="profile-form-container">
            <div className="profile-header">
                <div className="profile-info">
                    <div className="profile-avatar">
                        <img src={defaultAvatar} alt="Profile" />
                    </div>
                    <div className="profile-details">
                        <h2>Thông tin cá nhân</h2>
                        <p>Trường Công nghệ thông tin và Truyền thông</p>
                    </div>
                </div>
                <button className="sign-out-button">Đăng xuất</button>
            </div>

            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <h3>Thông tin cá nhân</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="fullName">Họ tên</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Ngày sinh</label>
                            <input
                                type="text"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                placeholder="DD/MM/YYYY"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="location">Địa chỉ</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h3>Thông tin học vấn</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="school">Trường học</label>
                            <select
                                id="school"
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn trường --</option>
                                <option value="HUST">Đại học Bách Khoa Hà Nội</option>
                                <option value="NEU">Đại học Kinh tế Quốc dân</option>
                                <option value="HANU">Đại học Hà Nội</option>
                                <option value="FTU">Đại học Ngoại thương</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="major">Ngành học</label>
                            <select
                                id="major"
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn ngành --</option>
                                <option value="IT">Công nghệ thông tin</option>
                                <option value="ME">Kỹ thuật cơ khí</option>
                                <option value="EE">Kỹ thuật điện</option>
                                <option value="CE">Kỹ thuật xây dựng</option>
                                <option value="BA">Quản trị kinh doanh</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="graduationYear">Năm tốt nghiệp</label>
                            <select
                                id="graduationYear"
                                name="graduationYear"
                                value={formData.graduationYear}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn năm --</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h3>Kỹ năng chuyên môn</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="skills">Kỹ năng kỹ thuật (nếu có)</label>
                            <select
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn kỹ năng --</option>
                                <option value="none">Không có</option>
                                <option value="autocad">AutoCAD</option>
                                <option value="matlab">Matlab</option>
                                <option value="java">Java</option>
                                <option value="solidworks">SolidWorks</option>
                                <option value="sap">SAP</option>
                                <option value="excel">Excel nâng cao</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="language">Trình độ ngôn ngữ (nếu có)</label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn trình độ --</option>
                                <option value="none">Không có</option>
                                <option value="english">Tiếng Anh - IELTS 6.0</option>
                                <option value="japanese">Tiếng Nhật - N3</option>
                                <option value="chinese">Tiếng Trung - HSK 4</option>
                                <option value="korean">Tiếng Hàn - TOPIK 4</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h3>Mục tiêu nghề nghiệp</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="desiredField">Ngành nghề mong muốn</label>
                            <select
                                id="desiredField"
                                name="desiredField"
                                value={formData.desiredField}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn ngành nghề --</option>
                                <option value="mechanical">Kỹ thuật cơ khí</option>
                                <option value="automation">Tự động hóa</option>
                                <option value="data">Phân tích dữ liệu</option>
                                <option value="accounting">Kế toán</option>
                                <option value="production">Quản lý sản xuất</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="hoursPerWeek">Số giờ/tuần có thể làm</label>
                            <select
                                id="hoursPerWeek"
                                name="hoursPerWeek"
                                value={formData.hoursPerWeek}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn số giờ --</option>
                                <option value="10">10 giờ/tuần</option>
                                <option value="20">20 giờ/tuần</option>
                                <option value="30">30 giờ/tuần</option>
                                <option value="40">40 giờ/tuần</option>
                                <option value="flexible">Linh hoạt</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="internshipType">Hình thức làm việc</label>
                            <input
                                type="text"
                                id="internshipType"
                                name="internshipType"
                                value={formData.internshipType}
                                onChange={handleChange}
                                placeholder="Ví dụ: Thực tập, toàn thời gian, từ xa..."
                            />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h3>Tùy chọn khác</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="website">Trang web</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="additionalInfo">Thông tin nổi bật</label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                            <button type="button" className="add-button">+</button>
                        </div>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="button" className="delete-button" onClick={handleDelete}>
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