import type { Meta, StoryObj } from '@storybook/react-vite';
import StoreTypeIcon from '../../components/common/StoreTypeIcon';

const meta: Meta<typeof StoreTypeIcon> = {
  title: 'Common/StoreTypeIcon',
  component: StoreTypeIcon,
  parameters: {
    layout: 'centered',
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
      control: 'number',
      defaultValue: 50,
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

// 프랜차이즈 스토리들 (주황색)
export const FranchiseCafe: Story = {
  args: {
    category: 'cafe',
    storeClass: 'franchise',
    size: 50,
  },
};

export const FranchiseFood: Story = {
  args: {
    category: 'food',
    storeClass: 'franchise',
    size: 50,
  },
};

export const FranchiseShopping: Story = {
  args: {
    category: 'shopping',
    storeClass: 'franchise',
    size: 50,
  },
};

// 소상공인 스토리들 (파란색)
export const SmallBusinessEducation: Story = {
  args: {
    category: 'education',
    storeClass: 'small-business',
    size: 50,
  },
};

export const SmallBusinessBeauty: Story = {
  args: {
    category: 'beauty',
    storeClass: 'small-business',
    size: 50,
  },
};

export const SmallBusinessActivity: Story = {
  args: {
    category: 'activity',
    storeClass: 'small-business',
    size: 50,
  },
};

// 이벤트 스토리들 (핑크색)
export const EventCulture: Story = {
  args: {
    category: 'culture',
    storeClass: 'event',
    size: 50,
  },
};

export const EventPopup: Story = {
  args: {
    category: 'popup',
    storeClass: 'event',
    size: 50,
  },
};

export const EventBakery: Story = {
  args: {
    category: 'bakery',
    storeClass: 'event',
    size: 50,
  },
};

// 다양한 크기 스토리
export const SmallSize: Story = {
  args: {
    category: 'convenience',
    storeClass: 'franchise',
    size: 30,
  },
};

export const LargeSize: Story = {
  args: {
    category: 'convenience',
    storeClass: 'small-business',
    size: 80,
  },
};

// 모든 카테고리 한번에 보기
export const AllCategories: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4 p-4">
      <div className="text-center">
        <StoreTypeIcon category="cafe" storeClass="franchise" size={50} />
        <p className="text-sm mt-2">카페 (프랜차이즈)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="food" storeClass="small-business" size={50} />
        <p className="text-sm mt-2">푸드 (소상공인)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="shopping" storeClass="event" size={50} />
        <p className="text-sm mt-2">쇼핑 (이벤트)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="education" storeClass="franchise" size={50} />
        <p className="text-sm mt-2">교육 (프랜차이즈)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="culture" storeClass="small-business" size={50} />
        <p className="text-sm mt-2">문화/여가 (소상공인)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="bakery" storeClass="event" size={50} />
        <p className="text-sm mt-2">베이커리 (이벤트)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="beauty" storeClass="franchise" size={50} />
        <p className="text-sm mt-2">뷰티/건강 (프랜차이즈)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="convenience" storeClass="small-business" size={50} />
        <p className="text-sm mt-2">생활/편의 (소상공인)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="activity" storeClass="event" size={50} />
        <p className="text-sm mt-2">액티비티 (이벤트)</p>
      </div>
      <div className="text-center">
        <StoreTypeIcon category="popup" storeClass="franchise" size={50} />
        <p className="text-sm mt-2">팝업스토어 (프랜차이즈)</p>
      </div>
    </div>
  ),
};

// 색상별 그룹
export const ColorGroups: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      {/* 프랜차이즈 그룹 (주황색) */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-orange-500">프랜차이즈 (Orange)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="franchise" size={50} />
          <StoreTypeIcon category="food" storeClass="franchise" size={50} />
          <StoreTypeIcon category="shopping" storeClass="franchise" size={50} />
          <StoreTypeIcon category="education" storeClass="franchise" size={50} />
          <StoreTypeIcon category="beauty" storeClass="franchise" size={50} />
        </div>
      </div>

      {/* 소상공인 그룹 (파란색) */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-blue-500">소상공인 (Blue)</h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="culture" storeClass="small-business" size={50} />
          <StoreTypeIcon category="bakery" storeClass="small-business" size={50} />
          <StoreTypeIcon category="convenience" storeClass="small-business" size={50} />
          <StoreTypeIcon category="activity" storeClass="small-business" size={50} />
          <StoreTypeIcon category="popup" storeClass="small-business" size={50} />
        </div>
      </div>

      {/* 이벤트 그룹 (핑크색) */}
      <div>
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#E6007E' }}>
          이벤트 (Primary Pink)
        </h3>
        <div className="flex gap-4">
          <StoreTypeIcon category="cafe" storeClass="event" size={50} />
          <StoreTypeIcon category="food" storeClass="event" size={50} />
          <StoreTypeIcon category="shopping" storeClass="event" size={50} />
          <StoreTypeIcon category="culture" storeClass="event" size={50} />
          <StoreTypeIcon category="popup" storeClass="event" size={50} />
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
      <div className="text-center">
        <StoreTypeIcon category="cafe" storeClass="franchise" size={100} />
        <p className="text-sm mt-2">100px</p>
      </div>
    </div>
  ),
};
