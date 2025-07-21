import React from 'react';
import GradeMini from './GradeMini';
type GradeType = 'VIP' | 'VVIP' | '우수';

type MembershipCardProps = {
  name: string;
  description: string;
  grade: GradeType | GradeType[]; // ✅ 배열도 받을 수 있게 수정
  imageUrl: string;
};

export default function MembershipCard({
  name,
  description,
  grade,
  imageUrl,
}: MembershipCardProps) {
  return (
    <div className="relative w-[353px] h-[85px]">
      {/* 배경 테두리 박스 */}
      <div className="absolute left-0 top-0 w-full h-full rounded-xl border border-zinc-400 bg-white" />

      {/* 콘텐츠 영역 */}
      <div className="flex justify-start items-center absolute left-2 top-2.5 gap-3">
        {/* 원형 이미지 */}
        <div className="relative w-[64.46px] h-[63px]">
          <svg
            width={65}
            height={63}
            viewBox="0 0 65 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-0 top-0"
            preserveAspectRatio="none"
          >
            <path
              d="M32.3928 0.5C49.9279 0.5 64.1233 14.39 64.1233 31.5C64.1233 48.61 49.9279 62.5 32.3928 62.5C14.8577 62.5 0.662354 48.61 0.662354 31.5C0.662354 14.39 14.8577 0.5 32.3928 0.5Z"
              className="fill-white stroke-gray-300"
            />
          </svg>
          <img
            src={imageUrl}
            alt={name}
            className="absolute left-[13.5px] top-[12.5px] w-[37.43px] h-[37.43px] object-contain"
          />
        </div>

        {/* 텍스트 정보 */}
        <div className="flex flex-col gap-1 w-[249.92px]">
          <p className="text-xs font-bold text-black">{name}</p>
          <p className="text-s font-bold text-black">{description}</p>

          {/* 등급 뱃지 */}
          <div className="flex items-center gap-1.5">
            {Array.isArray(grade) ? (
              grade.map((g, index) => <GradeMini key={index} grade={g} />)
            ) : (
              <GradeMini grade={grade} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
