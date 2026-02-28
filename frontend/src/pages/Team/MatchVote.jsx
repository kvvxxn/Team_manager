import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import TeamHeader from '../../components/TeamHeader'; // 헤더 제거

const MatchVote = () => {
  const navigate = useNavigate(); 
  // 탭 상태 관리 ('vote' | 'lineup')
  const [activeTab, setActiveTab] = useState('vote');

  // 투표 데이터 및 마감 시간 설정
  const deadline = new Date('2026-03-01T23:59:00'); // 날짜 수정 (현재 날짜 이후로)
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

  // 2. 가상의 팀 밸런스 매칭 결과 (선발 정보 탭)
  const teamResult = {
    teamA: ['김민수(PIVO)', '이영희(ALA)', '박지성(FIXO)'],
    teamB: ['최지우(GOLEIRO)', '손흥민(ALA)', '이강인(PIVO)']
  };

  // 3. 가상의 투표 현황 데이터 (카카오톡 스타일)
  const voteStatus = {
    attending: [
      { id: 1, name: '김민수', img: 'https://via.placeholder.com/40' },
      { id: 2, name: '이영희', img: 'https://via.placeholder.com/40' },
      { id: 3, name: '박지성', img: 'https://via.placeholder.com/40' },
      { id: 4, name: '손흥민', img: 'https://via.placeholder.com/40' },
      { id: 5, name: '차범근', img: 'https://via.placeholder.com/40' },
    ],
    notAttending: [
      { id: 6, name: '홍길동', img: 'https://via.placeholder.com/40' },
    ],
    undecided: [
      { id: 7, name: '아무개', img: 'https://via.placeholder.com/40' },
      { id: 8, name: '테스트', img: 'https://via.placeholder.com/40' },
    ]
  };

  const voteCounts = {
    attending: voteStatus.attending.length,
    notAttending: voteStatus.notAttending.length,
    undecided: voteStatus.undecided.length,
    total: voteStatus.attending.length + voteStatus.notAttending.length + voteStatus.undecided.length
  };


  // 지도 앱 열기
  const openMap = () => {
    window.open('https://map.kakao.com/link/search/풋살장', '_blank');
  };

  return (
    <div style={styles.pageWrapper}>
      <TeamHeader />
      <div style={styles.container}>
        
        {/* 상단 탭 네비게이션 */}
        <div style={styles.tabHeader}>
          <div 
            style={{...styles.tabItem, ...(activeTab === 'vote' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('vote')}
          >
            투표
          </div>
          <div 
            style={{...styles.tabItem, ...(activeTab === 'lineup' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('lineup')}
          >
            선발 정보
          </div>
        </div>

        {/* ======================= 투표 탭 내용 ======================= */}
        {activeTab === 'vote' && (
          <div style={styles.tabContent}>
            
            {/* 상단 정보: 남은 시간, 날씨, 위치 */}
            <header style={styles.header}>
              <div style={styles.timerBox}>
                <span style={styles.timerIcon}>⏰</span>
                <span style={isVoteClosed ? styles.timerClosed : styles.timerActive}>{timeLeft}</span>
              </div>
            </header>

            <section style={styles.infoSection}>
              <div style={styles.weatherCard}>
                <h4 style={styles.cardTitle}>🌤️ 날씨</h4>
                <div style={styles.weatherInfo}>
                  <span style={{fontSize: '2rem'}}>18°C</span>
                  <span>맑음 (강수 10%)</span>
                </div>
              </div>
              <div style={styles.mapCard} onClick={openMap}>
                <h4 style={styles.cardTitle}>📍 위치</h4>
                <p style={styles.cardContent}>서울시 강남구 테헤란로 123</p>
                <div style={styles.mapPlaceholder}>지도 보기</div>
              </div>
            </section>

            {/* 카카오톡 스타일 투표 현황 */}
            <section style={styles.voteListSection}>
              <h3 style={styles.sectionTitle}>투표 현황 ({voteCounts.total}명)</h3>
              
              <div style={styles.voteGroup}>
                <div style={styles.voteGroupHeader}>
                  <span style={{color: '#4CAF50'}}>참석</span>
                  <span>{voteCounts.attending}명</span>
                </div>
                <div style={styles.voterList}>
                  {voteStatus.attending.map(user => (
                    <div key={user.id} style={styles.voterItem}>
                      <div style={styles.avatar}></div>
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.voteGroup}>
                <div style={styles.voteGroupHeader}>
                  <span style={{color: '#f44336'}}>불참</span>
                  <span>{voteCounts.notAttending}명</span>
                </div>
                <div style={styles.voterList}>
                  {voteStatus.notAttending.map(user => (
                    <div key={user.id} style={styles.voterItem}>
                      <div style={styles.avatar}></div>
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.voteGroup}>
                <div style={styles.voteGroupHeader}>
                  <span style={{color: '#FFC107'}}>미정</span>
                  <span>{voteCounts.undecided}명</span>
                </div>
                <div style={styles.voterList}>
                  {voteStatus.undecided.map(user => (
                    <div key={user.id} style={styles.voterItem}>
                      <div style={styles.avatar}></div>
                      <span>{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 내 투표 버튼 영역 */}
              <div style={styles.myVoteAction}>
                <button style={{...styles.voteBtn, backgroundColor: '#4CAF50', color: '#fff'}}>참석</button>
                <button style={{...styles.voteBtn, backgroundColor: '#f44336', color: '#fff'}}>불참</button>
                <button style={{...styles.voteBtn, backgroundColor: '#FFC107', color: '#333'}}>미정</button>
              </div>
            </section>
          </div>
        )}

        {/* ======================= 선발 정보 탭 내용 ======================= */}
        {activeTab === 'lineup' && (
          <div style={styles.tabContent}>
            
            {/* 팀 매칭 결과 */}
            <section style={styles.resultSection}>
              <h3 style={styles.sectionTitle}>⚽ 팀 매칭</h3>
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

            {/* 전술판 */}
            <section style={styles.formationSection}>
              <div style={styles.formationHeader}>
                <h3 style={styles.sectionTitle}>📋 전술판</h3>
                <div style={styles.modeButtons}>
                  <button style={styles.modeBtn}>5:5</button>
                  <button style={styles.modeBtn}>6:6</button>
                </div>
              </div>
              
              <div style={styles.pitch}>
                <div style={styles.pitchLineCenter}></div>
                <div style={styles.pitchCircle}></div>
                <div style={styles.pitchGoalAreaLeft}></div>
                <div style={styles.pitchGoalAreaRight}></div>
                
                {/* 예시 선수 포지션 (정적) */}
                <div style={{...styles.playerToken, top: '45%', left: '10%', backgroundColor: '#f44336'}}>GK</div>
                <div style={{...styles.playerToken, top: '20%', left: '30%', backgroundColor: '#f44336'}}>DF</div>
                <div style={{...styles.playerToken, top: '70%', left: '30%', backgroundColor: '#f44336'}}>DF</div>
                
                <div style={{...styles.playerToken, top: '45%', right: '10%', backgroundColor: '#2196F3'}}>GK</div>
                <div style={{...styles.playerToken, top: '20%', right: '30%', backgroundColor: '#2196F3'}}>DF</div>
                <div style={{...styles.playerToken, top: '70%', right: '30%', backgroundColor: '#2196F3'}}>DF</div>

              </div>
              <p style={styles.sectionSub}>선수 토큰을 드래그하여 전술을 짜보세요 (준비중)</p>
            </section>
          </div>
        )}

      </div>
    </div>
  );
};
메인으로 버튼 스타일
  backBtn: {
    padding: '15px 20px', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    borderBottom: '1px solid #f0f0f0' 
  },
  backText: { fontSize: '0.95rem', fontWeight: 'bold', marginLeft: '8px', color: '#555' },

  // 
const styles = {
  pageWrapper: { backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '30px' },
  container: { maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '50px' },
  
  // 탭 스타일
  tabHeader: { display: 'flex', borderBottom: '1px solid #eee', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10 },
  tabItem: { flex: 1, padding: '15px 0', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', color: '#888', cursor: 'pointer' },
  activeTab: { color: '#333', borderBottom: '3px solid #333' },
  tabContent: { padding: '20px' },

  header: { textAlign: 'center', marginBottom: '20px' },
  timerBox: { 
    display: 'inline-block', padding: '8px 16px', backgroundColor: '#fefefe', 
    borderRadius: '20px', border: '1px solid #eee', fontSize: '0.9rem' 
  },
  timerActive: { color: '#e63946', fontWeight: 'bold' },
  timerClosed: { color: '#888' },

  // 날씨/위치
  infoSection: { display: 'flex', gap: '15px', marginBottom: '25px' },
  weatherCard: { flex: 1, padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '12px', textAlign: 'center' },
  weatherInfo: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px', fontWeight: 'bold', color: '#1976D2' },
  mapCard: { flex: 1, padding: '15px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer' },
  mapPlaceholder: { marginTop: '10px', fontSize: '0.9rem', color: '#2196F3', fontWeight: 'bold' },
  cardTitle: { margin: 0, fontSize: '1rem', color: '#555' },
  cardContent: { margin: '5px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold' },

  // 투표 리스트
  voteListSection: { marginTop: '10px' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '15px' },
  voteGroup: { marginBottom: '20px' },
  voteGroupHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem', fontWeight: 'bold' },
  voterList: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  voterItem: { display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', backgroundColor: '#f9f9f9', borderRadius: '20px', fontSize: '0.85rem' },
  avatar: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ddd' },
  
  myVoteAction: { marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' },
  voteBtn: { flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },

  // 선발 정보 탭 스타일
  resultSection: { marginBottom: '30px' },
  teamGrid: { display: 'flex', alignItems: 'center', gap: '10px' },
  teamCard: { flex: 1, padding: '15px', border: '1px solid #eee', borderRadius: '10px', textAlign: 'center', backgroundColor: '#fff' },
  vsCircle: { fontWeight: 'bold', color: '#888' },
  playerItem: { padding: '5px 0', borderBottom: '1px solid #f9f9f9', fontSize: '0.9rem' },

  formationSection: { marginTop: '20px' },
  formationHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  modeButtons: { display: 'flex', gap: '5px' },
  modeBtn: { padding: '5px 10px', border: '1px solid #ddd', borderRadius: '15px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.8rem' },
  
  pitch: { 
    position: 'relative', height: '300px', backgroundColor: '#4CAF50', 
    borderRadius: '5px', border: '2px solid #fff', overflow: 'hidden' 
  },
  pitchLineCenter: { position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%', backgroundColor: 'rgba(255,255,255,0.7)' },
  pitchCircle: { 
    position: 'absolute', top: '50%', left: '50%', width: '60px', height: '60px', 
    border: '2px solid rgba(255,255,255,0.7)', borderRadius: '50%', transform: 'translate(-50%, -50%)' 
  },
  pitchGoalAreaLeft: { position: 'absolute', top: '30%', left: 0, width: '40px', height: '40%', border: '2px solid rgba(255,255,255,0.7)', borderLeft: 'none' },
  pitchGoalAreaRight: { position: 'absolute', top: '30%', right: 0, width: '40px', height: '40%', border: '2px solid rgba(255,255,255,0.7)', borderRight: 'none' },
  
  playerToken: { 
    position: 'absolute', width: '24px', height: '24px', borderRadius: '50%', 
    color: '#fff', fontSize: '0.7rem', display: 'flex', justifyContent: 'center', alignItems: 'center',
    fontWeight: 'bold', border: '1px solid rgba(0,0,0,0.2)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  sectionSub: { textAlign: 'center', fontSize: '0.85rem', color: '#888', marginTop: '10px' }
};

export default MatchVote;