import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkCard from '@/components/common/BookmarkCard';
import type { BookmarkStore } from '@/types/bookmark';

const meta: Meta<typeof BookmarkCard> = {
  title: 'Common/BookmarkCard',
  component: BookmarkCard,
  tags: ['autodocs'],
  argTypes: {
    isDarkMode: {
      control: 'boolean',
      description: '다크 모드 설정',
    },
  },
};

export default meta;

type Story = StoryObj<typeof BookmarkCard>;

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

export const 기본: Story = {
  args: {
    store: sampleStore,
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}: ${isBookmarked}`),
  },
};

export const 다크모드: Story = {
  args: {
    store: sampleStore,
    isDarkMode: true,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 다크모드 - ${storeId}: ${isBookmarked}`),
  },
};

export const 즐겨찾기됨: Story = {
  args: {
    store: {
      ...sampleStore,
      isBookmarked: true,
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}: ${isBookmarked}`),
  },
};

export const 소상공인매장: Story = {
  args: {
    store: {
      ...sampleStore,
      name: '동네 카페',
      storeClass: 'LOCAL',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 소상공인 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 이벤트매장_일반: Story = {
  args: {
    store: {
      ...sampleStore,
      event: 'GENERAL',
      status: '이벤트 매장',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 일반 이벤트 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 이벤트매장_필수: Story = {
  args: {
    store: {
      ...sampleStore,
      event: 'REQUIRE',
      status: '필수 매장',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 필수 이벤트 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 영업종료: Story = {
  args: {
    store: {
      ...sampleStore,
      status: '영업종료',
    },
    isDarkMode: false,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 영업종료 매장 - ${storeId}: ${isBookmarked}`),
  },
};

export const 다크모드_이벤트매장: Story = {
  args: {
    store: {
      ...sampleStore,
      event: 'GENERAL',
      status: '이벤트 매장',
      isBookmarked: true,
    },
    isDarkMode: true,
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 다크모드 이벤트 매장 - ${storeId}: ${isBookmarked}`),
  },
};
