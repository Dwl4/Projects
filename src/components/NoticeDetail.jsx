import React from 'react';
import { demoNotices } from '../data/demoNoticeData';

export default function NoticeDetail({ notice, onBack }) {
  const currentNotice = demoNotices.find(n => n.id === notice.id) || demoNotices[0];

  return (
    <div className="w-full bg-white flex flex-col">
      {/* 공지사항 제목 */}
      <div className="w-full h-[100px] pl-[10px] flex items-center mb-[30px]">
        <h1
          className="text-[32px] font-bold text-black cursor-pointer hover:opacity-50 flex items-center gap-[10px] transition-opacity"
          onClick={onBack}
        >
          <span>←</span>
          <span>공지사항</span>
        </h1>
      </div>

      {/* 공지 내용 */}
      <div className="w-full flex flex-col items-center">
        {/* 공지 제목 섹션 */}
        <div className="w-[860px] h-[55px]">
          {/* 제목과 날짜 */}
          <div className="w-[860px] h-[38px] flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-black leading-[38px]">{currentNotice.title}</h2>
            <span className="text-[14px] text-black font-bold">{currentNotice.date}</span>
          </div>
              <div className="w-full h-[2px] bg-[#d9d9d9]" />
          {/* 조회수 */}
          <div className="w-[860px] h-[15px] flex justify-end">
            <span className="text-[10px] text-black font-bold">조회 수 {currentNotice.views}</span>
          </div>
        </div>

        {/* 공지 본문 */}
        <div className="w-full flex justify-center">
          <div className="w-[800px] mt-[30px] mb-[40px]">
            <pre className="text-[14px] text-black leading-[1.8] whitespace-pre-wrap font-inter font-bold">
              {currentNotice.fullContent || currentNotice.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}