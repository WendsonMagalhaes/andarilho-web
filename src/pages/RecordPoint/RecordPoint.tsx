import React, { useState, useEffect } from 'react';
import './RecordPoint.css';
import MapaLocalizacao from '../../components/MapLocation/MapLocation';
import Sidebar from '../../components/Sidebar/Sidebar'
import Header from '../../components/Header/Header';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot,
    faMapLocation,
    faMapLocationDot,
    faCircle,

} from '@fortawesome/free-solid-svg-icons';

const tiposMarcacao = [
    { value: 'entrada', label: 'Início da Jornada' },
    { value: 'saida', label: 'Fim da Jornada' },
    { value: 'entrada_pausa_descanso', label: 'Pausa Descanso - Entrada' },
    { value: 'saida_pausa_descanso', label: 'Pausa Descanso - Retorno' },
    { value: 'entrada_pausa_almoco', label: 'Pausa Almoço - Entrada' },
    { value: 'saida_pausa_almoco', label: 'Pausa Almoço - Retorno' },
];
const usuario_id = localStorage.getItem('id');

const RecordPoint: React.FC = () => {
    const [tipo, setTipo] = useState<string>(tiposMarcacao[0].value);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [endereco, setEndereco] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [_registros, setRegistros] = useState<any[]>([]);

    const [marcacoes, setMarcacoes] = useState({
        entrada: '--:--',
        entrada_pausa_descanso: '--:--',
        saida_pausa_descanso: '--:--',
        entrada_pausa_almoco: '--:--',
        saida_pausa_almoco: '--:--',
        saida: '--:--',
    });




    const getLocation = (): Promise<{
        lat: number;
        lng: number;
        endereco: string;
    }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalização não suportada pelo navegador.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                        const response = await fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`
                        );
                        const data = await response.json();

                        if (data.status === 'OK' && data.results.length > 0) {
                            resolve({
                                lat: latitude,
                                lng: longitude,
                                endereco: data.results[0].formatted_address,
                            });
                        } else {
                            reject(new Error('Não foi possível obter o endereço.'));
                        }
                    } catch (err) {
                        reject(new Error('Erro ao buscar o endereço.'));
                    }
                },
                (err) => {
                    reject(new Error(`Erro ao obter localização: ${err.message}`));
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    };


    const fetchRegistrosPorData = async (usuarioId: number, data: string): Promise<any[]> => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://andarilho-production.up.railway.app/registros-ponto/registros/${usuarioId}?data=${data}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });

            const dataRes = await response.json();

            if (response.ok) {
                setRegistros(dataRes); // ainda pode manter isso
                return dataRes; // <- aqui está a correção
            } else {
                console.error('Erro ao buscar registros:', dataRes.error);
                return []; // ou lançar erro, dependendo do que você prefere
            }
        } catch (error) {
            console.error('Erro ao fazer requisição:', error);
            return [];
        }
    };

    const preencherMarcacoes = (registros: any[]) => {
        const novaMarcacao = { ...marcacoes };  // Copia o estado atual para evitar mutação direta

        registros.forEach((registro) => {
            const hora = new Date(registro.data_hora).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            });

            switch (registro.tipo_marcacao) {
                case 'entrada':
                    novaMarcacao.entrada = hora;
                    break;
                case 'entrada_pausa_descanso':
                    novaMarcacao.entrada_pausa_descanso = hora;
                    break;
                case 'saida_pausa_descanso':
                    novaMarcacao.saida_pausa_descanso = hora;
                    break;
                case 'entrada_pausa_almoco':
                    novaMarcacao.entrada_pausa_almoco = hora;
                    break;
                case 'saida_pausa_almoco':
                    novaMarcacao.saida_pausa_almoco = hora;
                    break;
                case 'saida':
                    novaMarcacao.saida = hora;
                    break;
                default:
                    break;
            }
        });

        setMarcacoes(novaMarcacao);  // Atualiza o estado com os novos valores
    };




    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {


            const token = localStorage.getItem('token');
            const response = await fetch('https://andarilho-production.up.railway.app/registros-ponto/registrar-ponto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    usuario_id: usuario_id,
                    tipo_marcacao: tipo,
                    data_hora: new Date().toISOString(),
                    latitude: lat,
                    longitude: lng,
                    endereco,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                updateData();
            } else {
                setError(data.message || 'Erro ao registrar ponto.');
            }
        } catch (err: any) {
            setError(err.message || 'Erro inesperado.');
        } finally {
            setLoading(false);
        }
    };
    const updateData = async () => {
        const usuarioId = Number(localStorage.getItem('id'));
        const dataAtual = new Date().toISOString().split('T')[0];

        // Atualiza os registros da mesma maneira
        const registros = await fetchRegistrosPorData(usuarioId, dataAtual);

        // Atualiza a UI com os novos registros
        preencherMarcacoes(registros);
    };

    const getPrimeiraMarcacaoVazia = () => {
        const ordemMarcacoes = [
            'entrada',
            'entrada_pausa_descanso',
            'saida_pausa_descanso',
            'entrada_pausa_almoco',
            'saida_pausa_almoco',
            'saida'
        ];

        for (const tipo of ordemMarcacoes) {
            if (marcacoes[tipo as keyof typeof marcacoes] === '--:--') {
                return tipo;
            }
        }

        return null; // todas preenchidas
    };
    useEffect(() => {
        const proxima = getPrimeiraMarcacaoVazia();
        if (proxima) setTipo(proxima);
    }, [marcacoes]);

    useEffect(() => {
        const fetchLocation = async () => {
            const { lat, lng, endereco } = await getLocation();
            setLat(lat);
            setLng(lng);
            setEndereco(endereco);
        };
        fetchLocation();

        updateData();
    }, []);

    return (
        <div>
            <Header />
            <div className="record-point-container">
                <Sidebar />
                <main>
                    <MapaLocalizacao />

                    <div className="map-overlay-button">
                        <button onClick={handleSubmit} disabled={loading} className="round-button">
                            {loading ? 'Registrando...' : 'Registrar Ponto'}
                        </button>
                    </div>
                    {error && <p className="error">{error}</p>}

                    <div className='container-location-info'>
                        {lat !== null && lng !== null && (
                            <div className="location-info">
                                <p><FontAwesomeIcon icon={faLocationDot} className='icon' /> {endereco}</p>
                                <div className='location-info-lat-lng'>
                                    <p><FontAwesomeIcon icon={faMapLocationDot} className='icon' /> {lat.toFixed(8)}</p>
                                    <p> <FontAwesomeIcon icon={faMapLocation} className='icon' /> {lng.toFixed(8)}</p>
                                </div>
                                <p> <FontAwesomeIcon icon={faCircle} className='icon' /> {tiposMarcacao.find(item => item.value === tipo)?.label || ''}</p>

                            </div>
                        )}
                    </div>


                    <div className="marking-point-container">
                        <div className="date-header">
                            {new Date().toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </div>

                        <div className="marking-grid">
                            <div className="pause">Início da Jornada: {marcacoes.entrada}</div>
                            <div className="pause">Pausa Descanso - Entrada: {marcacoes.entrada_pausa_descanso}</div>
                            <div className="pause">Pausa Descanso - Retorno: {marcacoes.saida_pausa_descanso}</div>
                            <div className="pause">Pausa Almoço - Entrada: {marcacoes.entrada_pausa_almoco}</div>
                            <div className="pause">Pausa Almoço - Retorno: {marcacoes.saida_pausa_almoco}</div>
                            <div className="pause">Fim da Jornada: {marcacoes.saida}</div>
                        </div>



                    </div>


                </main>
            </div >
        </div >

    );
};

export default RecordPoint;
