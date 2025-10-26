import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { aiChatService } from '../api';
import { demoDictionaryData } from '../data/demoDictionaryData';

const imgMagnifyingLens = "/assets/Search.png";

function SearchResultsContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const receivedSessionUuid = location.state?.sessionUuid || null;  // 🔹 홈에서 받은 UUID
  const firstQuestion = location.state?.firstQuestion || '';  // 🔹 홈에서 입력한 첫 질문

  const [sessionUuid, setSessionUuid] = useState(receivedSessionUuid);  // 🔹 받은 UUID로 초기화
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const processedSessionRef = useRef(null);  // 🔹 이미 처리한 세션 추적
  const [selectedTerm, setSelectedTerm] = useState(null);  // 선택된 용어

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1️⃣ 컴포넌트 초기화 - sessionUuid 변경될 때마다 실행
  useEffect(() => {
    console.log('🔄 세션 변경 감지', { receivedSessionUuid, firstQuestion, processed: processedSessionRef.current });

    // 이미 처리한 세션이면 중복 실행 방지
    const sessionKey = `${receivedSessionUuid}_${firstQuestion}`;
    if (processedSessionRef.current === sessionKey) {
      console.log('⏭️ 이미 처리된 세션 - 스킵');
      return;
    }
    processedSessionRef.current = sessionKey;

    if (receivedSessionUuid && firstQuestion) {
      // 홈에서 받은 세션 UUID와 첫 질문으로 대화 시작
      setSessionUuid(receivedSessionUuid);
      sendFirstQuestion(receivedSessionUuid, firstQuestion);
    } else if (receivedSessionUuid) {
      // 세션 UUID만 있고 질문이 없으면 메시지 로드 (사이드바/프로필 클릭)
      setSessionUuid(receivedSessionUuid);
      loadMessages(receivedSessionUuid);
    } else {
      // 세션이 없으면 빈 상태로 유지 (세션 생성하지 않음)
      console.log('⚠️ 세션 정보 없음 - 빈 상태 유지');
      setSessionUuid(null);
      setMessages([]);
    }
  }, [receivedSessionUuid, firstQuestion]); // receivedSessionUuid가 변경될 때마다 실행

  // 2️⃣ 첫 질문 전송 (홈에서 넘어온 경우)
  const sendFirstQuestion = async (uuid, question) => {
    try {
      console.log('🔵 [채팅] 첫 질문 전송', { sessionUuid: uuid, question });
      setLoading(true);

      // 사용자 메시지 즉시 표시
      setMessages([
        {
          id: `temp_${Date.now()}`,
          role: 'user',
          content: question,
          created_at: new Date().toISOString(),
        },
      ]);

      // AI에게 첫 질문 전송
      const response = await aiChatService.chatWithAI(uuid, question);
      console.log('✅ [채팅] AI 응답 받음', response);

      // 서버에서 전체 메시지 목록 다시 가져오기 (동기화)
      console.log('🔵 [채팅] 메시지 목록 다시 조회 (동기화)');
      const messagesData = await aiChatService.getSessionMessages(uuid);
      console.log('✅ [채팅] 메시지 목록 받음', messagesData);

      if (messagesData.items && messagesData.items.length > 0) {
        setMessages(messagesData.items);
      }
    } catch (err) {
      console.error('❌ [채팅] 첫 질문 전송 실패:', err);
      setError('첫 질문 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ 세션 메시지 로드 (세션만 받은 경우)
  const loadMessages = async (uuid) => {
    try {
      console.log('🔵 [채팅] 기존 세션 메시지 로드', { sessionUuid: uuid });
      setLoading(true);

      const messagesData = await aiChatService.getSessionMessages(uuid);
      console.log('✅ [채팅] 메시지 목록 받음', messagesData);

      if (messagesData.items && messagesData.items.length > 0) {
        setMessages(messagesData.items);
      }
    } catch (err) {
      console.error('❌ [채팅] 메시지 조회 실패:', err);
      setError('메시지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 용어 클릭 핸들러
  const handleTermClick = (termData) => {
    setSelectedTerm(termData);
  };

  // 텍스트에서 용어 하이라이트
  const highlightTerms = (text) => {
    if (!text || !demoDictionaryData || demoDictionaryData.length === 0) return text;

    // 용어를 길이순으로 정렬 (긴 용어부터 매칭하여 부분 매칭 방지)
    // 1~2글자 용어는 제외
    const sortedTerms = [...demoDictionaryData]
      .filter((termObj) => termObj.term.length > 2)
      .sort((a, b) => b.term.length - a.term.length);

    const matches = [];

    // 모든 용어 찾기
    sortedTerms.forEach((termObj) => {
      // 특수문자 이스케이프 처리
      const escapedTerm = termObj.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedTerm})`, 'g');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          term: match[0],
          termData: termObj
        });
      }
    });

    // 겹치지 않는 매칭만 선택 (긴 용어 우선)
    const validMatches = [];
    matches.sort((a, b) => a.start - b.start);

    matches.forEach((match) => {
      const overlap = validMatches.some(
        (vm) => (match.start >= vm.start && match.start < vm.end) ||
                (match.end > vm.start && match.end <= vm.end)
      );
      if (!overlap) {
        validMatches.push(match);
      }
    });

    if (validMatches.length === 0) return text;

    // JSX 요소 배열 생성
    const parts = [];
    let lastIndex = 0;

    validMatches.sort((a, b) => a.start - b.start).forEach((match, idx) => {
      // 매칭 전 텍스트
      if (match.start > lastIndex) {
        parts.push(text.substring(lastIndex, match.start));
      }
      // 하이라이트된 용어
      parts.push(
        <span
          key={`term-${idx}`}
          onClick={() => handleTermClick(match.termData)}
          className="bg-yellow-200 cursor-pointer hover:bg-yellow-300 transition-colors px-[2px] rounded"
          title="클릭하여 용어 설명 보기"
        >
          {match.term}
        </span>
      );
      lastIndex = match.end;
    });

    // 마지막 남은 텍스트
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  // 4️⃣ 메시지 전송
  const handleSendMessage = async () => {
    // 1. 빈 메시지나 세션 없으면 중단
    if (!inputMessage.trim() || !sessionUuid || loading) return;

    // 2. 메시지 저장 & 입력창 초기화
    const userMessage = inputMessage.trim();
    setInputMessage('');  // 입력창 비우기
    setLoading(true);     // 로딩 시작

    // 3. 사용자 메시지 즉시 화면에 표시 (낙관적 업데이트)
    const tempUserMessageId = `temp_${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempUserMessageId,
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      // 4. API 호출: POST /ai-chat/chat
      console.log('🔵 메시지 전송', { sessionUuid, message: userMessage });
      const response = await aiChatService.chatWithAI(sessionUuid, userMessage);
      console.log('✅ AI 응답 받음', response);

      // 5. 서버에서 전체 메시지 목록 다시 가져오기 (동기화)
      console.log('🔵 메시지 목록 다시 조회 (동기화)');
      const messagesData = await aiChatService.getSessionMessages(sessionUuid);
      console.log('✅ 메시지 목록 받음', messagesData);

      if (messagesData.items && messagesData.items.length > 0) {
        setMessages(messagesData.items);
      }
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      setError('메시지 전송에 실패했습니다.');

      // 임시 사용자 메시지 제거
      setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessageId));

      // 에러 메시지를 화면에 표시
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'error',
          content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);  // 로딩 종료
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 용어 상세 모달 */}
      {selectedTerm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedTerm(null)}
        >
          <div
            className="bg-white rounded-[15px] p-[30px] max-w-[600px] max-h-[80vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-[20px]">
              <h2 className="text-[24px] font-bold text-[#333]">{selectedTerm.term}</h2>
              <button
                onClick={() => setSelectedTerm(null)}
                className="text-[24px] text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            {selectedTerm.category && (
              <div className="mb-[15px]">
                <span className="inline-block bg-[#5F9AD0] text-white text-[12px] px-[10px] py-[4px] rounded-full">
                  {selectedTerm.category}
                </span>
              </div>
            )}
            <div className="text-[15px] text-[#333] leading-relaxed whitespace-pre-wrap">
              {selectedTerm.definition}
            </div>
            {selectedTerm.related_laws && (
              <div className="mt-[20px] pt-[20px] border-t border-gray-200">
                <h3 className="text-[16px] font-bold mb-[10px]">관련 법령</h3>
                <p className="text-[14px] text-gray-600">{selectedTerm.related_laws}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 안내 문구 */}
      <div className="flex-shrink-0 px-[60px] pt-[20px] pb-[10px] border-b border-gray-200">
        <p className="text-[14px] text-center text-[#999]">이 서비스는 법률 자문이 아닌 단순 참고용입니다</p>
        <h1 className="text-[24px] font-bold text-center mt-[10px]">AI 법률 상담</h1>
        {error && (
          <p className="text-[14px] text-center text-red-500 mt-[10px]">{error}</p>
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-[60px] py-[30px] space-y-[20px]">
        {messages.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-[18px] text-[#999] mb-[20px]">
                법률 관련 궁금한 사항을 물어보세요
              </p>
              <p className="text-[14px] text-[#bbb]">
                AI가 관련 법령과 판례를 찾아 답변해드립니다
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          // 마지막 AI 응답인지 확인
          const isLastAIMessage = message.role === 'assistant' &&
            index === messages.length - 1;

          return (
            <div
              key={message.id || index}
              className={`flex ${
                message.role === 'user'
                  ? 'justify-end'
                  : message.role === 'error'
                  ? 'justify-center'
                  : 'justify-start'
              }`}
            >
              {message.role === 'user' ? (
                // 사용자 메시지
                <div className="bg-[#ACCEE9] rounded-[15px] px-[20px] py-[15px] max-w-[600px]">
                  <p className="text-[15px] text-[#082135] leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              ) : message.role === 'error' ? (
                // 에러 메시지
                <div className="bg-red-100 border-2 border-red-300 rounded-[15px] px-[25px] py-[15px] max-w-[500px]">
                  <p className="text-[14px] text-red-700">
                    {message.content}
                  </p>
                </div>
              ) : (
                // AI 응답
                <div className="bg-white border-2 border-[#9EC3E5] rounded-[15px] px-[25px] py-[20px] max-w-[700px] shadow-sm">
                  {message.legal_category && (
                    <div className="mb-[10px]">
                      <span className="inline-block bg-[#5F9AD0] text-white text-[12px] px-[10px] py-[4px] rounded-full">
                        {message.legal_category}
                      </span>
                    </div>
                  )}
                  <div className="text-[15px] text-[#333] leading-relaxed whitespace-pre-wrap">
                    {highlightTerms(message.content)}
                  </div>

                  {/* 변호사 관련 버튼 - 마지막 AI 응답에만 표시 */}
                  {isLastAIMessage && (
                    <div className="mt-[15px] pt-[15px] border-t border-gray-200 flex gap-[10px]">
                      <button
                        onClick={() => navigate('/lawyer-list')}
                        className="flex-1 px-[15px] py-[10px] bg-[#9EC3E5] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#7da9d3] transition-colors"
                      >
                        변호사 알아보기
                      </button>
                      <button
                        onClick={() => navigate('/nearby-lawyers')}
                        className="flex-1 px-[15px] py-[10px] bg-[#5F9AD0] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#4a7db0] transition-colors"
                      >
                        내 근처 변호사 찾기
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-[#9EC3E5] rounded-[15px] px-[25px] py-[20px]">
              <div className="flex items-center gap-[8px]">
                <div className="w-[8px] h-[8px] bg-[#5F9AD0] rounded-full animate-bounce"></div>
                <div className="w-[8px] h-[8px] bg-[#5F9AD0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-[8px] h-[8px] bg-[#5F9AD0] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="flex-shrink-0 px-[60px] py-[30px] border-t border-gray-200 bg-white">
        <div className="flex justify-center">
          <div className="relative w-[800px]">
            <div className="w-full h-[60px] bg-[#d9d9d9] relative rounded-[10px]">
              <div className="w-full h-full bg-[#d9d9d9] shadow-[3px_4px_0px_#95b1d4] rounded-[10px]" />

              {/* 입력창 */}
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={sessionUuid ? "추가 질문을 입력하세요..." : "세션을 생성하는 중..."}
                disabled={loading || !sessionUuid}
                className="absolute left-[20px] top-1/2 transform -translate-y-1/2
                           w-[calc(100%-100px)] h-[40px] bg-transparent outline-none text-[16px] text-[#333] placeholder-gray-500
                           disabled:cursor-not-allowed"
              />

              {/* 전송 버튼 */}
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim() || !sessionUuid}
                className="absolute right-[15px] top-1/2 transform -translate-y-1/2"
              >
                <div
                  className={`w-[45px] h-[45px] bg-center bg-cover bg-no-repeat transition-opacity ${
                    loading || !inputMessage.trim() || !sessionUuid
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:opacity-80'
                  }`}
                  style={{ backgroundImage: `url('${imgMagnifyingLens}')` }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultsContent;
