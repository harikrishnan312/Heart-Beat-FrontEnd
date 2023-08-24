import React, { useState } from 'react'
import './SignUp.css'
import logo from '../../../images/logo.jpeg'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();


  async function HandleSubmit(e) {
    e.preventDefault()
    const res = await fetch('http://localhost:3000/admin/signUp', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    const data = await res.json();
    if (data.status == 'ok') {
      navigate('/admin/login')
    } else {
      setError(data.status)
    }
  }
  return (
    <div className='container'>
      <div className='logoFrame'><img className='logo' src={logo} alt="" /></div>
      <h1>SignUp</h1>
      <form onSubmit={HandleSubmit}>
        <label className='text'>Email:</label>
        <input onChange={(e) => { setEmail(e.target.value) }} type="email" value={email} required />
        <label className='text'>Password:</label>
        <input onChange={(e) => { setPassword(e.target.value) }} type="password" value={password} pattern="[A-Za-z0-9]+" required />
        <div style={{ textAlign: 'center' }}><button type="submit">Sign Up</button></div>
        <br></br>
      </form>
      <div style={{ textAlign: 'center' }}><span style={{ color: 'red' }}>{error}</span></div>
    </div>
  )
}

export default SignUp
