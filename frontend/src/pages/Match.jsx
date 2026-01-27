import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Match = () => {
  const navigate = useNavigate();

  // 1. 임시 팀 랭킹 데이터
  const [rankings] = useState([
    { id: 1, logo: '🦁', name: '레오 FC', region: '서울', rp: 2450 },
    { id: 2, logo: '🦅', name: '독수리 풋살', region: '경기', rp: 2100 },
    { id: 3, logo: '🐬', name: '돌고래즈', region: '인천', rp: 1980 },
  ]);

  // 2. 매칭 대기 팀 목록 데이터 (새로 추가)
  const [waitingTeams] = useState([
    { id: 101, logo: '🔥', name: '불꽃슈팅', region: '서울 강남', date: '2026-02-05', time: '20:00', rp: 1850 },
    { id: 102, logo: '⚽', name: '풋살매니아', region: '경기 수원', date: '2026-02-06', time: '19:30', rp: 2100 },
    { id: 103, logo: '🛡️', name: '철벽방어', region: '인천 송도', date: '2026-02-05', time: '22:00', rp: 1680 },
  ]);

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.header}>
        <div onClick={() => navigate('/main')} style={styles.backBtn}>
          🏠 <span>메인으로</span>
        </div>
        <h2 style={styles.title}>매칭 및 랭킹</h2>
      </header>

      {/* 상단 레이아웃: 랭킹 + 매칭 설정 */}
      <div style={styles.topContainer}>
        <section style={styles.rankingSection}>
          <h3 style={styles.sectionTitle}>🏆 실시간 팀 랭킹 (RP)</h3>
          <div style={styles.rankList}>
            {rankings.map((team, index) => (
              <div key={team.id} style={styles.rankItem}>
                <span style={styles.rankNumber}>{index + 1}</span>
                <span style={styles.teamLogo}>{team.logo}</span>
                <div style={styles.teamInfo}>
                  <span style={styles.teamName}>{team.name}</span>
                  <span style={styles.teamRegion}>{team.region}</span>
                </div>
                <span style={styles.rpText}>{team.rp} RP</span>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.matchSection}>
          <h3 style={styles.sectionTitle}>⚽ 매칭 조건 설정</h3>
          <div style={styles.filterBox}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>선호 지역</label>
              <select style={styles.select}>
                <option>전체 지역</option>
                <option>서울</option>
                <option>경기</option>
              </select>
            </div>

            {/* 날짜 및 시간 선택 추가 */}
            <div style={styles.dateTimeRow}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>희망 날짜</label>
                <input type="date" style={styles.select} defaultValue="2026-02-01" />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>희망 시간</label>
                <input type="time" style={styles.select} defaultValue="20:00" />
              </div>
            </div>

            <button style={styles.matchBtn}>매칭 대기열 등록</button>
          </div>
        </section>
      </div>

      {/* 하단 레이아웃: 매칭 대기 팀 목록 (새로 추가) */}
      <section style={styles.waitingSection}>
        <h3 style={styles.sectionTitle}>📢 현재 매칭 대기 중인 팀</h3>
        <div style={styles.waitingGrid}>
          {waitingTeams.map((team) => (
            <div key={team.id} style={styles.waitingCard}>
              <div style={styles.cardTop}>
                <span style={styles.teamLogoLarge}>{team.logo}</span>
                <div style={styles.cardTitleBox}>
                  <span style={styles.waitTeamName}>{team.name}</span>
                  <span style={styles.waitTeamRp}>{team.rp} RP</span>
                </div>
                <button style={styles.challengeBtn}>신청</button>
              </div>
              <div style={styles.cardInfo}>
                <div style={styles.infoItem}>📍 {team.region}</div>
                <div style={styles.infoItem}>📅 {team.date}</div>
                <div style={styles.infoItem}>⏰ {team.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '40px' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  backBtn: { cursor: 'pointer', padding: '10px 18px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', gap: '8px', fontWeight: 'bold' },
  title: { fontSize: '2rem', fontWeight: '800', margin: 0 },
  
  topContainer: { display: 'flex', gap: '30px', marginBottom: '40px' },
  
  rankingSection: { flex: 1.2, backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#333' },
  rankList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  rankItem: { display: 'flex', alignItems: 'center', padding: '12px 20px', backgroundColor: '#fff', borderRadius: '15px', border: '1px solid #f0f0f0' },
  rankNumber: { fontSize: '1.1rem', fontWeight: '900', color: '#1a73e8', width: '30px' },
  teamLogo: { fontSize: '1.5rem', margin: '0 15px' },
  teamInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  teamName: { fontWeight: 'bold', fontSize: '1rem' },
  teamRegion: { fontSize: '0.8rem', color: '#888' },
  rpText: { fontWeight: 'bold', color: '#e63946' },

  matchSection: { flex: 1, backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  filterBox: { display: 'flex', flexDirection: 'column', gap: '15px' },
  dateTimeRow: { display: 'flex', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: 'bold', color: '#666' },
  select: { padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#fcfcfc', fontSize: '0.95rem' },
  matchBtn: { marginTop: '10px', padding: '15px', backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },

  // 하단 대기 팀 목록 스타일
  waitingSection: { marginTop: '20px' },
  waitingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  waitingCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #fff', transition: '0.2s' },
  cardTop: { display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '15px' },
  teamLogoLarge: { fontSize: '2.5rem' },
  cardTitleBox: { flex: 1, display: 'flex', flexDirection: 'column' },
  waitTeamName: { fontSize: '1.1rem', fontWeight: 'bold' },
  waitTeamRp: { fontSize: '0.9rem', color: '#e63946', fontWeight: 'bold' },
  challengeBtn: { padding: '8px 16px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  cardInfo: { display: 'flex', flexWrap: 'wrap', gap: '10px', paddingTop: '15px', borderTop: '1px solid #f5f5f5' },
  infoItem: { fontSize: '0.85rem', color: '#555', backgroundColor: '#f5f5f5', padding: '6px 12px', borderRadius: '20px' }
};

export default Match;