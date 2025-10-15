import React, { useState } from 'react';

export default function InquiryFormContent({ onBackClick }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 문의 내용을 모두 입력해주세요.');
      return;
    }

    // 문의 제출 로직
    alert('문의가 성공적으로 제출되었습니다.');
    setTitle('');
    setContent('');
    onBackClick(); // 제출 후 이전 페이지로 돌아가기
  };

  return (
    <>
      {/* 상단 회색 바 */}
      <div className="w-full h-[10px] bg-[#d9d9d9]" />

      <div className="w-[1020px]">
        {/* 고객지원 제목 */}
        <div className="bg-white box-border flex h-[100px] items-start overflow-clip pl-[10px] pr-[20px] py-[10px] w-[1020px]">
          <p className="font-bold text-[30px] text-black text-center tracking-[-0.33px]">
            고객지원
          </p>
        </div>

        {/* 뒤로가기 */}
        <div className="box-border flex h-[50px] items-center overflow-clip px-[100px] py-0 w-full">
          <p
            className="font-normal text-[#4b7dbc] text-[15px] tracking-[-0.165px] cursor-pointer hover:underline w-[73px]"
            onClick={onBackClick}
          >
            &lt; 전체 문의
          </p>
        </div>

        {/* 문의하기 폼 */}
        <div className="box-border flex flex-col gap-[10px] items-center px-[230px] py-0 w-full">
          <p className="font-semibold text-[30px] text-black tracking-[-0.33px]">
            문의하기
          </p>
          <p className="font-medium text-[#7b7b7b] text-[15px] tracking-[-0.165px]">
            문의 사항을 작성하여 주시면, 최대한 신속하게 답변 드리겠습니다.
          </p>

          {/* 제목 입력 */}
          <div className="relative rounded-[10px] w-full">
            <div className="box-border flex gap-[10px] items-center overflow-clip px-[15px] py-[10px] w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="font-medium text-[15px] text-black tracking-[-0.165px] w-full bg-transparent outline-none placeholder-[#8e8e8e]"
              />
            </div>
            <div className="absolute border-[#d9d9d9] border-[3px] border-solid inset-0 pointer-events-none rounded-[10px]" />
          </div>

          {/* 문의 내용 입력 */}
          <div className="relative rounded-[10px] w-full">
            <div className="box-border flex gap-[10px] items-start overflow-clip px-[15px] py-[10px] w-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문의 내용을 입력해주세요."
                className="font-medium text-[15px] text-black tracking-[-0.165px] w-full h-[400px] bg-transparent outline-none resize-none placeholder-[#8e8e8e]"
              />
            </div>
            <div className="absolute border-[#d9d9d9] border-[3px] border-solid inset-0 pointer-events-none rounded-[10px]" />
          </div>

          {/* 제출 버튼 */}
          <div className="box-border flex gap-[10px] items-center justify-end px-0 py-[10px] w-full">
            <button
              onClick={handleSubmit}
              className="bg-[#95b1d4] box-border flex flex-col gap-[10px] h-[30px] items-center justify-center px-[16px] py-0 rounded-[10px] w-[100px] hover:bg-[#7da3cc] transition-colors"
            >
              <p className="font-medium text-[15px] text-black text-center tracking-[-0.165px]">
                문의 제출
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}