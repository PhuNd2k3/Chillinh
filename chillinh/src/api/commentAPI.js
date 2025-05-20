import axios from "axios";
import API_BASE_URL from "./config";

const API_URL = `${API_BASE_URL}/companies`;

// 1. Get reviews for a company
export async function getCompanyReviews(companyId) {
  try {
    const response = await axios.get(`${API_URL}/${companyId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error getting company reviews:", error);
    throw error;
  }
}

// 2. Thêm bình luận mới cho công ty
export async function addCompanyComment(companyId, commentObj) {
  try {
    const response = await axios.post(`${API_URL}/${companyId}/reviews`, commentObj);
    return response.data.reviews;
  } catch (error) {
    console.error("Error adding company comment:", error);
    throw error;
  }
}

// 3. Trả lời 1 comment đã viết của công ty
export async function replyToCompanyComment(companyId, reviewId, replyObj) {
  try {
    const response = await axios.post(
      `${API_URL}/${companyId}/reviews/${reviewId}/replies`, 
      replyObj
    );
    return response.data.reviews;
  } catch (error) {
    console.error("Error replying to company comment:", error);
    throw error;
  }
}

// 4. Vote for a review (upvote/downvote)
export async function voteForReview(companyId, reviewId, voteType) {
  try {
    const response = await axios.post(
      `${API_URL}/${companyId}/reviews/${reviewId}/vote`,
      { voteType }
    );
    return response.data;
  } catch (error) {
    console.error("Error voting for review:", error);
    throw error;
  }
}
