import React, { useState } from 'react';

// Tailwind 클래스명 → 실제 색상값 매핑 (conic-gradient에 색상값 필요)
const tailwindColors = {
  'bg-white': '#FFFFFF',
  'bg-pink-100': '#FCE7F3',
};

// prizeData를 컴포넌트 밖으로 빼서 초기값 계산 시에도 참조할 수 있도록 함
const prizeData = [
  { id: 1, prizeName: '스타벅스\n아메리카노', probability: 90 },
  { id: 2, prizeName: '베스킨라빈스\n파인트', probability: 0.75 },
  { id: 3, prizeName: 'LG\ngram', probability: 0.15 },
  { id: 4, prizeName: '아이패드', probability: 0.04 },
  { id: 5, prizeName: '테슬라', probability: 0.01 },
  { id: 6, prizeName: 'CGV\n영화관람권', probability: 5 },
];

const sectionAngle = 360 / prizeData.length;

// 룰렛 이벤트 ID를 상수로 정의 (이 값은 실제 이벤트 ID에 맞춰야 합니다)
const ROULETTE_EVENT_ID = 1;

const ProbabilityRoulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  // 로컬스토리지 값으로 상태 초기화
  const [hasSpun, setHasSpun] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rouletteHasSpun') === 'true';
    }
    return false;
  });

  const [result, setResult] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const savedResult = localStorage.getItem('rouletteResult');
      return savedResult ? JSON.parse(savedResult) : null;
    }
    return null;
  });

  const [showResult, setShowResult] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rouletteHasSpun') === 'true';
    }
    return false;
  });

  const [rotation, setRotation] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedResultItem = localStorage.getItem('rouletteResult');
      if (savedResultItem) {
        const savedResult = JSON.parse(savedResultItem);
        const savedIndex = prizeData.findIndex((item) => item.id === savedResult.id);
        if (savedIndex !== -1) {
          return 360 - savedIndex * sectionAngle - sectionAngle / 2;
        }
      }
    }
    return 0;
  });

  // 백엔드로 결과를 전송하는 함수
  const sendResultToBackend = async (prize) => {
    setIsSaving(true);
    setApiMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('로그인 정보가 없습니다. 다시 로그인해주세요.');
      }

      const response = await fetch(
        `https://dev.unear.site/api/app/roulette/spin/${ROULETTE_EVENT_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          // [핵심 수정] body에 participated 필드를 추가합니다.
          body: JSON.stringify({
            reward: prize.prizeName.replace('\n', ' '),
            participated: 1, // 참여했으므로 true 값을 함께 보냅니다.
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || '알 수 없는 오류가 발생했습니다.');
      }

      console.log('서버 저장 성공:', responseData);
    } catch (error) {
      console.error('API 요청 오류:', error);
      if (error.message.includes('Failed to fetch')) {
        setApiMessage('오류: 서버에 연결할 수 없습니다. 네트워크나 CORS 설정을 확인해주세요.');
      } else {
        setApiMessage(`오류: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getRandomResult = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < prizeData.length; i++) {
      cumulative += prizeData[i].probability;
      if (random <= cumulative) return i;
    }
    return 0;
  };

  const handleClick = () => {
    if (isSpinning || hasSpun || isSaving) return;
    setIsSpinning(true);
    setShowResult(false);
    setApiMessage('');

    const selectedIndex = getRandomResult();
    const minFullSpins = 3;
    const targetRotation =
      360 * minFullSpins + (360 - selectedIndex * sectionAngle - sectionAngle / 2);

    setRotation(targetRotation);
    setHasSpun(true);

    setTimeout(() => {
      const finalResult = prizeData[selectedIndex];
      setResult(finalResult);
      setIsSpinning(false);
      setShowResult(true);

      localStorage.setItem('hasSpunRoulette', 'true');
      localStorage.setItem('rouletteResult', JSON.stringify(finalResult));

      sendResultToBackend(finalResult);
    }, 4000);
  };

  const generateConicGradient = () => {
    let gradient = '';
    let angleStart = 0;
    prizeData.forEach((_, index) => {
      const angleEnd = angleStart + sectionAngle;
      const colorClass = index % 2 === 0 ? 'bg-white' : 'bg-pink-100';
      const colorValue = tailwindColors[colorClass];
      gradient += `${colorValue} ${angleStart}deg ${angleEnd}deg${
        index < prizeData.length - 1 ? ', ' : ''
      }`;
      angleStart = angleEnd;
    });
    return `conic-gradient(${gradient})`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white">
      <div className="relative w-80 h-80 max-w-sm rounded-full bg-gray-100 shadow-2xl mb-8">
        {/* ... 룰렛 판 UI ... */}
        {/* 핀 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-pink-500" />
        </div>

        {/* 룰렛 판 */}
        <div
          className="absolute top-3 left-3 right-3 bottom-3 rounded-full border-4 border-pink-200 overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'transform 4s ease-out',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: generateConicGradient() }}
          />

          {/* 각 칸 텍스트 */}
          {prizeData.map((item, i) => (
            <div
              key={item.id}
              className="absolute inset-0 flex justify-center items-start text-center text-black text-xs"
              style={{ transform: `rotate(${i * sectionAngle + sectionAngle / 2}deg)` }}
            >
              <div className="flex flex-col items-center mt-4">
                {item.prizeName.split('\n').map((line, index) => (
                  <p key={index} className="text-black font-medium text-[11px] leading-tight px-1">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* 구분선 */}
          {prizeData.map((_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-1/2 left-1/2 w-0.5 -ml-0.25 bg-pink-200"
              style={{
                transform: `rotate(${index * sectionAngle}deg)`,
                transformOrigin: 'bottom',
              }}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-pink-400 flex items-center justify-center shadow-lg">
          <button
            className="w-20 h-20 rounded-full bg-pink-500 text-white text-lg font-bold flex items-center justify-center hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClick}
            disabled={isSpinning || hasSpun || isSaving}
          >
            {isSpinning || isSaving ? '' : hasSpun ? '완료' : '도전'}
          </button>
        </div>
      </div>

      {/* 결과 표시 */}
      {showResult && result && (
        <div className="p-4 bg-white text-black rounded-xl shadow-xl animate-bounce max-w-sm w-full text-center">
          <p className="text-lg text-pink-500 font-semibold">
            {result.prizeName.replace('\n', ' ')}
          </p>
        </div>
      )}

      {/* 로딩 및 API 메시지 표시 */}
      {(isSpinning || isSaving) && (
        <div className="mt-4 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span className="text-sm">
            {isSpinning ? '두근두근...' : '결과를 저장하고 있어요...'}
          </span>
        </div>
      )}

      {apiMessage && (
        <p className="mt-2 text-sm text-center font-semibold text-white bg-black bg-opacity-30 px-3 py-1 rounded-full">
          {apiMessage}
        </p>
      )}
    </div>
  );
};

export default ProbabilityRoulette;
