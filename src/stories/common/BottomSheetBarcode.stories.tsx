import type { Meta, StoryObj } from '@storybook/react-vite';
import BottomSheetBarcode from '@/components/common/BottomSheetBarcode';

const meta: Meta<typeof BottomSheetBarcode> = {
  title: 'Common/BottomSheetBarcode',
  component: BottomSheetBarcode,
  decorators: [
    (Story) => (
      <div className="w-full max-w-[393px] min-h-screen bg-background mx-auto flex flex-col relative px-5">
        <div className="pt-[40px] pb-[65px]">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      source: {
        type: 'code',
      },
      description: {
        component:
          'U:NEAR 프로젝트에서 사용하는 바코드 바텀시트 컴포넌트입니다. 사용자 정보와 바코드를 표시하는 모달 형태의 바텀시트를 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    userName: {
      control: 'text',
      description: '사용자 이름',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"홍길동"' },
      },
    },
    userGrade: {
      control: 'select',
      options: ['VIP', 'VVIP', '우수'],
      description: '사용자 등급',
      table: {
        type: { summary: '"VIP" | "VVIP" | "우수"' },
        defaultValue: { summary: '"VVIP"' },
      },
    },
    barcodeValue: {
      control: 'text',
      description: '바코드 값',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"344BA876Y89"' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheetBarcode>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '기본 바코드 바텀시트입니다. 홍길동님, VVIP 등급으로 표시됩니다.',
      },
    },
  },
};

export const VipUser: Story = {
  args: {
    userName: '김철수',
    userGrade: 'VIP',
    barcodeValue: '123456789',
  },
  parameters: {
    docs: {
      description: {
        story: 'VIP 등급 사용자의 바코드 바텀시트입니다.',
      },
    },
  },
};

export const ExcellentUser: Story = {
  args: {
    userName: '이영희',
    userGrade: '우수',
    barcodeValue: 'EXCELLENT123',
  },
  parameters: {
    docs: {
      description: {
        story: '우수 등급 사용자의 바코드 바텀시트입니다.',
      },
    },
  },
};

export const LongUserName: Story = {
  args: {
    userName: '김영수박사',
    userGrade: 'VVIP',
    barcodeValue: 'LONGNAME456',
  },
  parameters: {
    docs: {
      description: {
        story: '긴 이름을 가진 사용자의 바코드 바텀시트입니다.',
      },
    },
  },
};

export const CustomBarcode: Story = {
  args: {
    userName: '최민수',
    userGrade: 'VIP',
    barcodeValue: 'CUSTOM789ABC',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 바코드 값을 사용하는 바텀시트입니다.',
      },
    },
  },
};

export const AllGrades: Story = {
  render: () => (
    <div className="flex gap-4">
      <BottomSheetBarcode userName="VIP사용자" userGrade="VIP" barcodeValue="VIP123" />
      <BottomSheetBarcode userName="VVIP사용자" userGrade="VVIP" barcodeValue="VVIP456" />
      <BottomSheetBarcode userName="우수사용자" userGrade="우수" barcodeValue="EXCELLENT789" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 등급의 바코드 바텀시트를 한번에 볼 수 있습니다.',
      },
    },
  },
};
