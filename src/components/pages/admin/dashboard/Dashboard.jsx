import React, { useEffect, useState } from 'react'
import Navbar from '../../../navbar/Navbar'
import Footer from '../../../footer/Footer'
import createInstance from '../../../../constants/axiosApi'

function Dashboard() {
    const [users, setUsers] = useState(0);
    const [premiumUsers,setPremiumUsers] = useState(0)
    const token = localStorage.getItem('adminToken')
    useEffect(() => {
        async function callBack() {

            const axiosInstance = createInstance(token);

            axiosInstance
                .get('/admin/dashboard')
                .then((response) => {
                    setUsers(response.data.users)
                    setPremiumUsers(response.data.premiumUsers)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }

        callBack()
    }, [])
    return (
        <div>
            <Navbar lists={['Dashboard', 'Newsfeed', 'Report', 'Logout']}></Navbar>
            <div style={{ minHeight: '90vh' }}>
                <p style={{ paddingLeft: '3em', paddingTop: '3em', color: 'grey', fontWeight: 'bold', fontSize: '2em' }} >Total Users purchased premium : <span style={{color:'red'}}>{premiumUsers} </span>users</p>
                <p style={{ paddingLeft: '3em', color: 'grey', fontWeight: 'bold', fontSize: '2em' }}>Total Users : <span style={{ color: 'red' }}>{users} </span>users</p>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Dashboard
