interface AccountManagementSectionProps {
  onChangePassword?: () => void;
}

const AccountManagementSection = ({ onChangePassword }: AccountManagementSectionProps) => {
  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword();
    } else {
      console.log('비밀번호 변경 클릭');
    }
  };

  return (
    <div className="w-full mt-3 mb-3 px-5">
      <div className="flex justify-center items-center">
        <button
          type="button"
          onClick={handleChangePassword}
          className="text-m font-regular text-gray-500 underline decoration-gray-500 underline-offset-2"
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default AccountManagementSection;
