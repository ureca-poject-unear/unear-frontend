import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MiniButton from '@/components/common/MiniButton';
import CommonModal from '@/components/common/CommonModal';
import type { Prize } from '@/components/junior/ProbabilityRoulette';
import ProbabilityRoulette from '@/components/junior/ProbabilityRoulette';
import { sendRouletteResult } from '@/apis/roulette';

type Stamp = {
  name: string;
  date?: string;
  isStamped: boolean;
};

type Props = {
  stamps: Stamp[];
  eventId: number;
  hasExistingResult: boolean;
  isRouletteEnabledByServer: boolean;
};

const StampRouletteCard: React.FC<Props> = ({
  stamps,
  eventId,
  hasExistingResult,
  isRouletteEnabledByServer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isRouletteSpun, setIsRouletteSpun] = useState(hasExistingResult);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsRouletteSpun(hasExistingResult);
  }, [hasExistingResult]);

  const displayStamps: Stamp[] = [...stamps];
  while (displayStamps.length < 4) {
    displayStamps.push({ name: '-', isStamped: false });
  }

  const isButtonActive = isRouletteEnabledByServer && !isRouletteSpun && !isProcessing;

  let buttonText = '룰렛 돌리기';
  if (isProcessing) {
    buttonText = '결과 저장 중...';
  } else if (isRouletteSpun) {
    buttonText = '참여 완료';
  } else if (!isRouletteEnabledByServer) {
  }

  const handleRouletteClick = () => {
    if (!isButtonActive) return;
    if (isRouletteSpun) {
      alert('이미 룰렛에 참여하셨습니다.');
      return;
    }
    if (isProcessing) return;
    if (!isRouletteEnabledByServer) {
      alert('룰렛이 아직 활성화되지 않았습니다.');
      return;
    }
    const token = sessionStorage.getItem('temp_access_token');
    if (!token) {
      alert('룰렛을 돌리려면 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleRouletteFinish = async (prize: Prize) => {
    if (isRouletteSpun || isProcessing) return;

    setIsProcessing(true);
    setIsModalOpen(false);

    try {
      await sendRouletteResult(eventId, prize.prizeName);
      setIsRouletteSpun(true);
      alert(`축하합니다! '${prize.prizeName.replace('\n', ' ')}'에 당첨되셨습니다!`);
    } catch (error) {
      console.error('룰렛 결과 저장 오류:', error);
      const errorMessage =
        error instanceof Error ? error.message : '룰렛 결과 저장 중 오류가 발생했습니다.';

      if (errorMessage.includes('이미') || errorMessage.includes('already')) {
        setIsRouletteSpun(true);
        alert('이미 룰렛에 참여하셨습니다.');
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-white p-5">
      <div className="m-2">
        <p className="text-lm font-bold text-black">스탬프</p>
      </div>
      <div className="rounded-lg p-4 space-y-3 border-2 border-zinc-100">
        {' '}
        {/* Added padding and spacing */}
        <div className="flex items-start">
          <svg
            width={21}
            height={20}
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mr-2 mt-0.5"
          >
            <path
              d="M8.93359 5V7H10.9336V15H12.9336V5H8.93359ZM10.9336 0C12.2468 0 13.5472 0.258658 14.7604 0.761205C15.9737 1.26375 17.0761 2.00035 18.0047 2.92893C18.9332 3.85752 19.6698 4.95991 20.1724 6.17317C20.6749 7.38642 20.9336 8.68678 20.9336 10C20.9336 12.6522 19.88 15.1957 18.0047 17.0711C16.1293 18.9464 13.5858 20 10.9336 20C9.62037 20 8.32001 19.7413 7.10676 19.2388C5.8935 18.7362 4.79111 17.9997 3.86253 17.0711C1.98716 15.1957 0.933594 12.6522 0.933594 10C0.933594 7.34784 1.98716 4.8043 3.86253 2.92893C5.73789 1.05357 8.28143 0 10.9336 0Z"
              fill="#E6007E"
            />
          </svg>
          <div>
            <p className="text-sm text-[#333]">제휴 매장 방문</p>
            <p className="text-xs  font-light text-gray-500">
              매장 리스트에서 원하는 매장을 선택해서 방문하세요
            </p>
            <p className="text-xs  font-light text-gray-500">
              필수 매장 1개, 이벤트 매장 3개를 방문해야되요
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <svg
            width={21}
            height={20}
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mr-2 mt-0.5"
          >
            <path
              d="M7.93359 5V7H11.9336V9H9.93359C9.40316 9 8.89445 9.21071 8.51938 9.58579C8.14431 9.96086 7.93359 10.4696 7.93359 11V15H13.9336V13H9.93359V11H11.9336C12.464 11 12.9727 10.7893 13.3478 10.4142C13.7229 10.0391 13.9336 9.53043 13.9336 9V7C13.9336 6.46957 13.7229 5.96086 13.3478 5.58579C12.9727 5.21071 12.464 5 11.9336 5H7.93359ZM10.9336 0C12.2468 0 13.5472 0.258658 14.7604 0.761205C15.9737 1.26375 17.0761 2.00035 18.0047 2.92893C18.9332 3.85752 19.6698 4.95991 20.1724 6.17317C20.6749 7.38642 20.9336 8.68678 20.9336 10C20.9336 12.6522 19.88 15.1957 18.0047 17.0711C16.1293 18.9464 13.5858 20 10.9336 20C9.62037 20 8.32001 19.7413 7.10676 19.2388C5.8935 18.7362 4.79111 17.9997 3.86253 17.0711C1.98716 15.1957 0.933594 12.6522 0.933594 10C0.933594 7.34784 1.98716 4.8043 3.86253 2.92893C5.73789 1.05357 8.28143 0 10.9336 0Z"
              fill="#E6007E"
            />
          </svg>
          <div>
            <p className="text-sm text-[#333]">결제 후 스탬프 획득</p>
            <p className="text-xs font-light text-gray-500">
              매장에서 결제시 자동으로 스탬프가 적립됩니다.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <svg
            width={21}
            height={20}
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 mr-2 mt-0.5"
          >
            <path
              d="M13.9336 13V11.5C13.9336 11.1022 13.7756 10.7206 13.4943 10.4393C13.2129 10.158 12.8314 10 12.4336 10C12.8314 10 13.2129 9.84196 13.4943 9.56066C13.7756 9.27936 13.9336 8.89782 13.9336 8.5V7C13.9336 6.46957 13.7229 5.96086 13.3478 5.58579C12.9727 5.21071 12.464 5 11.9336 5H7.93359V7H11.9336V9H9.93359V11H11.9336V13H7.93359V15H11.9336C12.464 15 12.9727 14.7893 13.3478 14.4142C13.7229 14.0391 13.9336 13.5304 13.9336 13ZM10.9336 0C12.2468 0 13.5472 0.258658 14.7604 0.761205C15.9737 1.26375 17.0761 2.00035 18.0047 2.92893C18.9332 3.85752 19.6698 4.95991 20.1724 6.17317C20.6749 7.38642 20.9336 8.68678 20.9336 10C20.9336 12.6522 19.88 15.1957 18.0047 17.0711C16.1293 18.9464 13.5858 20 10.9336 20C9.62037 20 8.32001 19.7413 7.10676 19.2388C5.8935 18.7362 4.79111 17.9997 3.86253 17.0711C1.98716 15.1957 0.933594 12.6522 0.933594 10C0.933594 7.34784 1.98716 4.8043 3.86253 2.92893C5.73789 1.05357 8.28143 0 10.9336 0Z"
              fill="#E6007E"
            />
          </svg>
          <div>
            <p className="text-sm text-[#333]">4개 획득 시 룰렛 참여</p>
            <p className="text-xs font-light text-gray-500">
              스탬프를 4개 모으면 경품 룰렛에 참여 할 수 있어요
            </p>
          </div>
        </div>
      </div>
      <div className="mt-2"></div>
      <div className="w-full h-59 rounded-xl bg-gray-50 flex flex-col justify-between p-4">
        <div className="flex justify-around items-start">
          {displayStamps.map((stamp, idx) => {
            const isFirst = idx === 0;
            return (
              <div key={idx} className="relative flex flex-col items-center w-[60px] h-[90px]">
                {isFirst && <></>}
                <p className="text-xs text-gray-500 text-center z-10 h-[14px]">
                  {stamp.date || '\u00A0'}
                </p>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    stamp.isStamped ? 'bg-transparent' : 'bg-zinc-300'
                  }`}
                >
                  {stamp.isStamped ? (
                    <div
                      className={`w-12 h-15 rounded-full flex items-center justify-center ${
                        isFirst ? 'bg-pink-300' : 'bg-blue-300'
                      }`}
                    >
                      {/* SVG: 당첨 스탬프 */}
                      <svg
                        width={48}
                        height={48}
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12"
                        preserveAspectRatio="none"
                      >
                        <g clipPath="url(#clip0)">
                          <g clipPath="url(#clip1)">
                            <path
                              d="M19.84 28.76C20.62 24.89 20.73 22.63 20.23 21.24C20.11 20.94 19.95 20.66 19.75 20.41C18.51 18.69 17.95 17.34 17.74 16.51C17.62 16.02 17.57 15.52 17.6 15.01C17.67 13.7 18.13 12.44 18.9 11.37C20.19 9.57 22.6 9.01 23.64 9C24.69 9.01 27.16 9.57 28.45 11.37C29.22 12.44 29.67 13.7 29.75 15.01C29.77 15.52 29.73 16.02 29.61 16.51C29.39 17.34 28.83 18.68 27.6 20.41C27.4 20.66 27.24 20.94 27.12 21.24C26.62 22.63 26.66 24.89 27.44 28.76M26.68 24.2H20.6M32.25 36.36H15.03C14.55 36.36 14.32 36.36 14.13 36.3C13.6 36.12 13.19 35.61 13.05 34.95C13 34.71 13 34.42 13 33.83C13 32.65 13 32.06 13.1 31.58C13.38 30.27 14.2 29.24 15.25 28.89C15.64 28.76 16.11 28.76 17.05 28.76H30.23C31.17 28.76 31.64 28.76 32.03 28.89C33.08 29.24 33.9 30.27 34.18 31.58C34.28 32.06 34.28 32.65 34.28 33.83C34.28 34.42 34.28 34.71 34.23 34.95C34.09 35.61 33.68 36.12 33.15 36.3C32.96 36.36 32.73 36.36 32.25 36.36Z"
                              stroke="white"
                              strokeWidth={3}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width={48} height={48} rx={24} fill="white" />
                          </clipPath>
                          <clipPath id="clip1">
                            <rect
                              width="36.48"
                              height="36.48"
                              fill="white"
                              transform="translate(6)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center opacity-33">
                      {/* 비활성 스탬프 SVG (회색 처리됨) */}
                      <svg
                        width={48}
                        height={48}
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12"
                        preserveAspectRatio="none"
                      >
                        <circle cx="24" cy="24" r="24" fill="#E5E7EB" />
                      </svg>
                    </div>
                  )}
                </div>
                <p
                  className={`mt-1 font-semibold text-center z-10 ${
                    isFirst ? 'text-pink-500' : 'text-black'
                  } ${stamp.name.length > 6 ? 'text-[10px] whitespace-nowrap' : 'text-xs'}`}
                >
                  {stamp.name}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-2">
          <MiniButton text={buttonText} onClick={handleRouletteClick} isActive={isButtonActive} />
        </div>
      </div>
      <CommonModal isOpen={isModalOpen} onClose={handleModalClose} title="행운의 룰렛">
        <ProbabilityRoulette onFinish={handleRouletteFinish} />
      </CommonModal>
    </div>
  );
};

export default StampRouletteCard;
