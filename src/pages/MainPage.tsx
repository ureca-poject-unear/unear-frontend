import Header from '@/components/common/Header';

const MainPage = () => {
  return (
    <>
      <Header title="메인페이지" />
      <div className="">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-lg font-bold mb-2 text-primary">U:NEAR 프론트엔드 프로젝트</h1>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-m font-thin text-primary">Thin - LGEIHeadline‑Thin</h2>
            <h2 className="text-m font-light text-primary">Light - LGEIHeadline‑Light</h2>
            <h2 className="text-m font-regular font-normal text-primary">
              Regular - LGEIHeadline‑Regular
            </h2>
            <h2 className="text-m font-semibold text-primary">Semibold - LGEIHeadline‑Semibold</h2>
            <h2 className="text-m font-bold text-primary">Bold - LGEIHeadline‑Bold</h2>
          </div>

          <p className="mt-8 text-sm font-bold text-black mb-6">스타일 테스트</p>
          <div className="w-24 h-24 bg-storeicon rounded-full mx-auto mb-6" />
          <div className="w-32 h-12 bg-store rounded-[12px] mx-auto mb-6" />

          <button className="bg-primary text-white px-6 py-2 rounded-[12px] text-lm">
            테스트 버튼
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPage;
