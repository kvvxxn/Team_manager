import React from 'react';
import TeamHeader from '../../components/TeamHeader';

const players = [
  { id: 1, name: '권도현', position: 'PIVO (FW)', games: 12, goals: 8, assists: 4, role: '관리자', rank: '월드클래스' },
  { id: 2, name: '이재희', position: 'ALA (MF)', games: 10, goals: 3, assists: 7, role: '회원', rank: '프로' },
  { id: 3, name: '김연준', position: 'FIXO (DF)', games: 15, goals: 1, assists: 2, role: '회원', rank: '아마추어' },
  { id: 4, name: '문민석', position: 'GOLEIRO (GK)', games: 14, goals: 0, assists: 1, role: '회원', rank: '세미프로' },
];

const PlayerStats = () => {
  // 랭크별 스타일을 결정하는 함수
  const getRankStyle = (rank) => {
    switch (rank) {
      case '아마추어':
        return { color: '#8B4513', fontWeight: '800' }; // 갈색(동색)
      case '세미프로':
        return { color: '#A9A9A9', fontWeight: '800' }; // 은색
      case '프로':
        return { color: '#D4AF37', fontWeight: '800', textShadow: '0.5px 0.5px 1px rgba(0,0,0,0.2)' }; // 금색
      case '월드클래스':
        return {
          fontWeight: '900',
          background: 'linear-gradient(45deg, #A020F0, #FF00FF, #A020F0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shine 2s linear infinite', // 반짝이는 효과를 위한 애니메이션
          display: 'inline-block'
        };
      default:
        return { color: '#333' };
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* 반짝이는 애니메이션을 위한 style 태그 (월드클래스 전용) */}
      <style>
        {`
          @keyframes shine {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}
      </style>
      
      <TeamHeader />

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logoBox}>
            <div style={styles.teamLogo}>⚽</div>
            <h2 style={styles.teamName}>우리 풋살 FC</h2>
          </div>
          <div style={styles.pageTitle}>선수 명부 & 기록</div>
        </header>

        <section style={styles.tableSection}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th>이름</th>
                <th>희망 포지션</th>
                <th>출장 경기</th>
                <th>득점</th>
                <th>도움</th>
                <th>등급</th>
                <th>랭크</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} style={styles.tdRow}>
                  <td style={styles.nameCell}>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.games}</td>
                  <td style={styles.goalCell}>{player.goals}</td>
                  <td>{player.assists}</td>
                  <td>
                    <span style={player.role === '관리자' ? styles.roleAdmin : styles.roleMember}>
                      {player.role}
                    </span>
                  </td>
                  <td>
                    {/* 함수를 통해 각 랭크에 맞는 스타일 적용 */}
                    <span style={getRankStyle(player.rank)}>{player.rank}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

// 기존 스타일 유지
const styles = {
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh' },
  container: { padding: '20px 40px' },
  header: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: '30px', backgroundColor: '#fff', padding: '20px',
    borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  logoBox: { display: 'flex', alignItems: 'center', gap: '15px' },
  teamLogo: { 
    width: '50px', height: '50px', backgroundColor: '#333', borderRadius: '50%', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', color: '#fff'
  },
  teamName: { fontSize: '1.4rem', fontWeight: 'bold', margin: 0 },
  pageTitle: { fontSize: '1rem', color: '#888', fontWeight: '500' },
  tableSection: { 
    backgroundColor: '#fff', borderRadius: '12px', padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowX: 'auto' 
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center' },
  thRow: { borderBottom: '2px solid #eee', height: '50px', color: '#666' },
  tdRow: { borderBottom: '1px solid #f5f5f5', height: '60px' },
  nameCell: { fontWeight: 'bold', color: '#333' },
  goalCell: { color: '#e63946', fontWeight: 'bold' },
  roleAdmin: { 
    padding: '4px 12px', backgroundColor: '#f3e5f5', color: '#9c27b0', 
    borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' 
  },
  roleMember: { 
    padding: '4px 12px', backgroundColor: '#f5f5f5', color: '#666', 
    borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' 
  }
};

export default PlayerStats;