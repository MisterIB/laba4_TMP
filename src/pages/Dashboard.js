import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import SignInRegister from "./SignUp"

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  /*const fetchPosts = async () => {
    try {
      const response = await fetch('/posts')
      
      const data = await response.json()
      if (data.error) throw data.message
      
      setPosts(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])*/

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/register', {username, email, password}, {withCredentials: true, credentials: 'include'})
      const data = await response()
      if (data.error) throw data.message
      
      signIn(username, password)
    } catch (err) {
      console.log(err)
    }
  }
  
  const signIn = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/signin', {username, password}, {withCredentials: true, credentials: 'include'})
      setUser(response.data)
      localStorage.clear('user')
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (err) {
      console.log(err)
    }
  }
  
  const signOut = async () => {
    try {
      const response = await fetch('/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()
      if (data.error) throw data.message
      
      setUser(null)
    } catch (err) {
      console.log(err)
    }
  }
  
  return (
    <div className="App">
      {
        user === null ?
        <SignInRegister
          signIn={signIn}
          register={register}
        />
        : navigate('/profile')//<p>Welcome, {user.username}! <button onClick={e => signOut()}>Sign Out</button> <Link to="/car">Home</Link></p>
      }
    </div>
  )
}

export default Dashboard;
