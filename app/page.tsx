"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type FormState = Record<string, string>;
type PanssItem = {
  code: string;
  name: string;
  group: "P" | "N" | "G";
  definition: string;
  example: string;
};
type BprsItem = {
  code: string;
  name: string;
  source: "언어적 보고" | "행동 관찰";
  definition: string;
};
type MseOption = { label: string; definition: string };
type MseSection = {
  key: string;
  title: string;
  subtitle?: string;
  definition: string;
  options: MseOption[];
};
type CssrsIdeationItem = {
  key: string;
  level: number;
  title: string;
  definition: string;
  question: string;
};
type CssrsIntensityItem = {
  key: string;
  title: string;
  question: string;
  options: Array<{ value: string; label: string }>;
};
type CssrsBehaviorItem = {
  key: string;
  countKey?: string;
  title: string;
  definition: string;
};

const PANSS_ITEMS: PanssItem[] = [
  { code: "P1", name: "망상", group: "P", definition: "현실적 근거가 없고 문화적 맥락으로 설명되지 않는 확고한 믿음.", example: "근거 없이 ‘누군가 음식에 독을 탄다’고 확신하며 식사를 거부함." },
  { code: "P2", name: "개념의 와해", group: "P", definition: "목표지향적인 사고의 조직이 흐트러져 말의 연결과 이해가 어려운 상태.", example: "질문과 무관한 주제로 계속 이동하거나 문장 간 논리적 연결이 끊김." },
  { code: "P3", name: "환각행동", group: "P", definition: "외부 자극 없이 지각을 경험하며 그에 반응하는 상태.", example: "아무도 없는 곳을 보며 대화하거나 목소리의 지시에 따라 행동함." },
  { code: "P4", name: "흥분", group: "P", definition: "과도한 활동성, 고양된 긴장, 빠른 행동으로 나타나는 통제 어려운 활성화.", example: "면담 중 계속 서성이고 큰 소리로 끼어들며 앉아 있기 어려워함." },
  { code: "P5", name: "과대성", group: "P", definition: "자신의 능력·지위·정체성을 비현실적으로 높게 평가하는 믿음.", example: "특별한 능력으로 국가를 구할 수 있으며 유명 인사가 자신을 찾는다고 주장함." },
  { code: "P6", name: "의심/피해감", group: "P", definition: "타인의 의도를 부당하게 의심하거나 자신이 해를 입는다고 느끼는 경향.", example: "의료진이 자신을 속이려 한다며 질문을 거부하고 주변을 경계함." },
  { code: "P7", name: "적개심", group: "P", definition: "분노와 원망이 언어·표정·행동으로 드러나는 상태.", example: "비꼬는 말, 욕설, 위협적인 자세 또는 공격 행동을 보임." },
  { code: "N1", name: "둔마된 정동", group: "N", definition: "표정, 목소리, 몸짓 등 감정 표현의 범위와 강도가 감소한 상태.", example: "슬픈 내용을 말하면서도 표정 변화가 거의 없고 목소리가 단조로움." },
  { code: "N2", name: "감정적 위축", group: "N", definition: "감정적으로 관계에 참여하고 반응하는 정도가 감소한 상태.", example: "가족이나 중요한 사건을 이야기해도 정서적 관여가 거의 보이지 않음." },
  { code: "N3", name: "빈약한 라포", group: "N", definition: "면담자와의 상호작용에서 공감, 개방성, 친밀감이 부족한 상태.", example: "눈맞춤과 반응이 적고 기계적으로 단답하며 관계 형성이 어려움." },
  { code: "N4", name: "수동적/무감동적 사회적 위축", group: "N", definition: "관심과 동기 부족으로 사회적 활동에 수동적으로 참여하지 않는 상태.", example: "권유가 없으면 방에서 나오지 않고 대인활동을 스스로 시작하지 않음." },
  { code: "N5", name: "추상적 사고의 어려움", group: "N", definition: "비유, 공통점, 개념화처럼 구체적 사실을 넘어 사고하는 능력의 저하.", example: "‘돌다리도 두드려 보고 건너라’를 문자 그대로 다리 이야기로만 해석함." },
  { code: "N6", name: "대화의 자발성과 흐름 부족", group: "N", definition: "대화 시작과 유지가 어렵고 말의 양·유창성·생산성이 감소한 상태.", example: "질문마다 한두 단어로만 답하고 추가 질문 없이는 대화가 이어지지 않음." },
  { code: "N7", name: "상동적 사고", group: "N", definition: "사고의 유연성이 줄어 같은 주제나 표현을 반복하는 상태.", example: "질문이 바뀌어도 동일한 문구나 한 가지 관심사로 반복해서 돌아감." },
  { code: "G1", name: "신체적 관심", group: "G", definition: "신체 상태나 질병에 과도하게 몰두하거나 비현실적으로 염려하는 상태.", example: "검사상 이상이 없는데도 심각한 암이 있다고 반복적으로 호소함." },
  { code: "G2", name: "불안", group: "G", definition: "현재 또는 예상되는 위험에 대한 걱정과 긴장, 자율신경 증상.", example: "계속 최악의 상황을 걱정하며 안절부절못하고 심계항진을 호소함." },
  { code: "G3", name: "죄책감", group: "G", definition: "과거 행동에 대한 부적절하거나 과도한 자책과 후회.", example: "사소한 실수를 가족의 불행 원인이라 여기며 용서받을 수 없다고 말함." },
  { code: "G4", name: "긴장", group: "G", definition: "불안과 관련된 뚜렷한 신체적 긴장 및 운동성 표현.", example: "주먹을 꽉 쥐고 몸이 경직되며 떨거나 자세를 자주 바꿈." },
  { code: "G5", name: "매너리즘과 자세", group: "G", definition: "부자연스럽고 기이하거나 과장된 동작 및 자세.", example: "목적 없이 특정 손동작을 반복하거나 이상한 자세를 오래 유지함." },
  { code: "G6", name: "우울", group: "G", definition: "슬픔, 의욕 저하, 비관, 무가치감으로 나타나는 지속적 저조한 기분.", example: "즐거움을 느끼지 못하고 미래가 없다고 말하며 눈물을 보임." },
  { code: "G7", name: "운동성 지체", group: "G", definition: "움직임과 말, 반응 속도가 전반적으로 느려진 상태.", example: "대답 전 긴 침묵이 있고 천천히 걷거나 동작 시작이 현저히 늦음." },
  { code: "G8", name: "비협조성", group: "G", definition: "불신, 방어, 반항 등으로 평가나 치료 요구에 적극적으로 저항하는 상태.", example: "면담 질문에 답하지 않고 검사나 투약을 반복적으로 거부함." },
  { code: "G9", name: "비정상적 사고내용", group: "G", definition: "기이하거나 비현실적이고 일상 기능을 방해하는 사고 내용.", example: "생각이 전파된다고 믿거나 특정 숫자에 특별한 우주적 의미가 있다고 몰두함." },
  { code: "G10", name: "지남력 장애", group: "G", definition: "시간, 장소, 사람 또는 상황을 정확히 파악하는 능력의 저하.", example: "병원을 집이라고 하거나 날짜와 현재 상황을 반복해서 틀림." },
  { code: "G11", name: "주의력 저하", group: "G", definition: "주의를 집중·유지하거나 필요에 따라 전환하는 능력의 저하.", example: "간단한 질문 중에도 주변 소리에 쉽게 산만해져 대화를 따라가지 못함." },
  { code: "G12", name: "판단력과 병식의 결여", group: "G", definition: "정신과적 상태와 치료 필요성을 인식하고 현실적인 결정을 내리는 능력의 부족.", example: "뚜렷한 증상에도 문제가 전혀 없다고 하며 위험한 귀가를 고집함." },
  { code: "G13", name: "의지의 장애", group: "G", definition: "생각과 행동을 의도적으로 시작·지속·조절하는 능력의 저하.", example: "기본적인 일상 과제를 결정하거나 시작하지 못해 계속 지시가 필요함." },
  { code: "G14", name: "충동조절 저하", group: "G", definition: "욕구나 감정을 숙고 없이 행동으로 옮기며 통제가 어려운 상태.", example: "사소한 자극에 갑자기 물건을 던지거나 자해 행동을 시도함." },
  { code: "G15", name: "몰두", group: "G", definition: "내적 생각과 감정에 지나치게 빠져 외부 환경과의 접촉이 감소한 상태.", example: "면담 중 내부 생각에 잠겨 질문을 놓치고 주변 상황에 거의 반응하지 않음." },
  { code: "G16", name: "능동적 사회적 회피", group: "G", definition: "두려움·불신·적대감 때문에 의도적으로 사람과 상황을 피하는 상태.", example: "해를 입을까 두려워 가족과 의료진을 피하고 문을 잠근 채 나오지 않음." },
];

const BPRS_ITEMS: BprsItem[] = [
  { code: "B1", name: "신체적 염려", source: "언어적 보고", definition: "신체적 건강에 대한 관심의 정도, 신체적 질병에 대한 두려움, 건강염려증." },
  { code: "B2", name: "불안", source: "언어적 보고", definition: "현재나 미래에 대한 걱정, 두려움, 지나친 근심." },
  { code: "B3", name: "감정적 철퇴", source: "행동 관찰", definition: "자발적인 상호작용의 결여, 고립, 다른 사람과 관계를 맺는 것의 결핍." },
  { code: "B4", name: "개념적인 와해", source: "언어적 보고", definition: "사고 과정이 혼란되어 있고, 연결이 되지 않고 와해되어 있는 정도." },
  { code: "B5", name: "죄책감", source: "언어적 보고", definition: "자기 비난이나 수치심, 과거 행동에 대한 지나친 자책." },
  { code: "B6", name: "긴장", source: "행동 관찰", definition: "긴장의 신체적 표현, 과잉활동성." },
  { code: "B7", name: "반복적 행동과 자세", source: "행동 관찰", definition: "이상하고 기괴하며 자연스럽지 못한 동작과 운동 행동. 틱은 포함하지 않음." },
  { code: "B8", name: "과대성", source: "언어적 보고", definition: "자신에 대한 과장된 생각, 오만함, 일상적이지 않은 힘과 능력에 대한 과신." },
  { code: "B9", name: "우울한 정동", source: "언어적 보고", definition: "슬픔, 의기소침함, 낙담한 기분, 염세적 태도." },
  { code: "B10", name: "적대감", source: "언어적 보고", definition: "타인에 대한 원한이나 경멸, 호전적 태도. 평가자에 대한 태도는 비협조성에서 평가." },
  { code: "B11", name: "의심", source: "언어적 보고", definition: "불신, 다른 사람이 환자에게 악의나 차별적 의도를 가지고 있다는 믿음." },
  { code: "B12", name: "환각 행동", source: "언어적 보고", definition: "외부 자극이 없는데도 스스로 느끼는 지각." },
  { code: "B13", name: "운동 지체", source: "행동 관찰", definition: "느린 움직임이나 말에서 시사되는 에너지 수준의 감소." },
  { code: "B14", name: "비협조성", source: "행동 관찰", definition: "저항, 방어적 태도, 권위에 대한 부인." },
  { code: "B15", name: "이상한 사고 내용", source: "언어적 보고", definition: "일상적이지 않으며 기괴한 사고 내용." },
  { code: "B16", name: "둔마된 정동", source: "행동 관찰", definition: "감소된 정서적 어조와 정상적인 감정 강도의 감소." },
  { code: "B17", name: "흥분성", source: "행동 관찰", definition: "고조된 감정의 반응성, 초조, 과잉 행동." },
  { code: "B18", name: "지남력 장애", source: "언어적 보고", definition: "시간, 장소, 사람에 대한 적절한 연상의 장애." },
];

const MSE_SECTIONS: MseSection[] = [
  {
    key: "appearance",
    title: "Appearance",
    subtitle: "General description",
    definition: "체격, 복장과 위생, 눈맞춤 및 전반적인 인상을 관찰합니다.",
    options: [
      { label: "Good hygiene", definition: "복장과 개인위생이 적절함" },
      { label: "Poor hygiene", definition: "위생이나 복장 관리가 부족함" },
      { label: "Obese / Thin build", definition: "비만하거나 마른 체형이 두드러짐" },
      { label: "Poor eye contact", definition: "눈맞춤을 피하거나 거의 유지하지 못함" },
      { label: "Guarded appearance", definition: "경계하고 방어적으로 보임" },
      { label: "Depressed / Anxious look", definition: "표정과 자세에서 우울·불안이 관찰됨" },
    ],
  },
  {
    key: "psychomotor",
    title: "Psychomotor Behavior",
    subtitle: "Overt behavior and psychomotor activity",
    definition: "겉으로 드러나는 행동의 양과 속도, 운동성 변화를 평가합니다.",
    options: [
      { label: "Psychomotor agitation", definition: "서성임·손 비빔 등 목적 없는 활동 증가" },
      { label: "Psychomotor retardation", definition: "동작과 반응 시작이 전반적으로 느림" },
      { label: "Hyperactivity", definition: "상황에 비해 활동량이 지나치게 많음" },
      { label: "Stereotypy", definition: "목적 없는 동일 행동을 반복함" },
      { label: "Tremor / Involuntary movement", definition: "떨림이나 불수의 운동이 관찰됨" },
      { label: "Catatonic feature", definition: "강직·함구·기이한 자세 등 긴장성 소견" },
    ],
  },
  {
    key: "attitude",
    title: "Attitude toward the Interviewer",
    definition: "면담자와 평가 과정에 대한 협조성, 경계, 적대성을 봅니다.",
    options: [
      { label: "Cooperative", definition: "면담에 자발적이고 적절하게 협조함" },
      { label: "Defensive", definition: "자신을 보호하려 질문을 피하거나 최소화함" },
      { label: "Guarded / Suspicious", definition: "의도를 의심하며 정보를 제한함" },
      { label: "Non-cooperative", definition: "질문·검사·면담 요구에 응하지 않음" },
      { label: "Hostile", definition: "분노·위협·적대적 태도가 드러남" },
      { label: "Withdrawn", definition: "상호작용을 피하고 정서적으로 물러남" },
    ],
  },
  {
    key: "speech",
    title: "Speech",
    definition: "발화량, 속도, 음량, 유창성 및 반응 잠복기를 평가합니다.",
    options: [
      { label: "Normal speech", definition: "속도·양·음량이 적절함" },
      { label: "Decreased verbal productivity", definition: "말의 양이 적고 단답형 반응이 많음" },
      { label: "Pressured speech", definition: "빠르고 멈추기 어려울 정도로 말이 많음" },
      { label: "Slow / Latent response", definition: "말이 느리거나 대답까지 시간이 오래 걸림" },
      { label: "Decreased tone / volume", definition: "목소리의 억양이나 음량이 감소함" },
      { label: "Loud speech", definition: "상황에 비해 목소리가 지나치게 큼" },
      { label: "Mutism", definition: "말할 수 있으나 거의 또는 전혀 말하지 않음" },
    ],
  },
  {
    key: "mood",
    title: "Mood",
    subtitle: "Pervasive and sustained emotion",
    definition: "환자가 주관적으로 보고하는 지속적인 내적 감정 상태입니다.",
    options: [
      { label: "Euthymic", definition: "뚜렷한 우울·고양 없이 안정된 기분" },
      { label: "Depressed", definition: "지속적인 슬픔·의욕 저하·비관" },
      { label: "Anxious", definition: "걱정과 두려움, 긴장이 지속됨" },
      { label: "Angry / Irritable", definition: "분노가 있거나 쉽게 짜증이 남" },
      { label: "Elated / Expansive / Euphoric", definition: "지나치게 고양되고 낙관적이며 들뜬 기분" },
      { label: "Empty / Guilty", definition: "공허감이나 과도한 죄책감을 느낌" },
      { label: "Hopeless / Futile", definition: "희망이 없고 어떤 노력도 소용없다고 느낌" },
      { label: "Anhedonic", definition: "평소 즐기던 활동에서 즐거움을 느끼지 못함" },
      { label: "Alexithymic", definition: "자신의 감정을 알아차리거나 표현하기 어려움" },
    ],
  },
  {
    key: "affect",
    title: "Affect",
    subtitle: "Outward expression of inner experience",
    definition: "표정, 목소리, 몸짓으로 관찰되는 감정의 범위와 안정성입니다.",
    options: [
      { label: "Full range", definition: "상황에 맞는 다양한 정서 표현" },
      { label: "Restricted affect", definition: "정서 표현의 범위가 다소 제한됨" },
      { label: "Blunted affect", definition: "정서 표현의 강도와 반응이 현저히 감소함" },
      { label: "Flat affect", definition: "표정·목소리의 정서 표현이 거의 없음" },
      { label: "Dysphoric", definition: "불쾌하고 괴로운 정서가 두드러짐" },
      { label: "Irritable", definition: "쉽게 짜증 내는 정서 표현" },
      { label: "Labile", definition: "정서가 빠르고 예측하기 어렵게 변함" },
      { label: "Inappropriate / Incongruent", definition: "상황 또는 보고된 기분과 정서 표현이 맞지 않음" },
    ],
  },
  {
    key: "thoughtForm",
    title: "Form & Continuity of Thought",
    definition: "사고의 속도·생산성·논리적 연결과 목표지향성을 평가합니다.",
    options: [
      { label: "Coherent / Relevant", definition: "사고가 논리적이고 질문에 적절히 답함" },
      { label: "Flight of ideas / Rapid thinking", definition: "연상에 따라 주제가 빠르게 이동함" },
      { label: "Slow / Hesitant thinking", definition: "사고 진행이 느리거나 머뭇거림" },
      { label: "Loose association", definition: "생각 사이의 논리적 연결이 약해짐" },
      { label: "Tangential", definition: "질문의 핵심에 도달하지 않고 빗나감" },
      { label: "Circumstantial", definition: "불필요한 세부를 거치지만 결국 핵심에 도달함" },
      { label: "Thought blocking", definition: "말이나 생각의 흐름이 갑자기 멈춤" },
      { label: "Distractibility", definition: "주변 자극에 쉽게 사고 흐름이 끊김" },
    ],
  },
  {
    key: "thoughtContent",
    title: "Content of Thought",
    definition: "사고가 집중되는 주제와 망상·관계사고·자살사고 등을 확인합니다.",
    options: [
      { label: "Preoccupation", definition: "특정 걱정이나 주제에 반복적으로 몰두함" },
      { label: "Hopelessness / Worthlessness", definition: "미래 희망이나 자기 가치가 없다고 느낌" },
      { label: "Self-blame / Regret", definition: "자신을 과도하게 탓하고 후회함" },
      { label: "Delusion", definition: "근거가 없고 교정되지 않는 확고한 믿음" },
      { label: "Idea of reference", definition: "무관한 사건이 자신과 관련 있다고 느낌" },
      { label: "Ideas of influence", definition: "외부 힘이 자신의 생각·행동에 영향을 준다고 느낌" },
      { label: "Suicidal ideation / plan", definition: "죽고 싶은 생각 또는 구체적 계획이 있음" },
      { label: "Homicidal ideation / plan", definition: "타인을 해치려는 생각 또는 계획이 있음" },
    ],
  },
  {
    key: "perception",
    title: "Perceptual Disturbance",
    definition: "외부 자극과 맞지 않는 지각 경험 및 현실감의 변화를 확인합니다.",
    options: [
      { label: "No perceptual disturbance", definition: "뚜렷한 지각 이상이 보고·관찰되지 않음" },
      { label: "Auditory hallucination", definition: "외부 소리 없이 목소리나 소리를 들음" },
      { label: "Visual hallucination", definition: "실제 자극 없이 사람이나 형상을 봄" },
      { label: "Command hallucination", definition: "특정 행동을 지시하는 환청을 경험함" },
      { label: "Illusion", definition: "실제 자극을 다른 것으로 잘못 지각함" },
      { label: "Depersonalization", definition: "자신이 낯설거나 자신과 분리된 듯 느낌" },
      { label: "Derealization", definition: "주변 세계가 비현실적이거나 낯설게 느껴짐" },
    ],
  },
  {
    key: "cognition",
    title: "Sensorium & Cognition",
    definition: "각성도, 지남력, 집중력·계산, 원격·최근·즉각 기억을 평가합니다.",
    options: [
      { label: "Alertness intact", definition: "명료하게 깨어 있고 자극에 적절히 반응함" },
      { label: "Drowsy / Fluctuating", definition: "졸리거나 의식 수준이 변동함" },
      { label: "Orientation intact", definition: "시간·장소·사람을 정확히 파악함" },
      { label: "Disoriented", definition: "시간·장소·사람 중 하나 이상을 틀림" },
      { label: "Concentration intact", definition: "주의 집중과 간단한 계산이 가능함" },
      { label: "Impaired concentration", definition: "주의를 유지하거나 계산하기 어려움" },
      { label: "Memory intact", definition: "원격·최근·즉각 기억이 보존됨" },
      { label: "Impaired memory", definition: "원격·최근·즉각 기억 중 저하가 확인됨" },
    ],
  },
  {
    key: "insight",
    title: "Insight",
    definition: "현재 증상과 질병, 치료 필요성에 대한 이해 수준입니다.",
    options: [
      { label: "Good insight", definition: "증상과 질병을 이해하고 치료 필요성을 인정함" },
      { label: "Partial insight", definition: "일부 문제는 인정하지만 원인·치료 이해가 제한됨" },
      { label: "Poor insight", definition: "문제 인식이 매우 제한되고 치료 필요성을 부정함" },
      { label: "No insight", definition: "질병과 증상의 존재를 전혀 인정하지 않음" },
    ],
  },
  {
    key: "judgment",
    title: "Judgement",
    definition: "현실을 검토하고 안전하고 합리적인 결정을 내리는 능력입니다.",
    options: [
      { label: "Intact judgement", definition: "상황과 결과를 고려해 적절한 결정을 내림" },
      { label: "Partially impaired", definition: "일부 상황에서 결과 예측과 결정이 제한됨" },
      { label: "Impaired judgement", definition: "위험과 결과를 고려한 합리적 결정이 어려움" },
    ],
  },
];

const CSSRS_IDEATION_ITEMS: CssrsIdeationItem[] = [
  {
    key: "cssrsWishToBeDead",
    level: 1,
    title: "죽고 싶은 소망",
    definition: "죽고 싶거나 더 이상 살고 싶지 않다는 수동적 바람.",
    question: "마지막 방문 이후 죽고 싶거나, 잠든 뒤 깨어나지 않았으면 좋겠다고 생각한 적이 있습니까?",
  },
  {
    key: "cssrsSuicidalThought",
    level: 2,
    title: "비특이적 적극적 자살사고",
    definition: "방법·의도·계획은 정하지 않았지만 스스로 목숨을 끊는 것을 생각함.",
    question: "마지막 방문 이후 실제로 자살을 생각한 적이 있습니까?",
  },
  {
    key: "cssrsMethod",
    level: 3,
    title: "방법을 생각한 자살사고",
    definition: "구체적인 실행 계획이나 의도는 없지만 한 가지 이상의 방법을 생각함.",
    question: "어떤 방법으로 실행할지 생각했으나 구체적인 계획이나 실행 의도는 없었습니까?",
  },
  {
    key: "cssrsIntent",
    level: 4,
    title: "계획 없이 실행 의도가 있는 자살사고",
    definition: "구체적 계획은 없지만 생각을 실행에 옮길 의도가 어느 정도 있음.",
    question: "구체적인 계획은 없더라도 실제로 실행할 의도가 어느 정도 있었습니까?",
  },
  {
    key: "cssrsPlanIntent",
    level: 5,
    title: "구체적 계획과 의도가 있는 자살사고",
    definition: "방법·시간·장소 등 계획의 전부 또는 일부를 세웠고 실행 의도도 있음.",
    question: "구체적인 자살 계획을 세웠으며 이를 실행할 의도가 있었습니까?",
  },
];

const CSSRS_INTENSITY_ITEMS: CssrsIntensityItem[] = [
  {
    key: "cssrsFrequency",
    title: "빈도",
    question: "가장 심각한 자살사고가 얼마나 자주 있었습니까?",
    options: [
      { value: "1", label: "1 · 일주일에 한 번 미만" },
      { value: "2", label: "2 · 일주일에 한 번" },
      { value: "3", label: "3 · 일주일에 2~5번" },
      { value: "4", label: "4 · 매일 또는 거의 매일" },
      { value: "5", label: "5 · 매일 여러 번" },
    ],
  },
  {
    key: "cssrsDuration",
    title: "지속 시간",
    question: "한번 시작된 생각이 얼마나 오래 지속되었습니까?",
    options: [
      { value: "1", label: "1 · 몇 초~몇 분" },
      { value: "2", label: "2 · 1시간 미만" },
      { value: "3", label: "3 · 1~4시간" },
      { value: "4", label: "4 · 4~8시간" },
      { value: "5", label: "5 · 8시간 이상 또는 지속적" },
    ],
  },
  {
    key: "cssrsControllability",
    title: "통제 가능성",
    question: "원할 때 자살사고를 중단하거나 통제할 수 있었습니까?",
    options: [
      { value: "0", label: "0 · 통제하려고 노력하지 않음" },
      { value: "1", label: "1 · 쉽게 통제 가능" },
      { value: "2", label: "2 · 거의 어렵지 않음" },
      { value: "3", label: "3 · 약간 어려움" },
      { value: "4", label: "4 · 많이 어려움" },
      { value: "5", label: "5 · 통제할 수 없음" },
    ],
  },
  {
    key: "cssrsDeterrents",
    title: "저지 요인",
    question: "가족·종교·죽음에 대한 두려움 등 실행을 막는 요인이 있었습니까?",
    options: [
      { value: "0", label: "0 · 해당 없음" },
      { value: "1", label: "1 · 확실한 저지 요인 있음" },
      { value: "2", label: "2 · 저지 요인이 있는 것 같음" },
      { value: "3", label: "3 · 확실하지 않음" },
      { value: "4", label: "4 · 저지 요인이 없는 것 같음" },
      { value: "5", label: "5 · 저지 요인이 분명히 없음" },
    ],
  },
  {
    key: "cssrsReasons",
    title: "자살사고의 이유",
    question: "타인의 반응을 얻으려는 목적과 고통을 끝내려는 목적 중 어느 쪽에 가까웠습니까?",
    options: [
      { value: "0", label: "0 · 해당 없음" },
      { value: "1", label: "1 · 전적으로 타인의 반응을 얻기 위함" },
      { value: "2", label: "2 · 주로 타인의 반응을 얻기 위함" },
      { value: "3", label: "3 · 두 이유가 비슷함" },
      { value: "4", label: "4 · 주로 고통을 끝내기 위함" },
      { value: "5", label: "5 · 전적으로 고통을 끝내기 위함" },
    ],
  },
];

const CSSRS_BEHAVIOR_ITEMS: CssrsBehaviorItem[] = [
  {
    key: "cssrsActualAttempt",
    countKey: "cssrsActualAttemptCount",
    title: "실제 자살기도",
    definition: "조금이라도 죽으려는 의도가 동반된 잠재적 자해행동. 실제 손상 발생 여부와 무관합니다.",
  },
  {
    key: "cssrsInterruptedAttempt",
    countKey: "cssrsInterruptedAttemptCount",
    title: "방해된 기도",
    definition: "자해행동을 시작하려 했으나 다른 사람이나 외부 상황 때문에 실행 전에 중단된 경우.",
  },
  {
    key: "cssrsAbortedAttempt",
    countKey: "cssrsAbortedAttemptCount",
    title: "중단된 기도",
    definition: "자해행동을 시작하려 했으나 실제 실행 전에 본인이 스스로 중단한 경우.",
  },
  {
    key: "cssrsPreparatoryBehavior",
    title: "준비 행위",
    definition: "수단 확보, 약물 수집, 유서 작성, 물건 나눠주기 등 생각을 넘어선 준비행동.",
  },
  {
    key: "cssrsNssi",
    title: "비자살적 자해행동",
    definition: "죽으려는 의도 없이 긴장 완화·감정 조절 등의 목적으로 한 자해행동.",
  },
];

const HISTORY_FIELDS = [
  ["chiefComplaint", "주호소", "환자의 표현을 가능한 그대로 기록하고, 발병 시기와 최근 악화 시기를 함께 기재", 3],
  ["presentIllness", "현병력", "증상 시작, 경과, 악화 요인, 기능 변화, 응급실 방문 경위", 5],
  ["pastHistory", "과거력", "정신과 진단·입원·자해/자살시도, 신체질환, 약물 및 순응도", 4],
  ["familyHistory", "가족력", "정신질환, 자살, 물질사용, 주요 유전·신체질환", 3],
  ["substanceHistory", "물질사용력", "알코올, 담배, 카페인, 처방약·불법약물의 종류/양/최근 사용", 3],
] as const;

const sections = [
  ["patient", "환자 정보"],
  ["history", "병력"],
  ["mse", "정신상태검사"],
  ["risk", "위험도"],
  ["panss", "PANSS"],
  ["bprs", "BPRS"],
  ["summary", "평가 요약"],
] as const;

export default function Home() {
  const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [form, setForm] = useState<FormState>({});
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(PANSS_ITEMS.map((item) => [item.code, 1])),
  );
  const [bprsScores, setBprsScores] = useState<Record<string, number>>(
    Object.fromEntries(BPRS_ITEMS.map((item) => [item.code, 1])),
  );
  const [mseSelections, setMseSelections] = useState<Record<string, string[]>>({});
  const [activeGroup, setActiveGroup] = useState<"P" | "N" | "G">("P");
  const [copied, setCopied] = useState(false);

  const setField = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleMse = (key: string, label: string) =>
    setMseSelections((current) => {
      const selected = current[key] || [];
      return {
        ...current,
        [key]: selected.includes(label)
          ? selected.filter((item) => item !== label)
          : [...selected, label],
      };
    });

  const totals = useMemo(() => {
    const sum = (group: "P" | "N" | "G") =>
      PANSS_ITEMS.filter((item) => item.group === group).reduce(
        (total, item) => total + scores[item.code],
        0,
      );
    const positive = sum("P");
    const negative = sum("N");
    const general = sum("G");
    return { positive, negative, general, total: positive + negative + general };
  }, [scores]);

  const bprsTotal = useMemo(
    () => BPRS_ITEMS.reduce((total, item) => total + bprsScores[item.code], 0),
    [bprsScores],
  );

  const cssrsIdeationAnswered = CSSRS_IDEATION_ITEMS.some((item) => Boolean(form[item.key]));
  const highestCssrsIdeation = CSSRS_IDEATION_ITEMS.reduce(
    (highest, item) => form[item.key] === "예" ? Math.max(highest, item.level) : highest,
    0,
  );

  const summaryText = useMemo(() => {
    const value = (key: string) => form[key]?.trim();
    const makeSection = (title: string, lines: Array<string | undefined>) => {
      const visibleLines = lines.filter((line): line is string => Boolean(line));
      return visibleLines.length ? `[${title}]\n${visibleLines.join("\n")}` : "";
    };
    const sexAge = [
      value("sex"),
      value("age") ? `${value("age")}세` : undefined,
    ].filter(Boolean).join(", ");
    const mseLines = MSE_SECTIONS.map((section) => {
      const selected = mseSelections[section.key]?.join(", ");
      const description = value(`mse_${section.key}`);
      if (!selected && !description) return undefined;
      return `- ${section.title}: ${[selected, description].filter(Boolean).join(" / ")}`;
    });
    const cssrsIdeationResponses = CSSRS_IDEATION_ITEMS
      .filter((item) => value(item.key))
      .map((item) => `${item.level}. ${item.title} ${value(item.key) === "예" ? "(+)" : "(-)"}`)
      .join(", ");
    const cssrsIntensityResponses = CSSRS_INTENSITY_ITEMS
      .filter((item) => value(item.key))
      .map((item) => {
        const selectedValue = value(item.key);
        const selectedOption = item.options.find((option) => option.value === selectedValue);
        const answer = selectedOption
          ? selectedOption.label.replace(" · ", "; ")
          : selectedValue;
        return `${item.title} ${answer}`;
      })
      .join(", ");
    const cssrsBehaviorResponses = CSSRS_BEHAVIOR_ITEMS
      .filter((item) => value(item.key))
      .map((item) => {
        const count = item.countKey ? value(item.countKey) : undefined;
        const isPositive = value(item.key) === "예";
        const response = isPositive
          ? count ? `(+, ${count}회)` : "(+)"
          : "(-)";
        return `${item.title} ${response}`;
      })
      .join(", ");
    const sections = [
      makeSection("환자 정보", [
        value("name") ? `이름: ${value("name")}` : undefined,
        sexAge ? `성별/나이: ${sexAge}` : undefined,
        value("patientId") ? `환자번호: ${value("patientId")}` : undefined,
        value("informant") ? `정보제공자/신뢰도: ${value("informant")}` : undefined,
        value("patientNote") ? `참고사항: ${value("patientNote")}` : undefined,
      ]),
      value("chiefComplaint") ? `[주호소]\n${value("chiefComplaint")}` : "",
      value("presentIllness") ? `[현병력]\n${value("presentIllness")}` : "",
      value("pastHistory") ? `[과거력]\n${value("pastHistory")}` : "",
      value("familyHistory") ? `[가족력]\n${value("familyHistory")}` : "",
      value("substanceHistory") ? `[물질사용력]\n${value("substanceHistory")}` : "",
      makeSection("Mental Status Examination", mseLines),
      makeSection("위험도 평가", [
        cssrsIdeationResponses ? `- C-SSRS 자살사고: ${cssrsIdeationResponses}` : undefined,
        cssrsIdeationAnswered ? `- 자살사고 최고 심각도: ${highestCssrsIdeation}/5` : undefined,
        cssrsIntensityResponses ? `- 자살사고 강도: ${cssrsIntensityResponses}` : undefined,
        value("cssrsIdeationDescription") ? `- 가장 심각한 자살사고 설명: ${value("cssrsIdeationDescription")}` : undefined,
        cssrsBehaviorResponses ? `- C-SSRS 자살행동: ${cssrsBehaviorResponses}` : undefined,
        value("cssrsBehaviorDescription") ? `- 자살행동 세부 내용: ${value("cssrsBehaviorDescription")}` : undefined,
        value("cssrsLethalAttemptDate") ? `- 가장 치명적인 기도 날짜: ${value("cssrsLethalAttemptDate")}` : undefined,
        value("cssrsActualLethality") ? `- 실제적 치명성: ${value("cssrsActualLethality")}` : undefined,
        value("cssrsPotentialLethality") ? `- 잠재적 치명성: ${value("cssrsPotentialLethality")}` : undefined,
        value("suicideRisk") ? `- 자살위험 종합 소견: ${value("suicideRisk")}` : undefined,
        value("violenceRisk") ? `- 타해사고/위협: ${value("violenceRisk")}` : undefined,
        value("meansAccess") ? `- 자해·타해 수단 접근성: ${value("meansAccess")}` : undefined,
        value("protectiveFactors") ? `- 보호요인: ${value("protectiveFactors")}` : undefined,
        value("riskLevel") ? `- 종합 위험도: ${value("riskLevel")}` : undefined,
        value("safetyPlan") ? `- 즉시 시행한 안전조치: ${value("safetyPlan")}` : undefined,
      ]),
      `[PANSS]\n양성척도 합 ${totals.positive}/49, 음성척도 합 ${totals.negative}/49, 일반정신병리 합 ${totals.general}/112, 총점 ${totals.total}/210`,
      `[BPRS]\n총점 ${bprsTotal}/126`,
      makeSection("임상 평가 및 계획", [
        value("impression") ? `진단적 인상: ${value("impression")}` : undefined,
        value("medicalWorkup") ? `의학적 감별/검사: ${value("medicalWorkup")}` : undefined,
        value("plan") ? `치료 및 처분 계획: ${value("plan")}` : undefined,
        value("clinician") ? `평가자: ${value("clinician")}` : undefined,
      ]),
    ].filter(Boolean);

    const header = [
      "[정신건강의학과 응급 평가]",
      value("assessmentDate") ? `평가일시: ${value("assessmentDate")}` : undefined,
    ].filter(Boolean).join("\n");

    return `${header}\n\n${sections.join("\n\n")}\n\n※ 본 기록은 임상 판단을 보조하기 위한 평가 요약이며, 최종 진단과 처분은 담당 의료진의 종합 판단에 따릅니다.`;
  }, [bprsTotal, cssrsIdeationAnswered, form, highestCssrsIdeation, mseSelections, totals]);

  const copySummary = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const resetAssessment = () => {
    const confirmed = window.confirm(
      "입력한 환자정보, 병력, MSE, C-SSRS 위험도, PANSS 및 BPRS 점수를 모두 초기화할까요?",
    );
    if (!confirmed) return;

    setForm({});
    setMseSelections({});
    setScores(Object.fromEntries(PANSS_ITEMS.map((item) => [item.code, 1])));
    setBprsScores(Object.fromEntries(BPRS_ITEMS.map((item) => [item.code, 1])));
    setActiveGroup("P");
    setCopied(false);
    window.requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  };

  const jumpTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <Image className="brand-emblem" src={`${assetBasePath}/jnuh-emblem.png`} alt="제주대학교병원 엠블럼" width={46} height={46} unoptimized priority />
          <div>
            <strong>JNUH PSY</strong>
            <span>정신건강 응급평가</span>
          </div>
        </div>
        <div className="top-actions">
          <div className="privacy"><span /> 입력 내용은 서버에 저장되지 않습니다</div>
          <button type="button" className="reset-button compact" onClick={resetAssessment}>내용 초기화</button>
        </div>
      </header>

      <nav className="mobile-section-nav" aria-label="평가 항목 바로가기">
        <div>
          {sections.map(([id, label], index) => (
            <button type="button" key={id} onClick={() => jumpTo(id)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <section className="support-banner" aria-labelledby="support-banner-title">
        <div className="support-banner-inner">
          <div className="support-banner-title" id="support-banner-title">
            <span>365일 · 24시간</span>
            <strong>상담 서비스</strong>
          </div>
          <div className="support-call-list">
            <a className="support-call mental" href="tel:15770199" aria-label="정신건강위기 상담전화 1577-0199로 전화하기">
              <span>정신건강위기상담전화</span>
              <strong>1577-0199</strong>
              <small>전화 연결</small>
            </a>
            <a className="support-call suicide" href="tel:109" aria-label="자살예방 상담전화 109로 전화하기">
              <span>자살예방상담전화</span>
              <strong>109</strong>
              <small>전화 연결</small>
            </a>
            <a className="support-call bereaved" href="tel:01027600199" aria-label="제주 자살유족 원스톱서비스 010-2760-0199로 전화하기">
              <span>자살유족 원스톱서비스 <em>제주</em></span>
              <strong>010-2760-0199</strong>
              <small>전화 연결</small>
            </a>
          </div>
        </div>
      </section>

      <div className="page-shell">
        <aside className="side-nav" aria-label="평가 항목">
          <div className="eyebrow">ASSESSMENT</div>
          <h1>정신건강<br />응급 평가</h1>
          <p>병력부터 증상 척도까지 한 흐름으로 기록합니다.</p>
          <nav>
            {sections.map(([id, label], index) => (
              <button key={id} onClick={() => jumpTo(id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>{label}
              </button>
            ))}
          </nav>
          <div className="side-note">
            <b>임상 보조 도구</b>
            <span>위급한 자·타해 위험은 척도 입력보다 즉각적인 안전 확보를 우선합니다.</span>
          </div>
        </aside>

        <div className="content">
          <section className="hero">
            <div>
              <div className="eyebrow">EMERGENCY PSYCHIATRY</div>
              <h2>ER PSY Note</h2>
            </div>
            <p>필수 임상정보와 정신상태검사, PANSS·BPRS를 구조화해 기록한 뒤 진료기록용 텍스트로 복사할 수 있습니다.</p>
          </section>

          <Section id="patient" number="01" title="환자 정보" description="환자 식별 정보와 평가 시점을 기록합니다.">
            <div className="field-grid patient-grid">
              <Field label="이름" required>
                <input value={form.name || ""} onChange={(e) => setField("name", e.target.value)} placeholder="환자 이름" autoComplete="off" />
              </Field>
              <Field label="성별" required>
                <select value={form.sex || ""} onChange={(e) => setField("sex", e.target.value)}>
                  <option value="">선택</option><option>남성</option><option>여성</option><option>기타/미상</option>
                </select>
              </Field>
              <Field label="나이" required>
                <div className="unit-input"><input type="number" min="0" max="130" value={form.age || ""} onChange={(e) => setField("age", e.target.value)} placeholder="0" /><span>세</span></div>
              </Field>
              <Field label="환자번호">
                <input value={form.patientId || ""} onChange={(e) => setField("patientId", e.target.value)} placeholder="선택 입력" />
              </Field>
              <Field label="평가일시">
                <input type="datetime-local" value={form.assessmentDate || ""} onChange={(e) => setField("assessmentDate", e.target.value)} />
              </Field>
              <Field label="정보제공자 / 신뢰도">
                <input value={form.informant || ""} onChange={(e) => setField("informant", e.target.value)} placeholder="예: 본인·보호자 / 중간" />
              </Field>
              <Field label="참고사항">
                <textarea rows={3} value={form.patientNote || ""} onChange={(e) => setField("patientNote", e.target.value)} placeholder="재발 여부, 의뢰 사유, 보호자 연락 상황 등 참고할 내용을 입력" />
              </Field>
            </div>
          </Section>

          <Section id="history" number="02" title="병력" description="현재 문제의 시간적 흐름과 관련 배경을 구체적으로 기록합니다.">
            <div className="stack">
              {HISTORY_FIELDS.map(([key, label, placeholder, rows]) => (
                <Field key={key} label={label}>
                  <textarea rows={rows} value={form[key] || ""} onChange={(e) => setField(key, e.target.value)} placeholder={placeholder} />
                </Field>
              ))}
            </div>
          </Section>

          <Section id="mse" number="03" title="Mental Status Examination" description="면담 중 관찰한 소견을 선택하고, 필요한 내용을 추가로 기술합니다.">
            <div className="mse-sections">
              {MSE_SECTIONS.map((section) => (
                <article className="mse-card" key={section.key}>
                  <div className="mse-card-heading">
                    <div>
                      <h3>{section.title}</h3>
                      {section.subtitle && <span>{section.subtitle}</span>}
                    </div>
                    <p>{section.definition}</p>
                  </div>
                  <div className="mse-options">
                    {section.options.map((option) => {
                      const selected = mseSelections[section.key]?.includes(option.label);
                      return (
                        <button
                          type="button"
                          key={option.label}
                          className={selected ? "selected" : ""}
                          onClick={() => toggleMse(section.key, option.label)}
                          aria-pressed={selected}
                        >
                          <span className="check-mark">{selected ? "✓" : ""}</span>
                          <span><b>{option.label}</b><small>{option.definition}</small></span>
                        </button>
                      );
                    })}
                  </div>
                  <Field label="Additional description">
                    <textarea
                      rows={2}
                      value={form[`mse_${section.key}`] || ""}
                      onChange={(e) => setField(`mse_${section.key}`, e.target.value)}
                      placeholder="선택 항목을 보완할 관찰 내용 또는 환자 진술"
                    />
                  </Field>
                </article>
              ))}
            </div>
          </Section>

          <Section id="risk" number="04" title="응급 위험도 평가" description="현재의 자·타해 위험과 즉시 필요한 안전조치를 확인합니다." urgent>
            <div className="risk-alert"><span>!</span><p><b>위험이 임박한 경우</b> 평가 입력을 중단하고 기관의 응급 안전 프로토콜을 즉시 시행하세요.</p></div>
            <div className="cssrs-panel">
              <div className="cssrs-heading">
                <div>
                  <span>C-SSRS · SINCE LAST VISIT</span>
                  <h3>구조화 자살위험 평가</h3>
                  <p>마지막 방문 이후의 자살사고와 행동을 단계적으로 확인합니다.</p>
                </div>
                <div className={`cssrs-level ${highestCssrsIdeation >= 4 ? "high" : ""}`}>
                  <span>사고 최고 심각도</span>
                  <strong>{cssrsIdeationAnswered ? highestCssrsIdeation : "—"}</strong>
                  <small>/ 5</small>
                </div>
              </div>

              <div className="cssrs-note">
                <b>면담 순서</b>
                <span>1·2번을 먼저 확인하고, 2번이 ‘예’이면 3–5번을 이어서 평가합니다. 이 기록 도구는 정식 교육과 임상 판단을 대체하지 않습니다.</span>
              </div>

              <div className="cssrs-subsection">
                <div className="cssrs-subheading">
                  <div><span>01</span><h4>자살사고 심각도</h4></div>
                  <p>각 문항을 예/아니오로 평가하고, ‘예’인 항목 중 가장 높은 단계를 확인합니다.</p>
                </div>
                <div className="cssrs-list">
                  {CSSRS_IDEATION_ITEMS.map((item) => (
                    <div className="cssrs-item" key={item.key}>
                      <span className="cssrs-number">{item.level}</span>
                      <div className="cssrs-copy">
                        <b>{item.title}</b>
                        <p>{item.question}</p>
                        <small>{item.definition}</small>
                      </div>
                      <BinaryChoice value={form[item.key] || ""} onChange={(choice) => setField(item.key, choice)} label={`${item.level}. ${item.title}`} />
                    </div>
                  ))}
                </div>
                <Field label="가장 심각한 자살사고 설명">
                  <textarea
                    rows={3}
                    value={form.cssrsIdeationDescription || ""}
                    onChange={(e) => setField("cssrsIdeationDescription", e.target.value)}
                    placeholder="방법, 대상 시점, 상황, 환자의 표현과 평가자의 판단을 구체적으로 기록"
                  />
                </Field>
              </div>

              <div className="cssrs-subsection">
                <div className="cssrs-subheading">
                  <div><span>02</span><h4>자살사고 강도</h4></div>
                  <p>가장 심각했던 자살사고를 기준으로 평가합니다. 숫자가 높을수록 대체로 위험한 양상을 의미합니다.</p>
                </div>
                <div className="cssrs-intensity-grid">
                  {CSSRS_INTENSITY_ITEMS.map((item) => (
                    <label className="cssrs-scale-field" key={item.key}>
                      <span>{item.title}</span>
                      <small>{item.question}</small>
                      <select value={form[item.key] || ""} onChange={(e) => setField(item.key, e.target.value)}>
                        <option value="">미평가</option>
                        {item.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

              <div className="cssrs-subsection">
                <div className="cssrs-subheading">
                  <div><span>03</span><h4>자살행동</h4></div>
                  <p>서로 다른 유형이 함께 존재할 수 있으므로 모든 항목을 각각 확인합니다.</p>
                </div>
                <div className="cssrs-list behavior">
                  {CSSRS_BEHAVIOR_ITEMS.map((item) => (
                    <div className="cssrs-item" key={item.key}>
                      <div className="cssrs-copy">
                        <b>{item.title}</b>
                        <small>{item.definition}</small>
                      </div>
                      {item.countKey && form[item.key] === "예" && (
                        <label className="cssrs-count">
                          <span>횟수</span>
                          <input
                            type="number"
                            min="0"
                            value={form[item.countKey] || ""}
                            onChange={(e) => setField(item.countKey!, e.target.value)}
                            aria-label={`${item.title} 횟수`}
                          />
                        </label>
                      )}
                      <BinaryChoice
                        value={form[item.key] || ""}
                        onChange={(choice) => {
                          setField(item.key, choice);
                          if (item.countKey && choice !== "예") setField(item.countKey, "");
                        }}
                        label={item.title}
                      />
                    </div>
                  ))}
                </div>
                <Field label="자살행동 세부 내용">
                  <textarea
                    rows={4}
                    value={form.cssrsBehaviorDescription || ""}
                    onChange={(e) => setField("cssrsBehaviorDescription", e.target.value)}
                    placeholder="일시, 방법, 의도, 중단 경위, 구조 과정, 의학적 손상과 비자살적 자해 여부를 기록"
                  />
                </Field>
                <div className="cssrs-lethality-grid">
                  <Field label="가장 치명적인 기도 날짜">
                    <input type="date" value={form.cssrsLethalAttemptDate || ""} onChange={(e) => setField("cssrsLethalAttemptDate", e.target.value)} />
                  </Field>
                  <Field label="실제적 치명성 / 의학적 손상">
                    <select value={form.cssrsActualLethality || ""} onChange={(e) => setField("cssrsActualLethality", e.target.value)}>
                      <option value="">미평가</option>
                      <option value="0 · 손상 없음 또는 매우 경미">0 · 손상 없음 또는 매우 경미</option>
                      <option value="1 · 경미한 신체 손상">1 · 경미한 신체 손상</option>
                      <option value="2 · 의학적 처치가 필요한 중등도 손상">2 · 의학적 처치가 필요한 중등도 손상</option>
                      <option value="3 · 입원이 필요한 중고도 손상">3 · 입원이 필요한 중고도 손상</option>
                      <option value="4 · 집중치료가 필요한 심각한 손상">4 · 집중치료가 필요한 심각한 손상</option>
                      <option value="5 · 사망">5 · 사망</option>
                    </select>
                  </Field>
                  <Field label="잠재적 치명성 (실제적 치명성 0인 경우)">
                    <select value={form.cssrsPotentialLethality || ""} onChange={(e) => setField("cssrsPotentialLethality", e.target.value)}>
                      <option value="">미평가</option>
                      <option value="0 · 상해 가능성이 거의 없음">0 · 상해 가능성이 거의 없음</option>
                      <option value="1 · 상해 가능성은 높으나 사망 가능성은 낮음">1 · 상해 가능성은 높으나 사망 가능성은 낮음</option>
                      <option value="2 · 의학적 치료에도 사망 가능성이 높음">2 · 의학적 치료에도 사망 가능성이 높음</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>
            <div className="mse-grid">
              <Field label="자살위험 종합 소견"><textarea rows={3} value={form.suicideRisk || ""} onChange={(e) => setField("suicideRisk", e.target.value)} placeholder="C-SSRS 결과와 현재 상태를 종합한 임상 판단" /></Field>
              <Field label="타해사고 / 위협"><textarea rows={3} value={form.violenceRisk || ""} onChange={(e) => setField("violenceRisk", e.target.value)} placeholder="대상, 계획, 의도, 최근 폭력·흥분" /></Field>
              <Field label="수단 접근성"><textarea rows={3} value={form.meansAccess || ""} onChange={(e) => setField("meansAccess", e.target.value)} placeholder="약물, 무기 등 치명적 수단의 접근 가능성" /></Field>
              <Field label="보호요인"><textarea rows={3} value={form.protectiveFactors || ""} onChange={(e) => setField("protectiveFactors", e.target.value)} placeholder="보호자, 치료 동기, 지지체계, 책임감" /></Field>
            </div>
            <div className="risk-footer">
              <Field label="종합 위험도">
                <div className="segmented">
                  {["낮음", "중간", "높음", "임박"].map((level) => (
                    <button type="button" key={level} className={form.riskLevel === level ? "selected" : ""} onClick={() => setField("riskLevel", level)}>{level}</button>
                  ))}
                </div>
              </Field>
              <Field label="즉시 시행한 안전조치"><textarea rows={2} value={form.safetyPlan || ""} onChange={(e) => setField("safetyPlan", e.target.value)} placeholder="관찰 수준, 보호자 동반, 수단 제한, 입원 등" /></Field>
            </div>
          </Section>

          <Section id="panss" number="05" title="PANSS" description="지난 1주간의 증상을 면담과 관찰, 정보제공자 자료를 종합하여 1–7점으로 평가합니다.">
            <div className="score-strip">
              <Score label="양성척도" value={totals.positive} max={49} tone="red" />
              <Score label="음성척도" value={totals.negative} max={49} tone="blue" />
              <Score label="일반정신병리" value={totals.general} max={112} tone="gold" />
              <Score label="PANSS 총점" value={totals.total} max={210} tone="dark" />
            </div>
            <div className="panss-scale"><b>채점 기준</b><span>1 없음</span><span>2 극히 경미</span><span>3 경미</span><span>4 중간</span><span>5 중고도</span><span>6 고도</span><span>7 최고도</span></div>
            <div className="tabs" role="tablist">
              {([["P", "양성척도 · 7"], ["N", "음성척도 · 7"], ["G", "일반정신병리 · 16"]] as const).map(([group, label]) => (
                <button key={group} className={activeGroup === group ? "active" : ""} onClick={() => setActiveGroup(group)}>{label}</button>
              ))}
            </div>
            <div className="panss-list">
              {PANSS_ITEMS.filter((item) => item.group === activeGroup).map((item) => (
                <div className="panss-row" key={item.code}>
                  <span className={`code code-${item.group.toLowerCase()}`}>{item.code}</span>
                  <div className="panss-info">
                    <b>{item.name}</b>
                    <p>{item.definition}</p>
                    <details>
                      <summary>임상 예시 보기</summary>
                      <span>{item.example}</span>
                    </details>
                  </div>
                  <div className="score-buttons" aria-label={`${item.code} ${item.name} 점수`}>
                    {[1, 2, 3, 4, 5, 6, 7].map((score) => (
                      <button key={score} className={scores[item.code] === score ? "selected" : ""} onClick={() => setScores((current) => ({ ...current, [item.code]: score }))}>{score}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="scale-note">PANSS는 교육받은 평가자가 공식 매뉴얼의 기준점(anchor point)에 따라 시행해야 합니다. 점수만으로 진단이나 처분을 결정하지 마세요.</p>
          </Section>

          <Section id="bprs" number="06" title="BPRS" description="간편 정신과적 평가 척도의 18개 증상을 언어적 보고와 행동 관찰을 바탕으로 1–7점 평가합니다.">
            <div className="score-strip bprs-score-strip">
              <Score label="BPRS 총점" value={bprsTotal} max={126} tone="dark" />
            </div>
            <div className="panss-scale">
              <b>채점 기준</b>
              <span>1 없음</span><span>2 매우 경함</span><span>3 경함</span>
              <span>4 중등도</span><span>5 약간 심함</span><span>6 심함</span><span>7 매우 심함</span>
            </div>
            <div className="panss-list bprs-list">
              {BPRS_ITEMS.map((item) => (
                <div className="panss-row" key={item.code}>
                  <span className="code code-b">{item.code}</span>
                  <div className="panss-info">
                    <div className="item-title-line">
                      <b>{item.name}</b>
                      <small>{item.source}</small>
                    </div>
                    <p>{item.definition}</p>
                  </div>
                  <div className="score-buttons" aria-label={`${item.code} ${item.name} 점수`}>
                    {[1, 2, 3, 4, 5, 6, 7].map((score) => (
                      <button
                        type="button"
                        key={score}
                        className={bprsScores[item.code] === score ? "selected" : ""}
                        aria-pressed={bprsScores[item.code] === score}
                        onClick={() => setBprsScores((current) => ({ ...current, [item.code]: score }))}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="scale-note">BPRS는 면담에서 확인한 환자의 보고와 평가자가 관찰한 행동을 구분해 채점합니다. 척도 점수만으로 진단이나 처분을 결정하지 마세요.</p>
          </Section>

          <Section id="summary" number="07" title="임상 평가 및 요약" description="진단적 인상과 계획을 입력한 뒤 전체 기록을 복사합니다.">
            <div className="stack">
              <Field label="진단적 인상"><textarea rows={3} value={form.impression || ""} onChange={(e) => setField("impression", e.target.value)} placeholder="주요 진단 및 감별진단, 근거" /></Field>
              <Field label="의학적 감별 / 검사"><textarea rows={3} value={form.medicalWorkup || ""} onChange={(e) => setField("medicalWorkup", e.target.value)} placeholder="섬망·물질·신경학적/내과적 원인 평가, 검사 결과" /></Field>
              <Field label="치료 및 처분 계획"><textarea rows={4} value={form.plan || ""} onChange={(e) => setField("plan", e.target.value)} placeholder="약물, 입원/귀가, 추적진료, 보호자 교육 및 안전계획" /></Field>
              <Field label="평가자"><input value={form.clinician || ""} onChange={(e) => setField("clinician", e.target.value)} placeholder="성명 / 직위" /></Field>
            </div>
            <div className="summary-preview">
              <div className="summary-heading"><div><span>TEXT PREVIEW</span><h3>평가 기록 미리보기</h3></div><button onClick={copySummary}>{copied ? "복사 완료 ✓" : "전체 평가 복사"}</button></div>
              <pre>{summaryText}</pre>
            </div>
          </Section>
          <div className="bottom-reset">
            <div><b>새로운 평가를 시작하시나요?</b><span>현재 입력 내용을 모두 지우고 초기 상태로 돌아갑니다.</span></div>
            <button type="button" className="reset-button" onClick={resetAssessment}>내용 전체 초기화</button>
          </div>
        </div>
      </div>
      <footer><b>JNUH PSY</b><span>의료진용 임상 기록 보조 도구 · 환자 안전과 기관 지침을 우선하세요.</span></footer>
    </main>
  );
}

function BinaryChoice({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return (
    <div className="binary-choice" role="group" aria-label={`${label} 응답`}>
      {["예", "아니오"].map((choice) => (
        <button
          type="button"
          key={choice}
          className={value === choice ? "selected" : ""}
          aria-pressed={value === choice}
          onClick={() => onChange(value === choice ? "" : choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}

function Section({ id, number, title, description, urgent, children }: { id: string; number: string; title: string; description: string; urgent?: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className={`form-section ${urgent ? "urgent" : ""}`}>
      <div className="section-heading"><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="field"><span>{label}{required && <i>필수</i>}</span>{children}</label>;
}

function Score({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return <div className={`score-card ${tone}`}><span>{label}</span><strong>{value}</strong><small>/ {max}</small></div>;
}
