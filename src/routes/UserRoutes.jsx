import { Route, Routes } from 'react-router-dom'
import LandingPage from '../components/pages/user/landing page/LandingPage'
import Login from '../components/login/Login'
import SignUp from '../components/pages/user/signup/SignUp'
import OTP from '../components/pages/user/otp/OTP'
import ProfileAdd from '../components/pages/user/profileAdd/profileAdd'
import Interest from '../components/pages/user/interest/Interest'
import Home from '../components/pages/user/home/Home'
import RequireUserAuth from '../Auth/RequireUserAuth'
import Profile from '../components/pages/user/profile/Profile'
import Discover from '../components/pages/user/discover/Discover'
import Likes from '../components/pages/user/likes/Likes'
import Matches from '../components/pages/user/matches/Matches'
import NewsFeed from '../components/pages/user/newsFeed/NewsFeed'
import Message from '../components/pages/user/message/Message'
import NotFound from '../components/notFound/NotFound'

function UserRoutes() {
  return (

    <Routes>

      <Route element={<RequireUserAuth />}>
        <Route element={<LandingPage />} path='/'></Route>
        <Route element={<Login role='user' />} path='/login'></Route>
        <Route element={<SignUp></SignUp>} path='/signUp'></Route>
        <Route element={<OTP></OTP>} path='/otp'></Route>
        <Route element={<ProfileAdd></ProfileAdd>} path='/profileAdd'></Route>
        <Route element={<Interest></Interest>} path='/interest'></Route>
      </Route>

      <Route element={<RequireUserAuth logged='true'></RequireUserAuth>}>
        <Route element={<Home></Home>} path='/home'></Route>
        <Route element={<Profile></Profile>} path='/profile'></Route>
        <Route element={<Discover></Discover>} path='/discover'></Route>
        <Route element={<Likes></Likes>} path='/likes'></Route>
        <Route element={<Matches></Matches>} path='/matches'></Route>
        <Route element={<NewsFeed admin={false}></NewsFeed>} path='/newsFeed'></Route>
        <Route element={<Message></Message>}path='/message'></Route>
      </Route>
      <Route element={<NotFound user={true} />} path="*" />

    </Routes>


  )
}

export default UserRoutes
