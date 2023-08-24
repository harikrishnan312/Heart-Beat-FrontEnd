import React, { useState } from 'react'
import './SignUp.css'
import logo from '../../../images/logo.jpeg'
import { Link, useNavigate } from 'react-router-dom'

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conFirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');

  const navigate = useNavigate();


  async function HandleSubmit(e) {
    e.preventDefault()
    if (conFirmPassword == password) {

      const res = await fetch("http://localhost:3000/signUp", {
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
        navigate(`/otp?id=${data.user_id}`)
      } else {
        setError(data.status)
      }
    } else {
      setError('Password doesn,t match')

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
        <p style={{ color: 'grey' }}>:Must have Capital,Small letter,number and {8} digits </p>
        <input onChange={(e) => { setPassword(e.target.value) }} type="password" value={password} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$" required />
        <label className='text'>Confirm Password:</label>
        <input onChange={(e) => { setConfirmPassword(e.target.value) }} type="password" value={conFirmPassword} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$" required />
        <div style={{ textAlign: 'center' }}><button type="submit">Sign Up</button></div>
        <br></br>
        <Link to={('/login')}><p style={{ textAlign: 'center' }}>SignIn</p></Link>
      </form>
      <div style={{ textAlign: 'center' }}><span style={{ color: 'red' }}>{error}</span></div>
    </div>
  )
}

export default SignUp
