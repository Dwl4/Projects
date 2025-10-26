import React, { useState } from 'react';
import { lawyerData, userProfile, recentCases, imageAssets } from '../demoData';

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [address, setAddress] = useState(userProfile.address);
  const [favorites, setFavorites] = useState(new Set());

  const toggleFavorite = (lawyerId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(lawyerId)) {
        newFavorites.delete(lawyerId);
      } else {
        newFavorites.add(lawyerId);
      }
      return newFavorites;
    });
  };

  const handleSave = () => {
    // localStorage에서 현재 사용자 정보 가져오기
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // 업데이트할 정보 준비
    const updatedUser = {
      ...currentUser,
      nickname: nickname,
      address: address
    };

    // localStorage에 저장
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('userName', nickname); // 사이드바 업데이트용

    // demoUsers 배열도 업데이트 (로그인 검증용)
    const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('demoUsers', JSON.stringify(users));
    }

    alert('정보가 저장되었습니다.');

    // 페이지 새로고침하여 사이드바 업데이트 반영
    window.location.reload();
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 도로명 주소 우선, 없으면 지번 주소 사용
        const roadAddress = data.roadAddress || data.jibunAddress;
        setAddress(roadAddress);
      }
    }).open();
  };

  const handleWithdraw = () => {
    if (window.confirm('정말로 회원 탈퇴하시겠습니까?')) {
      console.log('회원 탈퇴 처리');
    }
  };

  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start px-[300px] py-0 relative size-full">
      {/* 메뉴바 */}
      <div className="bg-white content-stretch flex gap-[10px] h-[100px] items-start relative shrink-0 w-full">
        <div className="basis-0 bg-[#9ec3e5] content-stretch flex grow h-[100px] items-center justify-between min-h-px min-w-px overflow-clip relative shrink-0">
          <div className="h-[100px] relative shrink-0 w-[300px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[297.62%] left-0 max-w-none top-[-98.81%] w-full" src={imageAssets.lawmateLogo} />
            </div>
          </div>
          <div className="box-border content-stretch flex font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold gap-[18px] items-center leading-[1.5] not-italic pl-0 pr-[50px] py-0 relative shrink-0 text-[16px] text-center text-white tracking-[-0.176px] w-[800px]">
            <p className="relative shrink-0 w-[52.5px]">법령</p>
            <p className="relative shrink-0 w-[52.5px]">판례</p>
            <p className="relative shrink-0 w-[103.25px]">커뮤니티</p>
            <p className="relative shrink-0 w-[77px]">변호사</p>
            <p className="relative shrink-0 w-[103.25px]">공지사항</p>
            <p className="relative shrink-0 w-[103.25px]">용어사전</p>
            <p className="relative shrink-0 w-[103.25px]">고객지원</p>
          </div>
        </div>
      </div>

      {/* main in main */}
      <div className="basis-0 bg-white content-stretch flex grow items-center justify-between min-h-px min-w-px overflow-clip relative shrink-0 w-full">
        {/* 로그인 및 로그 */}
        <div className="bg-white content-stretch flex flex-col h-full items-end overflow-clip relative shrink-0 w-[300px]">
          {/* 로그인 */}
          <div className="bg-[#95b1d4] box-border content-stretch flex flex-col gap-[10px] items-start justify-center overflow-clip p-[30px] relative shrink-0 size-[300px]">
            <div className="bg-[#95b1d4] content-stretch flex h-[150px] items-start justify-between overflow-clip relative shrink-0 w-[240px]">
              <div className="bg-[#95b1d4] content-stretch flex items-center relative shrink-0 size-[150px]">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
                  <div className="[grid-area:1_/_1] h-[161.196px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[11.574px_0.4px] mask-size-[150px_150px] ml-[-11.574px] mt-[-0.4px] relative w-[170.998px] rounded-full overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imageAssets.loginImage} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#95b1d4] content-stretch flex font-bold gap-[5px] h-[20px] items-center justify-center leading-[1.5] not-italic overflow-clip relative shrink-0 text-[15px] text-black text-center text-nowrap tracking-[-0.15px] w-[240px] whitespace-pre">
              <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid font-['Inter:Bold',_sans-serif] relative shrink-0 underline">{userProfile.nickname}</p>
              <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] relative shrink-0">님</p>
            </div>
            <div className="bg-[#95b1d4] box-border content-stretch flex flex-col h-[70px] items-start justify-between px-[20px] py-0 relative shrink-0 w-[240px]">
              <div className="bg-white box-border content-stretch flex flex-col gap-[10px] h-[31px] items-center justify-center overflow-clip px-0 py-[4px] relative shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-[200px]">
                <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.5] not-italic relative shrink-0 text-[#08213b] text-[15px] text-center text-nowrap tracking-[-0.15px] whitespace-pre">프로필</p>
              </div>
              <div className="bg-white box-border content-stretch flex h-[30px] items-center justify-center relative shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] shrink-0 w-[200px]">
                <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.5] not-italic relative shrink-0 text-[#08213b] text-[15px] text-center text-nowrap tracking-[-0.15px] whitespace-pre">로그 아웃</p>
              </div>
            </div>
          </div>

          {/* 로그 */}
          <div className="basis-0 bg-white content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
            <div className="bg-white content-stretch flex flex-col h-full items-start justify-center relative shrink-0 w-[295px]">
              <div className="bg-white box-border content-stretch flex font-bold gap-[130px] h-[30px] items-center leading-[1.5] not-italic pl-[30px] pr-0 py-0 relative shrink-0 text-[15px] text-center text-nowrap w-[295px] whitespace-pre">
                <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] relative shrink-0 text-[#03345a]">최근사건 기록</p>
                <p className="font-['Inter:Bold',_sans-serif] relative shrink-0 text-[#787878]">3/5</p>
              </div>
              <div className="bg-[#d9d9d9] h-[3px] shrink-0 w-[150px]" />
              <div className="basis-0 bg-white content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0 w-[295px]">
                {recentCases.map((caseItem) => (
                  <div key={caseItem.id} className="bg-white h-[80px] relative shrink-0 w-full">
                    <div className="box-border content-stretch flex flex-col h-[80px] items-start justify-center overflow-clip px-[30px] py-0 relative w-full">
                      <div className="bg-white content-stretch flex gap-[10px] h-[31px] items-center overflow-clip relative shrink-0 w-full">
                        <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.5] not-italic relative shrink-0 text-[15px] text-black text-center text-nowrap tracking-[-0.165px] whitespace-pre">{caseItem.title}</p>
                      </div>
                      <div className="bg-white box-border content-stretch flex gap-[10px] items-center overflow-clip px-[20px] py-0 relative shrink-0 w-full">
                        <p className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[13px] text-black text-center text-nowrap tracking-[-0.143px] whitespace-pre">{caseItem.description}</p>
                      </div>
                    </div>
                    <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_3px] border-solid inset-0 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#d9d9d9] h-full shrink-0 w-[5px]" />
          </div>
        </div>

        {/* main in main */}
        <div className="basis-0 bg-white content-stretch flex flex-col grow h-full items-center min-h-px min-w-px overflow-clip relative shrink-0">
          <div className="bg-[#d9d9d9] h-[10px] shrink-0 w-full" />
          <div className="basis-0 bg-[#f8f9fa] box-border content-stretch flex flex-col gap-[50px] grow items-center min-h-px min-w-px overflow-clip px-[50px] py-[30px] relative shrink-0 w-full">
            {/* 환영문구box */}
            <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 w-full">
              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full">
                <div className="content-stretch flex font-bold items-center leading-[1.5] not-italic overflow-clip relative shrink-0 text-[30px] text-black text-center text-nowrap tracking-[-0.33px] whitespace-pre">
                  <p className="font-['Inter:Bold',_sans-serif] relative shrink-0">{userProfile.nickname}</p>
                  <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] relative shrink-0">님 환영합니다</p>
                </div>
                <div
                  className="bg-[#9ec3e5] box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[10px] py-[2px] relative rounded-[5px] shrink-0 cursor-pointer hover:opacity-80"
                  onClick={handleSave}
                >
                  <p className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[13px] text-black text-center text-nowrap tracking-[-0.143px] whitespace-pre">저장 하기</p>
                </div>
              </div>
              <p className="font-['Inter:Light',_'Noto_Sans_KR:Light',_sans-serif] font-light leading-[1.5] not-italic relative shrink-0 text-[20px] text-black text-center text-nowrap tracking-[-0.22px] whitespace-pre">마이페이지에서 회원정보를 관리하실 수 있습니다.</p>
            </div>

            {/* 프로필box */}
            <div className="bg-[#e8e8e8] box-border content-stretch flex h-[250px] items-center justify-between overflow-clip relative rounded-[10px] shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
              {/* 이미지box */}
              <div className="box-border content-stretch flex flex-col gap-[20px] h-full items-start justify-center overflow-clip px-[45px] py-[20px] relative shrink-0">
                <div className="bg-[rgba(158,195,229,0)] content-stretch flex items-center relative shrink-0 size-[150px]">
                  <div className="absolute left-0 size-[150px] top-0">
                    <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full rounded-full" src={imageAssets.loginImage} />
                  </div>
                </div>
                <div className="bg-[rgba(158,195,229,0)] box-border content-stretch flex items-center justify-center overflow-clip px-[20px] py-0 relative shrink-0 w-full">
                  <div className="basis-0 bg-white box-border content-stretch flex gap-[10px] grow items-center justify-center min-h-px min-w-px overflow-clip px-0 py-[3px] relative rounded-[5px] shrink-0 cursor-pointer hover:opacity-80">
                    <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.5] not-italic relative shrink-0 text-[#08213b] text-[15px] text-center text-nowrap tracking-[-0.15px] whitespace-pre">이미지 수정</p>
                  </div>
                </div>
              </div>
              <div className="bg-white h-[200px] shrink-0 w-[3px]" />

              {/* 개인정보box */}
              <div className="basis-0 box-border content-stretch flex gap-[30px] grow h-full items-center min-h-px min-w-px overflow-clip pl-[30px] pr-[50px] py-[10px] relative shrink-0">
                {/* 이름,메일box */}
                <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start overflow-clip px-0 py-[30px] relative shrink-0">
                  <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[13px] text-black text-nowrap tracking-[-0.13px] whitespace-pre">
                    <p className="mb-0">이름: </p>
                    <p className="mb-0">&nbsp;</p>
                    <p>이메일:</p>
                  </div>
                </div>

                {/* 내용1 */}
                <div className="basis-0 box-border content-stretch flex flex-col gap-[20px] grow h-full items-start min-h-px min-w-px overflow-clip px-0 py-[30px] relative shrink-0">
                  <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[13px] text-black text-nowrap tracking-[-0.13px] whitespace-pre">
                    <p className="mb-0">{userProfile.name}</p>
                    <p className="mb-0">&nbsp;</p>
                    <p>{userProfile.email}</p>
                  </div>
                </div>

                {/* 닉,주소box */}
                <div className="box-border content-stretch flex flex-col gap-[10px] h-full items-start overflow-clip px-0 py-[30px] relative shrink-0">
                  <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[13px] text-black text-nowrap tracking-[-0.13px] whitespace-pre">
                    <p className="mb-0">닉네임:</p>
                    <p className="mb-0">&nbsp;</p>
                    <p>주소:</p>
                  </div>
                </div>

                {/* 내용2 */}
                <div className="basis-0 box-border content-stretch flex flex-col gap-[20px] grow h-full items-start min-h-px min-w-px overflow-clip px-0 py-[30px] relative shrink-0">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-white h-[20px] shrink-0 w-[200px] border border-gray-300 rounded px-[5px] text-[10px] focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex flex-col gap-[10px]">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="주소"
                      className="bg-white h-[20px] shrink-0 w-[200px] border border-gray-300 rounded px-[5px] text-[10px] focus:outline-none focus:border-blue-500"
                      readOnly
                    />
                    <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center overflow-clip px-[13px] py-0 relative shadow-[2px_2px_1px_0px_rgba(0,0,0,0.25)] shrink-0 cursor-pointer hover:opacity-80" onClick={handleAddressSearch}>
                      <p className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[13px] text-black text-nowrap tracking-[-0.13px] whitespace-pre">주소 검색</p>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex grow items-end justify-end min-h-px min-w-px overflow-clip relative shrink-0 w-full">
                    <div className="bg-white box-border content-stretch flex items-center justify-end px-[13px] py-0 relative shadow-[2px_2px_1px_0px_rgba(0,0,0,0.25)] shrink-0 cursor-pointer hover:opacity-80" onClick={handleWithdraw}>
                      <p className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[13px] text-black text-nowrap tracking-[-0.13px] whitespace-pre">회원 탈퇴</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 기록box */}
            <div className="basis-0 bg-[#e8e8e8] box-border content-stretch flex flex-col gap-[20px] grow items-start min-h-px min-w-px overflow-clip px-[45px] py-[30px] relative rounded-[10px] shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)] shrink-0 w-full">
              {/* 내 기록box */}
              <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-full">
                <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.5] not-italic relative shrink-0 text-[23px] text-black text-nowrap tracking-[-0.23px] whitespace-pre">내 기록</p>
              </div>

              {/* 사건 변호사box */}
              <div className="bg-[rgba(135,73,73,0)] box-border content-stretch flex flex-col items-start overflow-clip p-[10px] relative shrink-0 w-full">
                <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold gap-[50px] items-center leading-[normal] not-italic overflow-clip p-[10px] relative shrink-0 text-[10px] text-nowrap w-full whitespace-pre">
                  <p className="relative shrink-0 text-black">사건</p>
                  <p className="relative shrink-0 text-[#7bb5ff]">변호사</p>
                </div>
                <div className="bg-white h-[3px] shrink-0 w-full" />
                <div className="absolute bg-[#7bb5ff] h-[3px] left-[83px] top-[39px] w-[40px]" />
              </div>

              {/* 변호사box */}
              <div className="basis-0 content-start flex flex-wrap gap-[35px] grow items-start justify-between min-h-px min-w-px overflow-clip relative shrink-0 w-full">
                {lawyerData.map((lawyer) => (
                  <div key={lawyer.id} className="bg-[#d9d9d9] box-border content-stretch flex flex-col gap-[10px] h-[470px] items-start overflow-clip px-[10px] py-[15px] relative rounded-[10px] shrink-0 w-[250px]">
                    {/* 이미지,자소box */}
                    <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col items-start overflow-clip relative self-stretch shrink-0">
                        <p className="basis-0 font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[11px] text-black w-[99px]">
                          {lawyer.introduction}
                        </p>
                      </div>
                      <div className="h-[160px] overflow-clip relative shrink-0 w-[120px]">
                        <div className="absolute contents left-0 top-0">
                          <div className="absolute h-[244.211px] left-[-7.37px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[7.369px_0px] mask-size-[120.301px_160px] rounded-[5px] top-0 w-[136.842px]">
                            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[5px] size-full" src={lawyer.image} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 변호사 이름box */}
                    <div className="box-border content-stretch flex gap-[10px] items-center justify-end leading-[normal] not-italic overflow-clip px-[20px] py-0 relative shrink-0 text-black text-nowrap w-full whitespace-pre">
                      <p className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal relative shrink-0 text-[11px]">변호사</p>
                      <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold relative shrink-0 text-[15px]">{lawyer.name}</p>
                    </div>

                    {/* 전문분야box */}
                    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center overflow-clip relative shrink-0 w-full">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0">
                        <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre">전문 분야</p>
                      </div>
                      <div className="font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(2,_minmax(0px,_1fr))] h-[41px] not-italic overflow-clip relative shrink-0 text-[10px] w-full">
                        {lawyer.specialties.slice(0, 3).map((specialty, idx) => (
                          <ul key={idx} className="block css-1ka0cu leading-[0] relative self-start shrink-0 text-black w-[110px]">
                            <li className="ms-[15px]">
                              <span className="leading-[normal]">{specialty}</span>
                            </li>
                          </ul>
                        ))}
                        <p className="leading-[normal] relative self-start shrink-0 text-[#787878] w-[110px] whitespace-pre-wrap">      외 5개</p>
                      </div>
                    </div>

                    {/* 경력box */}
                    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0 w-full">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0">
                        <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre">주요 경력</p>
                      </div>
                      <div className="content-stretch flex flex-col font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal gap-[5px] items-start not-italic overflow-clip relative shrink-0 text-[10px] text-nowrap w-[230px]">
                        {lawyer.experience.slice(0, 3).map((exp, idx) => (
                          <ul key={idx} className="[white-space-collapse:collapse] block css-1ka0cu leading-[0] relative shrink-0 text-black">
                            <li className="ms-[15px]">
                              <span className="leading-[normal]">{exp}</span>
                            </li>
                          </ul>
                        ))}
                        <p className="leading-[normal] relative shrink-0 text-[#787878] whitespace-pre">      외 5개</p>
                      </div>
                    </div>

                    {/* 활동지역box */}
                    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0 w-full">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0">
                        <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre">활동 지역</p>
                      </div>
                      <div className="content-stretch flex flex-col gap-[5px] items-start overflow-clip relative shrink-0 w-[230px]">
                        <ul className="[white-space-collapse:collapse] block css-1ka0cu font-['Inter:Regular',_'Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[10px] text-black text-nowrap">
                          <li className="ms-[15px]">
                            <span className="leading-[normal]">서울·경기·온라인 상담 가능</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* 상담box */}
                    <div className="basis-0 box-border content-stretch flex grow items-center justify-between min-h-px min-w-px overflow-clip pl-[10px] pr-0 py-0 relative shrink-0 w-full">
                      <button
                        onClick={() => toggleFavorite(lawyer.id)}
                        className="relative shrink-0 size-[25px] cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          filter: favorites.has(lawyer.id) ? 'none' : 'grayscale(100%)'
                        }}
                      >
                        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imageAssets.favoriteIcon} />
                      </button>
                      <p className="font-['Inter:Bold',_'Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[10px] text-black text-nowrap whitespace-pre cursor-pointer hover:underline">상담하러 가기 →</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="bg-white content-stretch flex h-[100px] items-center justify-between relative shrink-0 w-full">
        <div className="basis-0 bg-[#9ec3e5] box-border content-stretch flex grow h-[100px] items-center justify-between min-h-px min-w-px overflow-clip pl-[50px] pr-0 py-0 relative shrink-0">
          <div className="basis-0 content-stretch flex flex-col grow items-start justify-center min-h-px min-w-px overflow-clip relative shrink-0">
            <div className="[text-shadow:rgba(0,0,0,0.25)_1px_1px_1px] font-['Inter:Extra_Light',_'Noto_Sans_KR:Light',_sans-serif] font-extralight leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">
              <p className="mb-0">"LAW MATE는 법률 자문을 대체하지 않으며, AI가 제공하는 내용은 참고용 자료입니다. 실제 법률 자문은 반드시 변호사와 상담하시기 바랍니다."</p>
              <p>"고객의 개인정보는 안전하게 보호되며, 최소한의 정보만 수집·활용합니다."</p>
            </div>
            <p className="[text-shadow:rgba(0,0,0,0.25)_1px_1px_1px] font-['Inter:Extra_Light',_sans-serif] font-extralight leading-[normal] min-w-full not-italic relative shrink-0 text-[10px] text-right text-white" style={{ width: "min-content" }}>© 2025 LAW MATE. All Rights Reserved.</p>
            <div className="content-stretch flex font-extralight gap-[10px] items-center justify-end leading-[normal] not-italic overflow-clip relative shrink-0 text-[10px] text-nowrap text-white w-full whitespace-pre">
              <p className="[text-shadow:rgba(0,0,0,0.25)_1px_1px_1px] font-['Inter:Extra_Light',_'Noto_Sans_KR:Light',_sans-serif] relative shrink-0">대표자: 백정현, 이도원, 김석주</p>
              <p className="[text-shadow:rgba(0,0,0,0.25)_1px_1px_1px] font-['Inter:Extra_Light',_'Noto_Sans_KR:Light',_sans-serif] relative shrink-0">전화: +82 10-2450-2676</p>
              <p className="[text-shadow:rgba(0,0,0,0.25)_1px_1px_1px] font-['Inter:Extra_Light',_sans-serif] relative shrink-0">Email: rlatjrwn2676@naver.com</p>
            </div>
          </div>
          <div className="h-[100px] relative shrink-0 w-[300px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[297.62%] left-0 max-w-none top-[-98.81%] w-full" src={imageAssets.lawmateLogo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}