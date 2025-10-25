# 🔗 LawMate API 엔드포인트 전체 문서

## 📋 기본 정보

- **Base URL**: `http://localhost:8000/api/v1`
- **인증 방식**: Bearer Token (JWT)
- **Content-Type**: `application/json` (파일 업로드 시 `multipart/form-data`)
- **API 버전**: v1

---

## 🔐 1. 인증 (Auth) API

### 1.1 일반 사용자 회원가입
- **엔드포인트**: `POST /api/v1/auth/register/user`
- **인증**: 불필요
- **설명**: 일반 사용자 계정을 생성합니다.

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "nickname": "길동이",
  "phone": "010-1234-5678",
  "address": "서울시 강남구"
}
```

#### Response (201):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "nickname": "길동이",
    "phone": "010-1234-5678",
    "address": "서울시 강남구",
    "profile_image": null,
    "is_active": true,
    "created_at": "2025-10-25T10:30:00"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### 1.2 변호사 회원가입
- **엔드포인트**: `POST /api/v1/auth/register/lawyer`
- **인증**: 불필요
- **Content-Type**: `multipart/form-data`
- **설명**: 변호사 계정을 생성합니다.

#### Request Form Data:
```
email: lawyer@example.com
password: password123
name: 김변호사
phone: 010-9876-5432
law_firm: 법무법인 정의
address: 서울시 서초구
profile_image: [file]
```

#### Response (201):
```json
{
  "lawyer": {
    "id": 1,
    "email": "lawyer@example.com",
    "name": "김변호사",
    "phone": "010-9876-5432",
    "law_firm": "법무법인 정의",
    "address": "서울시 서초구",
    "is_verified": false,
    "is_active": true,
    "created_at": "2025-10-25T10:30:00"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

### 1.3 로그인
- **엔드포인트**: `POST /api/v1/auth/login`
- **인증**: 불필요
- **설명**: 일반 사용자 또는 변호사 로그인을 수행합니다.

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "user_type": "user"
}
```

#### Parameters:
- `email` (string, required): 사용자 이메일
- `password` (string, required): 비밀번호
- `user_type` (string, required): "user" 또는 "lawyer"

#### Response (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

## 🤖 2. AI 채팅 (AI Chat) API

### 2.1 새 채팅 세션 생성
- **엔드포인트**: `POST /api/v1/ai-chat/sessions`
- **인증**: 선택사항 (비로그인 사용자도 가능)
- **설명**: 새로운 AI 상담 세션을 생성합니다.

#### Request Body:
```json
{
  "title": "교통사고 관련 문의",
  "initial_query": "교통사고 피해 보상은 어떻게 받나요?"
}
```

#### Response (201):
```json
{
  "session_id": 1,
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "title": "교통사고 관련 문의",
  "is_active": true,
  "created_at": "2025-10-25T10:30:00"
}
```

---

### 2.2 AI와 채팅
- **엔드포인트**: `POST /api/v1/ai-chat/chat`
- **인증**: 불필요
- **설명**: AI에게 질문하고 답변을 받습니다.

#### Request Body:
```json
{
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "message": "교통사고 과실 비율은 어떻게 결정되나요?"
}
```

#### Response (200):
```json
{
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "user_message": {
    "id": 1,
    "role": "user",
    "content": "교통사고 과실 비율은 어떻게 결정되나요?",
    "created_at": "2025-10-25T10:30:00"
  },
  "ai_response": {
    "id": 2,
    "role": "assistant",
    "content": "교통사고 과실 비율은...",
    "legal_category": "교통/형사",
    "created_at": "2025-10-25T10:30:05"
  }
}
```

---

### 2.3 내 채팅 세션 목록 조회
- **엔드포인트**: `GET /api/v1/ai-chat/sessions/my`
- **인증**: 필수
- **설명**: 로그인한 사용자의 모든 대화 세션을 조회합니다.

#### Query Parameters:
- `page` (int, optional): 페이지 번호 (기본값: 1)
- `limit` (int, optional): 페이지 크기 (기본값: 20)

#### Response (200):
```json
{
  "items": [
    {
      "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "교통사고 관련 문의",
      "legal_category": "교통/형사",
      "message_count": 5,
      "created_at": "2025-10-25T10:30:00",
      "updated_at": "2025-10-25T11:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 20
}
```

---

### 2.4 대화 히스토리 조회
- **엔드포인트**: `GET /api/v1/ai-chat/sessions/{session_uuid}/messages`
- **인증**: 선택사항
- **설명**: 특정 세션의 전체 대화 내역을 조회합니다.

#### Response (200):
```json
{
  "items": [
    {
      "id": 1,
      "role": "user",
      "content": "교통사고 피해 보상은?",
      "created_at": "2025-10-25T10:30:00"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "교통사고 피해 보상은...",
      "created_at": "2025-10-25T10:30:05"
    }
  ],
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "total": 2
}
```

---

### 2.5 세션에 메시지 전송
- **엔드포인트**: `POST /api/v1/ai-chat/sessions/{session_uuid}/messages`
- **인증**: 불필요
- **설명**: 세션에 새로운 메시지를 추가합니다.

#### Request Body:
```json
{
  "content": "추가 질문입니다",
  "message_type": "user"
}
```

#### Response (201):
```json
{
  "id": 3,
  "content": "추가 질문입니다",
  "message_type": "user",
  "created_at": "2025-10-25T11:00:00"
}
```

---

### 2.6 메시지 조회
- **엔드포인트**: `GET /api/v1/ai-chat/messages/{message_id}`
- **인증**: 불필요
- **설명**: 특정 메시지를 조회합니다.

#### Response (200):
```json
{
  "id": 1,
  "content": "교통사고 피해 보상은?",
  "message_type": "user",
  "session_id": 1,
  "created_at": "2025-10-25T10:30:00"
}
```

---

### 2.7 세션 UUID로 조회
- **엔드포인트**: `GET /api/v1/ai-chat/sessions/{session_uuid}`
- **인증**: 선택사항
- **설명**: 세션 UUID로 세션 정보를 조회합니다.

#### Response (200):
```json
{
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "title": "교통사고 관련 문의",
  "category": "교통/형사",
  "is_active": true,
  "created_at": "2025-10-25T10:30:00",
  "updated_at": "2025-10-25T11:00:00"
}
```

---

### 2.8 세션 제목 수정
- **엔드포인트**: `PUT /api/v1/ai-chat/sessions/{session_uuid}`
- **인증**: 선택사항
- **설명**: 세션 제목을 수정합니다.

#### Request Body:
```json
{
  "title": "교통사고 손해배상 문의"
}
```

#### Response (200):
```json
{
  "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "title": "교통사고 손해배상 문의",
  "updated_at": "2025-10-25T11:00:00"
}
```

---

### 2.9 세션 삭제
- **엔드포인트**: `DELETE /api/v1/ai-chat/sessions/{session_uuid}`
- **인증**: 필수
- **설명**: 세션을 삭제합니다.

#### Response (200):
```json
{
  "message": "Session deleted successfully"
}
```

---

## ⚖️ 3. 판례 검색 (Case Laws) API

### 3.1 판례 검색
- **엔드포인트**: `GET /api/v1/case-laws/search`
- **인증**: 불필요
- **설명**: 다양한 필터로 판례를 검색합니다.

#### Query Parameters:
- `keyword` (string, optional): 검색어 (사건명, 사건번호)
- `category` (string, optional): 카테고리
- `court` (string, optional): 법원명
- `case_type` (string, optional): 사건 종류
- `page` (int, optional): 페이지 번호 (기본값: 1)
- `limit` (int, optional): 페이지 크기 (기본값: 20, 최대: 100)

#### 예시:
```
GET /api/v1/case-laws/search?keyword=교통사고&court=대법원&page=1&limit=20
```

#### Response (200):
```json
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": 1,
      "case_number": "2023다12345",
      "case_name": "교통사고 손해배상청구",
      "court": "대법원",
      "case_type": "민사",
      "judgment_date": "2023-05-15",
      "summary": "교통사고로 인한 손해배상 사건",
      "category": "교통/형사",
      "views": 1523
    }
  ]
}
```

---

### 3.2 판례 상세 조회
- **엔드포인트**: `GET /api/v1/case-laws/{case_law_id}`
- **인증**: 불필요
- **설명**: 판례 상세 정보를 조회하고 조회수를 증가시킵니다.

#### Response (200):
```json
{
  "id": 1,
  "case_number": "2023다12345",
  "case_name": "교통사고 손해배상청구",
  "court": "대법원",
  "case_type": "민사",
  "judgment_date": "2023-05-15",
  "summary": "교통사고로 인한 손해배상 사건",
  "content": "판결문 전체 내용...",
  "category": "교통/형사",
  "views": 1524,
  "created_at": "2025-10-25T10:30:00",
  "updated_at": "2025-10-25T11:00:00"
}
```

---

### 3.3 내 즐겨찾기 판례 목록
- **엔드포인트**: `GET /api/v1/case-laws/favorites/my`
- **인증**: 필수
- **설명**: 로그인한 사용자의 즐겨찾기 판례 목록을 조회합니다.

#### Response (200):
```json
{
  "items": [
    {
      "id": 1,
      "case_number": "2023다12345",
      "case_name": "교통사고 손해배상청구",
      "court": "대법원",
      "case_type": "민사",
      "judgment_date": "2023-05-15",
      "summary": "교통사고로 인한 손해배상 사건",
      "category": "교통/형사",
      "views": 1523
    }
  ],
  "total": 1
}
```

---

### 3.4 판례 즐겨찾기 추가
- **엔드포인트**: `POST /api/v1/case-laws/{case_law_id}/favorite`
- **인증**: 필수
- **설명**: 판례를 즐겨찾기에 추가합니다.

#### Response (201):
```json
{
  "message": "Added to favorites",
  "favorite_id": 1
}
```

---

### 3.5 판례 즐겨찾기 삭제
- **엔드포인트**: `DELETE /api/v1/case-laws/{case_law_id}/favorite`
- **인증**: 필수
- **설명**: 판례를 즐겨찾기에서 삭제합니다.

#### Response (200):
```json
{
  "message": "Removed from favorites"
}
```

---

## 👥 4. 커뮤니티 (Community) API

### 4.1 게시글 작성
- **엔드포인트**: `POST /api/v1/community/posts`
- **인증**: 필수
- **설명**: 커뮤니티에 새로운 게시글을 작성합니다.

#### Request Body:
```json
{
  "title": "변호사 선임 관련 질문",
  "content": "변호사 선임 비용은 얼마나 드나요?",
  "category": "질문"
}
```

#### Response (201):
```json
{
  "id": 1,
  "user_id": 1,
  "title": "변호사 선임 관련 질문",
  "content": "변호사 선임 비용은 얼마나 드나요?",
  "category": "질문",
  "views": 0,
  "is_deleted": false,
  "created_at": "2025-10-25T10:30:00",
  "updated_at": "2025-10-25T10:30:00"
}
```

---

### 4.2 게시글 목록 조회
- **엔드포인트**: `GET /api/v1/community/posts`
- **인증**: 불필요
- **설명**: 커뮤니티 게시글 목록을 조회합니다.

#### Query Parameters:
- `category` (string, optional): 카테고리 필터
- `page` (int, optional): 페이지 번호 (기본값: 1)
- `limit` (int, optional): 페이지 크기 (기본값: 20, 최대: 100)

#### Response (200):
```json
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": 1,
      "user_id": 1,
      "title": "변호사 선임 관련 질문",
      "content": "변호사 선임 비용은 얼마나 드나요?",
      "category": "질문",
      "views": 15,
      "is_deleted": false,
      "created_at": "2025-10-25T10:30:00",
      "updated_at": "2025-10-25T10:30:00"
    }
  ]
}
```

---

### 4.3 내 게시글 목록 조회
- **엔드포인트**: `GET /api/v1/community/posts/my`
- **인증**: 필수
- **설명**: 로그인한 사용자가 작성한 게시글 목록을 조회합니다.

#### Query Parameters:
- `page` (int, optional): 페이지 번호 (기본값: 1)
- `limit` (int, optional): 페이지 크기 (기본값: 20, 최대: 100)

#### Response (200):
4.2와 동일

---

### 4.4 게시글 상세 조회
- **엔드포인트**: `GET /api/v1/community/posts/{post_id}`
- **인증**: 불필요
- **설명**: 게시글 상세 정보와 댓글을 조회하고 조회수를 증가시킵니다.

#### Response (200):
```json
{
  "id": 1,
  "user_id": 1,
  "title": "변호사 선임 관련 질문",
  "content": "변호사 선임 비용은 얼마나 드나요?",
  "category": "질문",
  "views": 16,
  "is_deleted": false,
  "created_at": "2025-10-25T10:30:00",
  "updated_at": "2025-10-25T10:30:00",
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "parent_comment_id": null,
      "content": "사건 종류에 따라 다릅니다.",
      "is_deleted": false,
      "created_at": "2025-10-25T11:00:00",
      "updated_at": "2025-10-25T11:00:00",
      "replies": []
    }
  ]
}
```

---

### 4.5 게시글 수정
- **엔드포인트**: `PUT /api/v1/community/posts/{post_id}`
- **인증**: 필수 (작성자만 가능)
- **설명**: 게시글을 수정합니다.

#### Request Body:
```json
{
  "title": "변호사 선임 비용 문의",
  "content": "수정된 내용",
  "category": "질문"
}
```

#### Response (200):
4.1과 동일

---

### 4.6 게시글 삭제
- **엔드포인트**: `DELETE /api/v1/community/posts/{post_id}`
- **인증**: 필수 (작성자만 가능)
- **설명**: 게시글을 소프트 삭제합니다.

#### Response (200):
```json
{
  "message": "Post deleted successfully"
}
```

---

### 4.7 댓글 작성
- **엔드포인트**: `POST /api/v1/community/posts/{post_id}/comments`
- **인증**: 필수
- **설명**: 게시글에 댓글을 작성합니다.

#### Request Body:
```json
{
  "content": "사건 종류에 따라 다릅니다.",
  "parent_id": null
}
```

#### Parameters:
- `content` (string, required): 댓글 내용
- `parent_id` (int, optional): 대댓글인 경우 부모 댓글 ID

#### Response (201):
```json
{
  "id": 1,
  "post_id": 1,
  "user_id": 2,
  "parent_comment_id": null,
  "content": "사건 종류에 따라 다릅니다.",
  "is_deleted": false,
  "created_at": "2025-10-25T11:00:00",
  "updated_at": "2025-10-25T11:00:00",
  "replies": []
}
```

---

### 4.8 댓글 목록 조회
- **엔드포인트**: `GET /api/v1/community/posts/{post_id}/comments`
- **인증**: 불필요
- **설명**: 게시글의 댓글 목록을 조회합니다.

#### Response (200):
```json
{
  "items": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 2,
      "parent_comment_id": null,
      "content": "사건 종류에 따라 다릅니다.",
      "is_deleted": false,
      "created_at": "2025-10-25T11:00:00",
      "updated_at": "2025-10-25T11:00:00",
      "replies": []
    }
  ]
}
```

---

### 4.9 댓글 수정
- **엔드포인트**: `PUT /api/v1/community/comments/{comment_id}`
- **인증**: 필수 (작성자만 가능)
- **설명**: 댓글을 수정합니다.

#### Request Body:
```json
{
  "content": "수정된 댓글 내용"
}
```

#### Response (200):
4.7과 동일

---

### 4.10 댓글 삭제
- **엔드포인트**: `DELETE /api/v1/community/comments/{comment_id}`
- **인증**: 필수 (작성자만 가능)
- **설명**: 댓글을 소프트 삭제합니다.

#### Response (200):
```json
{
  "message": "Comment deleted successfully"
}
```

---

## 📚 5. 법률 용어 사전 (Dictionary) API

### 5.1 법률 용어 검색
- **엔드포인트**: `GET /api/v1/dictionary/search`
- **인증**: 불필요
- **설명**: 법률 용어를 검색합니다.

#### Query Parameters:
- `keyword` (string, optional): 검색어 (용어명)
- `consonant` (string, optional): 초성 필터 (ㄱ, ㄴ, ㄷ...)
- `category` (string, optional): 카테고리
- `page` (int, optional): 페이지 번호 (기본값: 1)
- `limit` (int, optional): 페이지 크기 (기본값: 20, 최대: 100)

#### 예시:
```
GET /api/v1/dictionary/search?keyword=손해배상&page=1&limit=20
GET /api/v1/dictionary/search?consonant=ㅅ&page=1&limit=20
```

#### Response (200):
```json
{
  "total": 10,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": 1,
      "term": "손해배상",
      "term_english": "Damages",
      "definition": "타인에게 입힌 손해를 금전으로 보상하는 것",
      "category": "민법",
      "consonant": "ㅅ"
    }
  ]
}
```

---

### 5.2 카테고리 목록 조회
- **엔드포인트**: `GET /api/v1/dictionary/categories`
- **인증**: 불필요
- **설명**: 법률 용어 카테고리 목록을 조회합니다.

#### Response (200):
```json
["민법", "형법", "상법", "행정법"]
```

---

### 5.3 인기 법률 용어
- **엔드포인트**: `GET /api/v1/dictionary/popular`
- **인증**: 불필요
- **설명**: 조회수가 높은 인기 법률 용어를 조회합니다.

#### Query Parameters:
- `limit` (int, optional): 조회할 개수 (기본값: 10, 최대: 50)

#### Response (200):
```json
[
  {
    "id": 1,
    "term": "손해배상",
    "term_english": "Damages",
    "definition": "타인에게 입힌 손해를 금전으로 보상하는 것",
    "category": "민법",
    "consonant": "ㅅ"
  }
]
```

---

### 5.4 최근 추가된 법률 용어
- **엔드포인트**: `GET /api/v1/dictionary/recent`
- **인증**: 불필요
- **설명**: 최근에 추가된 법률 용어를 조회합니다.

#### Query Parameters:
- `limit` (int, optional): 조회할 개수 (기본값: 10, 최대: 50)

#### Response (200):
5.3과 동일

---

### 5.5 법률 용어 상세 조회
- **엔드포인트**: `GET /api/v1/dictionary/{term_id}`
- **인증**: 불필요
- **설명**: 법률 용어 상세 정보를 조회하고 조회수를 증가시킵니다.

#### Response (200):
```json
{
  "id": 1,
  "term": "손해배상",
  "term_english": "Damages",
  "definition": "타인에게 입힌 손해를 금전으로 보상하는 것",
  "category": "민법",
  "related_terms": "불법행위, 채무불이행, 과실",
  "consonant": "ㅅ",
  "views": 1523,
  "created_at": "2025-10-25T10:30:00",
  "updated_at": "2025-10-25T11:00:00"
}
```

---

### 5.6 내 즐겨찾기 용어 목록
- **엔드포인트**: `GET /api/v1/dictionary/favorites/my`
- **인증**: 필수
- **설명**: 로그인한 사용자의 즐겨찾기 법률 용어 목록을 조회합니다.

#### Response (200):
```json
{
  "items": [
    {
      "id": 1,
      "term": "손해배상",
      "term_english": "Damages",
      "definition": "타인에게 입힌 손해를 금전으로 보상하는 것",
      "category": "민법",
      "consonant": "ㅅ"
    }
  ],
  "total": 1
}
```

---

### 5.7 용어 즐겨찾기 추가
- **엔드포인트**: `POST /api/v1/dictionary/{term_id}/favorite`
- **인증**: 필수
- **설명**: 법률 용어를 즐겨찾기에 추가합니다.

#### Response (201):
```json
{
  "message": "Added to favorites",
  "favorite_id": 1
}
```

---

### 5.8 용어 즐겨찾기 삭제
- **엔드포인트**: `DELETE /api/v1/dictionary/{term_id}/favorite`
- **인증**: 필수
- **설명**: 법률 용어를 즐겨찾기에서 삭제합니다.

#### Response (200):
```json
{
  "message": "Removed from favorites"
}
```

---

## 👨‍⚖️ 6. 변호사 (Lawyers) API

### 6.1 변호사 검색
- **엔드포인트**: `GET /api/v1/lawyers/search`
- **인증**: 불필요
- **설명**: 다양한 조건으로 변호사를 검색합니다.

#### Query Parameters:
- `keyword` (string, optional): 검색어 (이름, 법률사무소)
- `specialty` (string, optional): 전문 분야
- `region` (string, optional): 지역
- `min_rating` (float, optional): 최소 평점 (0.0-5.0)
- `max_fee` (int, optional): 최대 상담료
- `page` (int, optional): 페이지 번호 (기본값: 1)
- `limit` (int, optional): 페이지 크기 (기본값: 20, 최대: 100)

#### 예시:
```
GET /api/v1/lawyers/search?specialty=교통사고&region=서울&min_rating=4.0&page=1&limit=20
```

#### Response (200):
```json
{
  "total": 30,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": 1,
      "name": "김변호사",
      "law_firm": "법무법인 정의",
      "profile_image": "/uploads/lawyers/profile1.jpg",
      "specialties": ["교통사고", "형사"],
      "rating": 4.8,
      "total_reviews": 152,
      "consultation_fee": 150000,
      "region": "서울",
      "is_verified": true
    }
  ]
}
```

---

### 6.2 변호사 상세 조회
- **엔드포인트**: `GET /api/v1/lawyers/{lawyer_id}`
- **인증**: 불필요
- **설명**: 변호사의 상세 정보를 조회합니다.

#### Response (200):
```json
{
  "id": 1,
  "email": "lawyer@example.com",
  "name": "김변호사",
  "phone": "010-9876-5432",
  "law_firm": "법무법인 정의",
  "address": "서울시 서초구",
  "profile_image": "/uploads/lawyers/profile1.jpg",
  "introduction": "교통사고 전문 변호사입니다.",
  "specialties": ["교통사고", "형사"],
  "education": [
    {"school": "서울대학교 법학과", "year": "2010"}
  ],
  "career": [
    {"position": "법무법인 정의 변호사", "period": "2015-현재"}
  ],
  "consultation_fee": 150000,
  "rating": 4.8,
  "total_consultations": 320,
  "total_reviews": 152,
  "region": "서울",
  "is_verified": true,
  "is_active": true,
  "created_at": "2025-01-01T00:00:00",
  "updated_at": "2025-10-25T10:30:00"
}
```

---

### 6.3 내 변호사 프로필 수정
- **엔드포인트**: `PUT /api/v1/lawyers/me`
- **인증**: 필수 (변호사만 가능)
- **Content-Type**: `multipart/form-data`
- **설명**: 변호사 자신의 프로필을 수정합니다.

#### Request Form Data:
```
name: 김변호사
phone: 010-9876-5432
law_firm: 법무법인 정의
address: 서울시 서초구
introduction: 교통사고 전문 변호사입니다.
specialties: ["교통사고", "형사"]
education: [{"school": "서울대", "year": "2010"}]
career: [{"position": "변호사", "period": "2015-현재"}]
consultation_fee: 150000
region: 서울
profile_image: [file]
```

#### 주의사항:
- `specialties`, `education`, `career`는 JSON 문자열로 전송해야 합니다.

#### Response (200):
6.2와 동일

---

### 6.4 내 즐겨찾기 변호사 목록
- **엔드포인트**: `GET /api/v1/lawyers/favorites/my`
- **인증**: 필수
- **설명**: 로그인한 사용자의 즐겨찾기 변호사 목록을 조회합니다.

#### Response (200):
```json
[
  {
    "id": 1,
    "name": "김변호사",
    "law_firm": "법무법인 정의",
    "profile_image": "/uploads/lawyers/profile1.jpg",
    "specialties": ["교통사고", "형사"],
    "rating": 4.8,
    "total_reviews": 152,
    "consultation_fee": 150000,
    "region": "서울",
    "is_verified": true
  }
]
```

---

### 6.5 변호사 즐겨찾기 추가
- **엔드포인트**: `POST /api/v1/lawyers/favorites/{lawyer_user_id}`
- **인증**: 필수
- **설명**: 변호사를 즐겨찾기에 추가합니다.

#### Response (201):
```json
{
  "id": 1,
  "user_id": 1,
  "lawyer_user_id": 2,
  "created_at": "2025-10-25T10:30:00"
}
```

---

### 6.6 변호사 즐겨찾기 삭제
- **엔드포인트**: `DELETE /api/v1/lawyers/favorites/{lawyer_user_id}`
- **인증**: 필수
- **설명**: 변호사를 즐겨찾기에서 삭제합니다.

#### Response (200):
```json
{
  "message": "Favorite removed successfully"
}
```

---

## 📢 7. 공지사항 (Notices) API

### 7.1 공지사항 목록 조회
- **엔드포인트**: `GET /api/v1/notices`
- **인증**: 불필요
- **설명**: 공지사항 목록을 조회합니다. (고정 공지가 우선 표시됩니다)

#### Query Parameters:
- `page` (int, optional): 페이지 번호 (기본값: 1)
- `limit` (int, optional): 페이지 크기 (기본값: 20, 최대: 100)

#### Response (200):
```json
{
  "total": 10,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": 1,
      "title": "서비스 오픈 안내",
      "is_pinned": true,
      "views": 1523,
      "created_at": "2025-10-25T10:30:00"
    }
  ]
}
```

---

### 7.2 카테고리 목록 조회
- **엔드포인트**: `GET /api/v1/notices/categories`
- **인증**: 불필요
- **설명**: 공지사항 카테고리 목록을 조회합니다.

#### Response (200):
```json
["공지", "업데이트", "이벤트"]
```

---

### 7.3 공지사항 상세 조회
- **엔드포인트**: `GET /api/v1/notices/{notice_id}`
- **인증**: 불필요
- **설명**: 공지사항 상세 내용을 조회하고 조회수를 증가시킵니다.

#### Response (200):
```json
{
  "id": 1,
  "title": "서비스 오픈 안내",
  "content": "LawMate 서비스가 오픈되었습니다...",
  "is_pinned": true,
  "views": 1524,
  "created_at": "2025-10-25T10:30:00",
  "updated_at": "2025-10-25T11:00:00"
}
```

---

### 7.4 공지사항 생성 (미구현)
- **엔드포인트**: `POST /api/v1/notices`
- **인증**: 필수 (관리자 전용)
- **상태**: 501 Not Implemented
- **설명**: 관리자 권한 구현 후 사용 가능합니다.

---

### 7.5 공지사항 수정 (미구현)
- **엔드포인트**: `PUT /api/v1/notices/{notice_id}`
- **인증**: 필수 (관리자 전용)
- **상태**: 501 Not Implemented
- **설명**: 관리자 권한 구현 후 사용 가능합니다.

---

### 7.6 공지사항 삭제 (미구현)
- **엔드포인트**: `DELETE /api/v1/notices/{notice_id}`
- **인증**: 필수 (관리자 전용)
- **상태**: 501 Not Implemented
- **설명**: 관리자 권한 구현 후 사용 가능합니다.

---

## 👤 8. 사용자 관리 (Users) API

### 8.1 사용자 생성
- **엔드포인트**: `POST /api/v1/users`
- **인증**: 불필요
- **설명**: 새로운 사용자를 생성합니다.

#### Request Body:
```json
{
  "email": "user@example.com",
  "name": "홍길동",
  "age": 30,
  "is_active": true
}
```

#### Response (201):
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "age": 30,
  "is_active": true,
  "created_at": "2025-10-25T10:30:00",
  "updated_at": "2025-10-25T10:30:00"
}
```

---

### 8.2 사용자 목록 조회
- **엔드포인트**: `GET /api/v1/users`
- **인증**: 불필요
- **설명**: 등록된 사용자 목록을 조회합니다.

#### Query Parameters:
- `skip` (int, optional): 건너뛸 항목 수 (기본값: 0)
- `limit` (int, optional): 조회할 최대 항목 수 (기본값: 100)

#### Response (200):
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "age": 30,
    "is_active": true,
    "created_at": "2025-10-25T10:30:00",
    "updated_at": "2025-10-25T10:30:00"
  }
]
```

---

### 8.3 사용자 단건 조회
- **엔드포인트**: `GET /api/v1/users/{user_id}`
- **인증**: 불필요
- **설명**: 특정 사용자의 정보를 조회합니다.

#### Response (200):
8.1과 동일

---

### 8.4 사용자 정보 수정
- **엔드포인트**: `PUT /api/v1/users/{user_id}`
- **인증**: 불필요
- **설명**: 사용자 정보를 수정합니다. (제공된 필드만 업데이트)

#### Request Body:
```json
{
  "name": "홍길순",
  "age": 31,
  "is_active": true
}
```

#### Response (200):
8.1과 동일

---

### 8.5 사용자 삭제
- **엔드포인트**: `DELETE /api/v1/users/{user_id}`
- **인증**: 불필요
- **설명**: 사용자를 삭제합니다.

#### Response (204):
No Content

---

## 🔧 9. 헬스 체크 및 기타 API

### 9.1 루트 엔드포인트
- **엔드포인트**: `GET /`
- **인증**: 불필요
- **설명**: API 서버의 기본 정보를 확인합니다.

#### Response (200):
```json
{
  "message": "Welcome to LawMate API",
  "version": "v1",
  "docs": "/docs",
  "redoc": "/redoc"
}
```

---

### 9.2 헬스 체크
- **엔드포인트**: `GET /health`
- **인증**: 불필요
- **설명**: 서버의 상태를 확인합니다.

#### Response (200):
```json
{
  "status": "healthy",
  "app": "LawMate API",
  "version": "v1"
}
```

---

### 9.3 Swagger UI 문서
- **엔드포인트**: `GET /docs`
- **인증**: 불필요
- **설명**: 브라우저에서 확인 가능한 인터랙티브 API 문서입니다.

---

### 9.4 ReDoc 문서
- **엔드포인트**: `GET /redoc`
- **인증**: 불필요
- **설명**: 브라우저에서 확인 가능한 API 문서 (대체 UI)입니다.

---

## 📝 공통 규격

### 인증 헤더 형식
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 토큰 정보
- **Access Token 만료 시간**: 60분 (3600초)
- **Refresh Token 만료 시간**: 7일
- **알고리즘**: HS256

### 에러 응답 형식
```json
{
  "detail": "에러 메시지"
}
```

또는 유효성 검증 실패 시:
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### HTTP 상태 코드
| 코드 | 설명 |
|------|------|
| 200 | 성공 (조회, 수정, 삭제) |
| 201 | 생성 성공 |
| 204 | 성공 (응답 본문 없음) |
| 400 | 잘못된 요청 |
| 401 | 인증 실패 (로그인 필요) |
| 403 | 권한 없음 |
| 404 | 리소스를 찾을 수 없음 |
| 409 | 충돌 (중복 등) |
| 422 | 유효성 검증 실패 |
| 500 | 서버 내부 에러 |
| 501 | 구현되지 않음 |

---

## 🎯 프론트엔드 연결 가이드

### 1. 환경 변수 설정
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000
```

### 2. Axios 인스턴스 생성 예시
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 처리 로직
      // Refresh Token으로 갱신 또는 로그아웃
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. API 호출 예시
```javascript
// 로그인
const login = async (email, password, userType) => {
  const response = await api.post('/auth/login', {
    email,
    password,
    user_type: userType,
  });
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  return response.data;
};

// 판례 검색
const searchCaseLaws = async (params) => {
  const response = await api.get('/case-laws/search', { params });
  return response.data;
};

// AI 채팅
const chatWithAI = async (sessionUuid, message) => {
  const response = await api.post('/ai-chat/chat', {
    session_uuid: sessionUuid,
    message,
  });
  return response.data;
};
```

### 4. 파일 업로드 예시 (변호사 프로필)
```javascript
const updateLawyerProfile = async (data) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('phone', data.phone);
  formData.append('specialties', JSON.stringify(data.specialties));
  formData.append('education', JSON.stringify(data.education));

  if (data.profileImage) {
    formData.append('profile_image', data.profileImage);
  }

  const response = await api.put('/lawyers/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
```

### 5. 페이지네이션 처리
```javascript
const [posts, setPosts] = useState([]);
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);

const fetchPosts = async (page) => {
  const response = await api.get('/community/posts', {
    params: { page, limit: 20 },
  });
  setPosts(response.data.items);
  setTotal(response.data.total);
};
```

### 6. React Query 활용 예시
```javascript
import { useQuery } from '@tanstack/react-query';

// 판례 검색 훅
const useCaseLaws = (params) => {
  return useQuery({
    queryKey: ['caseLaws', params],
    queryFn: () => searchCaseLaws(params),
  });
};

// 변호사 검색 훅
const useLawyers = (params) => {
  return useQuery({
    queryKey: ['lawyers', params],
    queryFn: () => searchLawyers(params),
  });
};
```

---

## 📌 주요 참고 사항

1. **인증이 선택사항인 API**: AI 채팅 일부 엔드포인트는 비로그인 사용자도 사용 가능합니다.
2. **즐겨찾기 기능**: 판례, 법률 용어, 변호사에 대한 즐겨찾기 기능이 모두 제공됩니다.
3. **조회수 증가**: 상세 조회 시 자동으로 조회수가 증가합니다.
4. **소프트 삭제**: 커뮤니티 게시글과 댓글은 실제 삭제되지 않고 `is_deleted` 플래그로 관리됩니다.
5. **파일 업로드 경로**: `/uploads` 디렉토리에 저장되며 정적 파일로 서빙됩니다.
6. **CORS 설정**: `http://localhost:3000`, `http://localhost:5173`이 기본으로 허용됩니다.

---

## 🔍 추가 문서

더 자세한 API 문서는 서버 실행 후 다음 URL에서 확인하실 수 있습니다:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-10-25
**API 버전**: v1
