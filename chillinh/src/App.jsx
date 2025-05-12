import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserList from "./pages/UserList";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserList />} />
          
          
          {/* Add more routes as needed */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
