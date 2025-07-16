import React, { useEffect, useState } from 'react';

// 카테고리 타입 정의
type CategoryType =
  | 'cafe'
  | 'food'
  | 'shopping'
  | 'education'
  | 'culture'
  | 'bakery'
  | 'beauty'
  | 'convenience'
  | 'activity'
  | 'popup';

// 구분 타입 정의
type StoreClassType = 'franchise' | 'small-business' | 'event';

// Props 인터페이스 정의
interface StoreTypeIconProps {
  category: CategoryType;
  storeClass: StoreClassType;
  size?: number;
  className?: string;
}

// 카테고리별 아이콘 경로 매핑
const categoryIconMap: Record<CategoryType, string> = {
  cafe: '/src/assets/common/coffee.svg',
  food: '/src/assets/common/food.svg',
  shopping: '/src/assets/common/shopping.svg',
  education: '/src/assets/common/book.svg',
  culture: '/src/assets/common/culture.svg',
  bakery: '/src/assets/common/bread.svg',
  beauty: '/src/assets/common/beauty.svg',
  convenience: '/src/assets/common/life.svg',
  activity: '/src/assets/common/activity.svg',
  popup: '/src/assets/common/store.svg',
};

const StoreTypeIcon: React.FC<StoreTypeIconProps> = ({
  category,
  storeClass,
  size = 50,
  className = '',
}) => {
  const [svgContent, setSvgContent] = useState<string>('');

  // 정확한 색상 값
  const getColor = (): string => {
    switch (storeClass) {
      case 'franchise':
        return '#f97316'; // orange-500
      case 'small-business':
        return '#3b82f6'; // blue-500
      case 'event':
        return '#E6007E'; // primary pink
      default:
        return '#333333';
    }
  };

  const iconPath = categoryIconMap[category];
  const color = getColor();

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(iconPath);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let svgText = await response.text();

        // 모든 SVG를 18x18로 통일
        svgText = svgText.replace(/<svg[^>]*width="[^"]*"[^>]*>/i, (match) => {
          return match.replace(/width="[^"]*"/i, 'width="18"');
        });

        svgText = svgText.replace(/<svg[^>]*height="[^"]*"[^>]*>/i, (match) => {
          return match.replace(/height="[^"]*"/i, 'height="18"');
        });

        // 만약 width나 height가 없다면 추가
        if (!svgText.includes('width=')) {
          svgText = svgText.replace(/<svg/, '<svg width="18"');
        }
        if (!svgText.includes('height=')) {
          svgText = svgText.replace(/<svg/, '<svg height="18"');
        }

        // 쇼핑 아이콘 특별 처리
        if (category === 'shopping') {
          svgText = svgText.replace(
            /<path fill-rule="evenodd"[^>]*fill="[^"]*"[^>]*>/gi,
            `<path fill-rule="evenodd" clip-rule="evenodd" fill="${color}"`
          );
          svgText = svgText.replace(/<path d="[^"]*" stroke="[^"]*"[^>]*>/gi, (match) =>
            match
              .replace(/stroke="[^"]*"/gi, `stroke="${color}"`)
              .replace(/fill="[^"]*"/gi, 'fill="none"')
          );

          svgText = svgText.replace(/#333333/gi, color);
        }
        // activity.svg처럼 stroke-based 아이콘 처리
        else if (category === 'activity') {
          svgText = svgText.replace(/fill="[^"]*"/gi, 'fill="none"');
          svgText = svgText.replace(/stroke="[^"]*"/gi, `stroke="${color}"`);
          svgText = svgText.replace(/#333333/gi, color);
        }
        // 나머지 아이콘들 일반 처리
        else {
          svgText = svgText.replace(/fill="[^"]*"/gi, `fill="${color}"`);
          svgText = svgText.replace(/stroke="[^"]*"/gi, `stroke="${color}"`);
          svgText = svgText.replace(/#333333/gi, color);
          svgText = svgText.replace(/#000000/gi, color);
        }

        setSvgContent(svgText);
      } catch (error) {
        console.error('SVG 로드 실패:', error);
      }
    };

    loadSvg();
  }, [iconPath, color]);

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '8px',
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  );
};

export default StoreTypeIcon;
