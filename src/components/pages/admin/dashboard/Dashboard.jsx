import React from 'react'
import Navbar from '../../../navbar/Navbar'
import Footer from '../../../footer/Footer'

function Dashboard() {
  return (
    <div>
          <Navbar lists={['Dashboard', 'Newsfeed', 'Report', 'Logout']}></Navbar>
      <h1>hy i am there</h1>
          <Footer></Footer>
    </div>
  )
}

export default Dashboard
