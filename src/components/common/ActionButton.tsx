import React, { useState } from 'react';

type ActionProps = {
  text: string; // 박스 안에 표시될 텍스트 (다시 추가)
  onClick: () => void; // 버튼 클릭 시 실행할 함수
};

export default function ActionBox({ text, onClick }: ActionProps) {
  // 이메일과 비밀번호 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 이메일과 비밀번호가 모두 입력되었는지 확인
  const isFormValid = email !== '' && password !== '';

  // 버튼 클릭 시 실행할 함수
  const handleClick = () => {
    if (isFormValid) {
      onClick(); // 조건이 맞으면 onClick 실행
      // ✨ 여기에 text prop의 값을 사용하여 알림 메시지를 생성합니다.
      alert(`${text} 되었습니다!`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 이메일 입력 */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} // 이메일 값 업데이트
        placeholder="이메일을 입력하세요"
        className="w-full max-w-[353px] p-2 mb-2 border border-gray-300 rounded"
      />

      {/* 비밀번호 입력 */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // 비밀번호 값 업데이트
        placeholder="비밀번호를 입력하세요"
        className="w-full max-w-[353px] p-2 mb-4 border border-gray-300 rounded"
      />

      {/* 버튼 */}
      <button className="relative w-[353px] h-[50px] rounded-xl" onClick={handleClick}>
        {/* 배경 요소 */}
        <div
          className={`w-full h-full absolute inset-0 rounded-xl ${
            isFormValid ? 'bg-[#e6007e]' : 'bg-zinc-200'
          }`}
        />
        {/* 텍스트 요소 */}
        <p className="absolute inset-0 flex items-center justify-center text-base font-semibold text-center text-white">
          {text} {/* ✨ text prop을 다시 사용합니다. */}
        </p>
      </button>
    </div>
  );
}
