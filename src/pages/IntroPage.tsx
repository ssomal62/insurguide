import { useNavigate } from "react-router-dom";
import { CommonButton } from "@/components/common/Button";
import CharacterCard from "@/components/common/CharacterCard";
import SlideTransition from "@/components/common/SlideTransition";

const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-[393px] h-[852px] bg-white font-[Pretendard] overflow-hidden">

      <SlideTransition keyId="intro">
        <div className="flex flex-col items-center px-4 pt-[54px] text-center">
          <p className="mt-[55px] text-[15px] leading-[22px] text-black">
            상호는 보험에 가입하려고 해요.
            <br />
            사회생활 8년 차,
            <br />
            이제는 보험도 슬슬 챙겨야 할 것 같대요.
            <br />
            상호는 아래 조건 속에서 <br />
            보험을 선택하라고 해요.
          </p>

          <div className="pt-[55px]">
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

          <p className="mt-6 text-[22px] font-medium leading-[30.8px] text-black">
            여러분도 자신의 조건을 떠올리며
            <br />
            함께 선택해보세요!
          </p>
        </div>
      </SlideTransition>


      <div className="absolute top-[722px] left-0 right-0 flex justify-center">
        <CommonButton
          variant="primary"
          label="다음 단계"
          className="w-[358px]"
          onClick={() => navigate("/game")}
        />
      </div>
    </div>
  );
};

export default IntroPage;
