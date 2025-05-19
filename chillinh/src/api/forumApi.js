import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}`;

export const fetchPosts = async () => {
  try {
    const [postsRes, usersRes, commentsRes, votesRes] = await Promise.all([
      axios.get(`${API_URL}/posts`),
      axios.get(`${API_URL}/users`),
      axios.get(`${API_URL}/comments`),
      axios.get(`${API_URL}/votes`)
    ]);

    // Transform the data to match our component's expected format
    const posts = postsRes.data.map(post => {
      const author = usersRes.data.find(user => user.id === post.userId);
      const postComments = commentsRes.data.filter(comment => comment.postId === post.id);
      const postVotes = votesRes.data.filter(vote => vote.postId === post.id);
      
      return {
        id: post.id,
        author: author?.name || 'Unknown User',
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
        time: new Date(post.createdAt).toLocaleString('vi-VN', { 
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }),
        content: post.content,
        title: post.title,
        tags: post.tags || [],
        voteCount: postVotes.filter(v => v.type === 'upvote').length - postVotes.filter(v => v.type === 'downvote').length,
        replies: postComments.map(comment => {
          const commentAuthor = usersRes.data.find(u => u.id === comment.userId);
          return {
            id: comment.id,
            author: commentAuthor?.name || 'Unknown User',
            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
            time: new Date(comment.createdAt).toLocaleString('vi-VN', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            }),
            content: comment.content
          };
        })
      };
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createVote = async (postId, userId, type) => {
  try {
    const response = await axios.post(`${API_URL}/votes`, {
      postId,
      userId,
      type,
      createdAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating vote:', error);
    throw error;
  }
};

export const createComment = async (postId, userId, content) => {
  try {
    const response = await axios.post(`${API_URL}/comments`, {
      postId,
      userId,
      content,
      createdAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, {
      ...postData,
      userId: "1", // Using mock userId for now
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}; 