import React from 'react'
import { Link } from "react-router-dom";
import './LandingPage.css'
import pic from "../../../images/landing.jpeg"


function LandingPage() {
  return (
    <>
      <div className='row' style={{ width:'100%',display: 'flex', justifyContent: 'center', paddingTop: '5em', alignItems: 'center', gap: '2em' }}>
        <img className='img images' src={pic} alt="" />
        <div className='carousel '>
          <div id="carouselExampleCaptions" className="carousel slide">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src={pic} className="d-block w-100" alt="..." style={{ borderRadius: '2em' }} />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Matches</h5>
                  <p>We match you with people that have a
                    large array of similar interests.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src={pic} className="d-block w-100" alt="..." style={{ borderRadius: '2em' }} />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Premium</h5>
                  <p>Sign up today and enjoy the first month
                    of premium benefits on us.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src={pic} className="d-block w-100" alt="..." style={{ borderRadius: '2em' }} />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Matches</h5>
                  <p>We match you with people that have a
                    large array of similar interests.</p>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <img className='img' src={pic} alt="" />
      </div>
      <br />
      <br />
      <div className='buttonClass' >
        <Link to={('/signUp')}><button className='create'>Create an account </button></Link>
        <br />
        <br />
        <p style={{ fontSize: '1em' }}>Already have an account? <Link to={('/login')}>Sign In</Link></p>
      </div>
    </>
  )
}

export default LandingPage
