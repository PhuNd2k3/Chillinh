import axios from "axios";
import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/users`;

// 1. Lấy thông tin profile của user
export async function getUserProfile(userId) {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// 2. Cập nhật thông tin profile
export async function updateUserProfile(userId, profileData) {
    try {
        const response = await axios.put(`${API_URL}/${userId}`, profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

// 3. Xóa profile
export async function deleteUserProfile(userId) {
    try {
        const response = await axios.delete(`${API_URL}/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user profile:", error);
        throw error;
    }
} 