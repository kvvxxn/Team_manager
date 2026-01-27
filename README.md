# ⚽ Football Team Manager
실시간 팀 매칭과 선수 기록 관리를 한곳에서 해결하는 풋살/축구 팀 관리 웹사이트 입니다. 

## ✨ 주요 기능 (Key Features)

### 1. 매칭 및 랭킹 (Matching & Ranking)
실시간 팀 랭킹: RP(Ranking Point) 기준 내림차순으로 정렬된 실시간 팀 순위를 확인할 수 있습니다.

- 매칭 시스템: 선호 지역, 상대 레벨, 희망 날짜 및 시간을 설정하여 최적의 상대 팀을 찾습니다.

- 대기열 목록: 현재 매칭을 기다리는 팀들의 로고, 지역, 실력 점수(RP)를 카드로 시각화하여 보여줍니다.

### 2. 나의 팀 & 선수 통계 (My Team & Stats)
- 선수 명부 관리: 팀원의 이름, 희망 포지션, 출장 경기수 및 득점/도움 기록을 관리합니다.

- 랭크 시스템: 아마추어, 세미프로, 프로, 월드클래스 등 4단계 등급을 부여하며, 월드클래스 등급은 특수한 보라색 반짝이 효과가 적용됩니다.

- 권한 구분: 관리자와 일반 회원을 뱃지로 구분하여 표시합니다.

### 3. 경기 투표 및 팀 나누기 (Match Vote & Team Balancing)
- 카운트다운: 경기 투표 마감까지 남은 시간을 실시간으로 계산하여 표시합니다.

- AI 팀 밸런스: 투표가 완료되면 선수들의 랭크와 실력 점수를 기반으로 최적의 밸런스를 갖춘 TEAM A vs TEAM B를 자동 생성합니다.

### 4. 캘린더 및 회비 관리 (Calendar & Finance)
- 일정 관리: 경기(친선/리그), 회비 마감일, 팀 회식 등 이벤트를 카테고리별로 색상을 구분하여 달력에 표시합니다.

- 회비 현황: 월별 총 수입, 지출, 잔액을 요약하여 보여주며 회원별 납부/미납 상태를 관리합니다.

## 🛠 기술 스택 (Tech Stack)
`Frontend`: React.js, React Router v6

`Styling`: Inline Styles (CSS-in-JS), Keyframe Animations

`State Management`: React Hooks (useState, useEffect, useNavigate)

`Tools`: Warp Terminal, Git

## 📂 프로젝트 구조 (Project Structure)
```plaintext
src/
├── components/
│   └── TeamHeader.jsx      # 상단 내비게이션 바 (뒤로가기 포함)
├── pages/
│   ├── Main.jsx            # 4분할 메인 대시보드
│   ├── Calendar.jsx        # 팀 일정 달력
│   ├── Match.jsx           # 팀 매칭 및 랭킹 시스템
│   ├── Settings.jsx        # 프로필 및 앱 설정
│   └── Team/
│       ├── PlayerStats.jsx # 선수 기록 및 랭크 관리
│       ├── MatchVote.jsx   # 투표 및 팀 밸런스 결과
│       ├── Finance.jsx     # 회비 및 지출 내역
│       └── Admin.jsx       # 팀원 추가 및 권한 관리
└── App.js                  # 라우팅 설정 센터
```


## 🚀 시작하기 (Getting Started)

1. 저장소를 클론합니다.
    ```bash
    git clone https://github.com/kdh3236/football-team-manager.git
    ```


2. 종속성을 설치합니다.

    ```bash
    npm install
    ```

3. 프로젝트를 실행합니다.

    ```bash
    npm start
    ```