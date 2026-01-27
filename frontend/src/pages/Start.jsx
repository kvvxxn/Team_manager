import React from 'react';
import { useNavigate } from 'react-router-dom';

const Start = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* 배경 오버레이 - 풋살장 느낌의 다크 그린 그라데이션 */}
      <div style={styles.overlay}>
        <div style={styles.content}>
          <h1 style={styles.title}>TEAM MANAGER</h1>
          <p style={styles.subtitle}>
            더 효율적인 팀 관리, 더 완벽한 경기 기록.<br />
            우리 팀의 모든 데이터를 한눈에 확인하세요.
          </p>
          
          <div style={styles.buttonContainer}>
            <button 
              style={styles.mainButton} 
              onClick={() => navigate('/login')}
            >
              팀 관리 시작하기
            </button>
            <button style={styles.subButton}>서비스 둘러보기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    background: 'url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000") center/cover no-repeat',
  },
  overlay: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 배경 이미지 어둡게 처리
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  content: { color: '#fff', padding: '20px' },
  title: { fontSize: '4rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' },
  subtitle: { fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '40px', opacity: '0.9' },
  buttonContainer: { display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' },
  mainButton: {
    padding: '15px 60px', fontSize: '1.1rem', fontWeight: 'bold',
    backgroundColor: '#00ff88', color: '#000', border: 'none', borderRadius: '30px',
    cursor: 'pointer', transition: '0.3s'
  },
  subButton: {
    padding: '10px 40px', fontSize: '1rem', color: '#fff',
    backgroundColor: 'transparent', border: '1px solid #fff', borderRadius: '30px',
    cursor: 'pointer'
  }
};

export default Start;