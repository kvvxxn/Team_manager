import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. 이동을 위한 hook 추가

const events = [
  { id: 1, date: '2026-02-05', type: 'match', title: '친선 경기 vs FC 개발자', time: '20:00' },
  { id: 2, date: '2026-02-10', type: 'finance', title: '2월 정기 회비 마감', time: '23:59' },
  { id: 3, date: '2026-02-18', type: 'match', title: '리그 3라운드', time: '19:00' },
  { id: 4, date: '2026-02-25', type: 'event', title: '팀 회식 (강남역)', time: '21:30' },
];

const Calendar = () => {
  const navigate = useNavigate(); // 2. navigate 함수 선언
  const [activeTab, setActiveTab] = useState('calendar'); // 탭 상태 ('calendar' | 'add')
  
  // 불참 일정 데이터 (초기값)
  const [unavailableDates, setUnavailableDates] = useState([
    { id: 1, date: '2026-02-14', name: '김민수', reason: '가족 여행' },
    { id: 2, date: '2026-02-20', name: '이영희', reason: '야근 예정' },
  ]);

  // 입력 폼 상태
  const [inputDate, setInputDate] = useState('');
  const [inputReason, setInputReason] = useState('');

  const days = Array.from({ length: 28 }, (_, i) => i + 1); 
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 일정 추가 핸들러
  const handleAddUnavailable = () => {
    if (!inputDate || !inputReason) {
      alert('날짜와 사유를 모두 입력해주세요.');
      return;
    }
    const newEntry = {
      id: Date.now(),
      date: inputDate,
      name: '나 (김민수)', // 현재 로그인한 사용자라고 가정
      reason: inputReason
    };
    setUnavailableDates([...unavailableDates, newEntry]);
    setInputDate('');
    setInputReason('');
    alert('불참 일정이 등록되었습니다.');
  };

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

        {/* 탭 네비게이션 */}
        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tabBtn, ...(activeTab === 'calendar' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('calendar')}
          >
            📅 일정
          </button>
          <button 
            style={{...styles.tabBtn, ...(activeTab === 'add' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('add')}
          >
            ➕ 일정 추가
          </button>
        </div>
      </header>

      {/* 1. 캘린더 뷰 */}
      {activeTab === 'calendar' && (
        <>
          <div style={styles.legend}>
            <span style={styles.legendMatch}>● 경기</span>
            <span style={styles.legendFinance}>● 회비</span>
            <span style={styles.legendEvent}>● 기타</span>
            <span style={styles.legendUnavail}>● 불참</span>
          </div>

          <div style={styles.calendarGrid}>
            {weekDays.map(day => (
              <div key={day} style={styles.dayHeader}>{day}</div>
            ))}

            {days.map(day => {
              const dateStr = `2026-02-${String(day).padStart(2, '0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              // 해당 날짜에 불참하는 사람들도 표시
              const dayUnavailable = unavailableDates.filter(u => u.date === dateStr);

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
                    {/* 불참자 표시 (작게) */}
                    {dayUnavailable.map(u => (
                      <div key={u.id} style={styles.unavailableItem}>
                        🚫 {u.name} ({u.reason})
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 2. 일정 추가(불참 등록) 뷰 */}
      {activeTab === 'add' && (
        <div style={styles.addSection}>
          <h3 style={styles.sectionTitle}>📅 불참 일정 등록</h3>
          <p style={styles.sectionDesc}>개인 사정으로 참여가 어려운 날짜를 미리 등록해주세요.</p>
          
          <div style={styles.formCard}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>날짜 선택</label>
              <input 
                type="date" 
                style={styles.input} 
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>불참 사유</label>
              <input 
                type="text" 
                placeholder="예: 야근, 가족 행사 등" 
                style={styles.input} 
                value={inputReason}
                onChange={(e) => setInputReason(e.target.value)}
              />
            </div>
            <button style={styles.submitBtn} onClick={handleAddUnavailable}>등록하기</button>
          </div>

          <h3 style={{...styles.sectionTitle, marginTop: '40px'}}>📋 등록된 불참 현황</h3>
          <div style={styles.listContainer}>
            {unavailableDates.length === 0 ? (
              <p style={{color: '#999'}}>등록된 일정이 없습니다.</p>
            ) : (
              unavailableDates.map(item => (
                <div key={item.id} style={styles.listItem}>
                  <div style={styles.listDate}>{item.date}</div>
                  <div style={styles.listContent}>
                    <span style={styles.listName}>{item.name}</span>
                    <span style={styles.listReason}>{item.reason}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
  legendUnavail: { color: '#d32f2f', fontWeight: 'bold' },

  // 탭 스타일
  tabContainer: { display: 'flex', gap: '10px' },
  tabBtn: {
    padding: '10px 20px', borderRadius: '20px', border: '1px solid #ddd',
    backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#888',
    transition: 'all 0.2s'
  },
  activeTab: { backgroundColor: '#333', color: '#fff', borderColor: '#333' },
  
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
  },
  unavailableItem: {
    fontSize: '0.75rem', padding: '4px 8px', borderRadius: '6px',
    backgroundColor: '#ffebee', color: '#c62828', fontWeight: 'bold', border: '1px solid #ffcdd2'
  },

  // 일정 추가(Add) 섹션 스타일
  addSection: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', maxWidth: '600px', margin: '0 auto'
  },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 10px 0' },
  sectionDesc: { color: '#666', marginBottom: '30px' },
  formCard: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: 'bold', color: '#333' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' },
  submitBtn: {
    marginTop: '10px', padding: '15px', borderRadius: '12px', border: 'none',
    backgroundColor: '#333', color: '#fff', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'
  },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: {
    padding: '15px', border: '1px solid #eee', borderRadius: '12px',
    display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fafafa'
  },
  listDate: { fontWeight: 'bold', color: '#333', minWidth: '100px' },
  listContent: { display: 'flex', flexDirection: 'column', gap: '2px' },
  listName: { fontWeight: 'bold', fontSize: '0.95rem' },
  listReason: { color: '#666', fontSize: '0.85rem' }
};

export default Calendar;