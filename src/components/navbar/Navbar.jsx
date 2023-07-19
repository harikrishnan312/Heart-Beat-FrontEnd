import React, { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg'
import './Navbar.css'
import { useNavigate } from 'react-router-dom';


function Navbar({ lists, user }) {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const handleItemClick = () => {
      setCollapsed(true);
    };

    const listItems = document.querySelectorAll('.navbar-nav .nav-link');

    listItems.forEach((item) => {
      item.addEventListener('click', handleItemClick);
    });

    return () => {
      listItems.forEach((item) => {
        item.removeEventListener('click', handleItemClick);
      });
    };
  }, []);

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav className={`navbar navbar-expand-lg bg-body-tertiary ${collapsed ? 'collapsed' : ''}`}>
      <div className="container-fluid" style={{ backgroundColor: '#e94057', height: '5em' }}>
        <a style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5em', cursor: 'pointer' ,marginRight:'2em'}} className="navbar-brand" onClick={() => {
          user ? navigate('/home') : navigate('/admin/home')
        }}>
          Heart Beat
        </a>
        <button style={{ color: 'white' }}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={!collapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon" ></span>
        </button>
        <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`} id="navbarNav" style={{ float: 'right' }}>
          <ul className="navbar-nav" style={{ gap: '3em', paddingLeft: '3em', backgroundColor: '#e94057', alignItems: 'center', borderRadius: '1em', width: '15em' }}>
            <li className="nav-item">
              <a style={{ color: 'white', fontSize: '1.2em' }} className="nav-link active" aria-current="page" onClick={() => {
                user ? navigate('/home') : navigate('/admin/home')
              }}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a style={{ color: 'white', fontSize: '1.2em' }} className="nav-link" onClick={() => { user ? navigate('/discover') : '' }}>
                {lists[0]}
              </a>
            </li>
            <li className="nav-item">
              <a style={{ color: 'white', fontSize: '1.2em' }} className="nav-link" onClick={() => { user ? navigate('/matches') : navigate('/admin/newsFeed') }}>
                {lists[1]}
              </a>
            </li>
            <li className="nav-item">
              <a onClick={() => {
                if (!user) {
                  localStorage.removeItem('adminToken');
                  navigate('/admin/login');
                } else {
                  navigate('/likes')
                }
              }} style={{ color: 'white', fontSize: '1.2em' }} className="nav-link">
                {lists[2]}
              </a>
            </li>
            <li className="nav-item">
              <a style={{ color: 'white', fontSize: '1.2em' }} className="nav-link" onClick={() => {
                if (user) {
                  navigate('/newsFeed')
                }
              }}>
                {lists[3] ? lists[3] : ''}
              </a>
            </li>

            {user ? (
              <li>
                <a style={{ color: 'white', fontSize: '1.2em' }} className="nav-link" onClick={() => { user ? navigate('/message') : '' }}>
                  {lists[4]}
                </a>
              </li>
            ) : (
              ''
            )}
            {user ? (
              <li>
                <div onClick={() => { navigate('/profile') }} className="nav-link" style={{ marginLeft: 'auto', marginRight: '1em', textAlign: 'center' }}>
                  <CgProfile size={30} color="white" />
                  <span style={{ color: 'white', fontSize: '1.2em' }}>Profile</span>
                </div>
              </li>
            ) : (
              ''
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar

