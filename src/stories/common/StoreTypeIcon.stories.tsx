import type { Meta, StoryObj } from '@storybook/react-vite';
import StoreTypeIcon from '../../components/common/StoreTypeIcon';

const meta: Meta<typeof StoreTypeIcon> = {
  title: 'Common/StoreTypeIcon',
  component: StoreTypeIcon,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
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
      description: '매장 카테고리',
    },
    storeClass: {
      control: 'select',
      options: ['franchise', 'small-business', 'event'],
      description: '매장 구분 (프랜차이즈/소상공인/이벤트)',
    },
    size: {
      control: { type: 'range', min: 30, max: 100, step: 10 },
      description: '박스 크기 (px)',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
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
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#E6007E' }}>
          이벤트 (Pink)
        </h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="event" size={50} />
          <StoreTypeIcon category="food" storeClass="event" size={50} />
          <StoreTypeIcon category="shopping" storeClass="event" size={50} />
        </div>
      </div>
    </div>
  ),
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
};
