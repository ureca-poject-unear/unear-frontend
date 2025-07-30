import React, { useState } from 'react';

// Tailwind 클래스명 → 실제 색상값 매핑 (conic-gradient에 색상값 필요)
const tailwindColors = {
  'bg-white': '#FFFFFF',
  'bg-pink-100': '#FCE7F3',
};

const ProbabilityRoulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<any>('');
  const [showResult, setShowResult] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // prizeData에 color 필드는 쓰지 않고 짝수/홀수 인덱스에 따라 색상 지정
  const prizeData = [
    { id: 1, prizeName: '스타벅스\n아메리카노', probability: 90 },
    { id: 2, prizeName: '베스킨라빈스\n파인트', probability: 0.75 },
    { id: 3, prizeName: 'LG\ngram', probability: 0.15 },
    { id: 4, prizeName: '아이패드', probability: 0.04 },
    { id: 5, prizeName: '테슬라', probability: 0.01 },
    { id: 6, prizeName: 'CGV\n영화관람권', probability: 5 },
  ];

  const sectionAngle = 360 / prizeData.length;

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
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
    setShowResult(false);
    setResult('');
    setHasSpun(true);

    const selectedIndex = getRandomResult();
    const resetRotation = rotation - (rotation % 360);
    const minFullSpins = 3;

    const targetRotation =
      resetRotation + 360 * minFullSpins + (360 - selectedIndex * sectionAngle - sectionAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setResult(prizeData[selectedIndex]);
      setIsSpinning(false);
      setShowResult(true);
    }, 4000);
  };

  // 짝수 인덱스는 bg-white, 홀수는 bg-pink-100 으로 칸 색상 적용 (conic-gradient용 색상값 매핑)
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
        {/* 핀 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary rotate-180" />
        </div>

        {/* 룰렛 판 */}
        <div
          className="absolute top-3 left-3 right-3 bottom-3 rounded-full border-4 border-pink-200 overflow-hidden transition-transform ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transitionDuration: isSpinning ? '4000ms' : '0ms',
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
              className="absolute top-0 bottom-1/2 left-1/2 w-0.5 -ml-0.25 bg-pink-100"
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
            className="w-20 h-20 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClick}
            disabled={isSpinning || hasSpun}
          >
            {isSpinning ? '' : hasSpun ? '완료' : '도전'}
          </button>
        </div>
      </div>

      {/* 결과 표시 */}
      {showResult && result && (
        <div className="p-1 bg-white text-black rounded-xl shadow-xl animate-bounce max-w-sm w-full text-center">
          <p className="text-lg font-bold text-primary mb-2">
            {result.prizeName.split('\n').map((line: string, i: number) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* 로딩 표시 */}
      {isSpinning && (
        <div className="mt-4 flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span className="text-sm">룰렛이 돌고 있습니다...</span>
        </div>
      )}
    </div>
  );
};

export default ProbabilityRoulette;
