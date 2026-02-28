import React from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrapper}>
      {/* 1. 다른 페이지와 통일된 상단 헤더 */}
      <header style={styles.header}>
        <div onClick={() => navigate('/main')} style={styles.backBtn}>
          🏠 <span>메인으로</span>
        </div>
        <h2 style={styles.title}>설정</h2>
      </header>

      <div style={styles.contentContainer}>
        {/* 내 프로필 섹션 */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>내 프로필</h3>
          <div style={styles.infoRow}>
            <span style={styles.label}>이름</span>
            <span style={styles.value}>김민수</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>포지션</span>
            <span style={styles.value}>PIVO (FW)</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>소속팀</span>
            <span style={styles.value}>FC 개발자</span>
          </div>
          <button style={styles.editBtn}>프로필 수정</button>
        </section>

        {/* 앱 설정 섹션 */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>앱 설정</h3>
          <div style={styles.settingRow}>
            <span>알림 설정</span>
            <span style={styles.statusOn}>ON</span>
          </div>
          <div style={styles.settingRow}>
            <span>다크 모드</span>
            <span style={styles.statusOff}>OFF</span>
          </div>
        </section>

        {/* 로그아웃 버튼 */}
        <button 
          style={styles.logoutBtn} 
          onClick={() => {
            if(window.confirm('로그아웃 하시겠습니까?')) navigate('/');
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '40px' },
  // 💡 매칭/캘린더 페이지와 동일한 헤더 스타일
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  backBtn: { 
    cursor: 'pointer', padding: '10px 18px', backgroundColor: '#fff', 
    borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
    display: 'flex', gap: '8px', fontWeight: 'bold', alignItems: 'center' 
  },
  title: { fontSize: '2rem', fontWeight: '800', margin: 0 },

  contentContainer: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' },
  
  section: { 
    backgroundColor: '#fff', padding: '30px', borderRadius: '20px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
  },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
  
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
  label: { color: '#888', fontSize: '0.95rem' },
  value: { fontWeight: '600', color: '#333' },
  
  editBtn: { 
    marginTop: '20px', width: '100%', padding: '12px', backgroundColor: '#f5f5f5', 
    border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' 
  },

  settingRow: { 
    display: 'flex', justifyContent: 'space-between', padding: '15px 0', 
    borderBottom: '1px solid #f5f5f5', alignItems: 'center' 
  },
  statusOn: { color: '#1a73e8', fontWeight: 'bold' },
  statusOff: { color: '#999', fontWeight: 'bold' },

  logoutBtn: { 
    padding: '18px', backgroundColor: '#ff5252', color: '#fff', 
    border: 'none', borderRadius: '15px', fontSize: '1.1rem', 
    fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(255,82,82,0.2)' 
  }
};

export default Settings;