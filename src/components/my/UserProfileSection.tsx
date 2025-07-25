import Grade from '@/components/common/Grade';
import MyPageNubiImage from '@/assets/my/mypagenubi.png';
import type { UserProfile } from '@/types/myPage';

interface UserProfileSectionProps extends UserProfile {
  onLogout?: () => void;
}

const UserProfileSection = ({
  name,
  grade,
  greeting = '오늘도 알뜰한 하루 되세요! ✨',
  onLogout,
}: UserProfileSectionProps) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('로그아웃 실행');
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="px-5 py-6">
        <div className="flex">
          {/* 캐릭터와 사용자 정보 */}
          <div className="flex gap-4 w-full">
            {/* 마이페이지 누비 캐릭터 */}
            <img src={MyPageNubiImage} alt="마이페이지 누비" className="w-[89px] h-[89px]" />

            {/* 사용자 정보 */}
            <div className="flex flex-col gap-2 mt-4 w-full">
              {/* 이름, 등급, 로그아웃 한 줄 */}
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <h2 className="text-lm font-semibold text-black">{name}님</h2>
                  <div className="mt-0.5">
                    <Grade grade={grade} />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-s font-regular text-gray-400 underline"
                  type="button"
                >
                  로그아웃
                </button>
              </div>

              {/* 인사말 */}
              <p className="text-m font-regular text-gray-400">{greeting}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection;
