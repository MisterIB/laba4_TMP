import React from "react"
import { Link } from "react-router-dom"
import './Profile.css'

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'))
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
                <Link to="/details" className="button">
                  Автомобиль
                </Link>
                
                <Link to="/information" className="button">
                  Информация
                </Link>
              </div>
            </div>
          ) : (
            <p>Пользователь не найден</p>
          )}
        </div>
      );
}

export default Profile
