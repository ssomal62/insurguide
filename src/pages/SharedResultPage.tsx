import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GameChoice } from "@/hooks/useGame";
import { useSharedResult } from "@/hooks/useSharedResult";
import { useFirebase } from "@/hooks/useFirebase";
import { getOrCreateUUID } from "@/utils/uuid";
import { partnerChoices } from "@/data/partnerChoices";
import { CommonButton } from "@/components/common/Button";
import ChoiceListCard from "@/components/result/ChoiceListCard";
import ScrollPageLayout from "@/components/layout/ScrollPageLayout";
import { responsiveImage, responsiveText } from "@/styles/responsive";

const SharedResultPage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { loadSharedResult, isLoading, error } = useSharedResult();
  const { logSharedResultViewed } = useFirebase();

  const [userChoices, setUserChoices] = useState<GameChoice[]>([]);
  const [viewCount, setViewCount] = useState<number>(0);
  const [loadError, setLoadError] = useState<string>("");

  const viewerUuid = getOrCreateUUID();

  useEffect(() => {
    const loadData = async () => {
      if (!shareId) {
        setLoadError("잘못된 공유 링크입니다.");
        return;
      }

      const result = await loadSharedResult(shareId);

      if (result.success && result.data) {
        setUserChoices(result.data.userChoices);
        setViewCount(result.data.viewCount + 1);

        // Firebase 이벤트 로깅
        logSharedResultViewed({
          shareId,
          viewerUuid,
          originalCreatorUuid: result.data.creatorUuid,
          choiceCount: result.data.userChoices.length,
        });
      } else {
        setLoadError(result.error || "결과를 불러올 수 없습니다.");
      }
    };

    loadData();
  }, [shareId]);

  const handlePlayGame = () => {
    // Firebase 이벤트 로깅
    if (shareId) {
      logSharedResultViewed({
        shareId,
        viewerUuid,
        action: "play_clicked",
      });
    }
    navigate("/");
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <ScrollPageLayout>
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1989FF] mb-4"></div>
          <p className={responsiveText.medium}>결과를 불러오는 중...</p>
        </div>
      </ScrollPageLayout>
    );
  }

  // 에러 상태
  if (error || loadError) {
    return (
      <ScrollPageLayout>
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <img
            src="/images/icons/error.png"
            alt="error"
            className="w-16 h-16 mb-4"
          />
          <h1 className={responsiveText.large}>결과를 찾을 수 없어요</h1>
          <div style={{ marginTop: "clamp(12px, 3vw, 24px)" }} />
          <p className={responsiveText.medium}>
            {loadError || error}
            <br />
            공유 링크가 올바른지 확인해주세요.
          </p>
          <div style={{ marginTop: "clamp(32px, 6vw, 48px)" }} />
          <CommonButton
            variant="primary"
            label="게임 해보기"
            onClick={handlePlayGame}
            className="px-8"
          />
        </div>
      </ScrollPageLayout>
    );
  }

  // 정상 상태 - 공유된 결과 표시
  return (
    <ScrollPageLayout
      footer={
        <div className="w-full">
          <CommonButton
            variant="primary"
            className="w-full result-page"
            label={
              <div className="flex items-center justify-center gap-2">
                {/* <img
                  src="/images/icons/play.png"
                  alt="play icon"
                  className="w-[20px] h-[20px]"
                /> */}
                나도 해보기
              </div>
            }
            onClick={handlePlayGame}
          />

          <div className="mt-2 text-center">
            <p className="text-base text-gray-500">
              이미 {viewCount}명이 확인했어요!
            </p>
          </div>
        </div>
      }
    >
      <div className="w-full flex flex-col items-center text-center font-[Pretendard]">
        <div className="w-full p-4 mb-8 flex justify-center">
          <div className="flex items-center gap-[10px]">
            <img
              src="/images/icons/mail_dock.png"
              alt="inbox icon"
              style={{
                width: "clamp(28px, 5vw, 60px)",
                height: "clamp(28px, 5vw, 60px)",
              }}
            />
            <p className={`${responsiveText.large} text-black font-medium`}>
              친구의 보험 성향 결과
            </p>
          </div>
        </div>

        <img
          src="/images/icons/clapping.png"
          alt="trophy"
          className={responsiveImage.result}
        />

        <div style={{ marginTop: "clamp(16px, 4vw, 32px)" }} />
        {/* <h1 className={responsiveText.large}>친구의 보험 성향 결과!</h1> */}
        <div style={{ marginTop: "clamp(12px, 3vw, 24px)" }} />
        <span className={responsiveText.subtext}>
          친구가 어떤 보험을 선택했는지 확인해보세요!
          <br />
          비슷한 성향인지 궁금하다면
          <br />
          아래 버튼으로 직접 해보세요.
        </span>
        <div style={{ marginTop: "clamp(40px, 6vw, 80px)" }} />
        <ChoiceListCard
          title="친구가 선택한 보험"
          type="user"
          choices={userChoices}
        />
        <div style={{ marginTop: "clamp(16px, 4vw, 40px)" }} />
        <ChoiceListCard
          title="상호의 Pick!"
          type="partner"
          choices={partnerChoices}
        />
      </div>
    </ScrollPageLayout>
  );
};

export default SharedResultPage;
