import { useState, useEffect } from "react";
import "./CompaniesPage.css";
import msbLogo from "../assets/logos/msb-logo.svg";
import upbaseLogo from "../assets/logos/upbase-logo.svg";
import logo1 from "../assets/logos/logo1.svg";
import logo2 from "../assets/logos/logo2.svg";
import logo3 from "../assets/logos/logo3.svg";
import logo4 from "../assets/logos/logo4.svg";
import logo5 from "../assets/logos/logo5.svg";
import Header from "../components/Header/Header";
import { Link } from "react-router-dom";
import { getAllCompanies, getMatchCompanies } from "../api/companyAPI";

const CompaniesPage = () => {
  const [filters, setFilters] = useState({
    salary: [],
    workingMode: [],
    language: [],
    workingType: []
  });

  const [allCompanies, setAllCompanies] = useState([]); // lưu toàn bộ danh sách
  const [companies, setCompanies] = useState([]); // danh sách hiển thị trang hiện tại
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
  const [selectedWorkingTime, setSelectedWorkingTime] = useState("");

  const COMPANIES_PER_PAGE = 10;

  useEffect(() => {
    fetchCompanies();
    fetchMatchedCompanies();
  }, []); // chỉ fetch 1 lần khi mount

  useEffect(() => {
    handlePaginationAndFiltering();
  }, [filters, pagination.currentPage, allCompanies]);

  useEffect(() => {
    // Reset currentPage về 1 khi filter thay đổi
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [filters]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await getAllCompanies();
      setAllCompanies(response.data);
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

    const handleChange = (e) => {
    setSelectedWorkingTime(e.target.value);
  };

    const clearSelection = () => {
      setSelectedWorkingTime("");
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

  const getFilterValues = () => {
    const salary = Array.from(document.querySelectorAll('input[name="salary"]:checked')).map(el => el.value);
    const workingMode = Array.from(document.querySelectorAll('input[name="workingMode"]:checked')).map(el => el.value);
    const language = Array.from(document.querySelectorAll('input[name="language"]:checked')).map(el => el.value);
    const workingType = Array.from(document.querySelectorAll('input[name="workingType"]:checked')).map(el => el.value);
    return { salary, workingMode, language, workingType };
  };

  function parseSalaryRange(rangeString) {
    if (!rangeString || typeof rangeString !== 'string') return null;
    const isTrieu = /triệu|trieu|TRIỆU|tr/i.test(rangeString);
    const isNghin = /nghìn|nghin|nghìn|nghìn/i.test(rangeString);
    if (rangeString.includes('+')) {
      let min = parseInt(rangeString.replace(/[^\d]/g, ''));
      if (isTrieu) min = min * 1_000_000;
      if (isNghin) min = min * 1_000;
      return { min, max: Infinity, display: rangeString };
    }
    const match = rangeString.match(/(\d{1,3}(?:[.,]\d{3})*)\s*-\s*(\d{1,3}(?:[.,]\d{3})*)/);
    if (match) {
      let min = parseInt(match[1].replace(/[^\d]/g, ''));
      let max = parseInt(match[2].replace(/[^\d]/g, ''));
      if (isTrieu) { min = min * 1_000_000; max = max * 1_000_000; }
      if (isNghin) { min = min * 1_000; max = max * 1_000; }
      return { min, max, display: rangeString };
    }
    // fallback: nếu chỉ có 1 số duy nhất
    const single = rangeString.match(/(\d{1,3}(?:[.,]\d{3})*)/);
    if (single) {
      let num = parseInt(single[1].replace(/[^\d]/g, ''));
      if (isTrieu) num = num * 1_000_000;
      if (isNghin) num = num * 1_000;
      return { min: num, max: num, display: rangeString };
    }
    return null;
  }

  const handlePaginationAndFiltering = () => {
    let filtered = allCompanies;
    if (filters.salary.length > 0) {
      filtered = filtered.filter(company => {
        const job = company.recruitment?.jobs?.[0];
        if (!job || !job.salary) return false;
        const salaryObj = parseSalaryRange(job.salary);
        if (!salaryObj) return false; // Nếu không phân tích được thì bỏ qua
        return filters.salary.some(range => {
          const filterObj = parseSalaryRange(range);
          if (!filterObj) return false;
          if (filterObj.max === Infinity) {
            return salaryObj.min >= filterObj.min;
          }
          return (
            (salaryObj.min <= filterObj.max && salaryObj.max >= filterObj.min)
          );
        });
      });
    }
    if (filters.workingMode.length > 0) {
      filtered = filtered.filter(company => {
        const job = company.recruitment?.jobs?.[0];
        return job && filters.workingMode.includes(job.working_mode);
      });
    }
    if (filters.language.length > 0) {
      filtered = filtered.filter(company => {
        const job = company.recruitment?.jobs?.[0];
        return job && filters.language.some(lan => job.language_requirement && job.language_requirement.includes(lan));
      });
    }
    if (filters.workingType.length > 0) {
      filtered = filtered.filter(company => {
        const job = company.recruitment?.jobs?.[0];
        return job && filters.workingType.includes(job.working_type);
      });
    }
    // Tính lại totalPages
    const totalPages = Math.max(1, Math.ceil(filtered.length / COMPANIES_PER_PAGE));
    let currentPage = pagination.currentPage > totalPages ? 1 : pagination.currentPage;
    setPagination(prev => ({
      ...prev,
      totalPages,
      totalCount: filtered.length,
      currentPage
    }));
    // Phân trang
    const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
    const endIndex = startIndex + COMPANIES_PER_PAGE;
    const paginatedCompanies = filtered.slice(startIndex, endIndex);
    setFilteredCompanies(filtered);
    setCompanies(paginatedCompanies);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: Math.max(1, Math.min(newPage, pagination.totalPages)),
    }));
    // Scroll lên đầu đoạn chữ 'Tất cả công ty' khi đổi trang
    setTimeout(() => {
      const resultSection = document.getElementById('search-result-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          window.scrollBy({ top: -900, left: 0, behavior: 'smooth' });
        }, 400);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  // Khi nhấn nút Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setShowMatchedSection(false);
    const newFilters = getFilterValues();
    setFilters(newFilters);
    // Scroll lên đầu đoạn chữ 'Tất cả công ty'
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

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${pagination.currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  // Tạo mảng logo mẫu
  const companyLogos = [msbLogo, upbaseLogo, logo1, logo2, logo3, logo4, logo5];
  // Hàm lấy random logo
  function getRandomLogo(companyId) {
    // Đảm bảo mỗi công ty luôn lấy cùng 1 logo random dựa trên id
    if (!companyId) return companyLogos[Math.floor(Math.random() * companyLogos.length)];
    let hash = 0;
    for (let i = 0; i < companyId.length; i++) {
      hash = companyId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % companyLogos.length;
    return companyLogos[idx];
  }

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
              <label><input type="checkbox" name="language" value="Tiếng Hàn" /> Tiếng Hàn</label>
              <label><input type="checkbox" name="language" value="Không yêu cầu" /> Không yêu cầu</label>
            </div>
          </div>
          <div className="filter-section">
            <div className="duy">
            <h3>Thời lượng làm việc</h3>
{selectedWorkingTime && (
                <button onClick={clearSelection} >
                <p>x</p>
                </button>
              )}
            </div>
            <div className="filter-options">
              <label>
                <input type="radio" name="workingTime" value="less20" onChange={handleChange} checked={selectedWorkingTime === "less20"}/> {"<"}{" "}
                20h/tuần
              </label>
              <label>
                <input type="radio" name="workingTime" value="20-30" onChange={handleChange} checked={selectedWorkingTime === "20-30"}/> 20 -
                30h/tuần
              </label>
              <label>
                <input type="radio" name="workingTime" value="more30" onChange={handleChange} checked={selectedWorkingTime === "more30"}/> {">"}{" "}
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
          </div>
          <div className={`companies-grid collapse-content${showMatchedSection ? ' open' : ''}`}
            style={{ maxHeight: showMatchedSection ? 2000 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1)' }}
          >
            {showMatchedSection && (
              <>
                {(showAllMatched
                  ? matchedCompanies.slice(0, 5)
                  : matchedCompanies.slice(0, 3)
                ).map((company) => (
                  <div key={company.id} className="company-card">
                    <div className="company-logo">
                      <img src={company.logo || getRandomLogo(company.id)} alt={company.name} />
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
                ))}
                {matchedCompanies.length > 3 && !showAllMatched && (
                  <button
                    className="show-more-btn"
                    onClick={() => setShowAllMatched(true)}
                    style={{ margin: "0 auto", display: "block", marginTop: "1rem" }}
                  >
                    Xem thêm
                  </button>
                )}
              </>
            )}
          </div>
          <div className="companies-list-header popular" id="search-result-section">
            <h2>{isSearching ? 'Kết quả tìm kiếm' : 'Tất cả công ty'}</h2>
          </div>
          <div className="companies-grid">
            {companies.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0', fontSize: '1.1rem' }}>
                Không có công ty phù hợp
              </div>
            ) : (
              companies.map((company) => (
                <div key={company.id} className="company-card">
                  <div className="company-logo">
                    <img src={company.logo || getRandomLogo(company.id)} alt={company.name} />
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
