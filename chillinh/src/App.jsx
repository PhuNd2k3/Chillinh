import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./pages/UserList";

function App() {
  return (
    <Router>
      <div>
        <h1>Quản lý người dùng (Vite + JSON Server)</h1>
        <Routes>
          <Route path="/" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
