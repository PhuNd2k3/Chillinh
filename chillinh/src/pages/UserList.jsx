import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header/Header";

const API = "http://localhost:3001/users";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  const addUser = async () => {
    if (!name.trim()) return;
    await axios.post(API, { name });
    setName("");
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <h2>Người dùng</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên mới"
      />
      <button onClick={addUser}>Thêm</button>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} <button onClick={() => deleteUser(u.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
