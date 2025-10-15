import React from 'react';

export default function LoginRequiredModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* 모달 */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-[12px] w-[322px] overflow-clip relative">
          <div className="h-[15px] w-full" />

          <div className="box-border flex gap-[10px] items-center overflow-clip px-[12px] py-0 w-full">
            <div className="flex flex-col font-normal leading-[0] text-[#1c1e26] text-[14px] w-[305px]">
              <p className="leading-[24px]">로그인/회원가입을 하셔야 문의를 작성 하실 수 있습니다.</p>
            </div>
          </div>

          <div className="box-border flex gap-[10px] items-center justify-end overflow-clip px-[15px] py-[10px] w-full">
            <div className="flex flex-col font-normal leading-[0] text-[#4b7dbc] text-[14px] text-right">
              <button
                onClick={onClose}
                className="leading-[24px] cursor-pointer hover:underline"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}