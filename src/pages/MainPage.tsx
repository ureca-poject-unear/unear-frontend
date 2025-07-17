import React, { useState } from 'react';
import StoreTypeIcon from '../components/common/StoreTypeIcon';
import MapMarkerIcon from '../components/common/MapMarkerIcon';

const MainPage = () => {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const handleMarkerClick = (markerId: string) => {
    // 이미 선택된 마커를 다시 클릭하면 선택 해제, 아니면 선택
    setSelectedMarkerId(selectedMarkerId === markerId ? null : markerId);
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-lg font-bold mb-2 text-primary">U:NEAR 프론트엔드 프로젝트</h1>

        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-m font-thin text-primary">Thin - LGEIHeadline‑Thin</h2>

          <h2 className="text-m font-light text-primary">Light - LGEIHeadline‑Light</h2>

          <h2 className="text-m font-regular font-normal text-primary">
            Regular - LGEIHeadline‑Regular
          </h2>
          <h2 className="text-m font-semibold text-primary">Semibold - LGEIHeadline‑Semibold</h2>

          <h2 className="text-m font-bold text-primary">Bold - LGEIHeadline‑Bold</h2>
        </div>
        <p className="mt-8 text-sm font-bold text-black mb-6">스타일 테스트</p>
        <div
          className="
            w-24 h-24 
            bg-storeicon        
            rounded-full 
            mx-auto 
            mb-6
          "
        />

        <div className="w-32 h-12 bg-store rounded-[12px] mx-auto mb-6" />

        <button className="bg-primary text-white px-6 py-2 rounded-[12px] text-lm">
          테스트 버튼
        </button>

        {/* StoreTypeIcon 테스트 */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-black mb-6">매장유형별 아이콘 테스트</h3>

          <div className="flex justify-center">
            <StoreTypeIcon category="cafe" storeClass="small-business" />
            <StoreTypeIcon category="activity" storeClass="event" />
            <StoreTypeIcon
              category="activity"
              storeClass="franchise"
              mode="statistics"
              shape="circle"
            />
          </div>
          <p className="text-sm mt-2 text-gray-600">프랜차이즈 카페 아이콘</p>
        </div>

        {/* MapMarkerIcon 테스트 */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-black mb-6">지도 마커 아이콘 테스트</h3>

          {/* 일반 매장 마커들 */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">일반 매장 마커</h4>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <div className="text-center">
                <MapMarkerIcon
                  category="cafe"
                  storeClass="franchise"
                  isSelected={selectedMarkerId === 'marker1'}
                  onClick={() => handleMarkerClick('marker1')}
                />
                <p className="text-xs mt-1">프랜차이즈 카페</p>
              </div>

              <div className="text-center">
                <MapMarkerIcon
                  category="food"
                  storeClass="small-business"
                  isSelected={selectedMarkerId === 'marker2'}
                  onClick={() => handleMarkerClick('marker2')}
                />
                <p className="text-xs mt-1">소상공인 음식점</p>
              </div>

              <div className="text-center">
                <MapMarkerIcon
                  category="shopping"
                  storeClass="event"
                  isSelected={selectedMarkerId === 'marker3'}
                  onClick={() => handleMarkerClick('marker3')}
                />
                <p className="text-xs mt-1">이벤트 쇼핑</p>
              </div>

              <div className="text-center">
                <MapMarkerIcon
                  category="activity"
                  storeClass="franchise"
                  isSelected={selectedMarkerId === 'marker4'}
                  onClick={() => handleMarkerClick('marker4')}
                />
                <p className="text-xs mt-1">액티비티</p>
              </div>
            </div>
          </div>

          {/* 필수 매장 마커들 */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">필수 매장 마커</h4>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <div className="text-center">
                <MapMarkerIcon
                  category="cafe"
                  storeClass="franchise"
                  isEssential={true}
                  isSelected={selectedMarkerId === 'essential1'}
                  onClick={() => handleMarkerClick('essential1')}
                />
                <p className="text-xs mt-1">필수 카페</p>
              </div>

              <div className="text-center">
                <MapMarkerIcon
                  category="beauty"
                  storeClass="small-business"
                  isEssential={true}
                  isSelected={selectedMarkerId === 'essential2'}
                  onClick={() => handleMarkerClick('essential2')}
                />
                <p className="text-xs mt-1">필수 뷰티</p>
              </div>

              <div className="text-center">
                <MapMarkerIcon
                  category="bakery"
                  storeClass="event"
                  isEssential={true}
                  isSelected={selectedMarkerId === 'essential3'}
                  onClick={() => handleMarkerClick('essential3')}
                />
                <p className="text-xs mt-1">필수 베이커리</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            💡 마커를 클릭하면 크기가 변하고 아이콘 색상이 바뀝니다.
            <br />
            하나의 마커만 선택 가능하며, 다른 마커를 클릭하면 이전 선택이 취소됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
