import React, { useState } from 'react';
import TeamHeader from '../../components/TeamHeader.jsx';

const Admin = () => {
  // 초기 팀원 데이터 (실제 서비스 시 DB에서 호출)
  const [members, setMembers] = useState([
    { id: 1, name: '김민수', role: '관리자', position: 'PIVO (FW)' },
    { id: 2, name: '이영희', role: '회원', position: 'ALA (MF)' },
    { id: 3, name: '박철수', role: '회원', position: 'FIXO (DF)' },
    { id: 4, name: '최지우', role: '회원', position: 'GOLEIRO (GK)' },
  ]);

  const [newName, setNewName] = useState('');
  const [newPos, setNewPos] = useState('PIVO (FW)');

  // 1. 등급 변경 함수 (관리자 기능)
  const handleRoleChange = (id, newRole) => {
    // 본인의 등급을 변경하려 할 때 경고 (실제로는 로그인된 사용자 ID와 비교 필요)
    if (newRole === '회원' && window.confirm('정말 관리자 권한을 해제하시겠습니까?')) {
       setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
    } else {
       setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
    }
  };

  // 2. 팀원 삭제 함수 (관리자 전용 기능)
  const handleDelete = (id) => {
    if (window.confirm('해당 팀원을 명단에서 삭제하시겠습니까?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  // 신규 팀원 추가 함수
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName) return alert('이름을 입력해주세요.');
    const newMember = {
      id: Date.now(),
      name: newName,
      role: '회원', // 기본적으로 회원으로 등록
      position: newPos
    };
    setMembers([...members, newMember]);
    setNewName('');
  };

  return (
    <div style={styles.pageWrapper}>
      <TeamHeader />
      <div style={styles.container}>
        <h2 style={styles.mainTitle}>🛠️ 팀 관리 (Admin)</h2>

        {/* 1. 신규 팀원 추가 섹션 */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>신규 팀원 추가</h3>
          <form onSubmit={handleAdd} style={styles.form}>
            <input 
              style={styles.input} 
              placeholder="이름 입력" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
            />
            <select style={styles.select} value={newPos} onChange={(e) => setNewPos(e.target.value)}>
              <option>PIVO (FW)</option>
              <option>ALA (MF)</option>
              <option>FIXO (DF)</option>
              <option>GOLEIRO (GK)</option>
            </select>
            <button type="submit" style={styles.addBtn}>추가하기</button>
          </form>
        </section>

        {/* 2. 전체 팀원 명단 및 권한 관리 섹션 */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>전체 팀원 관리</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th>이름</th>
                <th>희망 포지션</th>
                <th>등급</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} style={styles.tdRow}>
                  <td style={styles.nameCell}>{member.name}</td>
                  <td>{member.position}</td>
                  <td>
                    <select 
                      value={member.role} 
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      style={member.role === '관리자' ? styles.adminSelect : styles.memberSelect}
                    >
                      <option value="관리자">👑 관리자</option>
                      <option value="운영진">🛡️ 운영진</option>
                      <option value="회원">👤 회원</option>
                    </select>
                  </td>
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