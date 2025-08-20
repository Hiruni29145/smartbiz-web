import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from '../page/Login/Login'
import Dashboard from '../page/Dashboard/Dashboard'
import UserPage from '../page/UserPage/UserPage'
import Home from '../page/Home/Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Login/> */}
      {/* <Dashboard/> */}
     {/* <UserPage/> */}
     <Home/>
      {/* <EmployeePage/> */}
    </>
  )
}

export default App
