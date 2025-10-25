# LawMate API 서비스 사용 가이드

## 개요
이 폴더는 LawMate 백엔드 API와 통신하기 위한 모든 서비스를 포함하고 있습니다.

## 폴더 구조

```
src/api/
├── config.js              # Axios 인스턴스 설정 및 인터셉터
├── authService.js         # 인증 관련 API
├── aiChatService.js       # AI 채팅 API
├── caseLawService.js      # 판례 검색 API
├── communityService.js    # 커뮤니티 API
├── dictionaryService.js   # 법률 용어 사전 API
├── lawyerService.js       # 변호사 API
├── noticeService.js       # 공지사항 API
├── userService.js         # 사용자 관리 API
└── index.js              # 통합 export 파일
```

## 설치 및 설정

### 1. 환경 변수 설정
`.env` 파일에 다음 변수가 설정되어 있어야 합니다:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_API_TIMEOUT=30000
```

### 2. 사용 방법

#### 기본 import
```javascript
// 방법 1: 개별 서비스 import
import { authService, aiChatService, caseLawService } from '../api';

// 방법 2: 특정 함수만 import
import { login, logout } from '../api/authService';
```

## API 서비스 상세

### 1. authService (인증)

```javascript
import { authService } from '../api';

// 일반 사용자 회원가입
const userData = {
  email: 'user@example.com',
  password: 'password123',
  name: '홍길동',
  nickname: '길동이',
  phone: '010-1234-5678',
  address: '서울시 강남구'
};
const result = await authService.registerUser(userData);

// 변호사 회원가입
const formData = new FormData();
formData.append('email', 'lawyer@example.com');
formData.append('password', 'password123');
formData.append('name', '김변호사');
formData.append('profile_image', file);
const result = await authService.registerLawyer(formData);

// 로그인
const result = await authService.login('user@example.com', 'password123', 'user');

// 로그아웃
authService.logout();

// 로그인 상태 확인
const isLoggedIn = authService.isAuthenticated();

// 사용자 타입 확인
const userType = authService.getUserType(); // 'user' 또는 'lawyer'
```

### 2. aiChatService (AI 채팅)

```javascript
import { aiChatService } from '../api';

// 새 채팅 세션 생성
const session = await aiChatService.createSession('교통사고 문의', '교통사고 피해 보상은?');

// AI와 채팅
const response = await aiChatService.chatWithAI(sessionUuid, '과실 비율은 어떻게 결정되나요?');

// 내 채팅 세션 목록 (인증 필요)
const sessions = await aiChatService.getMySessions(1, 20);

// 대화 히스토리 조회
const messages = await aiChatService.getSessionMessages(sessionUuid);

// 세션 제목 수정
await aiChatService.updateSessionTitle(sessionUuid, '새 제목');

// 세션 삭제
await aiChatService.deleteSession(sessionUuid);
```

### 3. caseLawService (판례 검색)

```javascript
import { caseLawService } from '../api';

// 판례 검색
const results = await caseLawService.searchCaseLaws({
  keyword: '교통사고',
  court: '대법원',
  page: 1,
  limit: 20
});

// 판례 상세 조회
const caseLaw = await caseLawService.getCaseLawDetail(1);

// 즐겨찾기 추가 (인증 필요)
await caseLawService.addCaseLawToFavorites(1);

// 즐겨찾기 삭제 (인증 필요)
await caseLawService.removeCaseLawFromFavorites(1);

// 내 즐겨찾기 목록 (인증 필요)
const favorites = await caseLawService.getMyFavoriteCaseLaws();
```

### 4. communityService (커뮤니티)

```javascript
import { communityService } from '../api';

// 게시글 작성 (인증 필요)
const post = await communityService.createPost({
  title: '변호사 선임 관련 질문',
  content: '변호사 선임 비용은 얼마나 드나요?',
  category: '질문'
});

// 게시글 목록 조회
const posts = await communityService.getPosts({
  category: '질문',
  page: 1,
  limit: 20
});

// 게시글 상세 조회
const postDetail = await communityService.getPostDetail(1);

// 게시글 수정 (인증 필요)
await communityService.updatePost(1, {
  title: '수정된 제목',
  content: '수정된 내용'
});

// 댓글 작성 (인증 필요)
const comment = await communityService.createComment(1, '댓글 내용');

// 대댓글 작성
const reply = await communityService.createComment(1, '대댓글 내용', 1);
```

### 5. dictionaryService (법률 용어 사전)

```javascript
import { dictionaryService } from '../api';

// 용어 검색
const terms = await dictionaryService.searchTerms({
  keyword: '손해배상',
  page: 1,
  limit: 20
});

// 초성 검색
const terms = await dictionaryService.searchTerms({
  consonant: 'ㅅ',
  page: 1,
  limit: 20
});

// 인기 용어
const popular = await dictionaryService.getPopularTerms(10);

// 최근 추가된 용어
const recent = await dictionaryService.getRecentTerms(10);

// 용어 상세 조회
const term = await dictionaryService.getTermDetail(1);

// 즐겨찾기 추가 (인증 필요)
await dictionaryService.addTermToFavorites(1);
```

### 6. lawyerService (변호사)

```javascript
import { lawyerService } from '../api';

// 변호사 검색
const lawyers = await lawyerService.searchLawyers({
  specialty: '교통사고',
  region: '서울',
  min_rating: 4.0,
  page: 1,
  limit: 20
});

// 변호사 상세 조회
const lawyer = await lawyerService.getLawyerDetail(1);

// 내 프로필 수정 (인증 필요, 변호사만)
const formData = new FormData();
formData.append('name', '김변호사');
formData.append('specialties', JSON.stringify(['교통사고', '형사']));
formData.append('profile_image', file);
await lawyerService.updateMyProfile(formData);

// 즐겨찾기 추가 (인증 필요)
await lawyerService.addLawyerToFavorites(2);
```

### 7. noticeService (공지사항)

```javascript
import { noticeService } from '../api';

// 공지사항 목록 조회
const notices = await noticeService.getNotices({
  page: 1,
  limit: 20
});

// 공지사항 상세 조회
const notice = await noticeService.getNoticeDetail(1);

// 카테고리 목록
const categories = await noticeService.getCategories();
```

## React 컴포넌트에서 사용 예시

### 1. 로그인 페이지
```javascript
import React, { useState } from 'react';
import { authService } from '../api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await authService.login(email, password, 'user');
      console.log('로그인 성공:', result);
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error.response?.data);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button type="submit">로그인</button>
    </form>
  );
}
```

### 2. 판례 검색 페이지
```javascript
import React, { useState, useEffect } from 'react';
import { caseLawService } from '../api';

function CaseLawSearchPage() {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    page: 1,
    limit: 20
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await caseLawService.searchCaseLaws(searchParams);
      setResults(data.items);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchParams.keyword}
        onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
        placeholder="판례 검색"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? '검색 중...' : '검색'}
      </button>

      <div>
        {results.map((item) => (
          <div key={item.id}>
            <h3>{item.case_name}</h3>
            <p>{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. AI 채팅 페이지
```javascript
import React, { useState, useEffect } from 'react';
import { aiChatService } from '../api';

function AIChatPage() {
  const [sessionUuid, setSessionUuid] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // 세션 생성
  useEffect(() => {
    const initSession = async () => {
      const session = await aiChatService.createSession('법률 상담', '안녕하세요');
      setSessionUuid(session.session_uuid);
    };
    initSession();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !sessionUuid) return;

    try {
      const response = await aiChatService.chatWithAI(sessionUuid, input);
      setMessages([
        ...messages,
        response.user_message,
        response.ai_response
      ]);
      setInput('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>전송</button>
    </div>
  );
}
```

## 에러 처리

모든 API 호출은 try-catch 블록으로 감싸서 에러를 처리해야 합니다:

```javascript
try {
  const result = await authService.login(email, password, 'user');
  // 성공 처리
} catch (error) {
  if (error.response) {
    // 서버가 응답을 반환한 경우
    console.error('에러 상태:', error.response.status);
    console.error('에러 메시지:', error.response.data);
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    console.error('서버 응답 없음');
  } else {
    // 요청 설정 중 에러가 발생한 경우
    console.error('요청 설정 에러:', error.message);
  }
}
```

## 인증 토큰 관리

- Access Token과 Refresh Token은 자동으로 localStorage에 저장됩니다.
- 모든 API 요청에 자동으로 Bearer Token이 추가됩니다.
- 401 에러 발생 시 자동으로 로그아웃 처리됩니다.
- Refresh Token 로직은 백엔드 API 구현 후 활성화할 수 있습니다.

## 주의사항

1. 환경 변수는 반드시 `REACT_APP_` 접두사를 사용해야 합니다.
2. `.env` 파일은 `.gitignore`에 추가되어 있어야 합니다.
3. 인증이 필요한 API는 로그인 후에만 호출해야 합니다.
4. FormData를 사용하는 API (파일 업로드)는 별도의 Content-Type 설정이 필요합니다.

## 개발 서버 실행

```bash
# 프론트엔드 개발 서버 (포트 4000)
PORT=4000 npm start

# 백엔드 서버가 http://localhost:8000에서 실행 중이어야 합니다.
```
