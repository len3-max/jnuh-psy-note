"use client";

import { useMemo, useState } from "react";

type FormState = Record<string, string>;
type PanssItem = { code: string; name: string; group: "P" | "N" | "G" };

const PANSS_ITEMS: PanssItem[] = [
  { code: "P1", name: "망상", group: "P" },
  { code: "P2", name: "개념의 와해", group: "P" },
  { code: "P3", name: "환각행동", group: "P" },
  { code: "P4", name: "흥분", group: "P" },
  { code: "P5", name: "과대성", group: "P" },
  { code: "P6", name: "의심/피해감", group: "P" },
  { code: "P7", name: "적개심", group: "P" },
  { code: "N1", name: "둔마된 정동", group: "N" },
  { code: "N2", name: "감정적 위축", group: "N" },
  { code: "N3", name: "빈약한 라포", group: "N" },
  { code: "N4", name: "수동적/무감동적 사회적 위축", group: "N" },
  { code: "N5", name: "추상적 사고의 어려움", group: "N" },
  { code: "N6", name: "대화의 자발성과 흐름 부족", group: "N" },
  { code: "N7", name: "상동적 사고", group: "N" },
  { code: "G1", name: "신체적 관심", group: "G" },
  { code: "G2", name: "불안", group: "G" },
  { code: "G3", name: "죄책감", group: "G" },
  { code: "G4", name: "긴장", group: "G" },
  { code: "G5", name: "매너리즘과 자세", group: "G" },
  { code: "G6", name: "우울", group: "G" },
  { code: "G7", name: "운동성 지체", group: "G" },
  { code: "G8", name: "비협조성", group: "G" },
  { code: "G9", name: "비정상적 사고내용", group: "G" },
  { code: "G10", name: "지남력 장애", group: "G" },
  { code: "G11", name: "주의력 저하", group: "G" },
  { code: "G12", name: "판단력과 병식의 결여", group: "G" },
  { code: "G13", name: "의지의 장애", group: "G" },
  { code: "G14", name: "충동조절 저하", group: "G" },
  { code: "G15", name: "몰두", group: "G" },
  { code: "G16", name: "능동적 사회적 회피", group: "G" },
];

const MSE_FIELDS = [
  ["appearance", "외모 및 위생", "복장, 위생, 눈맞춤, 실제 나이와의 부합"],
  ["attitude", "태도 및 협조", "협조적, 방어적, 적대적, 양가적 등"],
  ["behavior", "행동 및 정신운동", "초조/지체, 이상행동, 불수의운동"],
  ["speech", "언어", "속도, 양, 음량, 유창성, 반응 잠복기"],
  ["mood", "기분 (주관적)", "환자가 표현하는 기분"],
  ["affect", "정동 (객관적)", "범위, 강도, 안정성, 적절성, 일치도"],
  ["thoughtProcess", "사고과정", "목표지향성, 연상의 이완, 우원/지리멸렬"],
  ["thoughtContent", "사고내용", "망상, 집착, 과대/피해/관계 사고"],
  ["perception", "지각", "환청·환시, 착각, 이인증/비현실감"],
  ["cognition", "인지 및 지남력", "의식, 시간·장소·사람 지남력, 주의·기억"],
  ["insight", "병식", "증상과 치료 필요성에 대한 이해"],
  ["judgment", "판단력", "현실검증력, 사회적 판단, 치료 결정 능력"],
] as const;

const HISTORY_FIELDS = [
  ["chiefComplaint", "주호소", "환자의 표현을 가능한 그대로 기록", 3],
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
  ["summary", "평가 요약"],
] as const;

export default function Home() {
  const [form, setForm] = useState<FormState>({});
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(PANSS_ITEMS.map((item) => [item.code, 1])),
  );
  const [activeGroup, setActiveGroup] = useState<"P" | "N" | "G">("P");
  const [copied, setCopied] = useState(false);

  const setField = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

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

  const summaryText = useMemo(() => {
    const value = (key: string) => form[key]?.trim() || "미기재";
    const sexAge = [value("sex"), form.age ? `${form.age}세` : "나이 미기재"].join(", ");
    const mse = MSE_FIELDS.map(([key, label]) => `- ${label}: ${value(key)}`).join("\n");
    const panss = PANSS_ITEMS.map(
      (item) => `${item.code} ${item.name} ${scores[item.code]}점`,
    ).join(", ");

    return `[정신건강의학과 응급 평가]\n평가일시: ${value("assessmentDate")}\n\n[환자 정보]\n이름: ${value("name")}\n성별/나이: ${sexAge}\n환자번호: ${value("patientId")}\n정보제공자/신뢰도: ${value("informant")}\n\n[주호소]\n${value("chiefComplaint")}\n\n[현병력]\n${value("presentIllness")}\n\n[과거력]\n${value("pastHistory")}\n\n[가족력]\n${value("familyHistory")}\n\n[물질사용력]\n${value("substanceHistory")}\n\n[Mental Status Examination]\n${mse}\n\n[위험도 평가]\n- 자살사고/계획/의도: ${value("suicideRisk")}\n- 타해사고/위협: ${value("violenceRisk")}\n- 자해·타해 수단 접근성: ${value("meansAccess")}\n- 보호요인: ${value("protectiveFactors")}\n- 종합 위험도: ${value("riskLevel")}\n- 즉시 시행한 안전조치: ${value("safetyPlan")}\n\n[PANSS]\n양성척도 ${totals.positive}/49, 음성척도 ${totals.negative}/49, 일반정신병리 ${totals.general}/112, 총점 ${totals.total}/210\n${panss}\n\n[임상 평가 및 계획]\n진단적 인상: ${value("impression")}\n의학적 감별/검사: ${value("medicalWorkup")}\n치료 및 처분 계획: ${value("plan")}\n평가자: ${value("clinician")}\n\n※ 본 기록은 임상 판단을 보조하기 위한 평가 요약이며, 최종 진단과 처분은 담당 의료진의 종합 판단에 따릅니다.`;
  }, [form, scores, totals]);

  const copySummary = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const jumpTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">+</span>
          <div>
            <strong>PSY·ER</strong>
            <span>정신건강 응급평가</span>
          </div>
        </div>
        <div className="privacy"><span /> 입력 내용은 서버에 저장되지 않습니다</div>
      </header>

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
              <h2>빠르게 기록하고,<br />한 번에 정리하세요.</h2>
            </div>
            <p>필수 임상정보와 정신상태검사, PANSS를 구조화해 기록한 뒤 진료기록용 텍스트로 복사할 수 있습니다.</p>
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

          <Section id="mse" number="03" title="Mental Status Examination" description="면담 중 관찰한 소견과 환자 진술을 구분해 기술합니다.">
            <div className="mse-grid">
              {MSE_FIELDS.map(([key, label, placeholder]) => (
                <Field key={key} label={label}>
                  <textarea rows={3} value={form[key] || ""} onChange={(e) => setField(key, e.target.value)} placeholder={placeholder} />
                </Field>
              ))}
            </div>
          </Section>

          <Section id="risk" number="04" title="응급 위험도 평가" description="현재의 자·타해 위험과 즉시 필요한 안전조치를 확인합니다." urgent>
            <div className="risk-alert"><span>!</span><p><b>위험이 임박한 경우</b> 평가 입력을 중단하고 기관의 응급 안전 프로토콜을 즉시 시행하세요.</p></div>
            <div className="mse-grid">
              <Field label="자살사고 / 계획 / 의도"><textarea rows={3} value={form.suicideRisk || ""} onChange={(e) => setField("suicideRisk", e.target.value)} placeholder="현재·최근 사고, 구체적 계획, 의도, 과거 시도" /></Field>
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
                  <b>{item.name}</b>
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

          <Section id="summary" number="06" title="임상 평가 및 요약" description="진단적 인상과 계획을 입력한 뒤 전체 기록을 복사합니다.">
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
        </div>
      </div>
      <footer><b>PSY·ER</b><span>의료진용 임상 기록 보조 도구 · 환자 안전과 기관 지침을 우선하세요.</span></footer>
    </main>
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
