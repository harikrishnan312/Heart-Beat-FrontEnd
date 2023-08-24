import React, { useEffect, useState } from 'react'
import './UserCard.css'
import { AiTwotoneHeart } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { GiSelfLove } from 'react-icons/gi'
import { MdWorkspacePremium } from 'react-icons/md'
import { GiLoveLetter } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import createInstance from '../../constants/axiosApi'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import io from "socket.io-client";
import { useSelector } from 'react-redux'

const EndPoint = "http://localhost:3000";
let socket;


function UserCard({ user, like, match, matches, update }) {
  const users = useSelector((state) => state.user.userData);

  const [liked, setLiked] = useState(like)
  const token = localStorage.getItem('token')
  const navigate = useNavigate('')

  const HandleLike = (id) => {
    const axiosInstance = createInstance(token);
    const updatedLiked = !liked
    setLiked(!liked)
    axiosInstance
      .patch('/profileLike', { id, liked: updatedLiked, match })
      .then((res) => {
        // console.log(res.data);
        !liked?socket = io(EndPoint):''

        !liked?socket.emit("set up", users._id):''

        !liked?socket.emit("like sent", id):'';
        
        if (res.data.status === 'ok' && match) {
          toast.success("It's a perfect match", {
            position: toast.POSITION.TOP_RIGHT
          })
        }
      }).catch((error) => {
        console.error('Error:', error);
      });


  }
  const HandleDelete = (id) => {
    const axiosInstance = createInstance(token);
    axiosInstance
      .patch('/deleteMatch', { id })
      .then((res) => {
        update()
        console.log(res.data);
      }).catch((error) => {
        console.error('Error:', error);
      });

  }



  return (
    <div className="card userCard" style={{
      // backgroundImage: `url(http://localhost:8000/images/${user.image})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#f0f0f0' /* Fallback background color */,

      cursor: 'pointer'
    }} onClick={() => { navigate(`/profile?id=${user._id}&user=${false}`) }}>
      <img src={`http://localhost:3000/images/${user.image}`} alt="" style={{
        borderRadius: '1em', height: '22em', width: '18em', position: 'absolute', zIndex: 1, objectFit: 'cover'
      }} />
      <div className="user-details">

        <h3 className="username"
          style={{ padding: '.5em', color: 'white', position: 'relative', zIndex: 2, fontFamily: 'cursive' }}>{user.firstName}</h3>
        <div style={{
          backgroundColor: 'white',
          width: '18em',
          boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          zIndex: 2,
        }}>
          <GiLoveLetter size={40} color='blue'
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/message?id=${user._id}`)
            }}></GiLoveLetter>
          {matches ?
            <MdDelete size={60} color='red'
              style={{ marginLeft: '2em' }}
              onClick={(e) => {
                e.stopPropagation();
                HandleDelete(user._id)
              }}>
            </MdDelete> :
            <AiTwotoneHeart size={60} color={liked ? 'red' : '#e94057'}
              style={{ marginLeft: '2em' }}
              onClick={(e) => {
                e.stopPropagation();
                HandleLike(user._id)
              }}
            ></AiTwotoneHeart>}

          {/* <GiSelfLove style={{ marginLeft: '2em' }} size={40} color='red'></GiSelfLove> */}
          {user.PremiumPurchased ? <MdWorkspacePremium style={{ marginLeft: '2em' }} size={40} color='gold'></MdWorkspacePremium> : ''
          }
        </div>
      </div>
    </div>
  )
}

export default UserCard
