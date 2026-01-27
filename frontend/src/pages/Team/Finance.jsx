import React from 'react';
import TeamHeader from '../../components/TeamHeader';

// 임시 회비 및 지출 데이터
const membersFinance = [
  { id: 1, name: '김민수', isPaid: true, amount: 20000 },
  { id: 2, name: '이영희', isPaid: true, amount: 20000 },
  { id: 3, name: '박철수', isPaid: false, amount: 20000 },
  { id: 4, name: '최지우', isPaid: true, amount: 20000 },
  { id: 5, name: '정대만', isPaid: false, amount: 20000 },
];

const expenses = [
  { id: 1, date: '2026-01-20', item: '경기장 대관료', amount: 80000 },
  { id: 2, date: '2026-01-22', item: '음료수 구매', amount: 15000 },
  { id: 3, date: '2026-01-25', item: '팀 유니폼 제작 (선금)', amount: 100000 },
];

const Finance = () => {
  const totalIncome = membersFinance
    .filter(member => member.isPaid)
    .reduce((sum, member) => sum + member.amount, 0);

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  return (
    <div style={styles.pageWrapper}>
      <TeamHeader />
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.pageTitle}>회비 관리</h2>
          <p style={styles.currentMonth}>2026년 1월 회비 현황</p>
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
          <h3 style={styles.sectionTitle}>회원별 회비 납부 현황</h3>
          <ul style={styles.memberList}>
            {membersFinance.map(member => (
              <li key={member.id} style={styles.memberItem}>
                <span style={styles.memberName}>{member.name}</span>
                <span style={member.isPaid ? styles.paidStatus : styles.unpaidStatus}>
                  {member.isPaid ? '납부 완료' : '미납'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.expenseListSection}>
          <h3 style={styles.sectionTitle}>지출 내역</h3>
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
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
  pageTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' },
  currentMonth: { fontSize: '1.2rem', color: '#666' },

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