import React, { useState } from 'react'
import baseApiCall from '../../../../constants/fetchApi';

import logo from '../../../images/logo.jpeg'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../spinner/Spinner';

function OTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, Setloading] = useState(false)
  const navigate = useNavigate()

  var url_string = window.location.href;
  var url = new URL(url_string);
  var id = url.searchParams.get("id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    Setloading(true)


    let options = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      }, body: JSON.stringify({
        otp,
        id
      })
    }

    const data = await baseApiCall('otp', options);


    if (data.status == 'ok') {

      setTimeout(() => {
        Setloading(false)
        toast.success('Successfully verified', {
          position: toast.POSITION.TOP_RIGHT
        })
        navigate(`/profileAdd?id=${id}`);
      }, 2000)

    } else {
      setTimeout(() => {
        Setloading(false)
        setError(data.status);
      }, 2000)

    }
  }

  const Resend = async () => {

    let options = {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      }, body: JSON.stringify({
        id
      })
    }

    const data = await baseApiCall('resend', options);

    console.log(data.status);
  }
  return (
    <div className='container'>
      <div className='logoFrame'><img className='logo' src={logo} alt="" /></div>
      <h1>OTP</h1>
      <form onSubmit={handleSubmit} >
        <label className='text'>OTP:</label>
        <input type="number" value={otp} onChange={(e) => { setOtp(e.target.value) }} required />

        <div style={{ textAlign: 'center' }}><button type="submit">Verify</button></div>
        <br></br>
      </form>
      <p onClick={Resend} style={{ textAlign: 'center', color: '#e94057', cursor: 'pointer' }}>Resend</p>
      <div style={{ textAlign: 'center' }}><span style={{ color: 'red' }}>{error}</span></div>
      {loading ? <Spinner></Spinner> : ''}
    </div>
  )
}

export default OTP
