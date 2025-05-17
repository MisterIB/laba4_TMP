import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './Car.css';

const Car = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [car, setCar] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/cars/${id}`, {
                    withCredentials: true,
                    credentials: 'include'
                });
                setCar(response.data);
            } catch (err) {
                console.error('Ошибка при получении данных автомобиля');
                navigate('/profile');
            }
        };

        if (id) {
            fetchCar();
        }
    }, [id]);

    if (!car) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div className="car-details-container">
            <div className="car-info">
                <h2>Информация об автомобиле</h2>
                <div className="car-data">
                    <p>
                        <strong>Модель:</strong> {car.model}
                    </p>
                    <p>
                        <strong>Номер:</strong> {car.plate}
                    </p>
                    <p>
                        <strong>Цвет:</strong> {car.color}
                    </p>
                </div>
            </div>

            <div className="buttons-container">
                <Link to={`/rc/${car.id}`} className="button">
                    Маршрутный компьютер
                </Link>
                
                <Link to={`/bsc/${car.id}`} className="button">
                    Бортовая система контроля
                </Link>
                
                <Link to={`/mds/${car.id}`} className="button">
                    Измерительные системы
                </Link>
                
                <Link to="/profile" className="button back-button">
                    Назад
                </Link>
            </div>
        </div>
    );
};

export default Car;
