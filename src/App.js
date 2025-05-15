import React from "react"
import { BrowserRouter, Router, Routes, Route } from "react-router-dom"
import CarDetails from "./pages/carDetails"
import PasswordReset from "./pages/PasswordReset"
import Profile from "./pages/Profile"
import Information from "./pages/Information"
import Detail from "./pages/Detail"
import Form from "./pages/Form"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/details" element={<CarDetails />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/information" element={<Information />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/add" element={<Form />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
