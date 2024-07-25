import React, { useEffect, useState } from 'react'
import './Home.css'

import io from "socket.io-client";



import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../../../redux/userData';

import Navbar from '../../../navbar/Navbar';
import SlideComponent from '../../../spring/Animated';
import SpringComponent2 from '../../../spring/Anmated2';
import img1 from '../../../images/01.png'
import img2 from '../../../images/02.png'
import img3 from '../../../images/03.png'
import Card from '../../../card/Card';
import card1 from '../../../images/card1.png';
import card2 from '../../../images/card2.png';
import card3 from '../../../images/card3.png';
import card4 from '../../../images/card4.png';
import Footer from '../../../footer/Footer';
import createInstance from '../../../../constants/axiosApi';
import handlePayment from '../../../../constants/razorPay';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const EndPoint = "https://heart-beat-backend.onrender.com";
let socket;

function Home() {
  const user = useSelector((state) => state.user.userData);


  const dispatch = useDispatch(null);



  useEffect(() => {

    async function callBack() {

      const token = localStorage.getItem('token');

      const axiosInstance = createInstance(token);

      axiosInstance
        .get('/home')
        .then((response) => {
          const data = response.data;
          if (data) {
            dispatch(setUserData(data.user))
          }

        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    callBack()
  }, [])
  useEffect(() => {
    socket = io(EndPoint);

    user ? socket.emit("set up", user._id) : ''
  }, [])

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {

      toast(`New Message Recieved..............
       ${newMessageRecieved.sender.firstName}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      dispatch(setNotification('new'));

    })
    socket.on("like received", () => {
      console.log("hy i liked u");
      toast("Somebody Likes You...", {
        position: toast.POSITION.TOP_RIGHT
      })

    })

  })
  return (
    <div>
      <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed', 'Messages']} user='true'></Navbar>


      <div className='row'>
        <div className='col-md-12 header1'><span >It All Starts With A Date</span></div>
        <div className='col-md-12 para1'><p>Learn from them and try to make it to this board. This will for sure boost you visibility and increase your chances to find you loved one.</p></div>

        <div className='col-md-6 animation' style={{ padding: '1em', textAlign: 'center' }}>
          <SlideComponent></SlideComponent>
        </div>
        <div className='col-md-6 notes' style={{ padding: '1em', textAlign: 'center' }}>
          <br />
          <br />
          <img className='img-fluid' src={img1} alt="" />
          <br />
          <br />
          <img className='img-fluid' src={img2} alt="" />
          <br />
          <br />
          <img className='img-fluid' src={img3} alt="" />
        </div>
        <div className='col-md-6' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{ fontSize: '1.5em', fontWeight: 'bold', width: '15em' }}>Upgrade your dating experience with our premium membership! Only 599/-</p>
          <button style={{ backgroundColor: '#e94057', borderRadius: '1em', color: 'white', width: '10em', height: '3em', fontWeight: 'bold', alignContent: 'center', border: 'none' }} onClick={handlePayment}>Premium</button>
          <br /><br />
        </div>
        <div className='col-md-6' >
          <SpringComponent2></SpringComponent2>
        </div>
        <div className='col-md-12 header1'><span >Take a leap into the world of online dating.</span></div>
        <div className='col-md-12 para1'><p>Start your romantic journey with our Dating Platform....</p></div>
        <div className='col-md-12 row' >
          <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Members in total' imageUrl={card1} color='red'></Card></div>
          <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Members Online' imageUrl={card2} color='lightgreen'></Card></div>
          <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Mens Online' imageUrl={card3} color='violet'></Card></div>
          <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Women Online' imageUrl={card4} color='blue'></Card></div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default Home
