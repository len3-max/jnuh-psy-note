# JNUH PSY · ER PSY Note

응급실 정신건강의학과 환자의 병력, Mental Status Examination, 위험도 및
PANSS 평가를 구조화해 기록하고 텍스트로 복사할 수 있는 임상 기록 보조
웹앱입니다.

## 주요 기능

- 환자 정보와 병력 기록
- 세부 소견을 선택할 수 있는 Mental Status Examination
- 자살 및 폭력 위험도 평가
- 정의와 임상 예시를 포함한 PANSS 채점
- 기입된 항목만 포함하는 텍스트 미리보기 및 복사
- 상단·하단 전체 초기화

## 개인정보 안내

입력 내용은 서버로 전송하거나 저장하지 않습니다. 단, 실제 임상 사용 시에는
기관의 개인정보 보호 정책과 의료정보 보안 지침을 우선해 주세요.

이 앱은 임상 판단을 보조하기 위한 도구이며, 최종 진단과 처분을 대신하지
않습니다. 위급한 자·타해 위험이 있는 경우 기관의 응급 안전 프로토콜을
즉시 시행해야 합니다.

## 개발

Node.js 22 이상이 필요합니다.

```bash
npm install
npm run dev
```

일반 배포 빌드는 `npm run build`, GitHub Pages 정적 빌드는
`npm run build:github-pages`를 사용합니다.
