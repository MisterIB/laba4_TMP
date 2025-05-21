import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import './Profile.css'
import axios from "axios"

const Profile = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [cars, setCars] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [newCar, setNewCar] = useState({
      model: '',
      plate: '',
      color: '',
      RCmodel: '',
      MDSmodel: '',
      OCSmodel: '',
      userId: user.id
  });
  const [showForm, setShowForm] = useState(false)

    const signOut = async () => {
      try {
        const response = await axios.post('http://217.71.129.139:5735/signout', {}, {withCredentials: true, credentials: 'include'})
        navigate('/')
        const data = await response.json()
      } catch (err) {
        console.log(err)
        alert('Произошла ошибка при выходе из системы')
      }
    }

    const handleAddCar = async () => {
      try {
          const response = await axios.post('http://217.71.129.139:5735/cars', newCar, { withCredentials: true, credentials: 'include' })
          setCars([...cars, response.data])
          setNewCar({ RCmodel: '', MDSmodel: '', OCSmodel: '', model: '', plate: '', color: '', userId: user.id })
          setShowForm(false)
      } catch (err) {
          console.log(err)
          alert('Ошибка при добавлении автомобиля')
      }
  }

  const handleDeleteCar = async (carId) => {
      try {
          const response = await axios.delete('http://217.71.129.139:5735/cars?carId=' + carId, { withCredentials: true, credentials: 'include' })
          setCars(cars.filter(car => car.id !== carId))
      } catch (err) {
          console.log(err)
          alert('Ошибка при удалении автомобиля')
      }
  }

  useEffect(() => {
    const fetchCars = async() => {
        try {
            const response = await axios.get('http://217.71.129.139:5735/cars?userId=' + user.id, { withCredentials: true, credentials: 'include' });
            setCars(response.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
            alert('Ошибка при получении списка автомобилей')
            setLoading(false)
        }
    }

    fetchCars()
}, [])

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
                
                <Link to="/information" className="button">Информация</Link>

                <button className="out-button" onClick={signOut}>Выход</button>
                
                <button className="button" onClick={() => setShowForm(true)}>Добавить автомобиль</button>

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
                      <input type="text" placeholder="Модель маршрутного компьютера" value={newCar.RCmodel} onChange={(e) => setNewCar({...newCar, RCmodel: e.target.value})}/>
                      <input type="text" placeholder="Модель системы измерительных приборов" value={newCar.MDSmodel} onChange={(e) => setNewCar({...newCar, MDSmodel: e.target.value})}/>
                      <input type="text" placeholder="Модель бортовой системы контроля" value={newCar.OCSmodel} onChange={(e) => setNewCar({...newCar, OCSmodel: e.target.value})}/>
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
