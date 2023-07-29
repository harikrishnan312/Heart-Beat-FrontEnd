import React, { useEffect, useState } from 'react'
import createInstance from '../../../../constants/axiosApi';
import Navbar from '../../../navbar/Navbar';
import Footer from '../../../footer/Footer';
import Table from '../../../table/Tables';
import MyModal from '../../../modal/Modal';
import './Report.css'


function Report() {
    const token = localStorage.getItem('adminToken');
    const [data, setData] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState();
    const [block, setBlock] = useState();
    const [render, setRender] = useState(true)


    const columns = [
        { Header: 'Name', accessor: 'userId.firstName' },
        { Header: 'No.of users reported', accessor: 'count' },
        {
            Header: 'Actions',
            accessor: (row) => row.userId._id,
            Cell: ({ value, row }) => (
                <div className='actions'>
                   
                        {(row.original.userId.isBlocked ? (
                            <button className='unblock' onClick={() => openModal(value, false)} >
                                Unblock
                            </button>
                        ) : (
                            <button className='block' onClick={() => openModal(value, true)}>
                                Block
                            </button>
                        )) }
                </div>
            ),
        }

    ];
    const openModal = (id, blocked) => {
 
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
            .patch('/admin/home', { token, value, block })
            .then((response) => {
                console.log(response.data);
                setRender(!render)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        console.log('Saving changes...');
        closeModal();
    };
    useEffect(() => {
        const axiosInstance = createInstance(token);

        axiosInstance.get('/admin/report').then((res) => {
            setData(res.data.user)
        })
    }, [render])
    return (
        <div>
            <Navbar lists={['Dashboard', 'Newsfeed', 'Report', 'Logout']}></Navbar>
            <div style={{ padding: '2em', overflow: 'auto', minHeight: '100vh' }} className='report'>{data.length>0 ? <Table columns={columns} data={data}></Table> : <h1>No Users Reported</h1>}</div>
            <MyModal
                showModal={showModal}
                closeModal={closeModal}
                handleSaveChanges={handleSaveChanges}
            />
            <Footer></Footer>
        </div>
    )
}

export default Report
