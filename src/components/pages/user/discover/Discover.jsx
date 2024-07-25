import React, { useEffect, useState } from 'react'
import Navbar from '../../../navbar/Navbar';
import UserCard from '../../../userCard/UserCard'
import createInstance from '../../../../constants/axiosApi';
import Footer from '../../../footer/Footer';
import './Discover.css'
import { AiFillFilter } from 'react-icons/ai'
import { useSelector } from 'react-redux';


function Discover() {
    const user = useSelector((state => state.user.userData));
    const token = localStorage.getItem('token');


    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([])
    const [loaded, setLoaded] = useState(false);
    const [ageFrom, setAgeFrom] = useState(18);
    const [ageTo, setAgeTo] = useState(80);
    const [gender, setGender] = useState('both')
    const [nearBy, setNearBy] = useState(false)

    const usersPerPage = 8;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;



    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const HandleFilter = () => {

        if ((ageTo && ageFrom) && gender) {
            const axiosInstance = createInstance(token);
            const params = {
                ageFrom,
                ageTo,
                gender,
                filter: true,
                nearBy
            };
            axiosInstance
                .get('/discover', { params })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status == 'ok') {
                        const users = response.data.users;
                        const data = users.filter((users) => users._id !== user._id);
                        setData(data);
                        setLoaded(true)
                    }
                })
        }
    }


    const NearByHandle = () => {
        console.log(nearBy);
        setNearBy(!nearBy)
    }

    useEffect(() => {

        async function callback() {
            const token = localStorage.getItem('token');

            const axiosInstance = createInstance(token);

            axiosInstance
                .get('/discover')
                .then((response) => {
                    const users = response.data.users;
                    const data = users.filter((user) => user._id !== response.data.id);
                    setData(data);
                    setLoaded(true);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }
        callback()
    }, [loaded])
    // console.log(data);
    const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser)

    return (
        <div className='discover'>
            <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed', 'Messages']} user='true'></Navbar>
            {/* Dropdown */}

            <div className="btn-group dropstart">
                <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <AiFillFilter size={30} />
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <label htmlFor="age-from">Age From:</label>
                        <input type="number" id="age-from" value={ageFrom} onChange={(e) => { setAgeFrom(e.target.value) }} required />
                    </li>
                    <li>
                        <label htmlFor="age-to">Age To:</label>
                        <input type="number" id="age-to" value={ageTo} onChange={(e) => { setAgeTo(e.target.value) }} required />
                    </li>
                    <li className="dropdown-divider"></li>
                    <li>
                        <label htmlFor="gender">Gender:</label>
                        <select id="gender" value={gender} onChange={(e) => { setGender(e.target.value) }} required >
                            <option value="both">Both</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>

                        </select>
                    </li>
                    <input
                        type="checkbox"
                        checked={nearBy}
                        onChange={NearByHandle}
                        style={{ width: '20px', height: '20px',margin:'.5em'}}
                    />
                    <label>Nearby</label>

                    <button className='filter' onClick={HandleFilter}>Filter</button>
                </ul>
            </div>

            {loaded ?

                (<div>

                    <h1 style={{ color: 'grey', paddingTop: '1em' }}> "Find Your Perfect Match"</h1>

                    <div className='cardContainer row'>
                        {data.length == 0 ? <h1 style={{ color: 'red', fontFamily: 'cursive' ,paddingTop:'4em'}}>Sorry No Matches....</h1> : ''
                        }
                        {currentUsers.map((user, index) => (
                            <div key={index} style={{ padding: '3em' }} className='col-lg-3 col-md-6'><UserCard user={user} like={false} /></div>
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

                </div>) : <div style={{height:"100vh"}}></div>
            }
            <Footer></Footer>
        </div>
    )
}

export default Discover
