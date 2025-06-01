import axios from 'axios';
import API_BASE_URL from "./config";

export const getAllCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`);
    return {
      data: response.data,
      totalCount: response.data.length,
      totalPages: Math.ceil(response.data.length / 10)
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getMatchCompanies = async (userId = '007') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/match-companies/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching matched companies:', error);
    throw error;
  }
}; 