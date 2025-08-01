import { useNavigate } from 'react-router-dom';
import GradeMini from './GradeMini';
type GradeType = 'VIP' | 'VVIP' | '우수';
type MembershipCardProps = {
  name: string;
  description: string;
  grade: GradeType | GradeType[];
  imageUrl: string;
  onClick?: () => void;
};
export default function MembershipCard({
  name,
  description,
  grade,
  imageUrl,
  onClick,
}: MembershipCardProps) {
  const navigate = useNavigate();
  const imageSrc = imageUrl;
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/membership/detail/${encodeURIComponent(name)}`);
    }
  };
  return (
    <div
      className="relative w-[353px] h-[85px] cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleClick();
      }}
    >
      {/* 배경 테두리 박스 */}
      <div className="absolute left-0 top-0 w-full h-full rounded-[12px] border-[0.5px] border-gray-400 bg-white" />
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
            src={imageSrc}
            alt={name}
            onError={(e) => {
              e.currentTarget.src = '/images/default-franchise.png'; // fallback 이미지
            }}
            className="absolute left-[13.5px] top-[12.5px] w-[37px] h-[37px] object-contain"
          />
        </div>
        {/* 텍스트 정보 */}
        <div className="flex flex-col w-[249.92px]">
          <div className="flex flex-col gap-[2px]">
            <p className="text-xs font-bold text-black">{name}</p>
            <p className="text-s font-bold text-black truncate">{description}</p>
          </div>
          {/* 등급 뱃지 */}
          <div className="mt-[6px] flex items-center gap-1.5">
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
