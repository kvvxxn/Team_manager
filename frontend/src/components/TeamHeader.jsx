import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TeamHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: '기록 보기', path: '/team/stats', color: '#4CAF50' },
    { name: '회비 납부', path: '/team/finance', color: '#FF9800' },
    { name: '관리', path: '/team/admin', color: '#9C27B0' },
  ];

  return (
    <nav style={styles.navBar}>
      {/* 홈 버튼 영역 - 왼쪽 고정 */}
      <div onClick={() => navigate('/main')} style={styles.homeBtn}>
        🏠 <span style={styles.homeText}>메인으로</span>
      </div>

      {/* 메뉴 리스트 영역 - 중앙 정렬 및 간격 확대 */}
      <div style={styles.menuContainer}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.navItem,
                color: isActive ? item.color : '#666',
                borderBottom: isActive ? `4px solid ${item.color}` : '4px solid transparent',
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
      
      {/* 우측 균형을 위한 빈 공간 (선택 사항) */}
      <div style={{ width: '120px' }}></div>
    </nav>
  );
};

const styles = {
  navBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // 홈 버튼과 메뉴 사이의 공간 확보
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '0 40px', // 전체 바의 좌우 여백 확대
    height: '70px',    // 바 높이를 조금 더 높여서 시원하게 설정
  },
  homeBtn: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    transition: '0.2s',
  },
  homeText: { fontSize: '0.95rem', fontWeight: 'bold', marginLeft: '8px', color: '#333' },
  
  menuContainer: {
    display: 'flex',
    gap: '60px', // 💡 핵심: 메뉴 사이의 간격을 대폭 늘림 (기존 대비 2~3배)
    height: '100%',
    alignItems: 'center',
  },
  
  navItem: {
    padding: '22px 10px', // 상하 패딩으로 높이감 조절
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '1.1rem',   // 폰트 크기 살짝 확대
    fontWeight: '700',
    transition: 'all 0.2s ease',
    letterSpacing: '1px', // 글자 자간을 벌려 가독성 향상
  },
};

export default TeamHeader;