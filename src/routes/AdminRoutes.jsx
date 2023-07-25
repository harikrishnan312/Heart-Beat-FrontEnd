import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from '../components/pages/admin/signup/SignUp'
import Login from '../components/login/Login'
import Home from '../components/pages/admin/home/Home'
import RequireAdminAuth from '../Auth/RequireAdminAuth'
import NewsFeed from '../components/pages/user/newsFeed/NewsFeed'
import NotFound from '../components/notFound/NotFound'
import Report from '../components/pages/admin/report/Report'


function AdminRoutes() {
  return (

    <Routes>

      <Route element={<RequireAdminAuth />}>
        <Route element={<SignUp></SignUp>} path='/signup'></Route>
        <Route element={<Login role='admin'></Login>} path="/login"></Route>
      </Route>

      <Route element={<RequireAdminAuth logged='true' />}>
        <Route element={<Home></Home>} path='/home'></Route>
        <Route element={<NewsFeed admin={true}></NewsFeed>} path='/newsFeed'></Route>
        <Route element={<Report></Report>} path='/report'></Route>
      </Route>
      <Route element={<NotFound user={false} />} path="*" />
    </Routes>
  )
}

export default AdminRoutes
