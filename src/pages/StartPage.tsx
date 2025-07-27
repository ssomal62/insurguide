import { CommonButton } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFirebase } from '@/hooks/useFirebase';
import { analytics } from '@/config/firebase';
import { setUserProperties } from 'firebase/analytics';
import { getOrCreateUUID, resetUUID } from "@/utils/uuid";

const StartPage = () => {

  const { logGameStart, logPagePerformance } = useFirebase();
  const navigate = useNavigate();


  useEffect(() => {
    sessionStorage.clear();
    resetUUID();
  }, []);

  useEffect(() => {
  const loadTime = Math.round(performance.now());
  logPagePerformance({ page: 'start', loadTime });
  }, []);

  useEffect(() => {
  const isMobile = /iPhone|Android|Mobile/i.test(navigator.userAgent);
  const deviceType = isMobile ? 'mobile' : 'desktop';

  if (analytics) {
    setUserProperties(analytics, {
      deviceType,
    });
  }
}, []);

  const handleStart = () => {
    const uuid = getOrCreateUUID();
    logGameStart({ uuid });
    navigate("/intro");
  };

  return (
    <div className="relative w-[393px] h-[852px] bg-white overflow-hidden">
      <img
        src="/images/icons/scanly.png"
        alt="보험 탐색 일러스트"
        className="w-[196px] h-[196px] mt-[177px] mx-auto"
      />

      <h1 className="mt-0 text-[32px] font-semibold text-black text-center leading-[44.8px] font-[Pretendard]">
        마이리틀 보험팝
      </h1>

      <p className="mt-[8px] text-[14px] text-[#030303] text-center leading-[22px] font-[Archivo] tracking-[-0.35px]">
        어려운 보험, 좀 더 쉽게 알아볼까요?
      </p>

      <div className="absolute top-[722px] left-0 right-0 flex justify-center">
<CommonButton onClick={handleStart} label="시작하기" />
      </div>
    </div>
  );
};

export default StartPage;
