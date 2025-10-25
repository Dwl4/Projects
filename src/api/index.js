// API 서비스 통합 export 파일

export * as authService from './authService';
export * as aiChatService from './aiChatService';
export * as caseLawService from './caseLawService';
export * as communityService from './communityService';
export * as dictionaryService from './dictionaryService';
export * as lawyerService from './lawyerService';
export * as noticeService from './noticeService';
export * as userService from './userService';

// API 인스턴스도 export
export { default as api } from './config';
