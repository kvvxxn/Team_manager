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
    const [monthlyFee, setMonthlyFee] = useState(0);
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
        formData.append('monthly_fee', monthlyFee);
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
                alert('Team created successfully!');
                // Update local storage user info
                const updatedUser = { ...user, team: newTeam, role: 'ADMIN' };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                navigate('/team/stats'); // Redirect to team dashboard
            } else {
                alert('Failed to create team.');
                const err = await res.json();
                console.error(err);
            }
        } catch (err) {
            console.error(err);
            alert('Error creating team.');
        }
    };

    const handleJoinRequest = async (teamId) => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:8000/api/teams/${teamId}/join?user_id=${user.user_id}`, {
                method: 'POST',
            });
            if (res.ok) {
                alert('Join request sent!');
                // Update local status if needed (e.g. pending)
            } else {
                alert('Failed to send request (maybe already sent?)');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Filter teams based on search
    const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome! You don't have a team yet.</h1>
            <div style={styles.tabs}>
                <button 
                    style={tab === 'create' ? styles.activeTab : styles.tab} 
                    onClick={() => setTab('create')}
                >
                    Create Team
                </button>
                <button 
                    style={tab === 'join' ? styles.activeTab : styles.tab} 
                    onClick={() => setTab('join')}
                >
                    Join Team
                </button>
            </div>

            <div style={styles.content}>
                {tab === 'create' ? (
                    <form onSubmit={handleCreateTeam} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label>Team Name</label>
                            <input 
                                type="text" 
                                value={teamName} 
                                onChange={(e) => setTeamName(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Monthly Fee (₩)</label>
                            <input 
                                type="number" 
                                value={monthlyFee} 
                                onChange={(e) => setMonthlyFee(Number(e.target.value))} 
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Emblem (Image)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setEmblem(e.target.files[0])} 
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" style={styles.submitBtn}>Creat Team</button>
                    </form>
                ) : (
                    <div style={styles.joinContainer}>
                        <input 
                            type="text" 
                            placeholder="Search team..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={styles.searchInput}
                        />
                        <div style={styles.teamList}>
                            {filteredTeams.map(team => (
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
                                        Request Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        fontFamily: "'Noto Sans KR', sans-serif",
    },
    title: {
        color: '#2c3e50',
        marginBottom: '30px',
    },
    tabs: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px',
    },
    tab: {
        padding: '10px 30px',
        border: '1px solid #ccc',
        borderRadius: '20px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
    },
    activeTab: {
        padding: '10px 30px',
        border: '1px solid #3498db',
        borderRadius: '20px',
        backgroundColor: '#3498db',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    content: {
        backgroundColor: '#f9f9f9',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '400px',
        margin: '0 auto',
    },
    formGroup: {
        textAlign: 'left',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginTop: '5px',
    },
    submitBtn: {
        padding: '12px',
        backgroundColor: '#2ecc71',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    joinContainer: {
        textAlign: 'left',
    },
    searchInput: {
        width: '100%',
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginBottom: '20px',
    },
    teamList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
    },
    teamCard: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '180px',
    },
    teamInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    emblem: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '10px',
    },
    placeholderEmblem: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#ecf0f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        marginBottom: '10px',
    },
    teamName: {
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#34495e',
    },
    joinBtn: {
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
    },
};

export default TeamSetup;
