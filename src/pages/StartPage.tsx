import { CommonButton } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFirebase } from "@/hooks/useFirebase";
import { analytics } from "@/config/firebase";
import { setUserProperties } from "firebase/analytics";
import { getOrCreateUUID, resetUUID } from "@/utils/uuid";
import {
  responsiveButton,
  responsiveImage,
  responsiveText,
} from '@/styles/responsive';

import ShortPageLayout from "@/components/layout/ShortPageLayout";

const StartPage = () => {
  const { logGameStart, logPagePerformance } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    resetUUID();
  }, []);

  useEffect(() => {
    const loadTime = Math.round(performance.now());
    logPagePerformance({ page: "start", loadTime });
  }, []);

  useEffect(() => {
    const isMobile = /iPhone|Android|Mobile/i.test(navigator.userAgent);
    const deviceType = isMobile ? "mobile" : "desktop";
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
<ShortPageLayout
  footer={
<CommonButton
  onClick={handleStart}
  label={<span className={responsiveButton.text}>시작하기</span>}
  className={responsiveButton.base}
/>
  }
>

<div className="flex flex-col items-center gap-6 text-center px-4">
<img
  src="/images/icons/scanly.png"
  alt="일러스트"
  className={responsiveImage.square}
/>

<h1 className={responsiveText.heading}>웨얼 이즈<br/>마이 보험매니절?!</h1>
<p className={responsiveText.subtext}>나 지금 보험 빨리 알아봐야하는데<br/>
우리 보험 매니저 어디 갔어?</p>
</div>
    </ShortPageLayout>
  );
};

export default StartPage;
