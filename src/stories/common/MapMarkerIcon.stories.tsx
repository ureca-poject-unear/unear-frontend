import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';

const meta: Meta<typeof MapMarkerIcon> = {
  title: 'Common/MapMarkerIcon',
  component: MapMarkerIcon,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 지도 마커 아이콘 컴포넌트입니다. 매장 구분에 따른 색상과 일반/필수 매장에 따른 크기 차이를 지원하며, 선택 상태에 따른 시각적 피드백을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: [
        'cafe',
        'food',
        'shopping',
        'education',
        'culture',
        'bakery',
        'beauty',
        'convenience',
        'activity',
        'popup',
      ],
      description: '매장 카테고리 타입',
      table: {
        type: { summary: 'CategoryType' },
        defaultValue: { summary: 'cafe' },
      },
    },
    storeClass: {
      control: 'select',
      options: ['franchise', 'small-business', 'event'],
      description: '매장 구분 타입 (배경 색상 결정)',
      table: {
        type: { summary: 'StoreClassType' },
        defaultValue: { summary: 'franchise' },
      },
    },
    isEssential: {
      control: 'boolean',
      description: '필수 매장 여부 (크기와 색상에 영향)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isSelected: {
      control: 'boolean',
      description: '선택 상태 (크기와 아이콘 색상에 영향)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    category: 'cafe',
    storeClass: 'franchise',
    isEssential: false,
    isSelected: false,
  },
};

// 선택된 상태
export const Selected: Story = {
  args: {
    category: 'cafe',
    storeClass: 'franchise',
    isEssential: false,
    isSelected: true,
  },
  parameters: {
    docs: {
      description: {
        story: '선택된 상태의 마커입니다. 크기가 커지고 아이콘 색상이 검정색으로 변합니다.',
      },
    },
  },
};

// 필수 매장
export const Essential: Story = {
  args: {
    category: 'food',
    storeClass: 'small-business',
    isEssential: true,
    isSelected: false,
  },
  parameters: {
    docs: {
      description: {
        story: '필수 매장 마커입니다. 일반 마커보다 크기가 크고 핑크색 배경을 가집니다.',
      },
    },
  },
};

// 선택된 필수 매장
export const EssentialSelected: Story = {
  args: {
    category: 'beauty',
    storeClass: 'event',
    isEssential: true,
    isSelected: true,
  },
  parameters: {
    docs: {
      description: {
        story: '선택된 필수 매장 마커입니다. 가장 큰 크기를 가집니다.',
      },
    },
  },
};

// 매장 구분별 색상
export const StoreClassColors: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">프랜차이즈 (Orange)</h3>
        <div className="flex gap-4">
          <MapMarkerIcon category="cafe" storeClass="franchise" />
          <MapMarkerIcon category="food" storeClass="franchise" />
          <MapMarkerIcon category="shopping" storeClass="franchise" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-500">소상공인 (Blue)</h3>
        <div className="flex gap-4">
          <MapMarkerIcon category="cafe" storeClass="small-business" />
          <MapMarkerIcon category="food" storeClass="small-business" />
          <MapMarkerIcon category="shopping" storeClass="small-business" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">이벤트 (Pink)</h3>
        <div className="flex gap-4">
          <MapMarkerIcon category="cafe" storeClass="event" />
          <MapMarkerIcon category="food" storeClass="event" />
          <MapMarkerIcon category="shopping" storeClass="event" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '매장 구분에 따른 배경 색상 차이를 확인할 수 있습니다.',
      },
    },
  },
};

// 모든 카테고리 보기
export const AllCategories: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold mb-4">모든 카테고리 아이콘</h3>
      <div className="grid grid-cols-5 gap-4">
        {[
          'cafe',
          'food',
          'shopping',
          'education',
          'culture',
          'bakery',
          'beauty',
          'convenience',
          'activity',
          'popup',
        ].map((category) => (
          <div key={category} className="text-center">
            <MapMarkerIcon category={category} storeClass="franchise" />
            <p className="text-sm mt-2 capitalize">{category}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 카테고리의 마커 아이콘을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

// 크기 비교
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">크기 비교</h3>
        <div className="flex items-end gap-4">
          <div className="text-center">
            <MapMarkerIcon category="cafe" storeClass="franchise" isEssential={false} />
            <p className="text-sm mt-2">
              일반 매장
              <br />
              25×25px
            </p>
          </div>
          <div className="text-center">
            <MapMarkerIcon category="cafe" storeClass="franchise" isEssential={true} />
            <p className="text-sm mt-2">
              필수 매장
              <br />
              35×35px
            </p>
          </div>
          <div className="text-center">
            <MapMarkerIcon
              category="cafe"
              storeClass="franchise"
              isEssential={false}
              isSelected={true}
            />
            <p className="text-sm mt-2">
              선택된 일반
              <br />
              30×30px
            </p>
          </div>
          <div className="text-center">
            <MapMarkerIcon
              category="cafe"
              storeClass="franchise"
              isEssential={true}
              isSelected={true}
            />
            <p className="text-sm mt-2">
              선택된 필수
              <br />
              42×42px
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '일반 매장과 필수 매장, 선택 상태에 따른 크기 차이를 비교할 수 있습니다.',
      },
    },
  },
};

// 인터랙티브 예제
export const InteractiveExample: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleClick = (id: string) => {
      setSelectedId(selectedId === id ? null : id);
    };

    const markers = [
      {
        id: 'marker1',
        category: 'cafe',
        storeClass: 'franchise',
        label: '프랜차이즈 카페',
        isEssential: false,
      },
      {
        id: 'marker2',
        category: 'food',
        storeClass: 'small-business',
        label: '소상공인 음식점',
        isEssential: false,
      },
      {
        id: 'marker3',
        category: 'shopping',
        storeClass: 'event',
        label: '이벤트 쇼핑',
        isEssential: false,
      },
      {
        id: 'essential1',
        category: 'beauty',
        storeClass: 'franchise',
        label: '필수 뷰티',
        isEssential: true,
      },
    ] as const;

    return (
      <div className="space-y-6 p-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">인터랙티브 마커 선택</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            {markers.map((marker) => (
              <div key={marker.id} className="text-center">
                <MapMarkerIcon
                  category={marker.category}
                  storeClass={marker.storeClass}
                  isEssential={marker.isEssential}
                  isSelected={selectedId === marker.id}
                  onClick={() => handleClick(marker.id)}
                />
                <p className="text-sm mt-2">{marker.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              현재 선택된 마커:{' '}
              {selectedId ? markers.find((m) => m.id === selectedId)?.label : '없음'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              💡 마커를 클릭해보세요. 하나만 선택 가능합니다.
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '실제 사용 시나리오를 시뮬레이션합니다. 하나의 마커만 선택 가능하며, 클릭 시 크기와 색상이 변경됩니다.',
      },
    },
  },
};

// 실제 사용 시나리오
export const RealWorldUsage: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">지도 위의 매장 마커들</h3>
        <div
          className="bg-gray-100 p-6 rounded-lg relative"
          style={{ minHeight: '300px', width: '100%', maxWidth: '500px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg opacity-50"></div>

          <div className="relative z-10" style={{ width: '100%', height: '100%' }}>
            <div className="absolute" style={{ top: '20px', left: '30px' }}>
              <MapMarkerIcon category="cafe" storeClass="franchise" />
            </div>

            <div className="absolute" style={{ top: '40px', right: '40px' }}>
              <MapMarkerIcon category="food" storeClass="small-business" />
            </div>

            <div
              className="absolute"
              style={{ top: '80px', left: '50%', transform: 'translateX(-50%)' }}
            >
              <MapMarkerIcon category="activity" storeClass="small-business" isSelected={true} />
            </div>

            <div className="absolute" style={{ top: '140px', left: '50px' }}>
              <MapMarkerIcon category="shopping" storeClass="event" />
            </div>

            <div className="absolute" style={{ top: '80px', right: '30px' }}>
              <MapMarkerIcon category="beauty" storeClass="franchise" isEssential={true} />
            </div>

            <div
              className="absolute"
              style={{ top: '160px', left: '45%', transform: 'translateX(-50%)' }}
            >
              <MapMarkerIcon category="bakery" storeClass="event" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          실제 지도 화면에서 다양한 매장 마커들이 어떻게 보일지 시뮬레이션
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 지도 애플리케이션에서 마커들이 어떻게 배치되고 표시될지 보여주는 예시입니다.',
      },
    },
  },
};
