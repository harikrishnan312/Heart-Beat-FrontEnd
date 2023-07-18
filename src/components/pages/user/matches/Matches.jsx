import React, { useEffect, useState } from 'react'

import Navbar from '../../../navbar/Navbar'
import Footer from '../../../footer/Footer'
import UserCard from '../../../userCard/UserCard'
import createInstance from '../../../../constants/axiosApi'
function Matches() {
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleted, setDeleted] = useState(false)


    const usersPerPage = 8;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const updatePage = () => {
        setDeleted(!deleted)
    }

    const token = localStorage.getItem('token');

    useEffect(() => {
        async function callback() {
            const axiosInstance = createInstance(token);

            axiosInstance
                .get('/matches')
                .then((response) => {
                    const users = response.data.users;
                    setData(users);
                    setLoaded(true);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }
        callback()
    }, [loaded,deleted])

    const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser)

    return (
        <div>
            <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed', 'Messages']} user='true'></Navbar>
            <h1 style={{ color: 'grey', paddingTop: '1em' }}> "Your perfect matches"</h1>
            {loaded ?
                <>
                    <div className='cardContainer row'>

                        {data.length == 0 ? <h1 style={{ color: 'red', fontFamily: 'cursive', paddingTop: '4em', }}>No Matches....</h1> : ''}
                        {currentUsers.map((user, index) => (
                            <div key={index} style={{ padding: '3em' }} className='col-lg-3 col-md-6'><UserCard user={user} like={true} matches={true} update={updatePage}/></div>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="pagination" style={{ padding: '3em' }}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ borderRadius: '1em', border: 'none', backgroundColor: 'grey', margin: '.5em', color: 'white', width: '6em', height: '2em' }}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(data.length / usersPerPage)}
                            style={{ borderRadius: '1em', border: 'none', backgroundColor: 'grey', margin: '.5em', color: 'white', width: '6em', height: '2em' }}
                        >
                            Next
                        </button>
                    </div>
                </> : ''}
            <Footer></Footer>
        </div>
    )
}

export default Matches
