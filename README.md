# ⚽ Football Team Manager
일정, 회비 및 기록 관리를 한곳에서 해결하는 풋살/축구 팀 관리 웹사이트 입니다. 

## ✨ 주요 기능 (Key Features)

### 1. 나의 팀 & 선수 통계 (My Team & Stats)

- **선수 명부 관리**: 팀원의 이름, 희망 포지션, 출장 경기수 및 득점/도움 기록을 관리합니다.

- **랭크 시스템**: 실력(출석률, 공격/수비 포인트, MOM 등 종합 반영)에 따라 아마추어, 세미프로, 프로, 월드클래스 등 4단계 등급을 부여합니다.

- **권한 구분**: 관리자와 일반 회원을 뱃지로 구분하여 표시합니다.

- **경기 로그 및 전적 아카이브**: 과거 경기 결과(스코어, 득점/도움 기록, 오늘의 MOM 등)를 위키나 뉴스 기사 형식으로 기록하여, 언제든 팀의 역사를 재미있게 되짚어볼 수 있습니다.

### 2. 경기 투표 및 팀 셋업 (Match Vote & Team Setup)

- **카운트다운**: 경기 투표 마감까지 남은 시간을 실시간으로 계산하여 표시합니다.

- **AI 팀 밸런스**: 투표가 완료되면 선수들의 랭크와 데이터를 기반으로 최적의 밸런스를 갖춘 TEAM A vs TEAM B를 자동 생성합니다.

- **드래그 앤 드롭 전술판 (Formation Maker)**: 풋살(5~6인제)과 축구(11인제) 버전을 지원하며, 배정된 팀원들을 화면에서 직접 드래그하여 직관적으로 포메이션을 짤 수 있습니다.

- **구장 정보 및 날씨 연동**: Open API를 활용해 경기 당일 구장 주변의 날씨 예보를 제공하며, 구장 주소 클릭 시 카카오맵/네이버지도 길 찾기로 바로 연결되어 주차 및 이동 정보를 쉽게 확인합니다.

### 3. 캘린더 및 회비 관리 (Calendar & Finance)

- **일정 관리**: 경기(친선/리그), 회비 마감일, 팀 회식 등 이벤트를 카테고리별로 색상을 구분하여 달력에 표시합니다.

    - 모든 팀원의 스케줄을 취합하여, AI가 가장 참석률이 높을 최적의 경기 시간을 자동 추천합니다.

- **회비 현황**: 월별 총 수입, 지출, 잔액을 요약하여 보여주며 회원별 납부/미납 상태를 투명하게 관리합니다.

### 4. 카카오톡 연동 및 스마트 공유 (KakaoTalk Integration)

- **원클릭 카톡 공유**: 투표 독려, 미납자 회비 입금 촉구, 확정된 팀 스쿼드 및 포메이션 이미지 등을 버튼 한 번에 깔끔한 메시지로 생성하여 카카오톡 단체방에 바로 공유합니다.

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

3. frontend 폴더로 이동합니다.

   ```bash
   cd frontend
   ```

4. 프로젝트를 실행합니다.

    ```bash
    npm start
    ```
