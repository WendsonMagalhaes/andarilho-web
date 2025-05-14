import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css'
import Logo from '../../assets/logo-01.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/login': 'Login',
    '/ponto': 'Registrar Ponto',
    '/historico': 'Histórico',
    // adicione outros mapeamentos conforme suas rotas
};

const Header: React.FC = () => {
    const location = useLocation();
    const title = routeTitles[location.pathname] || '';
    const [nomeUsuario, setNomeUsuario] = useState<string>('');

    useEffect(() => {
        console.log(localStorage)
        const nome = localStorage.getItem('nome');
        if (nome) setNomeUsuario(nome);
    }, []);

    return (
        <header className="header">
            <div className="container-logo">
                <Link to="/">
                    <img src={Logo} alt="Logo" className="logo" />
                </Link>
            </div>
            <h1>{title}</h1>
            <div className="container-usuario">
                <FontAwesomeIcon icon={faCircleUser} className='icon' />
                <p>{nomeUsuario || 'Usuário'}</p>
            </div>
        </header>
    );
};

export default Header;
