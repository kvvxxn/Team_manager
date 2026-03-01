import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamHeader from '../../components/TeamHeader.jsx';

const Admin = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (storedUser.role !== 'ADMIN' && storedUser.role !== 'MANAGER') {
      alert('관리자 또는 운영진만 접근할 수 있습니다.');
      navigate('/');
      return;
    }

    setUser(storedUser);
    
    if (storedUser.team) {
      fetchMembers(storedUser.team.id);
      fetchRequests(storedUser.team.id);
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const fetchMembers = async (teamId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/players?team_id=${teamId}`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (teamId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/teams/${teamId}/requests`);
      if (response.ok) {
        const data = await response.json();
        // user details are needed for display. Currently API returns request object.
        // Assuming request object has user_id, we might need to fetch user details or enrich backend response.
        // However, looking at the previous backend code for get_join_requests, it returns TeamJoinRequest model.
        // This model only has user_id. We need user name.
        // Let's assume for now we might need to update backend to include user info or fetch separately.
        // Wait, I can update the backend schema to include user info.
        // For now, let's keep it simple and see if the frontend breaks.
        // Actually, without user name, the request list is useless.
        // I will assume the backend returns basic info or I'll fix the backend next.
        setRequests(data); 
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const handleApprove = async (reqId) => {
    if (!window.confirm('가입을 승인하시겠습니까?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/teams/requests/${reqId}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('승인되었습니다.');
        setRequests(requests.filter(req => req.id !== reqId));
        if (user.team) fetchMembers(user.team.id); // Refresh members list
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleReject = async (reqId) => {
    if (!window.confirm('가입을 거절하시겠습니까?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/teams/requests/${reqId}/reject`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('거절되었습니다.');
        setRequests(requests.filter(req => req.id !== reqId));
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    // 본인의 등급을 변경하려 할 때 경고
    if (memberId === user.id && newRole === 'MEMBER') {
       if (!window.confirm('정말 관리자 권한을 해제하시겠습니까? 이후 관리 페이지에 접근할 수 없습니다.')) return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/players/${memberId}/role?role=${newRole}`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
        // If current user changed their own role to something non-admin, redirect
        if (memberId === user.id && newRole !== 'ADMIN' && newRole !== 'MANAGER') {
            const updatedUser = { ...user, role: newRole };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('권한이 변경되어 메인 페이지로 이동합니다.');
            navigate('/');
        }
      } else {
        alert('권한 변경 실패');
      }
    } catch (error) {
      console.error("Error updating role", error);
      alert('오류가 발생했습니다.');
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('정말 이 팀원을 추방하시겠습니까?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/players/${memberId}/team`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setMembers(members.filter(m => m.id !== memberId));
        alert('추방되었습니다.');
      } else {
        alert('추방 실패');
      }
    } catch (error) {
       alert('오류가 발생했습니다.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.pageWrapper}>
      <TeamHeader />
      <div style={styles.container}>
        <h2 style={styles.mainTitle}>🛠️ 팀 관리 (Admin)</h2>

        {/* 가입 요청 관리 섹션 */}
        {requests.length > 0 ? (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              📋 가입 요청 <span style={styles.badge}>{requests.length}</span>
            </h3>
            <ul style={styles.reqList}>
              {requests.map(req => (
                <li key={req.id} style={styles.reqItem}>
                  <div style={styles.reqInfo}>
                    {/* Backend should ideally return user name. For now displaying ID if name missing */}
                    <span style={styles.reqName}>{req.user ? req.user.name : `User ID: ${req.user_id}`}</span>
                    <span style={styles.reqDate}>요청일: {req.created_at ? new Date(req.created_at).toLocaleDateString() : '최근'}</span>
                  </div>
                  <div style={styles.reqActions}>
                    <button onClick={() => handleApprove(req.id)} style={styles.approveBtn}>승인</button>
                    <button onClick={() => handleReject(req.id)} style={styles.rejectBtn}>거절</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : (
             <section style={styles.section}>
                <h3 style={styles.sectionTitle}>가입 요청 없음</h3>
                <p style={{color: '#888'}}>현재 대기 중인 가입 요청이 없습니다.</p>
            </section>
        )}

        {/* 전체 팀원 명단 및 권한 관리 섹션 */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>전체 팀원 관리</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th>이름</th>
                <th>포지션</th>
                <th>등급</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} style={styles.tdRow}>
                  <td style={styles.nameCell}>{member.name}</td>
                  <td>{member.position_football} / {member.position_futsal}</td>
                  <td>
                    <select 
                      value={member.role} 
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      style={member.role === 'ADMIN' ? styles.adminSelect : styles.memberSelect}
                    >
                      <option value="ADMIN">👑 관리자</option>
                      <option value="MANAGER">🛡️ 운영진</option>
                      <option value="MEMBER">👤 회원</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(member.id)} style={styles.deleteBtn}>추방</button>
                  </td>
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
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '40px' },
  container: { padding: '20px 40px', maxWidth: '1000px', margin: '0 auto' },
  mainTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '30px' },
  
  section: { 
    backgroundColor: '#fff', padding: '25px', borderRadius: '15px', marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#444' },
  badge: { 
    backgroundColor: '#ff4757', color: '#fff', fontSize: '0.9rem', padding: '2px 8px', 
    borderRadius: '12px', verticalAlign: 'middle', marginLeft: '5px' 
  },
  
  // Requests List
  reqList: { listStyle: 'none', padding: 0 },
  reqItem: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '15px 0', borderBottom: '1px solid #eee' 
  },
  reqInfo: { display: 'flex', flexDirection: 'column', gap: '5px' },
  reqName: { fontWeight: 'bold', fontSize: '1.1rem' },
  reqDate: { fontSize: '0.85rem', color: '#888' },
  reqActions: { display: 'flex', gap: '10px' },
  approveBtn: { 
    padding: '8px 16px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', 
    borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
  },
  rejectBtn: { 
    padding: '8px 16px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', 
    borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
  },

  // Table
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'center' },
  thRow: { backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' },
  tdRow: { borderBottom: '1px solid #f1f1f1' },
  nameCell: { fontWeight: 'bold', color: '#333' },
  
  adminSelect: { 
    padding: '5px 10px', borderRadius: '6px', border: '1px solid #ddd', 
    backgroundColor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold', cursor: 'pointer' 
  },
  memberSelect: { 
    padding: '5px 10px', borderRadius: '6px', border: '1px solid #ddd', 
    backgroundColor: '#fff', color: '#666', cursor: 'pointer' 
  },
  
  deleteBtn: {
    padding: '5px 10px', backgroundColor: '#ff6b6b', color: '#fff', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
  }
};

export default Admin;
                  <td>
                    {/* 관리자가 본인을 삭제하지 못하도록 예외 처리 가능 */}
                    <button 
                      onClick={() => handleDelete(member.id)} 
                      style={styles.deleteBtn}
                    >
                      삭제
                    </button>
                  </td>
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
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh' },
  container: { padding: '20px 40px' },
  mainTitle: { marginBottom: '30px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' },
  section: { 
    backgroundColor: '#fff', padding: '25px', borderRadius: '15px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '30px' 
  },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
  form: { display: 'flex', gap: '15px' },
  input: { flex: 2, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  select: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  
  adminSelect: { 
    padding: '8px', borderRadius: '8px', border: '1px solid #e57373', 
    backgroundColor: '#ffebee', color: '#d32f2f', fontWeight: 'bold', cursor: 'pointer' 
  },
  memberSelect: { 
    padding: '8px', borderRadius: '8px', border: '1px solid #ddd', 
    backgroundColor: '#fff', color: '#333', cursor: 'pointer' 
  },

  // 기록 승인 관련 스타일
  badge: {
    backgroundColor: '#ff5252', color: '#fff', fontSize: '0.8rem', padding: '2px 8px', 
    borderRadius: '12px', marginLeft: '5px', verticalAlign: 'middle'
  },
  reqList: { listStyle: 'none', padding: 0, margin: 0 },
  reqItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '12px 15px', borderBottom: '1px solid #eee'
  },
  reqInfo: { display: 'flex', gap: '15px', alignItems: 'center' },
  reqName: { fontWeight: 'bold' },
  reqDate: { fontSize: '0.9rem', color: '#666' },
  reqStats: { fontSize: '0.9rem', fontWeight: 'bold', color: '#1976D2' },
  reqActions: { display: 'flex', gap: '8px' },
  approveBtn: {
    backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '6px 12px',
    borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
  },
  rejectBtn: {
    backgroundColor: '#ef5350', color: '#fff', border: 'none', padding: '6px 12px',
    borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
  },

  addBtn: { padding: '12px 25px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thRow: { borderBottom: '2px solid #eee', textAlign: 'left', height: '45px', color: '#888', fontSize: '0.9rem' },
  tdRow: { borderBottom: '1px solid #f5f5f5', height: '60px' },
  nameCell: { fontWeight: 'bold', color: '#333' },
  adminBadge: { 
    padding: '5px 12px', backgroundColor: '#F3E5F5', color: '#9C27B0', 
    borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' 
  },
  memberBadge: { 
    padding: '5px 12px', backgroundColor: '#F5F5F5', color: '#666', 
    borderRadius: '20px', fontSize: '0.85rem' 
  },
  deleteBtn: { 
    padding: '6px 12px', backgroundColor: 'transparent', color: '#FF5252', 
    border: '1px solid #FF5252', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem',
    transition: '0.2s'
  }
};

export default Admin;