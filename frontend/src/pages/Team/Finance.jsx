import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamHeader from '../../components/TeamHeader';

const Finance = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'ai'
  const [summary, setSummary] = useState({
      previous_balance: 0,
      current_income: 0,
      current_expense: 0,
      total_balance: 0
  });
  const [transactions, setTransactions] = useState([]); // List of finance records
  const [members, setMembers] = useState([]);
  const [user, setUser] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [monthlyFee, setMonthlyFee] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1 ~ 12
  
  // Auth & Team Check
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        setUser(storedUser);
        if (storedUser.team) {
            setTeamId(storedUser.team.id);
            // If monthly_fee is in storedUser (after login update), use it, otherwise fetch
            if (storedUser.team.monthly_fee) {
                setMonthlyFee(storedUser.team.monthly_fee);
            }
            fetchTeamMembers(storedUser.team.id);
            fetchTeamDetails(storedUser.team.id);
        } else {
            alert('팀에 소속되어 있지 않습니다.');
            navigate('/');
        }
    } else {
        navigate('/login');
    }
  }, [navigate]);

  // Fetch Data on Date/Team Change
  useEffect(() => {
    if (teamId) {
        fetchFinanceData(teamId, year, month);
    }
  }, [teamId, year, month]);

  const fetchTeamDetails = async (tid) => {
      try {
          const response = await fetch(`http://localhost:8000/api/teams/${tid}`);
          if (response.ok) {
              const data = await response.json();
              if (data.monthly_fee) setMonthlyFee(data.monthly_fee);
          }
      } catch (error) {
          console.error("Failed to fetch team details", error);
      }
  };

  const fetchTeamMembers = async (tid) => {
      try {
          const response = await fetch(`http://localhost:8000/api/players?team_id=${tid}`);
          if (response.ok) {
              const data = await response.json();
              setMembers(data);
          }
      } catch (error) {
          console.error("Failed to fetch members", error);
      }
  };

  const fetchFinanceData = async (tid, y, m) => {
      try {
          // 1. Fetch Summary (Balances)
          const summaryRes = await fetch(`http://localhost:8000/api/finances/summary?team_id=${tid}&year=${y}&month=${m}`);
          if (summaryRes.ok) {
              const summaryData = await summaryRes.json();
              setSummary(summaryData);
          }

          // 2. Fetch Transactions (List)
          const listRes = await fetch(`http://localhost:8000/api/finances/?team_id=${tid}&year=${y}&month=${m}`);
          if (listRes.ok) {
              const listData = await listRes.json();
              setTransactions(listData);
          }
      } catch (error) {
          console.error("Failed to fetch finance data", error);
      }
  };

  // Process Data for UI
  const memberStatus = members.map(member => {
      const payment = transactions.find(t => t.user_id === member.id && t.type === 'INCOME');
      return {
          ...member,
          isPaid: !!payment,
          amount: payment ? payment.amount : 0 
      };
  });

  const expenseList = transactions.filter(t => t.type === 'EXPENSE');

  // 납부 처리 핸들러
  const handlePayment = async (memberId) => {
      // Check for GENERAL_AFFAIRS role
      if (user?.role !== 'GENERAL_AFFAIRS') {
          alert('총무만 납부 처리할 수 있습니다.');
          return;
      }

      if (!window.confirm('회비를 납부 처리하시겠습니까?')) return;
      
      const paymentData = {
          user_id: memberId,
          team_id: teamId, 
          type: 'INCOME',
          amount: monthlyFee || 20000, 
          description: `${year}년 ${month}월 회비`,
          date: `${year}-${String(month).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}` 
      };

      try {
          const response = await fetch('http://localhost:8000/api/finances/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paymentData)
          });
          
          if (response.ok) {
              alert('납부 처리되었습니다.');
              fetchFinanceData(teamId, year, month); 
          } else {
              alert('처리에 실패했습니다.');
          }
      } catch (e) {
          console.error(e);
          alert('오류가 발생했습니다.');
      }
  };

  // 월 이동 핸들러
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month, 1));

  // AI 독촉 메시지 생성 로직
  const unpaidMembers = memberStatus.filter(m => !m.isPaid);
  const unpaidNames = unpaidMembers.map(m => m.name).join(', ');

  const [aiMessage, setAiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateMessage = async () => {
    if (unpaidMembers.length === 0) {
      setAiMessage('모든 회원이 회비를 납부했습니다! 🎉');
      return;
    }

    setIsLoading(true);
    
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
            {user?.role === 'GENERAL_AFFAIRS' && (
            <button 
              style={activeTab === 'ai' ? styles.activeTab : styles.tabBtn} 
              onClick={() => setActiveTab('ai')}
            >
              🤖 AI 독촉 매니저
            </button>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <>
            <section style={styles.balanceSection}>
              <div style={styles.balanceCard}>
                <span style={styles.cardLabel}>이월 잔액</span>
                {/* ❌ 오류 원인: style 속성 중복. 하나로 합쳐서 해결 */}
                <span style={{ ...styles.incomeAmount, color: '#888' }}>
                  {summary.previous_balance.toLocaleString()}원
                </span>
              </div>
              <div style={styles.balanceCard}>
                <span style={styles.cardLabel}>이번 달 수입</span>
                <span style={styles.incomeAmount}>+{summary.current_income.toLocaleString()}원</span>
              </div>
              <div style={styles.balanceCard}>
                <span style={styles.cardLabel}>이번 달 지출</span>
                <span style={styles.expenseAmount}>-{summary.current_expense.toLocaleString()}원</span>
              </div>
              <div style={styles.balanceCardTotal}>
                <span style={styles.cardLabelTotal}>현재 잔액</span>
                <span style={styles.totalAmount}>{summary.total_balance.toLocaleString()}원</span>
              </div>
            </section>

            <div style={styles.contentGrid}>
              {/* 왼쪽: 멤버 납부 현황 */}
              <section style={styles.memberSection}>
                <h3 style={styles.sectionTitle}>팀원 납부 현황</h3>
                <ul style={styles.memberList}>
                  {memberStatus.map((member) => (
                    <li key={member.id} style={styles.memberItem}>
                      <span style={styles.memberName}>{member.name}</span>
                       <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                        {member.isPaid ? (
                            <span style={styles.paidBadge}>납부완료</span>
                        ) : (
                            user?.role === 'GENERAL_AFFAIRS' ? (
                            <button 
                                onClick={() => handlePayment(member.id)}
                                style={styles.payBtn}
                            >
                                납부처리
                            </button>
                            ) : (
                            <span style={{fontSize: '0.8rem', color: '#e74c3c'}}>미납</span>
                            )
                        )}
                       </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 오른쪽: 지출 내역 */}
              <section style={styles.expenseSection}>
                <h3 style={styles.sectionTitle}>지출 내역</h3>
                {expenseList.length > 0 ? (
                  <ul style={styles.expenseList}>
                    {expenseList.map((item) => (
                      <li key={item.id} style={styles.expenseItem}>
                        <div style={styles.expenseInfo}>
                          <span style={styles.expenseDate}>{item.date}</span>
                          <span style={styles.expenseName}>{item.description}</span>
                        </div>
                        <span style={styles.expensePrice}>-{item.amount.toLocaleString()}원</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={styles.emptyState}>지출 내역이 없습니다.</div>
                )}
              </section>
            </div>
          </>
        ) : (
          <section style={styles.aiSection}>
            <div style={styles.aiHeader}>
              <h3 style={styles.sectionTitle}>💰 미납자 독촉 메시지 생성기</h3>
              <p style={styles.aiDesc}>AI가 정중하지만 단호한 독촉 메시지를 만들어줍니다.</p>
            </div>
            
            <div style={styles.targetBox}>
              <span style={styles.targetLabel}>독촉 대상 ({unpaidMembers.length}명):</span>
              <span style={styles.targetNames}>
                {unpaidNames || '없음 (모두 납부함)'}
              </span>
            </div>

            <div style={styles.messageBox}>
              {isLoading ? (
                <div style={styles.loading}>AI가 메시지를 작성중입니다... ✍️</div>
              ) : aiMessage ? (
                <div style={styles.generatedMessage}>{aiMessage}</div>
              ) : (
                <div style={styles.placeholder}>버튼을 눌러 메시지를 생성하세요.</div>
              )}
            </div>

            <div style={styles.aiActions}>
              <button 
                // 조건부 스타일 적용으로 수정
                style={{
                  ...styles.generateBtn,
                  ...(unpaidMembers.length === 0 ? styles.generateBtnDisabled : {})
                }}
                onClick={handleGenerateMessage}
                disabled={unpaidMembers.length === 0}
              >
                ✨ 메시지 생성
              </button>
              {aiMessage && (
                <button style={styles.copyBtn} onClick={copyToClipboard}>
                  📋 복사하기
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: '100vh', backgroundColor: '#f5f5f5', paddingBottom: '50px' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  header: { marginBottom: '30px', textAlign: 'center' },
  pageTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' },
  
  monthNav: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  currentMonth: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333' },
  navBtn: { 
    fontSize: '1.2rem', cursor: 'pointer', background: '#fff', border: '1px solid #ddd', 
    borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: '0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },

  tabContainer: { display: 'flex', justifyContent: 'center', gap: '10px' },
  tabBtn: {
    padding: '10px 20px', borderRadius: '25px', border: '1px solid #ddd',
    backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#666',
    transition: 'all 0.2s', fontSize: '0.95rem'
  },
  activeTab: { 
    padding: '10px 20px', borderRadius: '25px', border: 'none',
    backgroundColor: '#333', cursor: 'pointer', fontWeight: 'bold', color: '#fff',
    fontSize: '0.95rem', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' 
  },

  balanceSection: { display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' },
  balanceCard: { 
    flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '15px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', textAlign: 'center', minWidth: '150px'
  },
  balanceCardTotal: {
    flex: 1, backgroundColor: '#333', padding: '20px', borderRadius: '15px', 
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', minWidth: '150px',
    color: '#fff'
  },
  cardLabel: { display: 'block', fontSize: '0.9rem', color: '#888', marginBottom: '8px' },
  cardLabelTotal: { display: 'block', fontSize: '0.9rem', color: '#aaa', marginBottom: '8px' },
  incomeAmount: { fontSize: '1.4rem', fontWeight: 'bold', color: '#2ecc71' },
  expenseAmount: { fontSize: '1.4rem', fontWeight: 'bold', color: '#e74c3c' },
  totalAmount: { fontSize: '1.6rem', fontWeight: 'bold', color: '#fff' },

  contentGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'
    // 인라인 스타일에서는 @media 쿼리가 동작하지 않으므로 제거했습니다. 반응형이 필요하다면 CSS 파일을 사용하시는 것이 좋습니다.
  },

  sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#333', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #f0f0f0' },
  
  // Member List
  memberSection: { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
  memberList: { listStyle: 'none', padding: 0, margin: 0 },
  memberItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 0', borderBottom: '1px solid #f5f5f5'
  },
  memberName: { fontSize: '1rem', fontWeight: 'bold', color: '#444' },
  paidBadge: { 
    backgroundColor: '#e8f5e9', color: '#2ecc71', padding: '5px 12px', 
    borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' 
  },
  payBtn: {
    padding: '5px 12px', backgroundColor: '#fff', border: '1px solid #ddd',
    borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', color: '#666',
    transition: '0.2s'
    // 인라인 스타일에서 :hover는 동작하지 않아 제거했습니다.
  },

  // Expense List
  expenseSection: { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' },
  expenseList: { listStyle: 'none', padding: 0, margin: 0 },
  expenseItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 0', borderBottom: '1px solid #f5f5f5'
  },
  expenseInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  expenseDate: { fontSize: '0.8rem', color: '#999' },
  expenseName: { fontSize: '1rem', color: '#333' },
  expensePrice: { fontSize: '1rem', fontWeight: 'bold', color: '#e74c3c' },
  emptyState: { textAlign: 'center', padding: '30px 0', color: '#aaa', fontStyle: 'italic' },

  // AI Section
  aiSection: { 
    backgroundColor: '#fff', padding: '40px', borderRadius: '20px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto',
    textAlign: 'center'
  },
  aiHeader: { marginBottom: '30px' },
  aiDesc: { color: '#666', marginBottom: '30px' },
  targetBox: { 
    backgroundColor: '#fff5f5', padding: '15px', borderRadius: '10px', 
    marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
  },
  targetLabel: { color: '#e53935', fontWeight: 'bold' },
  targetNames: { color: '#333' },
  
  messageBox: { marginBottom: '25px' },
  generatedMessage: { 
    backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', 
    whiteSpace: 'pre-wrap', textAlign: 'left', lineHeight: '1.6', color: '#333',
    border: '1px solid #eee'
  },
  placeholder: { color: '#ccc', padding: '30px 0', fontStyle: 'italic' },
  loading: { color: '#666', padding: '20px 0' },
  
  aiActions: { display: 'flex', gap: '10px', justifyContent: 'center' },
  generateBtn: {
    padding: '12px 25px', backgroundColor: '#6c5ce7', color: '#fff', border: 'none',
    borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(108, 92, 231, 0.3)', transition: '0.2s'
  },
  // disabled 상태일 때 적용할 스타일을 따로 분리했습니다.
  generateBtnDisabled: {
    backgroundColor: '#a29bfe', cursor: 'not-allowed', boxShadow: 'none'
  },
  copyBtn: {
    padding: '12px 20px', backgroundColor: '#dfe6e9', color: '#2d3436', border: 'none',
    borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem',
    transition: '0.2s'
  }
};

export default Finance;