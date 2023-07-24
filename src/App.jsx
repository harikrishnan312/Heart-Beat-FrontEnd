import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRoutes from "./routes/UserRoutes"
import AdminRoutes from './routes/AdminRoutes'
import { ToastContainer } from 'react-toastify'
import './App.css'
import Loading from "./components/loading/Loading"



function App() {
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      setTimeout(() => {
         setLoading(false)
      }, 1500);
   },[])
   return (<>{loading ? <Loading /> :
      <Router>
         <ToastContainer />
         <Routes>
            <Route element={<AdminRoutes />} path="/admin/*" />
            <Route element={<UserRoutes />} path="/*" />
         </Routes>
      </Router>
   }
   </>
   )
}

export default App
