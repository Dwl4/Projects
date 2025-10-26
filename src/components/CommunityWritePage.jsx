import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as communityService from '../api/communityService';

const CommunityWritePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('잡담');
  const [loading, setLoading] = useState(false);

  // 카테고리 옵션
  const categories = [
    { value: '잡담', label: '잡담' },
    { value: '고민/상담', label: '고민/상담' },
    { value: '후기', label: '후기' },
  ];

  // 게시글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
      };

      console.log('📝 게시글 작성 요청:', postData);
      const response = await communityService.createPost(postData);
      console.log('✅ 게시글 작성 성공:', response);

      alert('게시글이 작성되었습니다.');
      navigate('/community'); // 커뮤니티 목록으로 이동
    } catch (error) {
      console.error('❌ 게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 취소 버튼
  const handleCancel = () => {
    if (title || content) {
      if (window.confirm('작성 중인 내용이 있습니다. 취소하시겠습니까?')) {
        navigate('/community');
      }
    } else {
      navigate('/community');
    }
  };

  return (
    <div className="w-full bg-white mx-auto">
      <div className="px-[50px] py-[40px]">
        {/* 제목 */}
        <div className="mb-[30px]">
          <h1 className="text-[30px] font-bold text-black">글쓰기</h1>
        </div>

        {/* 작성 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 카테고리 선택 */}
          <div className="mb-[20px]">
            <label className="block text-[16px] font-bold text-black mb-[10px]">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-[200px] px-[15px] py-[10px] border-2 border-[#d9d9d9] rounded-[8px] text-[15px] focus:border-[#9ec3e5] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 입력 */}
          <div className="mb-[20px]">
            <label className="block text-[16px] font-bold text-black mb-[10px]">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
              className="w-full px-[15px] py-[12px] border-2 border-[#d9d9d9] rounded-[8px] text-[15px] focus:border-[#9ec3e5] focus:outline-none"
            />
            <p className="text-[13px] text-gray-500 mt-[5px]">
              {title.length}/100자
            </p>
          </div>

          {/* 내용 입력 */}
          <div className="mb-[30px]">
            <label className="block text-[16px] font-bold text-black mb-[10px]">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={15}
              className="w-full px-[15px] py-[12px] border-2 border-[#d9d9d9] rounded-[8px] text-[15px] resize-none focus:border-[#9ec3e5] focus:outline-none"
            />
            <p className="text-[13px] text-gray-500 mt-[5px]">
              {content.length}자
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-center gap-[15px]">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-[40px] py-[12px] bg-white border-2 border-[#d9d9d9] text-[#666] rounded-[8px] text-[16px] font-medium hover:bg-gray-50 active:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-[40px] py-[12px] bg-[#9ec3e5] text-white rounded-[8px] text-[16px] font-medium hover:bg-[#7da9d3] active:bg-[#6b98c2] shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '작성 중...' : '작성 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityWritePage;
