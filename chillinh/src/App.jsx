import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./pages/UserList";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CompaniesPage from "./pages/CompaniesPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          {/* Add more routes as needed */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
