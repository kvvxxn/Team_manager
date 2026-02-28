import React, { useState } from 'react';
import TeamHeader from '../../components/TeamHeader';

// 📌 월별 데이터 (Mock Data)
const financeData = {
  '2026-01': {
    members: [
      { id: 1, name: '김민수', isPaid: true, amount: 20000 },
      { id: 2, name: '이영희', isPaid: true, amount: 20000 },
      { id: 3, name: '박철수', isPaid: false, amount: 20000 },
      { id: 4, name: '최지우', isPaid: true, amount: 20000 },
      { id: 5, name: '정대만', isPaid: false, amount: 20000 },
    ],
    expenses: [
      { id: 1, date: '2026-01-20', item: '경기장 대관료', amount: 80000 },
      { id: 2, date: '2026-01-22', item: '음료수 구매', amount: 15000 },
    ]
  },
  '2026-02': {
    members: [
      { id: 1, name: '김민수', isPaid: true, amount: 20000 },
      { id: 2, name: '이영희', isPaid: false, amount: 20000 }, // 미납
      { id: 3, name: '박철수', isPaid: true, amount: 20000 },
      { id: 4, name: '최지우', isPaid: true, amount: 20000 },
      { id: 5, name: '정대만', isPaid: true, amount: 20000 }, // 납부
    ],
    expenses: [
      { id: 3, date: '2026-02-10', item: '축구공 구입 (3개)', amount: 90000 },
    ]
  },
  // 데이터가 없는 달은 빈 배열 처리
};

// 📌 전체 멤버 리스트 (회비 미납시 자동 생성용)
const allMembers = [
  { id: 1, name: '김민수' },
  { id: 2, name: '이영희' },
  { id: 3, name: '박철수' },
  { id: 4, name: '최지우' },
  { id: 5, name: '정대만' },
];

const Finance = () => {
  // 1. 현재 보고 있는 연도와 월 상태 (초기값: 2026년 2월)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1)); 
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'ai'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1 ~ 12
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;

  // 2. 현재 월 데이터 가져오기 
  // 데이터가 없으면(미래의 달 등) 모든 멤버를 '미납' 상태로 생성하여 표시
  let currentData = financeData[monthKey];
  
  if (!currentData) {
    currentData = {
      members: allMembers.map(member => ({
        ...member,
        isPaid: false,
        amount: 20000 // 기본 회비
      })),
      expenses: []
    };
  }
  
  const { members, expenses } = currentData;

  // 3. 계산 로직
  const totalIncome = members
    .filter(member => member.isPaid)
    .reduce((sum, member) => sum + member.amount, 0);

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  // 4. 월 이동 핸들러
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

  // 5. AI 독촉 메시지 생성 로직
  const unpaidMembers = members.filter(m => !m.isPaid);
  const unpaidNames = unpaidMembers.map(m => m.name).join(', ');

  const [aiMessage, setAiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateMessage = async () => {
    if (unpaidMembers.length === 0) {
      setAiMessage('모든 회원이 회비를 납부했습니다! 🎉');
      return;
    }

    setIsLoading(true);
    
    // TODO: 실제 LLM API 연동 시 이곳에서 호출
    // simulate network delay
    setTimeout(() => {
      const message = `[우리팀 회비 알림 📢]\n\n${year}년 ${month}월 회비 미납 안내드립니다.\n\n대상자: ${unpaidNames}\n\n원활한 팀 운영을 위해 빠른 납부 부탁드립니다!\n감사합니다.`;
      setAiMessage(message);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiMessage);
    alert('독촉 메시지가 복사되었습니다!');
  };

  return (
    <div style={styles.pageWrapper}>
      <TeamHeader />
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.pageTitle}>💰 회비 관리</h2>
          
          {/* 월별 슬라이딩 네비게이션 */}
          <div style={styles.monthNav}>
            <button onClick={handlePrevMonth} style={styles.navBtn}>◀</button>
            <span style={styles.currentMonth}>{year}년 {month}월</span>
            <button onClick={handleNextMonth} style={styles.navBtn}>▶</button>
          </div>

          {/* 탭 네비게이션 */}
          <div style={styles.tabContainer}>
            <button 
              style={activeTab === 'dashboard' ? styles.activeTab : styles.tabBtn} 
              onClick={() => setActiveTab('dashboard')}
            >
              📊 회비 현황
            </button>
            <button 
              style={activeTab === 'ai' ? styles.activeTab : styles.tabBtn} 
              onClick={() => setActiveTab('ai')}
            >
              🤖 AI 독촉 매니저
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <>
            <section style={styles.balanceSection}>
              <div style={styles.balanceCard}>
                <span style={styles.cardLabel}>총 수입</span>
                <span style={styles.incomeAmount}>+{totalIncome.toLocaleString()}원</span>
              </div>
              <div style={styles.balanceCard}>
                <span style={styles.cardLabel}>총 지출</span>
                <span style={styles.expenseAmount}>-{totalExpense.toLocaleString()}원</span>
              </div>
              <div style={styles.balanceCard}>
                <span style={styles.cardLabel}>현재 잔액</span>
                <span style={styles.balanceAmount}>{currentBalance.toLocaleString()}원</span>
              </div>
            </section>

            <section style={styles.memberStatusSection}>
              <h3 style={styles.sectionTitle}>📋 회원별 납부 현황</h3>
              {members.length === 0 ? (
                <div style={styles.emptyState}>데이터가 없습니다.</div>
              ) : (
                <ul style={styles.memberList}>
                  {members.map(member => (
                    <li key={member.id} style={styles.memberItem}>
                      <span style={styles.memberName}>{member.name}</span>
                      <span style={member.isPaid ? styles.paidStatus : styles.unpaidStatus}>
                        {member.isPaid ? '납부 완료' : '미납'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section style={styles.expenseListSection}>
              <h3 style={styles.sectionTitle}>💸 지출 내역</h3>
              {expenses.length === 0 ? (
                <div style={styles.emptyState}>지출 내역이 없습니다.</div>
              ) : (
                <table style={styles.expenseTable}>
                  <thead>
                    <tr>
                      <th style={styles.th}>날짜</th>
                      <th style={styles.th}>항목</th>
                      <th style={styles.th}>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp.id} style={styles.tr}>
                        <td style={styles.td}>{exp.date}</td>
                        <td style={styles.td}>{exp.item}</td>
                        <td style={{...styles.td, ...styles.expenseItemAmount}}>-{exp.amount.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </>
        ) : (
          /* AI 독촉 매니저 탭 */
          <div style={styles.aiContainer}>
            <div style={styles.aiCard}>
              <h3 style={styles.aiTitle}>🤖 AI 회비 독촉 매니저</h3>
              <p style={styles.aiDesc}>
                미납 중인 회원들에게 보낼 정중하지만 단호한(?) 메시지를 생성합니다.
              </p>
              
              <div style={styles.unpaidBox}>
                <h4 style={styles.unpaidTitle}>🚨 {month}월 미납 대상자 ({unpaidMembers.length}명)</h4>
                {unpaidMembers.length > 0 ? (
                  <div style={styles.unpaidList}>
                    {unpaidMembers.map(m => (
                      <span key={m.id} style={styles.unpaidTag}>{m.name}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{color: '#4CAF50', fontWeight: 'bold'}}>모두 납부 완료! 👏</p>
                )}
              </div>

              <div style={styles.messageBox}>
                {!aiMessage && !isLoading ? (
                  <button onClick={handleGenerateMessage} style={styles.aiButton}>
                    🤖 AI에게 정중한 독촉 메시지 요청하기
                  </button>
                ) : isLoading ? (
                  <div style={styles.loadingBox}>
                    <p>⏳ AI가 미납자 명단을 분석하고 메시지를 작성중입니다...</p>
                  </div>
                ) : (
                  <>
                    <textarea 
                      readOnly 
                      style={styles.messageArea} 
                      value={aiMessage} 
                    />
                    <div style={styles.buttonGroup}>
                      <button onClick={handleGenerateMessage} style={styles.retryBtn}>
                        🔄 다시 생성하기
                      </button>
                      <button onClick={copyToClipboard} style={styles.copyBtn}>
                        📋 메시지 복사하기
                      </button>
                    </div>
                  </>
                )}
              </div>
              <p style={styles.aiFooter}>
                * 이 메시지는 AI가 팀 분위기에 맞춰 작성했습니다 (Mock)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' },
  container: { padding: '30px', backgroundColor: '#fff', maxWidth: '800px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
  header: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
  pageTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' },
  
  monthNav: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  currentMonth: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  navBtn: { 
    fontSize: '1.2rem', cursor: 'pointer', background: 'none', border: '1px solid #ddd', 
    borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: '0.2s'
  },

  // 탭 스타일
  tabContainer: { display: 'flex', justifyContent: 'center', gap: '10px' },
  tabBtn: {
    padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd',
    backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#888',
    transition: 'all 0.2s'
  },
  activeTab: { 
    padding: '8px 16px', borderRadius: '20px', border: '1px solid #333',
    backgroundColor: '#333', cursor: 'pointer', fontWeight: 'bold', color: '#fff' 
  },

  balanceSection: {
    display: 'flex', justifyContent: 'space-around', marginBottom: '40px',
    backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  balanceCard: { textAlign: 'center', flex: 1, padding: '10px' },
  cardLabel: { display: 'block', fontSize: '0.9rem', color: '#777', marginBottom: '8px' },
  incomeAmount: { fontSize: '1.6rem', fontWeight: 'bold', color: '#4CAF50' },
  expenseAmount: { fontSize: '1.6rem', fontWeight: 'bold', color: '#f44336' },
  balanceAmount: { fontSize: '1.6rem', fontWeight: 'bold', color: '#333' },

  sectionTitle: { fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },

  memberStatusSection: { marginBottom: '40px' },
  memberList: { listStyle: 'none', padding: 0 },
  memberItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0', borderBottom: '1px solid #eee'
  },
  memberName: { fontSize: '1.1rem', color: '#333' },
  paidStatus: { fontSize: '0.95rem', fontWeight: 'bold', color: '#4CAF50', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#e8f5e9' },
  unpaidStatus: { fontSize: '0.95rem', fontWeight: 'bold', color: '#f44336', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#ffebee' },

  expenseListSection: {},
  expenseTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px 15px', backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 15px', color: '#555' },
  expenseItemAmount: { color: '#f44336', fontWeight: 'bold' },
  emptyState: { textAlign: 'center', padding: '20px', color: '#999', fontStyle: 'italic' },

  // AI 매니저 스타일
  aiContainer: { display: 'flex', justifyContent: 'center', padding: '20px 0' },
  aiCard: { 
    backgroundColor: '#fff', padding: '30px', borderRadius: '15px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '500px', width: '100%',
    border: '1px solid #e3f2fd'
  },
  aiTitle: { fontSize: '1.4rem', fontWeight: 'bold', color: '#1565c0', marginBottom: '10px' },
  aiDesc: { color: '#666', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' },
  
  unpaidBox: { backgroundColor: '#ffebee', padding: '15px', borderRadius: '10px', marginBottom: '20px' },
  unpaidTitle: { fontSize: '1rem', fontWeight: 'bold', color: '#d32f2f', margin: '0 0 10px 0' },
  unpaidList: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  unpaidTag: { 
    backgroundColor: '#ffcdd2', color: '#b71c1c', padding: '4px 8px', 
    borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold' 
  },
  
  messageBox: { display: 'flex', flexDirection: 'column', gap: '15px' },
  messageArea: { 
    width: '100%', height: '150px', padding: '15px', borderRadius: '10px', 
    border: '1px solid #ddd', backgroundColor: '#f9f9f9', fontSize: '0.95rem',
    resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
  },
  aiButton: {
    padding: '16px', backgroundColor: '#6200ea', color: '#fff', border: 'none',
    borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
    width: '100%', boxShadow: '0 4px 6px rgba(98, 0, 234, 0.2)',
    transition: '0.2s'
  },
  loadingBox: { 
    padding: '30px', textAlign: 'center', backgroundColor: '#f5f5f5', 
    borderRadius: '10px', color: '#666', fontStyle: 'italic' 
  },
  buttonGroup: { display: 'flex', gap: '10px' },
  retryBtn: {
    padding: '12px', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ddd',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem',
    flex: 1, transition: '0.2s'
  },
  copyBtn: {
    padding: '12px', backgroundColor: '#1565c0', color: '#fff', border: 'none',
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem',
    flex: 2, transition: '0.2s'
  },
  aiFooter: { marginTop: '15px', textAlign: 'center', fontSize: '0.8rem', color: '#999' }
};

export default Finance;