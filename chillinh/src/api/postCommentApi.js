import API_BASE_URL from "./config";

const BASE_URL = `${API_BASE_URL}/postComments`;

export const postComment = async ({ postId, userId, content }) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId,
        userId,
        content,
        createdAt: new Date().toISOString()
      })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Không thể gửi bình luận");
    }

    return await res.json();
  } catch (err) {
    console.error("Lỗi khi gửi bình luận:", err);
    throw err;
  }
};
