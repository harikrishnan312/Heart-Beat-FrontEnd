import { useNavigate } from 'react-router-dom';
import React from 'react';
import img from '../images/404page.gif'


const NotFound = ({user}) => {
    const navigate = useNavigate('')
    return (
        <div style={{textAlign:'center' ,paddingTop:'2em'}}>
            <img className='img-fluid' src={img} alt="404 Not Found" />
            <p onClick={()=>{
                { user ? navigate('/home') : navigate('/admin/home') }
                
            }} style={{cursor:'pointer', color:'blue', padding:'2em'}}>Home</p>
        </div>
    );
};

export default NotFound;
