// src/pages/Login.tsx

import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import './Login.css'

import Logo from '../../assets/logo.png'

const Login: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [nome, setNome] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [id, setId] = useState<number | null>(null);
    const [tipoUsaurio, setTipoUsuario] = useState<string | null>(null);


    const navigate = useNavigate();

    const handleLoginSuccess = (data: {
        token: string;
        nome: string;
        email: string;
        id: number;
        tipo_usuario: string;
    }) => {
        // Armazenar o token no localStorage ou em outro lugar adequado
        localStorage.setItem('token', data.token);
        localStorage.setItem('nome', data.nome);
        localStorage.setItem('email', data.email);
        localStorage.setItem('id', String(data.id));
        localStorage.setItem('tipo usuario', data.tipo_usuario);

        setToken(token);
        setNome(nome);
        setEmail(email);
        setId(id);
        setTipoUsuario(tipoUsaurio)
        navigate('/dashboard');  // Redirecionar para o dashboard após login
    };

    const handleLoginFailure = (_error: string) => {
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <img src={Logo} alt="Logo" className="logo" />
                <h1>Andarilho</h1>
                <p>Marcar <strong>ponto</strong> nunca foi tão <strong>livre</strong>.
                    No seu <strong>tempo</strong>, no seu <strong>caminho</strong>.</p>
                <LoginForm onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
            </div>
        </div>
    );
};

export default Login;
