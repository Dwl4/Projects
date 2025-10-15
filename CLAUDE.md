# React Desktop Website Guidelines (1920×1080 전용)

## 1. 기본 해상도 규칙
- **대상 해상도**: 1920px × 1080px (Full HD)
- **레이아웃 여백**: 좌우 160px 여백 유지
- **본문 섹션 너비**: 1020px 고정
- **섹션 높이**: 주요 섹션은 `100vh` 또는 최소 1000px
- **스크롤**: 세로 스크롤만 허용 (한 화면 = 한 섹션 구조 가능)

---

## 3. 기술 스택
- **React 18+**
- **React Router v6** → 라우팅
- **Tailwind CSS** → 스타일링
- **Framer Motion** (선택) → 애니메이션
- **Axios or Fetch API** → 서버 통신

---

## 4. 코드 규칙
- **컴포넌트명**: PascalCase (`Navbar.jsx`, `HomePage.jsx`)
- **상태 관리**: useState, useEffect (필요시 Context)
- **CSS 관리**
  - Tailwind 중심
  - `styles/global.css` 추가 가능
- **코드 포맷팅**: ESLint + Prettier 적용

---

## 5. 커밋 메시지 규칙
- `feat:` 새로운 기능/컴포넌트 추가
- `fix:` 버그 수정
- `style:` UI/스타일 수정
- `refactor:` 코드 구조 변경
- `docs:` 문서 수정
- `chore:` 빌드/설정 관련

---

## 6. 예시 Tailwind Container
```jsx
<div className="w-[1600px] mx-auto">
  {/* 여기에 콘텐츠 배치 */}
</div>
```
---

# 7. MCP 서버
## Figma Dev Mode MCP 규칙
  - Figma Dev Mode MCP 서버는 이미지 및 SVG 에셋을 제공할 수 있는 끝점을 제공합니다.
  - 중요: Figma Dev Mode MCP 서버가 이미지 또는 SVG에 대한 로컬 호스트 소스를 반환하는 경우 해당 이미지 또는 SVG 소스를 직접 사용하세요.
  - 중요: 새로운 아이콘 패키지를 가져오거나 추가하지 마세요. 모든 에셋은 Figma 페이로드에 있어야 합니다.
  - 중요: 로컬 호스트 소스가 제공되는 경우 입력 예시를 사용하거나 생성하지 마세요.

  ---
# 8. 일반 규칙
- 중요: 가능하면 항상 `/path_to_your_design_system`의 컴포넌트를 사용하세요.
- 디자인과 정확히 일치하도록 Figma의 완성도를 우선시하세요.
- 하드코딩된 값을 피하고, 가능한 경우 Figma의 디자인 토큰을 사용하세요.
- 접근성을 위해 WCAG 요구 사항을 따르세요.
- 컴포넌트 문서를 추가하세요.
- 꼭 필요한 경우가 아니면 인라인 스타일을 피하고 `/path_to_your_design_system`에 UI 컴포넌트를 배치하세요.

# 9. 데이터 규칙
- 앞으로 들어오는 모든 데이터는 demoData.js에 넣을 것. 절대 파일에서 하드 코딩하면 안됨.
- 이미지를 외부에서 들여올 경우, 경로는 public/assets 폴더 안에 생성하거나 그 안에 있는 이미지를 사용할 것.