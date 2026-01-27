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

  return (
    <div style={styles.pageWrapper}>
      <TeamHeader />
      <div style={styles.container}>
        <header style={styles.header}>
          <h2>경기 투표 현황</h2>
          <div style={styles.timerBox}>
            <span style={styles.timerIcon}>⏰</span>
            <span style={isVoteClosed ? styles.timerClosed : styles.timerActive}>{timeLeft}</span>
          </div>
        </header>

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
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh' },
  container: { padding: '20px 40px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  timerBox: { 
    display: 'inline-flex', alignItems: 'center', gap: '10px', 
    padding: '10px 20px', backgroundColor: '#fff', borderRadius: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
  },
  timerActive: { color: '#e63946', fontWeight: 'bold', fontSize: '1.1rem' },
  timerClosed: { color: '#888', fontWeight: 'bold' },
  voteChart: { marginBottom: '50px' },
  progressBarContainer: { display: 'flex', height: '35px', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' },
  
  resultSection: { marginTop: '40px', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: '1.4rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' },
  sectionSub: { textAlign: 'center', color: '#888', marginBottom: '30px' },
  teamGrid: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  teamCard: { flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center' },
  vsCircle: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' },
  playerItem: { padding: '8px 0', borderBottom: '1px solid #f9f9f9', fontSize: '0.95rem' }
};

export default MatchVote;