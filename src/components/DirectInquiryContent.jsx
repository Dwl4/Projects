import React, { useState } from 'react';
import { demoMyInquiryData } from '../data/demoData';
import InquiryDetailContent from './InquiryDetailContent';
import InquiryFormContent from './InquiryFormContent';

export default function DirectInquiryContent() {
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleTitleClick = () => {
    setShowDetail(true);
  };

  const handleBackClick = () => {
    setShowDetail(false);
    setShowForm(false);
  };

  const handleInquiryFormClick = () => {
    setShowForm(true);
  };

  // 상세 페이지를 보여줄 때
  if (showDetail) {
    return <InquiryDetailContent onBackClick={handleBackClick} />;
  }

  // 문의 폼 페이지를 보여줄 때
  if (showForm) {
    return <InquiryFormContent onBackClick={handleBackClick} />;
  }
  return (
    <>

      <div className="w-[1020px]">
        {/* 고객지원 제목과 문의 등록 버튼 */}
        <div className="bg-white box-border flex h-[100px] items-start justify-between overflow-clip pl-[10px] pr-[20px] py-[10px] w-[1020px]">
          <p className="font-bold text-[30px] text-black text-center tracking-[-0.33px]">
            고객지원
          </p>
          <button
            onClick={handleInquiryFormClick}
            className="bg-[#9ec3e5] box-border flex gap-[10px] items-center justify-center overflow-clip px-[10px] py-[2px] rounded-[5px] hover:bg-[#7da3cc] transition-colors cursor-pointer"
          >
            <p className="font-normal text-[13px] text-black text-center tracking-[-0.143px]">
              문의 등록
            </p>
          </button>
        </div>

        {/* 내 문의 섹션 */}
        <div className="bg-white box-border flex h-[100px] items-center justify-center pb-[30px] pt-0 px-[50px] w-full">
          <p className="font-semibold text-[30px] text-black text-center tracking-[-0.33px]">
            내 문의
          </p>
        </div>

        {/* 테이블 헤더 */}
        <div className="box-border flex font-normal items-center justify-between px-[110px] py-0 text-[15px] tracking-[-0.165px] w-[1020px]">
          <p className="text-[#08213b] w-[500px]">
            제목
          </p>
          <p className="text-black text-center w-[95px]">
            문의 접수 번호
          </p>
          <p className="text-black text-center w-[90px]">
            최종 업데이트
          </p>
          <p className="text-black text-center w-[30px]">
            상태
          </p>
        </div>

        {/* 구분선 */}
        <div className="bg-[#d9d9d9] h-[3px] w-[820px] mx-auto" />

        {/* 문의 내용 */}
        <div className="box-border flex flex-col items-center px-[100px] py-0 w-[1020px]">
          {demoMyInquiryData.map((inquiry) => (
            <div key={inquiry.id} className="box-border flex font-normal h-[45px] items-center justify-between px-[10px] py-0 text-[15px] tracking-[-0.165px] w-full">
              <p
                className="text-[#d1363a] w-[500px] cursor-pointer hover:underline"
                onClick={handleTitleClick}
              >
                {inquiry.title}
              </p>
              <p className="text-black text-center w-[95px]">
                {inquiry.inquiryNumber}
              </p>
              <p className="text-black text-center w-[90px]">
                {inquiry.lastUpdate}
              </p>
              <p className="text-black text-center w-[30px]">
                {inquiry.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}