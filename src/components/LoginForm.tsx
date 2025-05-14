// src/components/LoginForm.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface LoginFormProps {
    onLoginSuccess: (dados: {
        token: string;
        nome: string;
        email: string;
        id: number;
        tipo_usuario: string;
    }) => void; onLoginFailure: (error: string) => void;  // Callback para o erro do login
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onLoginFailure }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);
        setErrorMessage('');

        // Lógica para enviar a solicitação de login para o backend
        try {
            const response = await fetch('https://andarilho-production.up.railway.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                // Sucesso no login
                onLoginSuccess({
                    token: data.token,
                    nome: data.user.nome,
                    email: data.user.email,
                    id: data.user.id,
                    tipo_usuario: data.user.tipo_usuario
                });
            } else {
                // Erro no login
                setErrorMessage(data.message || 'Erro ao realizar login.');
                onLoginFailure(data.message || 'Erro ao realizar login.');
            }
        } catch (error) {
            setErrorMessage('Erro de conexão com o servidor.');
            onLoginFailure('Erro de conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form">
            <form onSubmit={handleLogin}>
                <h1>Seja Bem-vindo!</h1>

                <div className="input-group">
                    <label htmlFor="email">
                        E-mail:
                    </label>
                    <div className="input-wrapper">

                        <div className='container-icon'>
                            <FontAwesomeIcon icon={faUser} className='icon' />

                        </div>
                        <div className='div-border-input-wrapper'>
                            <div className='border-input-wrapper '>

                            </div>
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Digite seu e-mail"

                        />
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="password">
                        Senha:
                    </label>
                    <div className="input-wrapper">

                        <div className='container-icon'>
                            <FontAwesomeIcon icon={faLock} className='icon' />

                        </div>
                        <div className='div-border-input-wrapper'>
                            <div className='border-input-wrapper '>

                            </div>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            placeholder="Digite sua senha"

                        />
                    </div>
                </div>
                {errorMessage && <p className="error">{errorMessage}</p>}

                <div className='container-button'>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Carregando...' : 'Entrar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
