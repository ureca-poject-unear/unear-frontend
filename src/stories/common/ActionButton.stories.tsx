// src/components/common/ActionBox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionBox from '../../components/common/ActionButton'; // ActionBox 컴포넌트 경로를 확인해주세요.

const meta: Meta<typeof ActionBox> = {
  title: 'Components/ActionBox',
  component: ActionBox,
  tags: ['autodocs'],
  argTypes: {
    text: {
      // ✨ text prop 정의를 다시 추가
      control: 'text',
      description: '박스 안에 표시될 텍스트입니다.',
    },
    onClick: {
      action: 'formSubmitted', // 폼 유효성 검사 통과 후 클릭 시 'formSubmitted' 액션이 기록됩니다.
      description: '이메일과 비밀번호가 모두 입력되었을 때 실행될 함수입니다.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
          **ActionBox** 컴포넌트는 사용자의 이메일과 비밀번호 입력을 받으며,
          두 필드가 모두 채워졌을 때만 버튼이 활성화되어 \`onClick\` 함수가 실행됩니다.
          입력 필드의 유효성에 따라 버튼의 배경색이 변경됩니다.
          **버튼 클릭 시 입력된 \`text\` prop의 값을 포함하는 알림 메시지가 뜹니다.**
          \`onClick\` 핸들러는 폼이 유효할 때만 호출됩니다.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ActionBox>;

export const 기본_폼: Story = {
  args: {
    text: '로그인', // ✨ text prop 다시 사용
    onClick: () => console.log('로그인 시도 (유효성 통과)'),
  },
};

export const 회원가입_폼: Story = {
  // ✨ 회원가입 폼 스토리 다시 추가
  args: {
    text: '회원가입',
    onClick: () => console.log('회원가입 시도 (유효성 통과)'),
  },
};

export const 커스텀_텍스트: Story = {
  // ✨ 커스텀 텍스트 스토리 다시 추가
  args: {
    text: '정보 제출',
    onClick: () => console.log('정보 제출됨 (유효성 통과)'),
  },
};

// 사용자가 이메일/비밀번호를 입력해야 버튼이 활성화됨을 보여주는 스토리
import { within, userEvent, expect } from '@storybook/test';

export const 유효성_검사_예시: Story = {
  args: {
    text: '제출', // ✨ text prop 다시 사용
    onClick: () => console.log('폼이 유효하여 제출되었습니다.'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = await canvas.getByPlaceholderText('이메일을 입력하세요');
    const passwordInput = await canvas.getByPlaceholderText('비밀번호를 입력하세요');
    // ✨ 버튼 텍스트가 text prop으로 동적이므로 getByRole의 name도 text prop에 따라 동적으로 설정될 수 있습니다.
    // 여기서는 '제출' 텍스트를 사용하므로 해당 텍스트로 찾습니다.
    const button = await canvas.getByRole('button', { name: '제출' });

    // 초기에는 버튼이 비활성화(회색) 상태임을 확인할 수 있습니다.
    await expect(button).toHaveStyle('background-color: rgb(204, 204, 204)'); // bg-zinc-200

    // 이메일만 입력
    await userEvent.type(emailInput, 'test@example.com');
    // 여전히 버튼은 회색이어야 합니다.
    await expect(button).toHaveStyle('background-color: rgb(204, 204, 204)');

    // 비밀번호까지 입력
    await userEvent.type(passwordInput, 'password123');
    // 이제 버튼이 활성화(분홍색) 상태여야 합니다.
    await expect(button).toHaveStyle('background-color: rgb(230, 0, 126)'); // bg-[#e6007e]

    // 버튼 클릭 (onClick이 트리거됨)
    await userEvent.click(button);
  },
};
