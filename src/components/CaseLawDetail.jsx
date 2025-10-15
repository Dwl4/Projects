import React, { useState } from 'react';
import { demoCaseLawDetailData } from '../data/demoData';

export default function CaseLawDetail() {
  const [activeTab, setActiveTab] = useState('판시사항');

  const tabs = ['판시사항', '판결요지', '참조조문', '참조판례', '전문'];

  return (
    <div className="bg-white flex flex-col min-h-screen w-full">
      {/* 메인 컨텐츠 */}
      <div className="flex flex-1">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col mx-auto max-w-[1020px]">

          <div className="px-[30px] py-[10px] flex-1">
            {/* 뒤로가기 */}
            <div className="py-[10px]">
              <p className="text-[30px] font-bold text-black cursor-pointer">←판례</p>
            </div>

            {/* 판례 제목 */}
            <div className="bg-[#9ec3e5] px-[30px] py-[15px] flex flex-col gap-[5px]">
              <p className="text-[20px] font-bold text-[#08213b]">
                {demoCaseLawDetailData.title}
              </p>
              <p className="text-[13px] text-black">
                {demoCaseLawDetailData.subtitle}
              </p>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-[192px] h-[40px] flex items-center justify-center cursor-pointer ${
                    activeTab === tab ? 'bg-[#9ec3e5] font-bold' : 'bg-white'
                  }`}
                >
                  <p className="text-[15px] text-black">{tab}</p>
                </div>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="bg-white px-[10px] py-[30px] flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
              {activeTab === '판시사항' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap">
                  {demoCaseLawDetailData.판시사항}
                </div>
              )}

              {activeTab === '판결요지' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap">
                  {demoCaseLawDetailData.판결요지}
                </div>
              )}

              {activeTab === '참조조문' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap">
                  {demoCaseLawDetailData.참조조문}
                </div>
              )}

              {activeTab === '참조판례' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap">
                  {demoCaseLawDetailData.참조판례}
                </div>
              )}

              {activeTab === '전문' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap">
                  {demoCaseLawDetailData.전문}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
