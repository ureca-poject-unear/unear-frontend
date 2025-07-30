import React, { useState } from 'react';
import MiniButton from '@/components/common/MiniButton';
import CommonModal from '@/components/common/CommonModal';
import ProbabilityRoulette from '@/components/junior/ProbabilityRoulette';

type Stamp = {
  name: string;
  date?: string;
  isStamped: boolean;
};

type Props = {
  stamps: Stamp[]; // 최대 4개
  onRouletteClick: () => void;
  hasAlreadySpun: boolean; // 사용자가 이미 룰렛을 돌렸는지 여부
};

const StampRouletteCard: React.FC<Props> = ({ stamps, onRouletteClick, hasAlreadySpun }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayStamps: Stamp[] = [...stamps];

  // 부족한 스탬프를 빈 슬롯으로 채우기
  while (displayStamps.length < 4) {
    displayStamps.push({ name: '-', isStamped: false });
  }

  // 모든 스탬프가 찍혔는지 여부
  const isAllStamped = displayStamps.every((stamp) => stamp.isStamped);

  // [수정] 버튼 활성화 조건: 모든 스탬프가 찍혀있고, 아직 룰렛을 돌리지 않았어야 함
  const isButtonActive = isAllStamped && !hasAlreadySpun;

  // [수정] 룰렛 참여 여부에 따라 버튼 텍스트 변경
  const buttonText = hasAlreadySpun ? '참여 완료' : '룰렛 돌리기';

  // 룰렛 버튼 클릭 시 모달 열기
  const handleRouletteClick = () => {
    // 활성화 상태일 때만 모달 열기 및 콜백 함수 실행
    if (isButtonActive) {
      setIsModalOpen(true);
      onRouletteClick();
    }
  };

  return (
    <div className="relative w-[393px] h-[210px] mx-auto bg-white  p-5">
      <h2 className="absolute left-5 top-3 text-lm font-bold text-black">스탬프</h2>

      <div className="w-[353px] h-36 rounded-xl bg-zinc-100 absolute left-[19.5px] top-[50px] flex flex-col justify-between p-4">
        <div className="flex justify-between items-start">
          {displayStamps.map((stamp, idx) => {
            const isFirst = idx === 0;

            return (
              <div key={idx} className="relative flex flex-col items-center w-[60px] h-[90px]">
                {isFirst && (
                  <>
                    {/* 필수 매장 배경 */}
                    <div className="absolute -top-[4px] -left-[10px] w-[79px] h-[90px] rounded-xl bg-pink-100 z-0" />
                    {/* 필수 매장 텍스트 */}
                    <p className="absolute -top-3 text-xs font-semibold text-[#e6007e] z-10">
                      필수 매장
                    </p>
                  </>
                )}

                <p className="text-xs text-gray-500 text-center z-10 h-[14px]">
                  {stamp.date || '\u00A0'}
                </p>

                {/* 스탬프 원 */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    stamp.isStamped ? 'bg-pink-100' : 'bg-zinc-300'
                  }`}
                >
                  {stamp.isStamped ? (
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
                        <rect width={48} height={48} rx={24} fill="#F9A8D4" />
                        <path
                          d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z"
                          fill="#E6007E"
                        />
                        <g clipPath="url(#clip1)">
                          <path
                            d="M19.8403 28.7609C20.6232 24.8878 20.7296 22.629 20.2295 21.2366C20.1084 20.9386 19.9467 20.6588 19.7491 20.4051C18.5133 18.6859 17.9524 17.3422 17.7381 16.5107C17.6182 16.0211 17.5706 15.5167 17.5967 15.0134C17.6745 13.7014 18.1254 12.4389 18.8964 11.3744C20.1884 9.56547 22.5962 9.01064 23.6405 9C24.6863 9.01064 27.1564 9.56699 28.4485 11.3744C29.2194 12.4389 29.6703 13.7014 29.7482 15.0134C29.7694 15.515 29.7314 16.0243 29.6068 16.5107C29.394 17.3422 28.8316 18.6844 27.5957 20.4051C27.3981 20.6588 27.2365 20.9386 27.1154 21.2366C26.6168 22.629 26.6594 24.8878 27.4407 28.7609M26.6806 24.2007H20.6004M32.2548 36.3613H15.0263C14.555 36.3613 14.3194 36.3613 14.1264 36.2959C13.6019 36.1211 13.193 35.6089 13.0517 34.9522C13 34.712 13 34.4186 13 33.8289C13 32.6508 13 32.0625 13.1034 31.5792C13.3846 30.2673 14.2039 29.2428 15.2527 28.8917C15.6404 28.7609 16.1116 28.7609 17.054 28.7609H30.227C31.1694 28.7609 31.6406 28.7609 32.0283 28.8901C33.0771 29.2413 33.8964 30.2658 34.1776 31.5776C34.281 32.061 34.281 32.6493 34.281 33.8273C34.281 34.4171 34.281 34.712 34.2293 34.9522C34.088 35.6089 33.6791 36.1211 33.1546 36.2959C32.9616 36.3613 32.726 36.3613 32.2548 36.3613Z"
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
                            width="36.4817"
                            height="36.4817"
                            fill="white"
                            transform="translate(6)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center opacity-[0.33]">
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
                          <path
                            d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z"
                            fill="#E5E7EB" // bg-gray-200 색상
                          />
                          <g clipPath="url(#clip1)">
                            <path
                              d="M19.8403 28.7609C20.6232 24.8878 20.7296 22.629 20.2295 21.2366C20.1084 20.9386 19.9467 20.6588 19.7491 20.4051C18.5133 18.6859 17.9524 17.3422 17.7381 16.5107C17.6182 16.0211 17.5706 15.5167 17.5967 15.0134C17.6745 13.7014 18.1254 12.4389 18.8964 11.3744C20.1884 9.56547 22.5962 9.01064 23.6405 9C24.6863 9.01064 27.1564 9.56699 28.4485 11.3744C29.2194 12.4389 29.6703 13.7014 29.7482 15.0134C29.7694 15.515 29.7314 16.0243 29.6068 16.5107C29.394 17.3422 28.8316 18.6844 27.5957 20.4051C27.3981 20.6588 27.2365 20.9386 27.1154 21.2366C26.6168 22.629 26.6594 24.8878 27.4407 28.7609M26.6806 24.2007H20.6004M32.2548 36.3613H15.0263C14.555 36.3613 14.3194 36.3613 14.1264 36.2959C13.6019 36.1211 13.193 35.6089 13.0517 34.9522C13 34.712 13 34.4186 13 33.8289C13 32.6508 13 32.0625 13.1034 31.5792C13.3846 30.2673 14.2039 29.2428 15.2527 28.8917C15.6404 28.7609 16.1116 28.7609 17.054 28.7609H30.227C31.1694 28.7609 31.6406 28.7609 32.0283 28.8901C33.0771 29.2413 33.8964 30.2658 34.1776 31.5776C34.281 32.061 34.281 32.6493 34.281 33.8273C34.281 34.4171 34.281 34.712 34.2293 34.9522C34.088 35.6089 33.6791 36.1211 33.1546 36.2959C32.9616 36.3613 32.726 36.3613 32.2548 36.3613Z"
                              stroke="#333"
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
                              width="36.4817"
                              height="36.4817"
                              fill="white"
                              transform="translate(6)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>

                <p
                  className={`mt-1 text-xs font-semibold text-center z-10 ${isFirst ? 'text-pink-500' : 'text-black'}`}
                >
                  {stamp.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* 버튼 */}
        <div className="flex justify-center mt-0">
          {/* [수정] 버튼 텍스트와 활성화 상태를 새로운 변수로 제어 */}
          <MiniButton text={buttonText} onClick={handleRouletteClick} isActive={isButtonActive} />
        </div>
      </div>

      {/* 모달 */}
      <CommonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="행운의 룰렛">
        <ProbabilityRoulette />
      </CommonModal>
    </div>
  );
};

export default StampRouletteCard;
