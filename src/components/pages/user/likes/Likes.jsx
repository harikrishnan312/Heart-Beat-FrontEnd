import React, { useEffect, useState } from 'react'
import './Likes.css'

import Navbar from '../../../navbar/Navbar'
import Footer from '../../../footer/Footer'
import UserCard from '../../../userCard/UserCard'
import createInstance from '../../../../constants/axiosApi'
function Likes() {
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOption, setSelectedOption] = useState('peopleYouLiked');

    const token = localStorage.getItem('token');

    const handleChange = (event) => {
        let SelectedOption = event.target.value;
        setSelectedOption(event.target.value);
        const params = {
            SelectedOption
        }
        const axiosInstance = createInstance(token);

        axiosInstance
            .get('/likes', { params })
            .then((response) => {
                const users = response.data.users;
                setData(users);
                setLoaded(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    };


    const usersPerPage = 8;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        async function callback() {
            const axiosInstance = createInstance(token);
            const params = {
                selectedOption
            }
            axiosInstance
                .get('/likes', { params })
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
    }, [loaded])
    const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser)
    return (
        <div>
            <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed', 'Messages']} user='true'></Navbar>

            {loaded ?
                <div>
                    <h1 style={{ color: 'grey', paddingTop: '1em' }}> "Wating for their response for perfect match"</h1>
                    <div className="dropdown-container">
                        <label htmlFor="peopleDropdown">Select:</label>
                        <select id="peopleDropdown" value={selectedOption} onChange={handleChange} style={{ backgroundColor: '#ff2b2b21' }}>
                            <option value="peopleYouLiked">People You Liked</option>
                            <option value="peopleLikesYou">People Who Likes You</option>
                        </select>
                    </div>
                    <div className='cardContainer row'>

                        {data.length == 0 ? (selectedOption === 'peopleYouLiked' ? <h1 style={{ color: 'red', fontFamily: 'cursive', paddingTop: '4em', }}>You are not waiting for anyone response....</h1> :
                            <h1 style={{ color: 'red', fontFamily: 'cursive', paddingTop: '4em', fontSize: '1.5em', padding: '3em' }}>"I'm sorry, but it appears that you don't have any likes. Perhaps updating your profile could help improve your visibility or attract more attention."</h1>) : ''
                        }
                        {currentUsers.map((user, index) => (
                            <div key={index} style={{ padding: '3em' }} className='col-lg-3 col-md-6'><UserCard user={user} like={selectedOption=='peopleYouLiked'?true:false}  match={selectedOption=='peopleLikesYou'?true:false}/></div>
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

                </div>
                : ''}
            <Footer></Footer>

        </div>
    )
}

export default Likes
