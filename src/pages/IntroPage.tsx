import { useNavigate } from "react-router-dom";
import { CommonButton } from "@/components/common/Button";
import CharacterCard from "@/components/common/CharacterCard";
import SlideTransition from "@/components/common/SlideTransition";
import ShortPageLayout from "@/components/layout/ShortPageLayout";
import { responsiveButton, responsiveText } from "@/styles/responsive";

const IntroPage = () => {
  const navigate = useNavigate();

  return (

<ShortPageLayout
  className="bg-[#007DFF] text-white"
  footer={
    <CommonButton
      label={<span className={responsiveButton.text}>다음 단계</span>}
      className={responsiveButton.base}
      variant="secondary"
      onClick={() => navigate("/game")}
    />
  }
>
  <SlideTransition keyId="intro">
    <div className="flex flex-col items-center text-center w-full px-4">
      <p className={`${responsiveText.medium}`}>
        상호는 보험에 가입하려고 해요.
        <br />
        사회생활 8년 차,
        <br />
        이제는 보험도 슬슬 챙겨야 할 것 같대요.
        <br />
        상호는 아래 조건 속에서 <br />
        보험을 선택하려고 해요.
      </p>

      <div className="mt-[6vh]">
        <CharacterCard
          name="안상호"
          imageSrc="/images/icons/avatar.png"
          info={[
            "성별 : 남",
            "나이 : 30대 후반",
            "직업 : 사무직",
            "이혼자 유무 : X",
            "질병 이력 : 최근 10년간 없음",
          ]}
        />
      </div>

      <p className={`mt-[4vh] ${responsiveText.large}`}>
        여러분도 자신의 조건을 떠올리며
        <br />
        함께 선택해보세요!
      </p>
    </div>
  </SlideTransition>
</ShortPageLayout>
  );
};

export default IntroPage;
