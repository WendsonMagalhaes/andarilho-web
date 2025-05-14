import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Header />
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ marginLeft: '250px', padding: '20px' }}>
                    <h1>Dashboard</h1>
                    <p>Bem-vindo ao seu dashboard!</p>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
