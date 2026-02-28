import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. 이동을 위한 hook 추가

const events = [
  { id: 1, date: '2026-02-05', type: 'match', title: '친선 경기 vs FC 개발자', time: '20:00' },
  { id: 2, date: '2026-02-10', type: 'finance', title: '2월 정기 회비 마감', time: '23:59' },
  { id: 3, date: '2026-02-18', type: 'match', title: '리그 3라운드', time: '19:00' },
  { id: 4, date: '2026-02-25', type: 'event', title: '팀 회식 (강남역)', time: '21:30' },
];

const Calendar = () => {
  const navigate = useNavigate(); // 2. navigate 함수 선언
  const days = Array.from({ length: 28 }, (_, i) => i + 1); 
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div style={styles.container}>
      {/* 상단 헤더 영역 수정 */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <div onClick={() => navigate('/main')} style={styles.backBtn}>
            🏠 <span style={styles.backText}>메인으로</span>
          </div>
          <h2 style={styles.title}>2026년 2월 일정</h2>
        </div>

        <div style={styles.legend}>
          <span style={styles.legendMatch}>● 경기</span>
          <span style={styles.legendFinance}>● 회비</span>
          <span style={styles.legendEvent}>● 기타</span>
        </div>
      </header>

      <div style={styles.calendarGrid}>
        {weekDays.map(day => (
          <div key={day} style={styles.dayHeader}>{day}</div>
        ))}

        {days.map(day => {
          const dateStr = `2026-02-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter(e => e.date === dateStr);

          return (
            <div key={day} style={styles.dayCell}>
              <span style={styles.dayNumber}>{day}</span>
              <div style={styles.eventContainer}>
                {dayEvents.map(event => (
                  <div 
                    key={event.id} 
                    style={{
                      ...styles.eventItem,
                      backgroundColor: 
                        event.type === 'match' ? '#e8f5e9' : 
                        event.type === 'finance' ? '#fff3e0' : '#e3f2fd',
                      color: 
                        event.type === 'match' ? '#2e7d32' : 
                        event.type === 'finance' ? '#ef6c00' : '#1565c0'
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', backgroundColor: '#f9f9f9', minHeight: '100vh' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    marginBottom: '30px',
    padding: '0 10px'
  },
  titleSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
  // 💡 메인으로 복귀 버튼 스타일
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: 'fit-content',
    padding: '8px 16px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    transition: '0.2s'
  },
  backText: { fontSize: '0.9rem', fontWeight: 'bold', marginLeft: '6px', color: '#555' },
  title: { fontSize: '2.2rem', fontWeight: '800', margin: 0, color: '#333' },
  
  legend: { display: 'flex', gap: '20px', fontSize: '1rem', paddingBottom: '10px' },
  legendMatch: { color: '#2e7d32', fontWeight: 'bold' },
  legendFinance: { color: '#ef6c00', fontWeight: 'bold' },
  legendEvent: { color: '#1565c0', fontWeight: 'bold' },
  
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '12px', // 그리드 간격을 넓혀서 더 시원하게
    backgroundColor: 'transparent',
  },
  dayHeader: { 
    padding: '15px', 
    textAlign: 'center', 
    fontWeight: '800', 
    color: '#999',
    fontSize: '1rem' 
  },
  dayCell: { 
    backgroundColor: '#fff', 
    minHeight: '140px', 
    padding: '15px', 
    borderRadius: '16px', // 셀을 둥글게 만들어 부드러운 느낌
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    display: 'flex', 
    flexDirection: 'column' 
  },
  dayNumber: { fontSize: '1.1rem', marginBottom: '10px', fontWeight: 'bold', color: '#444' },
  eventContainer: { display: 'flex', flexDirection: 'column', gap: '6px' },
  eventItem: {
    fontSize: '0.8rem', 
    padding: '6px 10px', 
    borderRadius: '8px',
    fontWeight: '600',
    whiteSpace: 'nowrap', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis'
  }
};

export default Calendar;