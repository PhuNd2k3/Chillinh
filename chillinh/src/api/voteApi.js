const BASE_URL = "http://localhost:3001/votes"; // JSON Server

// Lấy vote hiện tại của user cho post
const getUserVote = async (postId, userId) => {
  const res = await fetch(`${BASE_URL}?postId=${postId}&userId=${userId}`);
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
};

// Tạo mới vote
const createVote = async (postId, userId, type) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, userId, type }),
  });
  return res.json();
};

// Cập nhật vote
const updateVote = async (voteId, newType) => {
  const res = await fetch(`${BASE_URL}/${voteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: newType }),
  });
  return res.json();
};

// Gọi khi người dùng nhấn vote up
export const voteUp = async (postId, userId) => {
  const existing = await getUserVote(postId, userId);

  if (!existing) {
    return createVote(postId, userId, "upvote");
  }

  if (existing.type === "upvote") {
    return existing; // Không làm gì nếu đã vote up
  }

  return updateVote(existing.id, "upvote");
};

// Gọi khi người dùng nhấn vote down
export const voteDown = async (postId, userId) => {
  const existing = await getUserVote(postId, userId);

  if (!existing) {
    return createVote(postId, userId, "downvote");
  }

  if (existing.type === "downvote") {
    return existing; // Không làm gì nếu đã vote down
  }

  return updateVote(existing.id, "downvote");
};

// Lấy tất cả votes cho 1 bài viết
export const getVotes = async (postId) => {
  const res = await fetch(`${BASE_URL}?postId=${postId}`);
  return res.json();
};
