import api from './config';

// AI 채팅 관련 API 서비스

/**
 * 새 채팅 세션 생성
 * @param {string} title - 세션 제목
 * @param {string} initialQuery - 초기 질문
 */
export const createSession = async (title, initialQuery) => {
  const requestData = {
    title,
    initial_query: initialQuery,
  };

  console.log('📤 [POST /ai-chat/sessions] Request:', requestData);

  const response = await api.post('/ai-chat/sessions', requestData);

  console.log('📥 [POST /ai-chat/sessions] Response:', response.data);

  return response.data;
};

/**
 * AI와 채팅
 * @param {string} sessionUuid - 세션 UUID
 * @param {string} message - 메시지 내용
 */
export const chatWithAI = async (sessionUuid, message) => {
  const requestData = {
    session_uuid: sessionUuid,
    message,
  };

  console.log('📤 [POST /ai-chat/chat] Request:', requestData);

  const response = await api.post('/ai-chat/chat', requestData);

  console.log('📥 [POST /ai-chat/chat] Response:', response.data);

  return response.data;
};

/**
 * 내 채팅 세션 목록 조회 (인증 필요)
 * @param {number} page
 * @param {number} limit
 */
export const getMySessions = async (page = 1, limit = 20) => {
  const response = await api.get('/ai-chat/sessions/my', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * 대화 히스토리 조회
 * @param {string} sessionUuid
 */
export const getSessionMessages = async (sessionUuid) => {
  console.log(`📤 [GET /ai-chat/sessions/${sessionUuid}/messages] Request`);

  const response = await api.get(`/ai-chat/sessions/${sessionUuid}/messages`);

  console.log(`📥 [GET /ai-chat/sessions/${sessionUuid}/messages] Response:`, response.data);

  return response.data;
};

/**
 * 세션에 메시지 전송
 * @param {string} sessionUuid
 * @param {string} content
 */
export const sendMessage = async (sessionUuid, content) => {
  const response = await api.post(`/ai-chat/sessions/${sessionUuid}/messages`, {
    content,
    message_type: 'user',
  });
  return response.data;
};

/**
 * 메시지 조회
 * @param {number} messageId
 */
export const getMessage = async (messageId) => {
  const response = await api.get(`/ai-chat/messages/${messageId}`);
  return response.data;
};

/**
 * 세션 UUID로 조회
 * @param {string} sessionUuid
 */
export const getSession = async (sessionUuid) => {
  const response = await api.get(`/ai-chat/sessions/${sessionUuid}`);
  return response.data;
};

/**
 * 세션 제목 수정
 * @param {string} sessionUuid
 * @param {string} title
 */
export const updateSessionTitle = async (sessionUuid, title) => {
  const response = await api.put(`/ai-chat/sessions/${sessionUuid}`, { title });
  return response.data;
};

/**
 * 세션 삭제 (인증 필요)
 * @param {string} sessionUuid
 */
export const deleteSession = async (sessionUuid) => {
  const response = await api.delete(`/ai-chat/sessions/${sessionUuid}`);
  return response.data;
};
