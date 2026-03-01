import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        phone_number: '',
        position_football: 'ALL', // Default
        position_futsal: 'ALL'    // Default
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('회원가입이 완료되었습니다!');
                navigate('/');
            } else {
                alert('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2 style={styles.title}>JOIN TEAM</h2>
                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>아이디</label>
                        <input name="username" value={formData.username} onChange={handleChange} required style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>비밀번호</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>이름</label>
                        <input name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label>전화번호</label>
                        <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="010-0000-0000" style={styles.input} />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label>희망 포지션 (축구)</label>
                        <select name="position_football" value={formData.position_football} onChange={handleChange} style={styles.input}>
                            <option value="ALL">전 포지션 (ALL)</option>
                            <option value="FW">공격수 (FW)</option>
                            <option value="MF">미드필더 (MF)</option>
                            <option value="DF">수비수 (DF)</option>
                            <option value="GK">골키퍼 (GK)</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>희망 포지션 (풋살)</label>
                        <select name="position_futsal" value={formData.position_futsal} onChange={handleChange} style={styles.input}>
                            <option value="ALL">전 포지션 (ALL)</option>
                            <option value="PIVO">피보 (PIVO - 공격)</option>
                            <option value="ALA">아라 (ALA - 윙)</option>
                            <option value="FIXO">픽소 (FIXO - 수비)</option>
                            <option value="GOLEIRO">골레이로 (GOLEIRO - 골키퍼)</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>가입하기</button>
                    <button type="button" onClick={() => navigate('/')} style={{...styles.button, backgroundColor: '#999', marginTop: '5px'}}>취소</button>
                </form>
                <div style={styles.footer}>
                     이미 계정이 있으신가요? <span onClick={() => navigate('/')} style={{color: 'dodgerblue', cursor: 'pointer', fontWeight: 'bold'}}>로그인</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f7f6' },
    box: { width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem', fontWeight: 'bold' },
    form: { display: 'flex', flexDirection: 'column' },
    inputGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
    button: { padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }
};

export default Register;
