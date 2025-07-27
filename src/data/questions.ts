import { Question } from "@/types/game";

// 실제 보험 전문가 기획 기반 3개 질문
export const questions: Question[] = [
  {
    id: "q1",
    title: "암 진단비 2천만원 vs 암 치료비 1천만원",
    description:
      "평생 암이 발병할 확률은 대략 35%, 치료비는 평균 3000만원 가량입니다." +
      "이를 대비하기 위한 암 보험을 선택할 때, 가장 흔히 비교되는 두 가지 항목은 **암 진단비**와 **암 치료비**입니다.",
    designIntent:
      "저는 약 월 4만원의 비용으로 위 두 보험을\n" +
      "모두 선택했습니다. 평균 암 치료비를 고려하여\n" +
      "결정하였고, 그 외의 고액 암과 고액 치료비에 대한\n" +
      "별도 항목의 보장을 받도록 선택했습니다.",
    options: [
      {
        id: "q1_a",
        title: "암 진단비",
        amount: "2천만원",
        description: "진단 시 조건 없이 지급",
        detailedDescription:
          "암 진단 시 조건 없이 지급되는 것으로, 초기 치료비나 경제적 부담을 덜어주기 위한 금액입니다. 단, 일부 유사암(갑상선암 등)은 제외합니다.",
        category: "cancer_diagnosis",
        imagePath: "/images/question/question01.png",
        imageAlt: "암 진단비 보장",
      },
      {
        id: "q1_b",
        title: "암 치료비",
        amount: "1천만원",
        description: "치료 과정 실비 보장",
        detailedDescription:
          "치료 과정에서 발생하는 수술 및 입원비 등을 포함합니다. 항암이나 특수 치료(표적, 중입자 등) 등은 추가로 항목을 만드는 경우가 많습니다.",
        category: "cancer_treatment",
        imagePath: "/images/question/question02.png",
        imageAlt: "암 치료비 보장",
      },
    ],
  },
  {
    id: "q2",
    title: "질병 수술비 30만원 vs 상해 수술비 100만원",
    description:
      "**질병(암, 맹장염 등)**은 내부 요인으로, **상해(타박상, 골절 등)**는 외부 사고로 인해 발생합니다. 사람마다 생활 방식에 따라 걱정하는 부분이 다를 수 있습니다.",
    designIntent:
      "월 7,500원의 비용으로 위의 보장을 받고 있습니다.\n" + 
      "큰 고민하기보다는 전체 보험비(약 10만원)을\n" +
      "고려하여 설계사분의 추천대로 결정했습니다.",
    options: [
      {
        id: "q2_a",
        title: "질병 수술비",
        amount: "30만원",
        description: "내부 질병으로 인한 수술",
        detailedDescription:
          "질병으로 인한 수술은 갑작스럽게 발생하며, 의료비 부담이 큰 질병(암, 심장계 등)은 별도로 항목을 만들기도 합니다.",
        category: "disease_surgery",
        imagePath: "/images/question/question03.png",
        imageAlt: "질병 수술비 보장",
      },
      {
        id: "q2_b",
        title: "상해 수술비",
        amount: "100만원",
        description: "외부 사고로 인한 수술",
        detailedDescription:
          "상해는 예고 없이 발생하며, 고위험 직업군이나 활동성이 높은 사람들에게 더 중요한 보장입니다.",
        category: "accident_surgery",
        imagePath: "/images/question/question04.png",
        imageAlt: "상해 수술비 보장",
      },
    ],
  },
  {
    id: "q3",
    title: "중입자 5000만원 보장 vs 암표적치료비 3000만원",
    description:
      "암 치료는 기술 발전과 함께 다양한 치료법이 개발되고 있으며, 치료 방식에 따라 비용과 효과가 달라집니다. **중입자 치료**와 **표적 치료**는 각각의 장점과 특성을 가진 최신 치료법입니다.",
    designIntent:
      "현재 중입자 치료가 가능한 곳은 한국에서 단\n" +
      "두 곳이며, 제약 사항이 많아 선택하지 않았습니다. \n" +
      "표적치료는 유용한 경험 사례를 많이 들어 \n" +
      "표적치료만, 월 3,500원으로 비용으로  \n" +
      "보장받고 있습니다.",
    options: [
      {
        id: "q3_a",
        title: "중입자 치료",
        amount: "5천만원",
        description: "정밀한 방사선 치료",
        detailedDescription:
          "중입자 치료는 암세포를 정밀하게 제거하는 혁신적인 방법으로 부작용이 적고 치료 효과가 높지만, 치료비 또한 비쌉니다.",
        category: "heavy_ion_therapy",
        imagePath: "/images/question/question05.png",
        imageAlt: "중입자 치료 보장",
      },
      {
        id: "q3_b",
        title: "암표적치료비",
        amount: "3천만원",
        description: "선택적 암세포 공격",
        detailedDescription:
          "표적치료는 암 조직만을 선택적으로 공격해 부작용이 적고 효율적이지만 치료가 장기적으로 이어질 경우 지속적인 비용이 발생할 수 있습니다.",
        category: "targeted_therapy",
        imagePath: "/images/question/question06.png",
        imageAlt: "표적 치료 보장",
      },
    ],
  },
  {
    id: "q4",
    title: "20년 갱신 vs 비갱신(30년납 100세 만기)",
    description:
      "갱신형 보험은 초기 보험료가 낮아 부담이 적지만, 갱신 시 보험료가 증가할 수 있습니다. 비갱신형 보험은 그 반대입니다.",
    designIntent:
      "노후에 대한 투자라고 생각하여  \n" +
      "비갱신: 30년납 100세 만기를 선택했습니다.",
    options: [
      {
        id: "q4_a",
        title: "갱신형 보험",
        amount: "",
        description: "초기 보험료는 낮음",
        detailedDescription:
          "갱신형 보험은 초기 비용을 줄여 단기적으로는 부담이 적지만, 갱신 시점마다 보험료가 상승할 수 있어 장기적인 부담이 될 수 있습니다.",
        category: "renewal",
        imagePath: "/images/question/question07.png",
        imageAlt: "갱신형 보험",
      },
      {
        id: "q4_b",
        title: "비갱신형 보험",
        amount: "",
        description: "장기적으로 보험료 고정",
        detailedDescription:
          "비갱신형 보험은 초기에 다소 비쌀 수 있지만 일정한 보험료로 장기적인 안정성을 확보할 수 있습니다. 30년간 납부한 뒤 만기까지 보장받을 수도 있습니다.",
        category: "non_renewal",
        imagePath: "/images/question/question08.png",
        imageAlt: "비갱신형 보험",
      },
    ],
  },
  {
    id: "q5",
    title: "허혈성심장질환진단비 500만원 vs 뇌혈관질환진단비 500만원",
    description:
      "둘 모두 이름은 어려워보이지만 생명을 위협할 수 있는 중대 질환으로 이에 대한 대비는 필수적입니다.",
    designIntent:
      "월 약 4천원의 보험료로 둘 모두 선택했고,\n" +
      "전체 보험비(약 10만원)을 고려하여\n" +
      "설계사분의 추천대로 결정했습니다.",
    options: [
      {
        id: "q5_a",
        title: "허혈성 심장질환 진단비",
        amount: "500만원",
        description: "심근경색, 협심증 등",
        detailedDescription:
          "허혈성 심장질환에는 심근경색, 협심증 등 심혈관계 주요 질환이 포함되며, 생명을 위협하는 급성 질환으로 이어질 수 있습니다.",
        category: "heart_disease",
        imagePath: "/images/question/question09.png",
        imageAlt: "심장질환 진단비",
      },
      {
        id: "q5_b",
        title: "뇌혈관질환 진단비",
        amount: "500만원",
        description: "뇌출혈, 뇌경색 등",
        detailedDescription:
          "뇌혈관질환에는 뇌출혈, 뇌경색 등 뇌혈관 관련 주요 질환이 포함되며, 초기 치료뿐만 아니라 재활 과정에서도 높은 비용이 발생할 수 있습니다.",
        category: "brain_disease",
        imagePath: "/images/question/question10.png",
        imageAlt: "뇌질환 진단비",
      },
    ],
  },
];
