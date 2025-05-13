import { useState } from 'react';
import './CompaniesPage.css';
import msbLogo from '../assets/logos/msb-logo.svg';
import upbaseLogo from '../assets/logos/upbase-logo.svg';
import Header from '../components/Header/Header';
import { Link } from 'react-router-dom';

const CompaniesPage = () => {
    const [filters, setFilters] = useState({
        skills: [],
        languages: [],
        workingTime: '',
        workType: '',
        experience: ''
    });

    const mockCompanies = [
        {
            id: 1,
            logo: msbLogo,
            name: "Ngân hàng TMCP Hàng Hải Việt Nam (MSB)",
            position: "Chuyên Viên Chính Xử Lý Nợ Cá Nhân",
            location: "Hà Nội",
            type: "Toàn thời gian",
            salary: "15 triệu",
            isNegotiable: true,
            description: "Ngân Hàng Thương mại Cổ phần Hàng Hải Việt Nam (MSB)được thành lập từ năm 1991. Trải qua 32 năm kinh thành và phát triển, mang trong mình sứ mệnh..."
        },
        {
            id: 2,
            logo: upbaseLogo,
            name: "Công ty Công nghệ Cổ phần UPBASE",
            position: "Data Scientist",
            location: "Hà Nội",
            type: "Toàn thời gian",
            salary: "25 triệu",
            isNegotiable: true,
            description: "UPBASE là một E-commerce Enabler hàng đầu tại Việt Nam, với mục tiêu \"Unified Care\" cùng các đối tác phát triển trên nền tảng TMĐT mang lại trải nghiệm tốt nhất cho người dùng cuối."
        }
    ];

    const mockPopular = [
        {
            id: 3,
            logo: msbLogo,
            name: "Công ty Cổ phần MISA",
            position: "Business Analyst",
            location: "Hà Nội",
            type: "Toàn thời gian",
            salary: "10 triệu",
            isNegotiable: true,
            posted: "1 ngày trước",
            description: "Trong suốt hành trình gần 30 năm hình thành, MISA luôn là thương hiệu hàng đầu Việt Nam cung cấp giải pháp công nghệ số..."
        },
        {
            id: 4,
            logo: upbaseLogo,
            name: "Công ty Công nghệ Cổ phần UPBASE",
            position: "Data Analyst Intern",
            location: "Hà Nội",
            type: "Toàn thời gian",
            salary: "8 triệu",
            isNegotiable: true,
            posted: "1 ngày trước",
            description: "UPBASE là một E-commerce Enabler hàng đầu tại Việt Nam, với mục tiêu 'Unified Care' cùng các đối tác phát triển trên nền tảng TMĐT..."
        }
    ];

    return (
        <div className="companies-page">
            <Header />
            <div className="companies-header">
                <h1>Không chỉ <span className="highlight">tìm việc</span> – hãy chọn nơi <span className="highlight">xứng đáng</span></h1>
                <p>Khám phá những chia sẻ thật từ cộng đồng người đi làm để có lựa chọn đúng đắn</p>
            </div>
            <div className="companies-content">
                <div className="filters-sidebar">
                    <h2 className="sidebar-title">Lọc tìm kiếm</h2>
                    <div className="filter-section">
                        <h3>Yêu cầu kỹ năng</h3>
                        <div className="filter-options">
                            <label><input type="checkbox" value="AutoCAD" /> AutoCAD</label>
                            <label><input type="checkbox" value="SolidWorks" /> SolidWorks</label>
                            <label><input type="checkbox" value="Python" /> Python</label>
                            <label><input type="checkbox" value="SAP" /> SAP</label>
                            <label><input type="checkbox" value="Excel" /> Excel</label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Yêu cầu ngoại ngữ</h3>
                        <div className="filter-options">
                            <label><input type="checkbox" value="none" /> Không yêu cầu</label>
                            <label><input type="checkbox" value="english" /> Tiếng Anh</label>
                            <label><input type="checkbox" value="japanese" /> Tiếng Nhật</label>
                            <label><input type="checkbox" value="french" /> Tiếng Pháp</label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Thời lượng làm việc</h3>
                        <div className="filter-options">
                            <label><input type="radio" name="workingTime" value="less20" /> {'<'} 20h/tuần</label>
                            <label><input type="radio" name="workingTime" value="20-30" /> 20 - 30h/tuần</label>
                            <label><input type="radio" name="workingTime" value="more30" /> {'>'} 30h/tuần</label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Hình thức làm việc</h3>
                        <div className="filter-options">
                            <label><input type="radio" name="workType" value="remote" /> Làm từ xa</label>
                            <label><input type="radio" name="workType" value="hybrid" /> Bán thời gian</label>
                            <label><input type="radio" name="workType" value="office" /> Làm tại văn phòng</label>
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Đánh giá trung bình</h3>
                        <div className="filter-options">
                            <label><input type="radio" name="rating" value="1" /> 1 - 2 sao</label>
                            <label><input type="radio" name="rating" value="2" /> 2 - 3 sao</label>
                            <label><input type="radio" name="rating" value="3" /> 3 - 4 sao</label>
                            <label><input type="radio" name="rating" value="4" /> 4 - 5 sao</label>
                        </div>
                    </div>
                    <button className="search-btn">Tìm kiếm</button>
                </div>
                <div className="companies-list">
                    <div className="companies-list-header">
                        <h2>Dành cho bạn</h2>
                        <select className="sort-dropdown">
                            <option value="relevant">Sắp xếp theo</option>
                            <option value="newest">Mới nhất</option>
                            <option value="salary">Lương cao nhất</option>
                        </select>
                    </div>
                    <div className="companies-grid">
                        {mockCompanies.map(company => (
                            <div key={company.id} className="company-card">
                                <div className="company-logo">
                                    <img src={company.logo} alt={company.name} />
                                </div>
                                <div className="company-info">
                                    <h3><Link to={`/companies/${company.id}`}>{company.name}</Link></h3>
                                    <a href="#" className="job-title-link">{company.position}</a>
                                    <div className="company-details">
                                        <span>{company.location}</span>
                                        <span>{company.type}</span>
                                        <span>{company.salary} {company.isNegotiable && '(Thỏa thuận)'}</span>
                                        <span>{company.posted || '1 ngày trước'}</span>
                                    </div>
                                    <p className="company-description">{company.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="companies-list-header popular">
                        <h2>Phổ biến</h2>
                        <select className="sort-dropdown">
                            <option value="relevant">Sắp xếp theo</option>
                            <option value="newest">Mới nhất</option>
                            <option value="salary">Lương cao nhất</option>
                        </select>
                    </div>
                    <div className="companies-grid">
                        {mockPopular.map(company => (
                            <div key={company.id} className="company-card">
                                <div className="company-logo">
                                    <img src={company.logo} alt={company.name} />
                                </div>
                                <div className="company-info">
                                    <h3><Link to={`/companies/${company.id}`}>{company.name}</Link></h3>
                                    <a href="#" className="job-title-link">{company.position}</a>
                                    <div className="company-details">
                                        <span>{company.location}</span>
                                        <span>{company.type}</span>
                                        <span>{company.salary} {company.isNegotiable && '(Thỏa thuận)'}</span>
                                        <span>{company.posted}</span>
                                    </div>
                                    <p className="company-description">{company.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompaniesPage; 