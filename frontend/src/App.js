import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './pages/Start.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Main from './pages/Main.jsx';
import Calendar from './pages/Calendar.jsx';
import PlayerStats from './pages/Team/PlayerStats.jsx';
import MatchVote from './pages/Team/MatchVote.jsx';
import Finance from './pages/Team/Finance.jsx';
import Admin from './pages/Team/Admin.jsx';
import Settings from './pages/Settings.jsx';
import Match from './pages/Match.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        {/* 기존 매칭 페이지는 남겨두었습니다. 필요 없다면 지우셔도 됩니다. */}
        <Route path="/match" element={<Match />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/team/stats" element={<PlayerStats />} />
        
        {/* 💡 이 부분의 경로를 /team/match-vote 로 수정했습니다! */}
        <Route path="/team/match-vote" element={<MatchVote />} />
        
        <Route path="/team/finance" element={<Finance />} />
        <Route path="/team/admin" element={<Admin />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;