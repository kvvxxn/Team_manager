import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 실제 환경에서는 API에서 받아올 데이터 (예비 데이터)
const initialEvents = [
  { id: 1, date: '2026-02-05', type: 'match', title: '친선 경기 vs FC 개발자', time: '20:00' },
  { id: 2, date: '2026-02-10', type: 'finance', title: '2월 정기 회비 마감', time: '23:59' },
  { id: 3, date: '2026-02-18', type: 'match', title: '리그 3라운드', time: '19:00' },
  { id: 4, date: '2026-02-25', type: 'event', title: '팀 회식 (강남역)', time: '21:30' },
  { id: 5, date: '2026-03-01', type: 'match', title: '삼일절 친선 매치', time: '14:00' },
];

const Calendar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'add'
  
  // 1. 현재 보고 있는 연도와 월 상태 관리 (초기값: 2026년 2월)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); // Month is 0-indexed (1 = Feb)
  
  // 2. 전체 이벤트 및 불참 일정 데이터 상태 관리
  const [events, setEvents] = useState(initialEvents);
  const [unavailableDates, setUnavailableDates] = useState([
    { id: 1, date: '2026-02-14', name: '김민수', reason: '가족 여행' },
    { id: 2, date: '2026-02-20', name: '이영희', reason: '야근 예정' },
  ]);

  // 입력 폼 상태
  const [inputDate, setInputDate] = useState('');
  const [inputReason, setInputReason] = useState('');

  // 3. 현재 월의 달력 생성 로직
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 ~ 11

  // 해당 월의 첫 날과 마지막 날 계산
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  
  // 첫 날의 요일 (0: 일요일, 1: 월요일 ... )
  const startDayOfWeek = firstDayOfMonth.getDay();

  // 달력에 표시할 날짜 배열 생성 (빈 칸 포함)
  const calendarDays = [];
  // 앞쪽 빈 날짜 채우기
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // 실제 날짜 채우기
  for (let i = 1; i <= lastDateOfMonth; i++) {
    calendarDays.push(i);
  }

  // 월 이동 핸들러
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 일정 추가 핸들러
  const handleAddUnavailable = () => {
    if (!inputDate || !inputReason) {
      alert('날짜와 사유를 모두 입력해주세요.');
      return;
    }
    
    // API 연동 시 여기서 POST 요청 발송
    const newEntry = {
      id: Date.now(),
      date: inputDate,
      name: '나 (김민수)', 
      reason: inputReason
    };
    
    setUnavailableDates([...unavailableDates, newEntry]);
    setInputDate('');
    setInputReason('');
    alert('불참 일정이 등록되었습니다.');
  };

  // 날짜 형식 변환 (YYYY-MM-DD)
  const getFormattedDate = (day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // 실제 API 연동을 위한 useEffect 예시
  useEffect(() => {
    // console.log(`${year}년 ${month + 1}월 데이터 로딩중...`);
    // fetch(`/api/events?year=${year}&month=${month + 1}`).then(...)
  }, [year, month]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div style={styles.container}>
      {/* 상단 헤더 영역 */}
      <header style={styles.header}>
        <div style={styles.titleSection}>
          <div onClick={() => navigate('/main')} style={styles.backBtn}>
            🏠 <span style={styles.backText}>메인으로</span>
          </div>
          <div style={styles.monthNav}>
            <button onClick={handlePrevMonth} style={styles.navBtn}>◀</button>
            <h2 style={styles.title}>{year}년 {month + 1}월 일정</h2>
            <button onClick={handleNextMonth} style={styles.navBtn}>▶</button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div style={styles.tabContainer}>
          <button 
            style={{...styles.tabBtn, ...(activeTab === 'calendar' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('calendar')}
          >
            📅 달력
          </button>
          <button 
            style={{...styles.tabBtn, ...(activeTab === 'add' ? styles.activeTab : {})}} 
            onClick={() => setActiveTab('add')}
          >
            ➕ 불참 등록
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

            {calendarDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} style={styles.emptyCell}></div>;

              const dateStr = getFormattedDate(day);
              // 날짜별 이벤트 필터링
              const dayEvents = events.filter(e => e.date === dateStr);
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
        <div style={styles.addWrapper}>
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
          </div>

          <div style={styles.listSection}>
            <h3 style={styles.sectionTitle}>📋 내 불참 현황</h3>
            <div style={styles.listContainer}>
              {unavailableDates.length === 0 ? (
                <p style={{color: '#999'}}>등록된 일정이 없습니다.</p>
              ) : (
                unavailableDates.sort((a,b) => new Date(a.date) - new Date(b.date)).map(item => (
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
  
  monthNav: { display: 'flex', alignItems: 'center', gap: '15px' },
  navBtn: { padding: '5px 10px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#fff', border: 'none', borderRadius: '50%' },
  
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
    padding: '10px', 
    borderRadius: '16px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
    display: 'flex', 
    flexDirection: 'column' 
  },
  emptyCell: { backgroundColor: 'transparent' }, 

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
  addWrapper: { display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' },
  
  addSection: {
    backgroundColor: '#fff', padding: '30px', borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', width: '100%', maxWidth: '500px'
  },
  listSection: {
    backgroundColor: '#f5f5f5', padding: '30px', borderRadius: '20px',
    width: '100%', maxWidth: '500px'
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
    display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff'
  },
  listDate: { fontWeight: 'bold', color: '#333', minWidth: '100px' },
  listContent: { display: 'flex', flexDirection: 'column', gap: '2px' },
  listName: { fontWeight: 'bold', fontSize: '0.95rem' },
  listReason: { color: '#666', fontSize: '0.85rem' }
};

export default Calendar;