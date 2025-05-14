// src/components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faClock,
    faHistory,
    faUserPlus,
    faUsers,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/logo-01.png';
import './Sidebar.css';

interface JwtPayload {
    userId: string;
    tipo_usuario: 'admin' | 'supervisor' | 'colaborador';
    iat: number;
    exp: number;
}

interface MenuItem {
    to: string;
    icon: any;
    text: string;
    roles: JwtPayload['tipo_usuario'][];
}

const menuItems: MenuItem[] = [
    { to: '/dashboard', icon: faTachometerAlt, text: 'Dashboard', roles: ['admin', 'supervisor', 'colaborador'] },
    { to: '/ponto', icon: faClock, text: 'Registrar Ponto', roles: ['admin', 'supervisor', 'colaborador'] },
    { to: '/historico', icon: faHistory, text: 'Histórico', roles: ['admin', 'supervisor', 'colaborador'] },
    { to: '/usuarios/criar', icon: faUserPlus, text: 'Criar Usuário', roles: ['admin'] },
    { to: '/ajustar-ponto', icon: faEdit, text: 'Ajustar Ponto', roles: ['admin', 'supervisor'] },
    { to: '/funcionarios', icon: faUsers, text: 'Todos Funcionários', roles: ['admin', 'supervisor'] },
];

const Sidebar: React.FC = () => {
    const token = localStorage.getItem('token') || '';
    let tipoUsuario: JwtPayload['tipo_usuario'] = 'colaborador';
    try {
        const payload = jwtDecode<JwtPayload>(token);
        tipoUsuario = payload.tipo_usuario;
    } catch {
        // token inválido ou ausente → assume colaborador
    }

    const itensVisiveis = menuItems.filter(item =>
        item.roles.includes(tipoUsuario)
    );

    return (
        <nav className="sidebar">
            <div className="container-logo">
                <img src={Logo} alt="Logo" className="logo" />
            </div>
            <ul className="sidebar-options">
                {itensVisiveis.map(({ to, icon, text }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            className={({ isActive }) =>
                                isActive ? 'sidebar-link active' : 'sidebar-link'
                            }
                        >
                            <FontAwesomeIcon icon={icon} className="sidebar-icon" />
                            <span className="sidebar-text">{text}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;
