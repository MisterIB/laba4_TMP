import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import './Profile.css'
import axios from "axios"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [cars, setCars] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [newCar, setNewCar] = useState({
      model: '',
      plate: '',
      color: '',
      userId: user.id
  });
  const [showForm, setShowForm] = useState(false);

    const signOut = async () => {
      try {
        const response = await axios.post('http://localhost:5000/signout', {}, {withCredentials: true, credentials: 'include'})
        navigate('/')
        const data = await response.json()
        if (data.error) throw data.message
      } catch (err) {
        toast.error(err.message || 'Произошла ошибка при выходе из системы');
      }
    }

    const handleAddCar = async () => {
      try {
          const response = await axios.post('http://localhost:5000/cars', newCar, {
              withCredentials: true,
              credentials: 'include'
          });
          setCars([...cars, response.data]);
          setNewCar({ model: '', plate: '', color: '', userId: user.id });
          setShowForm(false);
          toast.success('Автомобиль успешно добавлен');
      } catch (err) {
          toast.error(err.message || 'Ошибка при добавлении автомобиля');
      }
  };

  const handleDeleteCar = async (carId) => {
      try {
          const response = await axios.delete(`http://localhost:5000/cars/${carId}`, {
              withCredentials: true,
              credentials: 'include'
          });
          setCars(cars.filter(car => car.id !== carId));
          toast.success('Автомобиль успешно удален');
      } catch (err) {
          toast.error(err.message || 'Ошибка при удалении автомобиля');
      }
  };

  useEffect(() => {
    const fetchCars = async() => {
        try {
            const response = await axios.post('http://localhost:5000/cars', {"userId": user.id}, { params: {userId: user.id}, withCredentials: true, credentials: 'include' });
            setCars(response.data);
            setLoading(false)
            console.log("Данные загружены: ", response.data);
        } catch (err) {
          toast.error(err.message || 'Ошибка при получении списка автомобилей');
            setLoading(false);
        }
    };

    fetchCars();
}, []);

    return (
        <div className="profile-container">
          {user ? (
            <div>
              <h2>Профиль пользователя</h2>
              <div className="user-info">
                <p>
                  <strong>Имя пользователя:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
              
              <div className="buttons">
                <Link to="/details" className="button">Автомобиль</Link>
                
                <Link to="/information" className="button">Информация</Link>

                <button className="button" onClick={() => setShowForm(true)}>Добавить автомобиль</button>

                <button onClick={signOut}>Выход</button>

              </div>
              <h3>Ваши автомобили</h3>
                    <div className="cars-list">
                        {cars ? (
                            cars.map(car => (
                                <div key={car.id} className="car-item">
                                    <Link to={`/car/${car.id}`}>
                                        <p>
                                            <strong>Модель:</strong> {car.model}
                                        </p>
                                        <p>
                                            <strong>Номер:</strong> {car.plate}
                                        </p>
                                    </Link>
                                    <button className="delete-button" onClick={() => handleDeleteCar(car.id)}>Удалить</button>
                                </div>
                            ))
                        ) : (
                            <p>У вас пока нет автомобилей</p>
                        )}
                    </div>

                    {showForm && (
                    <div className="add-car-form">
                      <h3>Добавить новый автомобиль</h3>
                      <input type="text" placeholder="Модель" value={newCar.model} onChange={(e) => setNewCar({...newCar, model: e.target.value})}/>
                      <input type="text" placeholder="Номер" value={newCar.plate} onChange={(e) => setNewCar({...newCar, plate: e.target.value})}/>
                      <input type="text" placeholder="Цвет" value={newCar.color} onChange={(e) => setNewCar({...newCar, color: e.target.value})}/>
                      <div className="form-buttons">
                        <button className="button" onClick={handleAddCar}>Сохранить</button>
                        <button className="button cancel" onClick={() => setShowForm(false)}>Отменить</button>
                      </div>
                    </div>
                    )}
                </div>
          ) : (
            <p>Пользователь не найден</p>
          )}
        </div>
      );
}

export default Profile
