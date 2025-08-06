import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import BookmarkCard from '@/components/common/BookmarkCard';
import PointNubiImage from '@/assets/story/pointNubi.png';
import StarBackgroundImage from '@/assets/story/starBackground.png';
import type { BookmarkStore } from '@/types/bookmark';
import { getRecommendedPlaces } from '@/apis/getStoryRecommend';
import { useAuthStore } from '@/store/auth';

const StoryRecommendPage = () => {
  const location = useLocation();
  const diagnosisLabel = location.state?.diagnosis?.label ?? '쩝쩝박사';

  const [stores, setStores] = useState<BookmarkStore[]>([]);
  const user = useAuthStore((state) => state.userInfo);

  const handleBookmarkToggle = (storeId: string) => {
    setStores((prev: BookmarkStore[]) =>
      prev.map((store: BookmarkStore) =>
        store.id === storeId ? { ...store, isBookmarked: !store.isBookmarked } : store
      )
    );
  };

  useEffect(() => {
    const fetchRecommendedStores = async () => {
      if (!user) return;

      console.log('🔎 사용자 정보:', user);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('📤 API 요청 바디:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            user: {
              userId: user.userId,
              username: user.username,
              email: user.email,
              tel: user.tel ?? '',
              birthdate: user.birthdate ?? '',
              gender: user.gender ?? '',
              membershipCode: user.membershipCode,
              provider: user.provider ?? '',
              providerId: user.providerId ?? '',
            },
          });

          try {
            console.log('📍 내 위치 좌표:', position.coords.latitude, position.coords.longitude);
            const data = await getRecommendedPlaces({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                tel: user.tel ?? '',
                birthdate: user.birthdate ?? '',
                gender: user.gender ?? '',
                membershipCode: user.membershipCode,
                provider: user.provider ?? '',
                providerId: user.providerId ?? '',
              },
            });

            console.log('추천 장소 API 응답:', data);
            const storeList: BookmarkStore[] = data.map((item) => ({
              id: String(item.placeId),
              placeId: item.placeId,
              name: item.placeName,
              address: '',
              distance: `${(item.distanceInMeters / 1000).toFixed(1)}km`,
              hours: '',
              category: 'CAFE',
              storeClass: 'LOCAL',
              event: 'NONE',
              isBookmarked: false,
              latitude: item.latitude,
              longitude: item.longitude,
            }));

            setStores(storeList);
          } catch (err) {
            console.error('추천 매장 불러오기 실패:', err);
          }
        },
        (error) => {
          console.error('위치 정보를 가져오는 데 실패했습니다:', error);
        }
      );
    };

    fetchRecommendedStores();
  }, [user]);

  return (
    <div className="overflow-hidden w-full h-full bg-storybackground1">
      <Header title="추천 매장" bgColor="bg-story" textColor="text-white" iconColor="text-white" />

      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover -z-100 opacity-40"
        style={{ backgroundImage: `url(${StarBackgroundImage})` }}
      />

      {/* 컨텐츠 */}
      <div className="relative z-10 mx-5 pt-4 pb-6">
        {/* 상단 진단 결과 섹션 */}
        <div className="flex items-center justify-between py-2 mb-6">
          <div>
            <p className="text-white text-lm font-bold mb-1">[{diagnosisLabel}]</p>
            <p className="text-white text-m font-semibold mb-2">
              {user?.username ?? '사용자'}님이 좋아할 만한 제휴처
            </p>

            <p className="text-gray-300 text-sm font-regular">
              🔥내 주변 추천 매장을 확인해보세요🔥
            </p>
          </div>
          <div>
            <img src={PointNubiImage} alt="포인트 누비" />
          </div>
        </div>

        {/* 추천 매장 리스트 */}
        <div className="space-y-4">
          {stores.map((store: BookmarkStore) => (
            <BookmarkCard
              key={store.id}
              store={store}
              onBookmarkToggle={handleBookmarkToggle}
              isDarkMode={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryRecommendPage;
