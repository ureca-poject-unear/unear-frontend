import type { Meta, StoryObj } from '@storybook/react-vite';
import StoreTypeIcon from '@/components/common/StoreTypeIcon';

const meta: Meta<typeof StoreTypeIcon> = {
  title: 'Common/StoreTypeIcon',
  component: StoreTypeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 매장 타입별 아이콘 컴포넌트입니다. 매장 모드와 통계 모드를 지원하며, 네모와 원형 모양을 선택할 수 있습니다.',
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
      description: '매장 구분 타입 (store 모드에서만 사용)',
      table: {
        type: { summary: 'StoreClassType' },
        defaultValue: { summary: 'franchise' },
      },
    },
    size: {
      control: { type: 'range', min: 30, max: 100, step: 10 },
      description: '아이콘 컨테이너 크기 (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '50' },
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
    mode: {
      control: 'select',
      options: ['store', 'statistics'],
      description: '색상 모드 선택',
      table: {
        type: { summary: 'ModeType' },
        defaultValue: { summary: 'store' },
      },
    },
    shape: {
      control: 'select',
      options: ['square', 'circle'],
      description: '아이콘 모양 선택',
      table: {
        type: { summary: 'ShapeType' },
        defaultValue: { summary: 'square' },
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
    size: 50,
    mode: 'store',
    shape: 'square',
  },
};

// 매장 모드 - 각 색상별 예시
export const StoreMode: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">프랜차이즈 (Orange)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="franchise" size={50} />
          <StoreTypeIcon category="food" storeClass="franchise" size={50} />
          <StoreTypeIcon category="shopping" storeClass="franchise" size={50} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-500">소상공인 (Blue)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="small-business" size={50} />
          <StoreTypeIcon category="food" storeClass="small-business" size={50} />
          <StoreTypeIcon category="shopping" storeClass="small-business" size={50} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-primary">이벤트 (Pink)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="event" size={50} />
          <StoreTypeIcon category="food" storeClass="event" size={50} />
          <StoreTypeIcon category="shopping" storeClass="event" size={50} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '매장 모드에서 storeClass에 따른 색상 변화를 보여주는 예시입니다.',
      },
    },
  },
};

// 통계 모드 - 카테고리별 색상
export const StatisticsMode: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold mb-4">통계 모드 - 카테고리별 색상</h3>
      <div className="grid grid-cols-5 gap-4">
        {(
          [
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
          ] as const
        ).map((category) => (
          <div key={category} className="text-center">
            <StoreTypeIcon category={category} storeClass="franchise" size={50} mode="statistics" />
            <p className="text-sm mt-2 capitalize">{category}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '통계 모드에서 각 카테고리별로 지정된 색상을 보여주는 예시입니다.',
      },
    },
  },
};

// 모양 비교 - 네모 vs 원형
export const ShapeComparison: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">네모 모양 (Square)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="franchise" size={50} shape="square" />
          <StoreTypeIcon category="food" storeClass="small-business" size={50} shape="square" />
          <StoreTypeIcon category="shopping" storeClass="event" size={50} shape="square" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">원형 모양 (Circle)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="franchise" size={50} shape="circle" />
          <StoreTypeIcon category="food" storeClass="small-business" size={50} shape="circle" />
          <StoreTypeIcon category="shopping" storeClass="event" size={50} shape="circle" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '네모 모양(square)과 원형 모양(circle)의 차이를 보여주는 예시입니다.',
      },
    },
  },
};

// 통계 모드 + 원형 조합
export const StatisticsWithCircle: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold mb-4">통계 모드 + 원형 조합</h3>
      <div className="grid grid-cols-5 gap-4">
        {(
          [
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
          ] as const
        ).map((category) => (
          <div key={category} className="text-center">
            <StoreTypeIcon
              category={category}
              storeClass="franchise"
              size={50}
              mode="statistics"
              shape="circle"
            />
            <p className="text-sm mt-2 capitalize">{category}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '통계 모드와 원형 모양을 조합한 예시입니다.',
      },
    },
  },
};

// 실제 사용 시나리오
export const RealWorldUsage: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">매장 리스트 (Store Mode)</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <StoreTypeIcon category="cafe" storeClass="franchise" size={40} />
            <div>
              <h4 className="font-semibold">스타벅스 강남점</h4>
              <p className="text-sm text-gray-600">프랜차이즈 카페</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <StoreTypeIcon category="food" storeClass="small-business" size={40} />
            <div>
              <h4 className="font-semibold">할머니 손만두</h4>
              <p className="text-sm text-gray-600">소상공인 음식점</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">통계 차트 (Statistics Mode)</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <StoreTypeIcon
              category="cafe"
              storeClass="franchise"
              size={40}
              mode="statistics"
              shape="circle"
            />
            <div>
              <h4 className="font-semibold">카페 통계</h4>
              <p className="text-sm text-gray-600">전체 매장의 35%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <StoreTypeIcon
              category="food"
              storeClass="franchise"
              size={40}
              mode="statistics"
              shape="circle"
            />
            <div>
              <h4 className="font-semibold">음식점 통계</h4>
              <p className="text-sm text-gray-600">전체 매장의 28%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 매장 모드와 통계 모드의 활용 예시입니다.',
      },
    },
  },
};

// 크기 비교
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">네모 모양 크기 비교</h3>
        <div className="flex items-end gap-4">
          <div className="text-center">
            <StoreTypeIcon category="cafe" storeClass="franchise" size={30} />
            <p className="text-sm mt-2">30px</p>
          </div>
          <div className="text-center">
            <StoreTypeIcon category="cafe" storeClass="franchise" size={50} />
            <p className="text-sm mt-2">50px</p>
          </div>
          <div className="text-center">
            <StoreTypeIcon category="cafe" storeClass="franchise" size={70} />
            <p className="text-sm mt-2">70px</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">원형 모양 크기 비교</h3>
        <div className="flex items-end gap-4">
          <div className="text-center">
            <StoreTypeIcon category="cafe" storeClass="franchise" size={30} shape="circle" />
            <p className="text-sm mt-2">30px</p>
          </div>
          <div className="text-center">
            <StoreTypeIcon category="cafe" storeClass="franchise" size={50} shape="circle" />
            <p className="text-sm mt-2">50px</p>
          </div>
          <div className="text-center">
            <StoreTypeIcon category="cafe" storeClass="franchise" size={70} shape="circle" />
            <p className="text-sm mt-2">70px</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기와 모양의 아이콘을 비교할 수 있습니다.',
      },
    },
  },
};
