const API_URL = 'http://localhost:3001/companies';

// 1. Thêm bình luận mới cho công ty
export async function addCompanyComment(companyId, commentObj) {
  // commentObj: {id, user, rating, content, date, replies: []}
  const res = await axios.get(`${API_URL}/${companyId}`);
  const company = res.data;
  const reviews = [...(company.reviews || []), commentObj];
  await axios.patch(`${API_URL}/${companyId}`, { reviews });
  return reviews;
}

// 2. Trả lời 1 comment đã viết của công ty
export async function replyToCompanyComment(companyId, reviewId, replyObj) {
  // replyObj: {id, user, content, date}
  const res = await axios.get(`${API_URL}/${companyId}`);
  const company = res.data;
  const reviews = (company.reviews || []).map(r => {
    if (r.id === reviewId) {
      return {
        ...r,
        replies: [...(r.replies || []), replyObj]
      };
    }
    return r;
  });
  await axios.patch(`${API_URL}/${companyId}`, { reviews });
  return reviews;
}
