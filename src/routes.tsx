import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dasboard';
import Login from './pages/Login/Login';
import RecordPoint from './pages/RecordPoint/RecordPoint';
import History from './pages/History/History';

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ponto" element={<RecordPoint />} />
                <Route path="/historico" element={<History />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
