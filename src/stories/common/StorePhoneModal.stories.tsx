import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import StorePhoneModal from '@/components/common/StorePhoneModal';
import type { BookmarkStore } from '@/types/bookmark';

const meta: Meta<typeof StorePhoneModal> = {
  title: 'Common/StorePhoneModal',
  component: StorePhoneModal,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof StorePhoneModal>;

const sampleStore: BookmarkStore = {
  id: 'store1',
  name: '스타벅스 강남점',
  address: '서울 강남구 테헤란로 152',
  distance: '0.2km',
  hours: '06:00 - 22:00',
  category: 'CAFE',
  storeClass: 'FRANCHISE',
  event: 'NONE',
  status: '영업중',
  isBookmarked: false,
  phoneNumber: '1544-1122',
};

// 스토리북에서 모달 상태를 관리하기 위한 래퍼 컴포넌트
const ModalWrapper = (args: any) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="bg-primary text-white px-4 py-2 rounded">
        모달 열기
      </button>
      <StorePhoneModal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const 기본: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    store: sampleStore,
  },
};

export const 전화번호없음: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    store: {
      ...sampleStore,
      name: '동네 마트',
    },
  },
};

export const 영업종료매장: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    store: {
      ...sampleStore,
      name: '맥도날드 역삼점',
      status: '영업종료',
      hours: '06:00 - 24:00',
      phoneNumber: '02-1234-5678',
    },
  },
};

export const 이벤트매장: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    store: {
      ...sampleStore,
      name: '투레쥬르 강남점',
      event: 'GENERAL',
      status: '이벤트 매장',
      category: 'BAKERY',
      phoneNumber: '070-1234-5678',
    },
  },
};

export const 필수매장: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    store: {
      ...sampleStore,
      name: 'CGV 강남점',
      event: 'REQUIRE',
      status: '필수 매장',
      category: 'CULTURE',
      hours: '10:00 - 24:00',
      phoneNumber: '1588-1234',
    },
  },
};

export const 소상공인매장: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    store: {
      ...sampleStore,
      name: '동네 카페',
      storeClass: 'LOCAL',
      address: '서울 강남구 테헤란로 164',
      phoneNumber: '02-987-6543',
    },
  },
};
