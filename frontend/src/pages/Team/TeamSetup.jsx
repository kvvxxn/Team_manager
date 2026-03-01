import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TeamSetup = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('create'); // create | join
    const [teams, setTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);

    // Create Form State
    const [teamName, setTeamName] = useState('');
    const [monthlyFee, setMonthlyFee] = useState(''); // 초기값을 빈 문자열로 변경
    const [emblem, setEmblem] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
        fetchTeams();
    }, [navigate]);

    const fetchTeams = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/teams/');
            if (res.ok) {
                const data = await res.json();
                setTeams(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', teamName);
        formData.append('monthly_fee', monthlyFee === '' ? 0 : monthlyFee); // 빈 값이면 0 전송
        formData.append('user_id', user.user_id); // Assuming backend uses this to set admin
        if (emblem) {
            formData.append('emblem', emblem);
        }

        try {
            const res = await fetch('http://localhost:8000/api/teams/', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const newTeam = await res.json();
                alert('팀이 성공적으로 생성되었습니다!');
                // Update local storage user info
                const updatedUser = { ...user, team: newTeam, role: 'ADMIN' };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                navigate('/team/stats'); // Redirect to team dashboard
            } else {
                alert('팀 생성에 실패했습니다.');
                const err = await res.json();
                console.error(err);
            }
        } catch (err) {
            console.error(err);
            alert('오류가 발생했습니다.');
        }
    };

    const handleJoinRequest = async (teamId) => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:8000/api/teams/${teamId}/join?user_id=${user.user_id}`, {
                method: 'POST',
            });
            if (res.ok) {
                alert('가입 신청을 보냈습니다. 관리자 승인을 기다려주세요.');
                // Update local status if needed (e.g. pending)
            } else {
                alert('이미 신청했거나 오류가 발생했습니다.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Filter teams based on search
    const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>아직 소속된 팀이 없습니다</h1>
                <p style={styles.subtitle}>팀을 생성하거나 기존 팀에 가입하여 활동을 시작하세요.</p>
                
                <div style={styles.tabs}>
                    <button 
                        style={tab === 'create' ? styles.activeTab : styles.tab} 
                        onClick={() => setTab('create')}
                    >
                        팀 생성하기
                    </button>
                    <button 
                        style={tab === 'join' ? styles.activeTab : styles.tab} 
                        onClick={() => setTab('join')}
                    >
                        팀 가입하기
                    </button>
                </div>

                <div style={styles.content}>
                    {tab === 'create' ? (
                        <form onSubmit={handleCreateTeam} style={styles.form}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>팀 이름</label>
                                <input 
                                    type="text" 
                                    value={teamName} 
                                    onChange={(e) => setTeamName(e.target.value)} 
                                    required 
                                    placeholder="멋진 팀 이름을 입력하세요"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>월 회비 (원)</label>
                                <input 
                                    type="number" 
                                    value={monthlyFee} 
                                    onChange={(e) => setMonthlyFee(e.target.value)} 
                                    placeholder="0"
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>팀 엠블럼 (이미지)</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setEmblem(e.target.files[0])} 
                                    style={styles.fileInput}
                                />
                            </div>
                            <button type="submit" style={styles.submitBtn}>팀 생성 완료</button>
                        </form>
                    ) : (
                        <div style={styles.joinContainer}>
                            <input 
                                type="text" 
                                placeholder="팀 검색..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                            <div style={styles.teamList}>
                                {filteredTeams.length > 0 ? (
                                    filteredTeams.map(team => (
                                        <div key={team.id} style={styles.teamCard}>
                                            <div style={styles.teamInfo}>
                                                {team.emblem ? (
                                                     <img src={`http://localhost:8000/${team.emblem}`} alt={team.name} style={styles.emblem} />
                                                ) : (
                                                    <div style={styles.placeholderEmblem}>⚽</div>
                                                )}
                                                <span style={styles.teamName}>{team.name}</span>
                                            </div>
                                            <button onClick={() => handleJoinRequest(team.id)} style={styles.joinBtn}>
                                                가입 신청
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p style={styles.noResult}>검색 결과가 없습니다.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f7f6', // Login 페이지와 동일한 배경색
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', // Login 페이지와 동일한 쉐도우
        padding: '40px',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    subtitle: {
        color: '#777',
        marginBottom: '30px',
        fontSize: '0.95rem',
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px',
    },
    tab: {
        padding: '10px 25px',
        border: '1px solid #ddd',
        borderRadius: '25px',
        backgroundColor: '#fff',
        color: '#555',
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
    },
    activeTab: {
        padding: '10px 25px',
        border: '1px solid #333', // 포인트 컬러
        borderRadius: '25px',
        backgroundColor: '#333', // 포인트 컬러
        color: '#fff',
        cursor: 'pointer',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
    },
    content: {
        textAlign: 'left',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#555',
        marginLeft: '5px',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
    },
    fileInput: {
        padding: '10px',
        fontSize: '0.95rem',
    },
    submitBtn: {
        width: '100%',
        padding: '15px',
        marginTop: '20px',
        backgroundColor: '#27ae60', // 긍정적인 초록색
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s',
    },
    joinContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    searchInput: {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        boxSizing: 'border-box',
    },
    teamList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
        maxHeight: '400px', // 스크롤 가능하게
        overflowY: 'auto',
        padding: '5px',
    },
    teamCard: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #eee',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '180px',
        transition: 'transform 0.2s',
        cursor: 'pointer',
    },
    teamInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10px',
    },
    emblem: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '10px',
        border: '1px solid #eee',
    },
    placeholderEmblem: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#f1f2f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        marginBottom: '10px',
        color: '#bdc3c7',
    },
    teamName: {
        fontWeight: 'bold',
        fontSize: '0.95rem',
        color: '#2c3e50',
        wordBreak: 'break-word',
    },
    joinBtn: {
        padding: '8px 16px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        width: '100%',
        marginTop: '10px',
    },
    noResult: {
        textAlign: 'center',
        color: '#999',
        gridColumn: '1 / -1',
        padding: '20px',
    },
};

export default TeamSetup;
