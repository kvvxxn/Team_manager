import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamHeader from '../../components/TeamHeader';

const PlayerStats = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
     const storedUser = localStorage.getItem('user');
     if (storedUser) {
         const parsedUser = JSON.parse(storedUser);
         setUser(parsedUser);
         if (parsedUser.team) {
             setCurrentTeam(parsedUser.team);
             fetchTeamMembers(parsedUser.team.id);
         } else {
             // 팀이 없으면 팀 설정 페이지로 리다이렉트
             navigate('/team/setup');
         }
     } else {
         navigate('/login');
     }
  }, [navigate]);

  const fetchTeamMembers = async (teamId) => {
      try {
          const response = await fetch(`http://localhost:8000/api/players?team_id=${teamId}`);
          if (response.ok) {
              const data = await response.json();
              setPlayers(data);
          }
      } catch (error) {
          console.error("Failed to fetch players", error);
      }
  };
  
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
            {currentTeam && currentTeam.emblem ? (
                <img src={`http://localhost:8000/${currentTeam.emblem}`} alt="Team Logo" style={styles.teamLogoImg} />
            ) : (
                <div style={styles.teamLogo}>⚽</div>
            )}
            <h2 style={styles.teamName}>{currentTeam ? currentTeam.name : '팀 정보를 불러오는 중...'}</h2>
          </div>
          <div style={styles.pageTitle}>선수 명부 & 기록</div>
          
          <button 
            style={styles.addRecordBtn} 
            onClick={() => setShowAddModal(true)}
          >
            📋 기록 추가 요청
          </button>
        </header>

        {showAddModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3 style={styles.modalTitle}>📝 경기 기록 등록 요청</h3>
              <p style={styles.modalDesc}>본인의 경기 기록을 입력해주세요. 관리자 승인 후 반영됩니다.</p>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>경기 날짜</label>
                <input type="date" style={styles.input} />
              </div>
              
              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>득점 (Goal)</label>
                  <input type="number" min="0" placeholder="0" style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>도움 (Assist)</label>
                  <input type="number" min="0" placeholder="0" style={styles.input} />
                </div>
              </div>

               <div style={styles.inputGroup}>
                <label style={styles.label}>포지션</label>
                <select style={styles.input}>
                  <option>PIVO (FW)</option>
                  <option>ALA (MF)</option>
                  <option>FIXO (DF)</option>
                  <option>GOLEIRO (GK)</option>
                </select>
              </div>

              <div style={styles.modalActions}>
                <button style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>취소</button>
                <button style={styles.submitBtn} onClick={() => {
                  alert('기록 등록이 요청되었습니다. 관리자 승인을 기다려주세요.');
                  setShowAddModal(false);
                }}>
                  등록 요청
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 기록 테이블 */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>이름</th>
                <th style={styles.th}>포지션 (축구/풋살)</th>
                <th style={styles.th}>출장 경기</th>
                <th style={styles.th}>득점</th>
                <th style={styles.th}>도움</th>
                <th style={styles.th}>등급</th>
                <th style={styles.th}>랭크</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} style={styles.tr}>
                  <td style={styles.td}>
                    {player.name}
                  </td>
                  <td style={styles.td}>{player.position_football} / {player.position_futsal}</td>
                  <td style={styles.td}>{player.matches_played || 0}</td>
                  <td style={styles.td}>{player.goals || 0}</td>
                  <td style={styles.td}>{player.assists || 0}</td>
                  <td style={styles.td}>
                    <span style={player.role === 'ADMIN' ? styles.roleAdmin : styles.roleMember}>
                      {player.role || 'MEMBER'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={getRankStyle(player.rank_tier)}>{player.rank_tier || 'AMATEUR'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// 기존 스타일 유지 및 업데이트
const styles = {
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '40px' },
  container: { padding: '20px 40px', maxWidth: '1200px', margin: '0 auto' },
  header: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: '30px', backgroundColor: '#fff', padding: '20px 30px',
    borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  },
  logoBox: { display: 'flex', alignItems: 'center', gap: '15px' },
  teamLogo: { 
    width: '60px', height: '60px', backgroundColor: '#333', borderRadius: '50%', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', color: '#fff'
  },
  teamLogoImg: { 
    width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  teamName: { fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#333' },
  pageTitle: { fontSize: '1rem', color: '#888', fontWeight: 'bold' },
  
  tableWrapper: {
    backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center' },
  thRow: { backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' },
  th: { padding: '15px', fontSize: '0.9rem', color: '#555', fontWeight: 'bold' },
  tr: { borderBottom: '1px solid #f1f1f1', transition: 'background-color 0.2s' },
  td: { padding: '15px', fontSize: '0.95rem', color: '#333' },
  
  // ROLE STYLES
  roleAdmin: { 
    backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 10px', 
    borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' 
  },
  roleMember: { 
    backgroundColor: '#f5f5f5', color: '#666', padding: '4px 10px', 
    borderRadius: '12px', fontSize: '0.8rem' 
  },

  // ... (기존 모달 스타일들)
  addRecordBtn: {
    padding: '10px 20px', backgroundColor: '#333', color: '#fff', 
    border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '0.9rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', transition: '0.2s',
    display: 'flex', alignItems: 'center', gap: '5px'
  },

  // 모달 스타일
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
  },
  modalTitle: { fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' },
  modalDesc: { fontSize: '0.9rem', color: '#666', marginBottom: '20px' },
  
  inputRow: { display: 'flex', gap: '15px', width: '100%' }, // width 100% 추가
  inputGroup: { 
    display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px', 
    flex: 1, minWidth: 0 // Flex 아이템 넘침 방지
  },
  label: { fontSize: '0.9rem', fontWeight: 'bold', color: '#444' },
  input: { 
    padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem',
    width: '100%', boxSizing: 'border-box' // box-sizing 추가하여 패딩 포함 계산
  },
  
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
  cancelBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#f5f5f5', cursor: 'pointer', fontWeight: 'bold', color: '#666' },
  submitBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#333', cursor: 'pointer', fontWeight: 'bold', color: '#fff' },
  
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