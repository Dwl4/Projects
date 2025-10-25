import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { aiChatService } from '../api';

const imgMagnifyingLens = "/assets/Search.png";

function SearchResultsContent() {
  const location = useLocation();
  const initialQuery = location.state?.initialQuery || '';

  const [sessionUuid, setSessionUuid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1️⃣ 컴포넌트 초기화 - 세션 생성
  useEffect(() => {
    // 이미 세션이 있으면 실행하지 않음 (중복 방지)
    if (!sessionUuid) {
      initializeSession();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2️⃣ 세션 생성
  const initializeSession = async () => {
    try {
      console.log('🔵 세션 생성 시작', { initialQuery });

      // initialQuery가 있으면 그것을 title과 initial_query로 사용
      const title = initialQuery
        ? (initialQuery.length > 50 ? initialQuery.substring(0, 50) + '...' : initialQuery)
        : 'AI 법률 상담';

      // API 호출: POST /ai-chat/sessions
      // title과 initial_query 모두 필수로 전달
      const session = await aiChatService.createSession(
        title,
        initialQuery || ''  // 빈 문자열이라도 전달
      );

      console.log('✅ 세션 생성 성공', session);

      // UUID를 state에 저장
      setSessionUuid(session.session_uuid);
      console.log('💾 저장된 sessionUuid:', session.session_uuid);

      // initialQuery가 있으면 메시지 목록에 추가 (서버에서 이미 처리됨)
      if (initialQuery) {
        // 세션 메시지 목록 조회
        setLoading(true);
        try {
          console.log('🔵 세션 메시지 조회', { sessionUuid: session.session_uuid });
          const messagesData = await aiChatService.getSessionMessages(session.session_uuid);
          console.log('✅ 메시지 목록 받음', messagesData);

          // 메시지 목록 설정
          if (messagesData.items && messagesData.items.length > 0) {
            setMessages(messagesData.items);
          }
        } catch (err) {
          console.error('메시지 조회 실패:', err);
          setError('메시지를 불러오는데 실패했습니다.');
        } finally {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('세션 생성 실패:', err);
      setError('세션 생성에 실패했습니다.');
    }
  };

  // 3️⃣ 메시지 전송
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
    <div className="w-full h-screen flex flex-col">
      {/* 안내 문구 */}
      <div className="flex-shrink-0 px-[60px] pt-[20px] pb-[10px] border-b border-gray-200">
        <p className="text-[14px] text-center text-[#999]">이 서비스는 법률 자문이 아닌 단순 참고용입니다</p>
        <h1 className="text-[24px] font-bold text-center mt-[10px]">AI 법률 상담</h1>
        {error && (
          <p className="text-[14px] text-center text-red-500 mt-[10px]">{error}</p>
        )}
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-[60px] py-[30px] space-y-[20px]" style={{ maxHeight: 'calc(100vh - 250px)' }}>
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

        {messages.map((message, index) => (
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
                <p className="text-[15px] text-[#333] leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            )}
          </div>
        ))}

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
