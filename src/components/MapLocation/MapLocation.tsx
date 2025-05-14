// src/components/MapLocation.tsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import './MapLocation.css'
const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '10px',
    border: '5px solid #1E56A0',
};

const MapLocation: React.FC = () => {
    const [localizacao, setLocalizacao] = useState<{ lat: number; lng: number } | null>(null);
    const [dataHora, setDataHora] = useState<{ data: string; hora: string }>({ data: '', hora: '' });


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocalizacao({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.error("Erro ao obter localização:", error);
            }
        );

        const atualizarDataHora = () => {
            const agora = new Date();

            const opcoesData: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            };

            const opcoesHora: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            };

            const data = agora.toLocaleDateString('pt-BR', opcoesData);
            const hora = agora.toLocaleTimeString('pt-BR', opcoesHora);

            setDataHora({ data, hora });
        };
        atualizarDataHora();
        const intervalo = setInterval(atualizarDataHora, 1000);

        return () => clearInterval(intervalo);
    }, []);

    if (!isLoaded) return <p>Carregando mapa...</p>;
    if (!localizacao) return <p>Obtendo localização...</p>;

    return (
        <div className="map-container">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={localizacao}
                zoom={16}
            >
                <Marker position={localizacao} />

            </GoogleMap>

            <div className="map-overlay-datetime">
                <p className="datetime-time">{dataHora.hora}</p>
                <p className="datetime-date">{dataHora.data}</p>

            </div>

        </div>
    );
};

export default MapLocation;
