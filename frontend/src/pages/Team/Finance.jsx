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
        </header>

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
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
  pageTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' },
  
  monthNav: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  currentMonth: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  navBtn: { 
    fontSize: '1.2rem', cursor: 'pointer', background: 'none', border: '1px solid #ddd', 
    borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: '0.2s'
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
};

export default Finance;