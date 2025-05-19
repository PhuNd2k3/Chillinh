import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/forum';

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createVote = async (postId, userId, type) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/votes`, {
      postId,
      userId,
      type
    });
    return response.data;
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
};

export const createComment = async (postId, userId, content) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/comments`, {
      postId,
      userId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts`, postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comments`, {
      params: { postId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createPostComment = async (postId, userId, content) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/postComments`, {
      postId,
      userId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post comment:', error);
    throw error;
  }
}; 