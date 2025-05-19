import { useState, useEffect } from "react";
import "./CompaniesPage.css";
import msbLogo from "../assets/logos/msb-logo.svg";
import upbaseLogo from "../assets/logos/upbase-logo.svg";
import Header from "../components/Header/Header";
import { Link } from "react-router-dom";
import { getAllCompanies, getMatchCompanies } from "../api/companyAPI";

const CompaniesPage = () => {
  const [filters, setFilters] = useState({
    skills: [],
    languages: [],
    workingTime: "",
    workType: "",
    experience: "",
  });

  const [companies, setCompanies] = useState([]);
  const [matchedCompanies, setMatchedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [showAllMatched, setShowAllMatched] = useState(false);
  const [showMatchedSection, setShowMatchedSection] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
    fetchMatchedCompanies();
  }, [pagination.currentPage]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getAllCompanies(pagination.currentPage);
      setCompanies(response.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalCount: response.totalCount,
      }));
    } catch (error) {
      setError("Failed to fetch companies");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchedCompanies = async () => {
    try {
      const response = await getMatchCompanies();
      if (response.success) {
        setMatchedCompanies(response.data);
      }
    } catch (error) {
      console.error("Error fetching matched companies:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${pagination.currentPage === i ? "active" : ""
            }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  // Hàm lấy giá trị filter từ UI
  const getFilterValues = () => {
    const salary = Array.from(document.querySelectorAll('input[name="salary"]:checked')).map(el => el.value);
    const workingMode = Array.from(document.querySelectorAll('input[name="workingMode"]:checked')).map(el => el.value);
    const language = Array.from(document.querySelectorAll('input[name="language"]:checked')).map(el => el.value);
    const workingType = Array.from(document.querySelectorAll('input[name="workingType"]:checked')).map(el => el.value);
    return { salary, workingMode, language, workingType };
  };

  // Hàm lọc công ty
  const filterCompanies = () => {
    const { salary, workingMode, language, workingType } = getFilterValues();
    let result = companies;
    if (salary.length > 0) {
      result = result.filter(company =>
        company.recruitment?.jobs?.some(job => {
          if (!job.salary) return false;
          const salaryStr = job.salary.replace(/[^\d\-]/g, '');
          const [min, max] = salaryStr.split('-').map(s => parseInt(s.trim()));
          return salary.some(range => {
            if (range === '0 - 1,000,000 VND') return min <= 1000000;
            if (range === '1,000,000 - 3,000,000 VND') return min >= 1000000 && max <= 3000000;
            if (range === '3,000,000 - 5,000,000 VND') return min >= 3000000 && max <= 5000000;
            if (range === '5,000,000 - 7,000,000 VND') return min >= 5000000 && max <= 7000000;
            if (range === '7,000,000+ VND') return min >= 7000000;
            return false;
          });
        })
      );
    }
    if (workingMode.length > 0) {
      result = result.filter(company =>
        company.recruitment?.jobs?.some(job =>
          workingMode.includes(job.working_mode)
        )
      );
    }
    if (language.length > 0) {
      result = result.filter(company =>
        company.recruitment?.jobs?.some(job =>
          language.some(lan => job.language_requirement && job.language_requirement.includes(lan))
        )
      );
    }
    if (workingType.length > 0) {
      result = result.filter(company =>
        company.recruitment?.jobs?.some(job =>
          workingType.includes(job.working_type)
        )
      );
    }
    setFilteredCompanies(result);
  };

  // Khi nhấn nút Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setShowMatchedSection(false);
    filterCompanies();
    setTimeout(() => {
      const resultSection = document.getElementById('search-result-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          window.scrollBy({ top: -150, left: 0, behavior: 'smooth' });
        }, 400);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="companies-page">
      <Header />
      <div className="companies-header">
        <h1>
          Không chỉ <span className="highlight">tìm việc</span> – hãy chọn nơi{" "}
          <span className="highlight">xứng đáng</span>
        </h1>
        <p>
          Khám phá những chia sẻ thật từ cộng đồng người đi làm để có lựa chọn
          đúng đắn
        </p>
      </div>
      <div className="companies-content">
        <div className="filters-sidebar">
          <h2 className="sidebar-title">Lọc tìm kiếm</h2>
          <div className="filter-section">
            <h3>Ngoại ngữ</h3>
            <div className="filter-options">
              <label><input type="checkbox" name="language" value="Tiếng Anh" /> Tiếng Anh</label>
              <label><input type="checkbox" name="language" value="Tiếng Nhật" /> Tiếng Nhật</label>
              <label><input type="checkbox" name="language" value="Tiếng Pháp" /> Tiếng Pháp</label>
              <label><input type="checkbox" name="language" value="Không yêu cầu" /> Không yêu cầu</label>
            </div>
          </div>
          <div className="filter-section">
            <h3>Thời lượng làm việc</h3>
            <div className="filter-options">
              <label>
                <input type="radio" name="workingTime" value="less20" /> {"<"}{" "}
                20h/tuần
              </label>
              <label>
                <input type="radio" name="workingTime" value="20-30" /> 20 -
                30h/tuần
              </label>
              <label>
                <input type="radio" name="workingTime" value="more30" /> {">"}{" "}
                30h/tuần
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Mức lương</h3>
            <div className="filter-options">
              <label><input type="checkbox" name="salary" value="0 - 1,000,000 VND" />  0 - 1,000,000 VND</label>
              <label><input type="checkbox" name="salary" value="1,000,000 - 3,000,000 VND" />  1,000,000 - 3,000,000 VND</label>
              <label><input type="checkbox" name="salary" value="3,000,000 - 5,000,000 VND" />  3,000,000 - 5,000,000 VND</label>
              <label><input type="checkbox" name="salary" value="5,000,000 - 7,000,000 VND" />  5,000,000 - 7,000,000 VND</label>
              <label><input type="checkbox" name="salary" value="7,000,000+ VND" />  7,000,000+ VND</label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Hình thức làm việc</h3>
            <div className="filter-options">
              <label><input type="checkbox" name="workingMode" value="Offline" /> Offline</label>
              <label><input type="checkbox" name="workingMode" value="Online" /> Online</label>
            </div>
          </div>

          <div className="filter-section">
            <h3>Loại hình công việc</h3>
            <div className="filter-options">
              <label><input type="checkbox" name="workingType" value="Full-time" /> Full-time</label>
              <label><input type="checkbox" name="workingType" value="Part-time" /> Part-time</label>
            </div>
          </div>
          <button className="search-btn" onClick={handleSearch}>Tìm kiếm</button>
        </div>
        <div className="companies-list">
          <div className="companies-list-header">
            <h2
              style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}
              onClick={() => setShowMatchedSection((prev) => !prev)}
            >
              Dành cho bạn
              <span className={`collapse-arrow${showMatchedSection ? ' open' : ''}`} style={{ marginLeft: 8, transition: 'transform 0.3s' }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 8L10 12L14 8" stroke="#3366FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </h2>
            <select className="sort-dropdown">
              <option value="relevant">Sắp xếp theo</option>
              <option value="newest">Mới nhất</option>
              <option value="salary">Lương cao nhất</option>
            </select>
          </div>
          <div className={`companies-grid collapse-content${showMatchedSection ? ' open' : ''}`}
            style={{ maxHeight: showMatchedSection ? 2000 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)' }}
          >
            {showMatchedSection && (
              (showAllMatched
                ? matchedCompanies.slice(0, 5)
                : matchedCompanies.slice(0, 3)
              ).map((company) => (
                <div key={company.id} className="company-card">
                  <div className="company-logo">
                    <img src={company.logo || msbLogo} alt={company.name} />
                  </div>
                  <div className="company-info">
                    <h3>
                      <Link to={`/companies/${company.id}`}>{company.name}</Link>
                    </h3>
                    <a href="#" className="job-title-link">
                      {company.recruitment?.jobs?.[0]?.title ||
                        "Vị trí đang tuyển"}
                    </a>
                    <div className="company-details">
                      <span>{company.location || "Hà Nội"}</span>
                      <span>
                        {company.recruitment?.jobs?.[0]?.type || "Toàn thời gian"}
                      </span>
                      <span>
                        {company.recruitment?.jobs?.[0]?.salary || "Thỏa thuận"}
                      </span>
                      <span>1 ngày trước</span>
                    </div>
                    <p className="company-description">
                      {company.description || "Không có mô tả"}
                    </p>
                    <div className="match-info">
                      <span className="match-score">
                        Độ phù hợp: {company.matchScore}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            {matchedCompanies.length > 3 && !showAllMatched && showMatchedSection && (
              <button
                className="show-more-btn"
                onClick={() => setShowAllMatched(true)}
                style={{ margin: "0 auto", display: "block", marginTop: "1rem" }}
              >
                Xem thêm
              </button>
            )}
          </div>
          <div className="companies-list-header popular" id="search-result-section">
            <h2>{isSearching ? 'Kết quả tìm kiếm' : 'Tất cả công ty'}</h2>
          </div>
          <div className="companies-grid">
            {(isSearching ? filteredCompanies : companies).length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0', fontSize: '1.1rem' }}>
                Không có công ty phù hợp
              </div>
            ) : (
              (isSearching ? filteredCompanies : companies).map((company) => (
                <div key={company.id} className="company-card">
                  <div className="company-logo">
                    <img src={company.logo || msbLogo} alt={company.name} />
                  </div>
                  <div className="company-info">
                    <h3>
                      <Link to={`/companies/${company.id}`}>{company.name}</Link>
                    </h3>
                    <a href="#" className="job-title-link">
                      {company.recruitment?.jobs?.[0]?.title ||
                        "Vị trí đang tuyển"}
                    </a>
                    <div className="company-details">
                      <span>{company.location || "Hà Nội"}</span>
                      <span>
                        {company.recruitment?.jobs?.[0]?.type || "Toàn thời gian"}
                      </span>
                      <span>
                        {company.recruitment?.jobs?.[0]?.salary || "Thỏa thuận"}
                      </span>
                      <span>1 ngày trước</span>
                    </div>
                    <p className="company-description">
                      {company.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="pagination">{renderPagination()}</div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
