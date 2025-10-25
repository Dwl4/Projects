import api from './config';

// 커뮤니티 관련 API 서비스

/**
 * 게시글 작성 (인증 필요)
 * @param {Object} postData - { title, content, category }
 */
export const createPost = async (postData) => {
  const response = await api.post('/community/posts', postData);
  return response.data;
};

/**
 * 게시글 목록 조회
 * @param {Object} params - { category, page, limit }
 */
export const getPosts = async (params) => {
  const response = await api.get('/community/posts', { params });
  return response.data;
};

/**
 * 내 게시글 목록 조회 (인증 필요)
 * @param {Object} params - { page, limit }
 */
export const getMyPosts = async (params) => {
  const response = await api.get('/community/posts/my', { params });
  return response.data;
};

/**
 * 게시글 상세 조회
 * @param {number} postId
 */
export const getPostDetail = async (postId) => {
  const response = await api.get(`/community/posts/${postId}`);
  return response.data;
};

/**
 * 게시글 수정 (인증 필요, 작성자만 가능)
 * @param {number} postId
 * @param {Object} postData - { title, content, category }
 */
export const updatePost = async (postId, postData) => {
  const response = await api.put(`/community/posts/${postId}`, postData);
  return response.data;
};

/**
 * 게시글 삭제 (인증 필요, 작성자만 가능)
 * @param {number} postId
 */
export const deletePost = async (postId) => {
  const response = await api.delete(`/community/posts/${postId}`);
  return response.data;
};

/**
 * 댓글 작성 (인증 필요)
 * @param {number} postId
 * @param {string} content
 * @param {number|null} parentId - 대댓글인 경우 부모 댓글 ID
 */
export const createComment = async (postId, content, parentId = null) => {
  const response = await api.post(`/community/posts/${postId}/comments`, {
    content,
    parent_id: parentId,
  });
  return response.data;
};

/**
 * 댓글 목록 조회
 * @param {number} postId
 */
export const getComments = async (postId) => {
  const response = await api.get(`/community/posts/${postId}/comments`);
  return response.data;
};

/**
 * 댓글 수정 (인증 필요, 작성자만 가능)
 * @param {number} commentId
 * @param {string} content
 */
export const updateComment = async (commentId, content) => {
  const response = await api.put(`/community/comments/${commentId}`, { content });
  return response.data;
};

/**
 * 댓글 삭제 (인증 필요, 작성자만 가능)
 * @param {number} commentId
 */
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/community/comments/${commentId}`);
  return response.data;
};
