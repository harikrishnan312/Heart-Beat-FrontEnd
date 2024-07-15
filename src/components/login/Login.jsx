import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'
import logo from '../images/logo.jpeg'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import baseApiCall from '../../constants/fetchApi';

function Login({ role }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [id, setId] = useState('')

  const navigate = useNavigate();

  const HandleUserSubmit = async (e) => {
    e.preventDefault();

    let options = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      }, body: JSON.stringify({
        email,
        password
      })
    }

    const data = await baseApiCall('login', options);

    if (data.status == 'ok') {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      toast.success('Login Successfull', {
        position: toast.POSITION.TOP_RIGHT
      })
      navigate('/home')

    } else if (data.status == 'addProfile') {
      setId(data.user);
      setError('Complete profile to login')
    }
    else if (data.status == 'Verification failed complete your registration') {
      setId(data.user)
      setError(data.status)
    }
    else {
      setError(data.status)
    }
  }

  const HandleAdminSubmit = async (e) => {
    e.preventDefault();

    let options = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      }, body: JSON.stringify({
        email,
        password
      })
    }

    const data = await baseApiCall('admin/login', options);

    if (data.status == 'ok') {
      localStorage.setItem('adminToken', data.token);

      navigate('/admin/home')

    }
    else {
      setError(data.status)
    }
  }
  return (
    <div className='container'>
      <div className='logoFrame'><img className='logo' src={logo} alt="" /></div>
      <h1>{role == 'user' ? 'Login' : 'Admin Login'}</h1>
      <form onSubmit={role == 'user' ? HandleUserSubmit : HandleAdminSubmit} >
        <label className='text'>Email:</label>
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
        <label className='text'>Password:</label>
        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }}  required />
        <button type="submit">Login</button>
        <br></br>
        {role == 'user' ? <Link to={('/signUp')}><p style={{ textAlign: 'center' }}>SignUp</p></Link> : ''}
      </form>
      <div style={{ textAlign: 'center' }}><span style={{ color: 'red' }}>{error}</span>
        <p>{error == 'Verification failed complete your registration' ? <a onClick={() => { navigate(`/otp?id=${id}`) }} style={{ color: 'blue', cursor: 'pointer' }}>Click here to complete verificaction</a> : ''}</p>
        <p>{error == 'Complete profile to login' ? <a onClick={() => { navigate(`/profileAdd?id=${id}`) }} style={{color:'blue',cursor:'pointer'}}>Click here to complete your profile</a> : ''}</p>
      </div>
    </div>
  )
}

export default Login
