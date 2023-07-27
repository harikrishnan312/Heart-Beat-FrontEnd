import React, { useEffect, useState } from 'react'
import Navbar from '../../../navbar/Navbar'
import Footer from '../../../footer/Footer'
import createInstance from '../../../../constants/axiosApi'

function Dashboard() {
    const [users, setUsers] = useState(0);
    const token = localStorage.getItem('adminToken')
    useEffect(() => {
        async function callBack() {

            const axiosInstance = createInstance(token);

            axiosInstance
                .get('/admin/dashboard')
                .then((response) => {
                    setUsers(response.data.users)
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
                <h1 style={{padding:'3em'}}>Total Users purchased premium : {users}</h1>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default Dashboard
