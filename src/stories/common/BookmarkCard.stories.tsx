import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkCard from '@/components/common/BookmarkCard';

const meta: Meta<typeof BookmarkCard> = {
  title: 'Common/BookmarkCard',
  component: BookmarkCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BookmarkCard>;

const sampleStore = {
  id: 'store1',
  name: '스타벅스 강남점',
  address: '서울 강남구 테헤란로 152',
  distance: '0.2km',
  hours: '06:00 - 22:00',
  category: 'cafe' as const,
  status: '영업중' as const,
  isBookmarked: false,
};

export const 기본: Story = {
  args: {
    store: sampleStore,
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
    onBookmarkToggle: (storeId, isBookmarked) =>
      console.log(`[storybook] 즐겨찾기 토글됨 - ${storeId}: ${isBookmarked}`),
  },
};
