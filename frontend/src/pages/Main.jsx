import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  
  // 유저 정보 확인
  const handleMyTeamClick = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.team) {
            navigate('/team/stats');
        } else {
            navigate('/team/setup');
        }
    } else {
        navigate('/login');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>FOOTBALL TEAM MANAGER</h1>
      </header>

      <main style={styles.gridContainer}>
        {/* 상단 2개 (긴 카드) */}
        <div style={{ ...styles.card, backgroundColor: '#e8f5e9' }} onClick={() => navigate('/calendar')}>
          <span style={styles.icon}>📅</span>
          <h2>캘린더</h2>
          <p>경기 일정 및 주요 행사</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#e3f2fd' }} onClick={handleMyTeamClick}>
          <span style={styles.icon}>👥</span>
          <h2>나의 팀</h2>
          <p>선수 명단 및 기록 확인</p>
        </div>

        {/* 하단 2개 (짧은 카드) */}
        {/* 기존 매칭 카드를 '경기 투표 및 팀 셋업'으로 변경 */}
        <div style={{ ...styles.card, backgroundColor: '#fff3e0' }} onClick={() => navigate('/team/match-vote')}>
          <span style={styles.icon}>🗳️</span>
          <h2>경기 투표 및 팀 셋업</h2>
          <p>투표 확인 및 AI 팀 밸런스</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: '#f3e5f5' }} onClick={() => navigate('/settings')}>
          <span style={styles.icon}>🛠️</span>
          <h2>설정</h2>
          <p>계정 및 앱 환경 설정</p>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' },
  header: { height: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '1px' },
  gridContainer: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1.5fr 1fr',
    gap: '20px',
    padding: '20px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  icon: { fontSize: '2.5rem', marginBottom: '10px' },
};

export default Main;