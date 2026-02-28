import React, { useState, useEffect } from 'react';
import TeamHeader from '../../components/TeamHeader';

const MatchVote = () => {
  // 투표 데이터 및 마감 시간 설정
  const deadline = new Date('2026-02-07T23:59:00'); 
  const [timeLeft, setTimeLeft] = useState('');
  const [isVoteClosed, setIsVoteClosed] = useState(false);

  // 1. 투표 마감 카운트다운 로직
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft('투표가 마감되었습니다.');
        setIsVoteClosed(true);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남음`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. 가상의 팀 밸런스 매칭 결과 (실제로는 서버 알고리즘 결과값)
  const teamResult = {
    teamA: ['김민수(PIVO)', '이영희(ALA)', '박지성(FIXO)'],
    teamB: ['최지우(GOLEIRO)', '손흥민(ALA)', '이강인(PIVO)']
  };

  // 지도 앱 열기 (예: 카카오맵 검색)
  const openMap = () => {
    // 실제 사용 시 구장 이름이나 주소를 변수로 처리하세요
    window.open('https://map.kakao.com/link/search/풋살장', '_blank');
  };

  return (
    <div style={styles.pageWrapper}>
      <TeamHeader />
      <div style={styles.container}>
        <header style={styles.header}>
          <h2>경기 투표 및 팀 셋업</h2>
          <div style={styles.timerBox}>
            <span style={styles.timerIcon}>⏰</span>
            <span style={isVoteClosed ? styles.timerClosed : styles.timerActive}>{timeLeft}</span>
          </div>
        </header>

        {/* 구장 정보 및 날씨 연동 섹션 (새로 추가) */}
        <section style={styles.infoSection}>
          <div style={styles.weatherCard}>
            <h4 style={styles.cardTitle}>🌤️ 당일 구장 날씨 (예보)</h4>
            <p style={styles.cardContent}>기온: 18°C | 맑음 (강수확률 10%)</p>
            <span style={styles.cardSubText}>* API 연동 예정</span>
          </div>
          <div style={styles.mapCard} onClick={openMap}>
            <h4 style={styles.cardTitle}>📍 구장 위치 및 길찾기</h4>
            <p style={styles.cardContent}>서울시 강남구 테헤란로 123 풋살파크</p>
            <span style={styles.cardSubText}>클릭하여 카카오맵 열기</span>
          </div>
        </section>

        {/* 투표 프로그레스 바 영역 (기존 유지) */}
        <section style={styles.voteChart}>
          <div style={styles.progressBarContainer}>
            <div style={{ ...styles.progressBar, width: '60%', backgroundColor: '#4CAF50' }}>참석 12명</div>
            <div style={{ ...styles.progressBar, width: '25%', backgroundColor: '#f44336' }}>불참 5명</div>
            <div style={{ ...styles.progressBar, width: '15%', backgroundColor: '#FFC107' }}>미정 3명</div>
          </div>
        </section>

        {/* 3. 투표 완료/마감 시 나타나는 팀 매칭 결과 섹션 */}
        <section style={styles.resultSection}>
          <h3 style={styles.sectionTitle}>⚽ AI 밸런스 팀 매칭 결과</h3>
          <p style={styles.sectionSub}>실력 점수와 포지션을 고려하여 최적의 밸런스로 나누었습니다.</p>
          
          <div style={styles.teamGrid}>
            <div style={styles.teamCard}>
              <h4 style={{ color: '#2196F3' }}>TEAM A</h4>
              {teamResult.teamA.map((p, i) => <div key={i} style={styles.playerItem}>{p}</div>)}
            </div>
            <div style={styles.vsCircle}>VS</div>
            <div style={styles.teamCard}>
              <h4 style={{ color: '#f44336' }}>TEAM B</h4>
              {teamResult.teamB.map((p, i) => <div key={i} style={styles.playerItem}>{p}</div>)}
            </div>
          </div>
        </section>

        {/* 4. 드래그 앤 드롭 전술판 섹션 (새로 추가) */}
        <section style={styles.formationSection}>
          <div style={styles.formationHeader}>
            <h3 style={styles.sectionTitle}>📋 Formation Maker (전술판)</h3>
            <div style={styles.modeButtons}>
              <button style={styles.modeBtn}>5인제</button>
              <button style={styles.modeBtn}>6인제</button>
              <button style={styles.modeBtn}>11인제</button>
            </div>
          </div>
          <p style={styles.sectionSub}>아래 전술판에 선수를 배치해보세요. (드래그 앤 드롭 기능 준비 중)</p>
          
          <div style={styles.pitch}>
            {/* 전술판 그라운드 UI (추후 dnd 라이브러리 연동) */}
            <div style={styles.centerCircle}></div>
            <div style={styles.halfWayLine}></div>
            <p style={{color: 'rgba(255,255,255,0.7)', zIndex: 1}}>드래그 앤 드롭 전술판 영역</p>
          </div>
        </section>

      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '50px' },
  container: { padding: '20px 40px', maxWidth: '1000px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '30px' },
  timerBox: { 
    display: 'inline-flex', alignItems: 'center', gap: '10px', 
    padding: '10px 20px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
  },
  timerActive: { color: '#e63946', fontWeight: 'bold', fontSize: '1.1rem' },
  timerClosed: { color: '#888', fontWeight: 'bold' },
  
  // 구장/날씨 섹션 스타일
  infoSection: { display: 'flex', gap: '20px', marginBottom: '30px' },
  weatherCard: { flex: 1, padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '15px', border: '1px solid #bbdefb' },
  mapCard: { flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #eee', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'transform 0.2s' },
  cardTitle: { margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' },
  cardContent: { margin: '0 0 8px 0', fontWeight: 'bold', color: '#555' },
  cardSubText: { fontSize: '0.8rem', color: '#888' },

  voteChart: { marginBottom: '40px' },
  progressBarContainer: { display: 'flex', height: '35px', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' },
  
  resultSection: { marginBottom: '40px', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center', margin: '0 0 10px 0' },
  sectionSub: { textAlign: 'center', color: '#888', marginBottom: '30px' },
  teamGrid: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  teamCard: { flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center' },
  vsCircle: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  playerItem: { padding: '8px 0', borderBottom: '1px solid #f9f9f9', fontSize: '0.95rem' },

  // 전술판 섹션 스타일
  formationSection: { padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  formationHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '10px' },
  modeButtons: { display: 'flex', gap: '10px' },
  modeBtn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#555' },
  pitch: { 
    position: 'relative', height: '450px', backgroundColor: '#2e7d32', 
    borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center',
    border: '4px solid #fff', marginTop: '20px', overflow: 'hidden'
  },
  centerCircle: { 
    position: 'absolute', width: '100px', height: '100px', 
    border: '2px solid #fff', borderRadius: '50%' 
  },
  halfWayLine: {
    position: 'absolute', width: '2px', height: '100%', backgroundColor: '#fff'
  }
};

export default MatchVote;