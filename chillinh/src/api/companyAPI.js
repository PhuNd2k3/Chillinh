import axios from 'axios';
import API_BASE_URL from "./config";


export const getAllCompanies = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies`, {
      params: {
        _page: page,
        _limit: limit,
        _sort: 'id',
        _order: 'desc'
      }
    });
    return {
      data: response.data,
      totalCount: parseInt(response.headers['x-total-count'] || '0'),
      currentPage: page,
      totalPages: Math.ceil(parseInt(response.headers['x-total-count'] || '0') / limit)
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