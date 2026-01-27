import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직이 들어갈 자리
    if (userId) navigate('/main');
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.loginTitle}>WELCOME BACK!</h2>
        <p style={styles.loginDesc}>팀 관리 시스템에 로그인하세요.</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ID (아이디)</label>
            <input 
              type="text" 
              placeholder="아이디를 입력하세요" 
              style={styles.input}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password (비밀번호)</label>
            <input type="password" placeholder="••••••••" style={styles.input} />
          </div>

          <button type="submit" style={styles.loginButton}>로그인</button>
        </form>

        <div style={styles.footerLinks}>
          <span>회원가입</span> | <span>아이디/비밀번호 찾기</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#f4f7f6'
  },
  loginBox: {
    width: '100%', maxWidth: '400px', padding: '40px',
    backgroundColor: '#fff', borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center'
  },
  loginTitle: { fontSize: '1.8rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' },
  loginDesc: { color: '#777', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold', color: '#555' },
  input: {
    width: '100%', padding: '12px 15px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box'
  },
  loginButton: {
    width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#333',
    color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '1rem'
  },
  footerLinks: { marginTop: '25px', fontSize: '0.85rem', color: '#999', cursor: 'pointer' }
};

export default Login;