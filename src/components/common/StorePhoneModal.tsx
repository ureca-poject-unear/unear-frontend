import type React from 'react';
import { useState } from 'react';
import LocationButton from './LocationButton';
import CallButton from './CallButton';
import CopyIcon from '@/assets/my/copy.svg?react';
import type { BookmarkStore } from '@/types/bookmark';

interface StorePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: BookmarkStore;
}

const StorePhoneModal: React.FC<StorePhoneModalProps> = ({ isOpen, onClose, store }) => {
  const [isCopied, setIsCopied] = useState(false);
  const phoneNumber = store.phoneNumber || '전화번호 없음';

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopyPhoneNumber = async () => {
    if (phoneNumber === '전화번호 없음') {
      return; // 전화번호가 없으면 복사 불가
    }
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('전화번호 복사 실패:', err);
    }
  };

  const handlePhoneCall = () => {
    if (phoneNumber === '전화번호 없음') {
      return; // 전화번호가 없으면 전화 걸기 불가
    }
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleLocationView = () => {
    console.log('위치 보기 클릭됨');
    // 위치 보기 로직 구현
  };

  const getStatusText = () => {
    switch (store.status) {
      case '영업중':
        return '영업중';
      case '영업종료':
        return '영업종료';
      case '필수 매장':
        return '영업중';
      case '이벤트 매장':
        return '영업중';
      default:
        return '영업중';
    }
  };

  const getStatusColor = () => {
    const statusText = getStatusText();
    return statusText === '영업중' ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      <div className="relative w-full max-w-[393px]">
        <div
          className="absolute inset-0 bottom-[65px] bg-black bg-opacity-40"
          onClick={handleBackdropClick}
        />

        {/* 모달 컨테이너 */}
        <div className="absolute inset-0 bottom-[65px] flex items-center justify-center px-5">
          <div className="w-full max-w-[353px] bg-white rounded-[16px] overflow-hidden shadow-lg">
            {/* 헤더 영역 */}
            <div className="px-5 pt-[24px] pb-0 relative">
              {/* 매장명과 닫기 버튼 */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lm font-semibold text-black leading-tight flex-1 pr-3">
                  {store.name}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0"
                  aria-label="모달 닫기"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* 주소 */}
              <div className="mb-4">
                <p className="text-sm font-light text-gray-500">{store.address}</p>
              </div>

              {/* 매장 전화번호 정보 박스 */}
              <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center">
                <p className="text-lm font-bold text-gray-600 mb-2">매장 전화번호</p>
                <p className="text-xl font-semibold text-black mb-3">{phoneNumber}</p>
                <p className={`text-sm font-regular ${getStatusColor()}`}>
                  {getStatusText()} ({store.hours})
                </p>
              </div>

              {/* 안내 텍스트 */}
              <div className="mb-4">
                <p className="text-sm font-regular text-gray-400">
                  매장에 직접 전화를 걸거나 번호를 복사할 수 있어요
                </p>
              </div>

              {/* 전화번호 복사 박스 */}
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-semibold text-black">{phoneNumber}</span>
                  {phoneNumber !== '전화번호 없음' && (
                    <button
                      onClick={handleCopyPhoneNumber}
                      className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      aria-label="전화번호 복사"
                    >
                      <CopyIcon width={18} height={18} className="stroke-current fill-none" />
                    </button>
                  )}
                </div>
                {isCopied && phoneNumber !== '전화번호 없음' && (
                  <p className="text-xs text-green-500 mt-1 text-center">
                    전화번호가 복사되었습니다!
                  </p>
                )}
              </div>

              {/* 하단 버튼들 */}
              <div className="flex gap-[20px] pb-5">
                <LocationButton onClick={handleLocationView} />
                <CallButton onClick={handlePhoneCall} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePhoneModal;

/*
- 사용법
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  <StorePhoneModal
    isOpen={isPhoneModalOpen}
    onClose={() => setIsPhoneModalOpen(false)}
    store={bookmarkStore} // phoneNumber는 store에서 가져옴
  />
*/
