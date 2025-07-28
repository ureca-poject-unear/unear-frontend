interface AccountManagementSectionProps {
  onChangePassword?: () => void;
  onDeleteAccount?: () => void;
}

const AccountManagementSection = ({
  onChangePassword,
  onDeleteAccount,
}: AccountManagementSectionProps) => {
  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword();
    } else {
      console.log('비밀번호 변경 클릭');
    }
  };

  const handleDeleteAccount = () => {
    if (onDeleteAccount) {
      onDeleteAccount();
    } else {
      console.log('회원탈퇴 클릭');
    }
  };

  return (
    <div className="w-full mt-3 mb-3 px-5">
      <div className="flex justify-center items-center gap-24">
        <button
          type="button"
          onClick={handleChangePassword}
          className="text-m font-regular text-gray-500 underline decoration-gray-500 underline-offset-2"
        >
          비밀번호 변경
        </button>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="text-m font-regular text-gray-500 underline decoration-gray-500 underline-offset-2"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default AccountManagementSection;
