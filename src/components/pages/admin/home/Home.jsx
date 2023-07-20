import React, { useEffect, useState } from 'react'
import createInstance from '../../../../constants/axiosApi';

import './Home.css'
import Navbar from '../../../navbar/Navbar'
import Table from '../../../table/Tables';
import MyModal from '../../../modal/Modal';
import Footer from '../../../footer/Footer';

function Home() {
  const token = localStorage.getItem('adminToken');

  const [data, setData] = useState();
  const [render, setRender] = useState(true)

  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState();
  const [block, setBlock] = useState();
  const [verified, setVerified] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const openModal = (id, blocked, deletes) => {
    if (deletes) {
      setDeleted(true)
    }
    setBlock(blocked);
    setValue(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = () => {
    const axiosInstance = createInstance(token);
    axiosInstance
      .patch('/admin/home', { token, value, block, deleted })
      .then((response) => {
        console.log(response.data);
        setRender(!render)
        setDeleted(false)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    console.log('Saving changes...');
    closeModal();
  };

  const columns = [
    { Header: 'Name', accessor: '_doc.firstName' },
    { Header: 'Age', accessor: 'age' },
    { Header: 'Email', accessor: '_doc.email' },
    { Header: 'Intersests', accessor: '_doc.interests' },
    // { Header: 'Location', accessor: 'location' },
    {
      Header: 'Actions',
      accessor: (row) => row._doc._id,
      Cell: ({ value, row }) => (
        <div className='actions'>
          {row.original._doc.isVerified ?
            (row.original._doc.isBlocked ? (
              <button className='unblock' onClick={() => openModal(value, false)} >
                Unblock
              </button>
            ) : (
              <button className='block' onClick={() => openModal(value, true)}>
                Block
              </button>
            )) : (<button className='block' onClick={() => openModal(value, true, true)} >
              Delete
            </button>)
          }
        </div>
      ),
    }

  ];

  useEffect(() => {

    async function callBack() {

      const axiosInstance = createInstance(token);
      const params = {
        verified: verified
      };
      axiosInstance
        .get('/admin/home', { params })
        .then((response) => {
          setData(response.data.updatedUsers)
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    }

    callBack()
  }, [render, verified])
  return (
    <div >
      <Navbar lists={['Dashboard', 'Newsfeed', 'Logout']}></Navbar>
      <h1>Users</h1>
      <div style={{ textAlign: 'center' }}><button className='buttonVerified' onClick={() => { setVerified(true) }}>Verified</button>
        <button className='buttonVerified' onClick={() => { setVerified(false) }}>Not Verified</button>
      </div>
      <div style={{ padding: '2em', overflow: 'auto',minHeight:'100vh' }}>{data ? <Table columns={columns} data={data}></Table> : ''}</div>
      <MyModal
        showModal={showModal}
        closeModal={closeModal}
        handleSaveChanges={handleSaveChanges}
      />
      <Footer></Footer>
    </div>
  )
}

export default Home
