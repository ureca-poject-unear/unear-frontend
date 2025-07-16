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
        component: 'U:NEAR 프로젝트에서 사용하는 매장 타입별 아이콘 컴포넌트입니다.',
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
      description: '매장 구분 타입',
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
  },
};

// 각 색상별 예시
export const Franchise: Story = {
  args: {
    category: 'cafe',
    storeClass: 'franchise',
    size: 50,
  },
};

export const SmallBusiness: Story = {
  args: {
    category: 'food',
    storeClass: 'small-business',
    size: 50,
  },
};

export const Event: Story = {
  args: {
    category: 'popup',
    storeClass: 'event',
    size: 50,
  },
};

// 모든 카테고리
export const AllCategories: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4 p-4">
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
          <StoreTypeIcon category={category} storeClass="franchise" size={50} />
          <p className="text-sm mt-2 capitalize">{category}</p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 카테고리 아이콘을 한 번에 확인할 수 있습니다.',
      },
    },
  },
};

// 색상 비교
export const ColorComparison: Story = {
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
        story: '매장 구분(storeClass)에 따른 색상 변화를 보여주는 예시입니다.',
      },
    },
  },
};

// 크기 비교
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-end gap-4 p-4">
      <div className="text-center">
        <StoreTypeIcon category="cafe" storeClass="franchise" size={30} />
        <p className="text-sm mt-2">30px</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="cafe" storeClass="small-business" size={50} />
        <p className="text-sm mt-2">50px</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="cafe" storeClass="event" size={70} />
        <p className="text-sm mt-2">70px</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 아이콘을 비교할 수 있습니다.',
      },
    },
  },
};

// 실제 사용 시나리오
export const RealWorldUsage: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold mb-4">실제 사용 시나리오</h3>

      {/* 카드 리스트 예시 */}
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

        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
          <StoreTypeIcon category="popup" storeClass="event" size={40} />
          <div>
            <h4 className="font-semibold">팝업 스토어</h4>
            <p className="text-sm text-gray-600">이벤트 매장</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 앱에서 사용될 수 있는 매장 리스트 형태의 예시입니다.',
      },
    },
  },
};

// 접근성 테스트
export const AccessibilityTest: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold mb-4">접근성 테스트</h3>
      <div className="flex gap-4">
        <StoreTypeIcon
          category="cafe"
          storeClass="franchise"
          size={50}
          className="focus:outline-2 focus:outline-blue-500"
        />
        <StoreTypeIcon
          category="food"
          storeClass="small-business"
          size={50}
          className="focus:outline-2 focus:outline-blue-500"
        />
      </div>
      <p className="text-sm text-gray-600">
        아이콘들은 적절한 색상 대비를 가지고 있으며, 필요시 포커스 스타일을 추가할 수 있습니다.
      </p>
    </div>
  ),
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: '접근성을 고려한 색상 대비와 포커스 스타일을 테스트할 수 있습니다.',
      },
    },
  },
};
