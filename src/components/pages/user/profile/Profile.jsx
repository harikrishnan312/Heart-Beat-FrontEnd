import React, { useEffect, useRef, useState } from 'react'
import './Profile.css'

import { useNavigate } from 'react-router-dom';
import Loading from '../../../loading/Loading';

import createInstance from '../../../../constants/axiosApi';

import Navbar from '../../../navbar/Navbar'
import baseApiCall from '../../../../constants/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../../../redux/userData';
import { AiFillCamera } from 'react-icons/ai'
import { AiFillEdit } from 'react-icons/ai'
import { AiFillDelete } from 'react-icons/ai'

import { FcMultipleCameras } from 'react-icons/fc'
import Card from '../../../card/Card';
import card1 from '../../../images/card1.png'
import card2 from '../../../images/card2.png'
import card3 from '../../../images/card3.png'
import card4 from '../../../images/card4.png'
import Footer from '../../../footer/Footer';



function Profile() {
    const url_string = window.location.href;
    const url = new URL(url_string);
    const auth = url.searchParams.get('user');
    const id = url.searchParams.get("id");

    const user = useSelector((state) => state.user.userData);

    const navigate = useNavigate()
    const token = localStorage.getItem('token');

    const [editing, setEditing] = useState(false);
    const [updated, setUpdated] = useState(false)

    const [age, setAge] = useState('');
    const [mobile, setMobile] = useState('');
    const [dp, setDp] = useState(null);
    const [location, setLocation] = useState('');
    const [about, setAbout] = useState('');
    const [gender, setGender] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [checkedValues, setCheckedValues] = useState([]);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [selectedImages, setSelectedImages] = useState(null);
    const [images, setImages] = useState(null);
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [openSuggestion, setOpenSuggestions] = useState(false);
    const [dob, setDob] = useState('');
    const [index, setIndex] = useState('')







    const dispatch = useDispatch(null);

    const handleEdit = () => {
        setEditing(true);
        setInterests(checkedValues)
        setCheckedValues([])
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSuggestions([])
        HandleMultipleUpload();
        const formData = new FormData();

        if (checkedValues.length == 0) {
            formData.append('interests', interests);
        } else {
            formData.append('interests', checkedValues);
        }

        formData.append('image', selectedImage);
        formData.append('firstName', fname);
        formData.append('lastName', lname);
        formData.append('age', dob);
        formData.append('location', location);
        formData.append('gender', gender);
        formData.append('mobile', mobile);
        formData.append('about', about);
        const axiosInstance = createInstance(token);
        axiosInstance
            .post('/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                if (response.data.status == 'ok') {
                    setUpdated(!updated);
                }
            })
        setEditing(false);
    }

    const fileInputRef = useRef(null);
    const filesInputRef = useRef(null);
    const filesEditRef = useRef(null);


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleEditClick = (index) => {
        setIndex(index)
        filesEditRef.current.click();
    }
    const HandleEditImages = async (event) => {
        const file = event.target.files[0];

        const axiosInstance = createInstance(token);

        const formData = new FormData();
        formData.append('images[]', file)
        formData.append('edit', true);
        formData.append('index', index)
        axiosInstance
            .post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                if (response.data.status == 'ok') {
                    setUpdated(!updated);
                }
            })
    }

    const HandleDelete = (index)=>{
        setIndex(index)
        const formData = new FormData();
        formData.append('deleted', true);
        formData.append('index', index);

        const axiosInstance = createInstance(token);
        axiosInstance
        .post('/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            if (response.data.status == 'ok') {
                setUpdated(!updated);
            }
        })

    }
    const handleMultipleImages = (event) => {
        const file = event.target.files;
        setSelectedImages(file);
    };

    const handleIconClicks = () => {
        filesInputRef.current.click();
    }

    const handleIconClick = () => {
        fileInputRef.current.click();
    }

    const HandleMultipleUpload = async () => {
        const formData = new FormData();

        for (let i = 0; i < selectedImages.length; i++) {
            formData.append('images[]', selectedImages[i]);
        }

        const axiosInstance = createInstance(token);
        axiosInstance
            .post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                if (response.data.status == 'ok') {
                    setUpdated(!updated);
                }
            })

    }

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setCheckedValues([...checkedValues, value]);
        } else {
            const updatedValues = checkedValues.filter((item) => item !== value);
            setCheckedValues(updatedValues);
        }
    };


    const CheckLocation = async (e) => {
        setLocation(e.target.value);
        setOpenSuggestions(true)
        let options = {
            method: 'get',
            params: {
                query: location
            }
        }

        const data = await baseApiCall('location', options);
        if (data) {
            const suggestions = data.map((location) => location.placeName);
            setSuggestions(suggestions);
        } else {
            setSuggestions([]);
        }
    }

    const handleChange = (e) => {
        setDob(e.target.value);
    };

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 1500);

        async function callBack() {
            const token = localStorage.getItem('token');

            const params = {
                id
            }

            const axiosInstance = createInstance(token);

            axiosInstance
                .get('/profile', { params })
                .then((response) => {
                    const data = response.data;
                    if (data) {
                        // console.log(data.user);
                        dispatch(setUserData(data.user));
                        setDp(data.image)
                        setFname(data.user.firstName)
                        setLname(data.user.lastName)
                        setAge(data.age);
                        setDob(data.user.age)
                        setAbout(data.user.about);
                        setGender(data.user.gender);
                        setMobile(data.user.mobile);
                        setCheckedValues(data.interests)
                        setLocation(data.user.location.placeName)
                        setImages(data.images)
                    }

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        callBack();
    }, [updated, id])


    return (
        <div>
            {loading ? <Loading /> :
                <>
                    <Navbar lists={['Discover', 'Matches', 'Likes','Newsfeed', ]} user='true'></Navbar>
                    <br />
                    <h1 style={{ fontWeight: 'bold' }}>Profile</h1>
                    <div className="row profile-container">

                        <div className="col-md-6 custom-upload-button" >
                            <div>
                                {dp ? (
                                    <div style={{ textAlign: 'center', padding: '1' }}><img className='preview img-fluid' src={selectedImage ? URL.createObjectURL(selectedImage) : `http://localhost:8000/images/${dp}`} alt="Image Preview" style={{
                                        width: '25em', height: '20em', borderRadius: '.5em'
                                    }} />
                                        {editing ? <div style={{ textAlign: 'center' }} onClick={handleIconClick}><AiFillCamera size={30} color='#e94057' /></div> : ''}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center' }} onClick={handleIconClick}><AiFillCamera size={30} color='#e94057' /></div>)}
                                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                                <br /><br />
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ fontWeight: 'bold' }}>Photos</h3>
                                </div>

                                <div className="image-grid">
                                    {images ? images.map((image, index) => (
                                        <div key={index} className="image-container">
                                            {image?
                                                <img className='imgs' style={{ borderRadius: '1em' }} src={`http://localhost:8000/images/${image}`} alt={`Image ${index}`} />:''
                                            }
                                            <input ref={filesEditRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={HandleEditImages} />

                                            {editing ? <AiFillEdit style={{ marginRight: '1em' }} size={30} color='blue' onClick={() => handleEditClick(index)} ></AiFillEdit> : ''}
                                            {editing ? <AiFillDelete size={30} color='red' onClick={()=>{HandleDelete(index)}}></AiFillDelete> : ''}

                                        </div>
                                    )) : ''
                                    }
                                </div>
                                <div>{(editing ?
                                    <>
                                        <div style={{ textAlign: 'center' }} onClick={handleIconClicks}><FcMultipleCameras size={30} color='#e94057' /></div>
                                        {/* <div style={{ textAlign: 'center' }}><button className='edit-button' onClick={HandleMultipleUpload}>Upload</button></div> */}
                                        <input ref={filesInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleMultipleImages} />
                                    </> : '')}
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 formInput'>
                            <div className=''>{
                                editing ?
                                    <div style={{ paddingLeft: '3em' }} className='row'>
                                        <div className="col-lg-12">

                                            <h1>Your interests</h1>
                                            <br /><br />
                                        </div>

                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Photography" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Photography
                                            </label>
                                        </div>

                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Karoke" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Karoke
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Cooking" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Cooking
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Run" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Run
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Shopping" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Shopping                        </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Yoga" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Yoga
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Tennis" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Tennis
                                            </label>
                                        </div> <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Swimming" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Swimming
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Music" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Music
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Video games" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Video games
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Traveling" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Traveling
                                            </label>
                                        </div>
                                        <div className="form-check col-md-4 col-sm-6">
                                            <input style={{ backgroundColor: '#e94057' }} className="form-check-input" type="checkbox" value="Extreme" id="flexCheckDefault" onChange={handleCheckboxChange} />
                                            <label style={{ paddingLeft: '1em' }} className="form-check-label" htmlFor="flexCheckDefault">
                                                Extreme
                                            </label>
                                        </div>
                                        <br></br>

                                    </div>
                                    : (<div style={{ paddingLeft: '4em' }}>
                                        <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>Interests :</h2>
                                        {checkedValues.map((data, index) => {
                                            return <span key={index} style={{ fontSize: '1.3em', color: '#e94057' }}>{data}</span>
                                        })}
                                        <br /><br /><br />

                                    </div>
                                    )}
                            </div>
                            {editing ? (
                                <div style={{ paddingLeft: '2em', paddingTop: '2em' }} className="profile-section">
                                    <form onSubmit={handleSave}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="name">First Name:</label>
                                                <input type="text" id="fname" name="fname" defaultValue={user.firstName} onChange={(e) => { setFname(e.target.value) }} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="name">Last Name:</label>
                                                <input type="text" id="lname" name="lname" defaultValue={user.lastName} onChange={(e) => { setLname(e.target.value) }} />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="age">Date of Birth:</label>
                                                <input
                                                    type="date"
                                                    id="dob"
                                                    defaultValue={age}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="phone">Phone:</label>
                                                <input type="tel" id="phone" name="phone" defaultValue={user.mobile} onChange={(e) => { setMobile(e.target.value) }} />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className='text'>Location:</label>
                                            <input type="text" value={location.placeName ? location.placeName : location} onChange={CheckLocation} required />
                                            {(suggestions.length > 0 && openSuggestion) && (
                                                <select className="suggestions" size={suggestions.length} onChange={(e) => {
                                                    setLocation(e.target.value);
                                                    setOpenSuggestions(false)
                                                }}>
                                                    {suggestions.map((suggestion, index) => (
                                                        <option key={index} value={suggestion}>
                                                            {suggestion}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="about">About:</label><br />
                                            <input type='text' id="about" name="about" defaultValue={user.about} onChange={(e) => { setAbout(e.target.value) }}></input>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="gender">Gender:</label>
                                            <select id="gender" name="gender" defaultValue={user.gender} onChange={(e) => { setGender(e.target.value) }}>
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <button type="submit">Save</button>
                                    </form>
                                </div>
                            ) : (
                                <div className="profile-section" style={{ paddingLeft: '4em' }}>
                                    <p className="profile-name">{user.firstName} {user.lastName}</p>
                                    <p><span className="field-label">Email:</span> {user.email}</p>
                                    <p><span className="field-label">Phone:</span> {user.mobile}</p>
                                    <p><span className="field-label">Age:</span> {age}</p>
                                    <p><span className="field-label">Location:</span> {user.location.placeName}</p>
                                    <p><span className="field-label">Gender:</span> {user.gender}</p>
                                    <h3>About</h3>
                                    <p className="about-text">{user.about}</p>
                                    {auth ? '' : (
                                        <div className="profile-buttons">
                                            <button className="edit-button" onClick={handleEdit}>Edit</button>
                                            <button className="logout-button" onClick={() => {
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('refreshToken');
                                                navigate('/login');
                                                dispatch(setUserData(null));
                                            }}>Logout</button>
                                        </div>
                                    )}
                                </div>

                            )}
                        </div>

                    </div>
                    <div>
                        <div className='col-md-12 header1'><span >Take a leap into the world of online dating.</span></div>
                        <div className='col-md-12 para1'><p>Start your romantic journey with our Dating Platform....</p></div>
                        <div className='col-md-12 row' >
                            <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Members in total' imageUrl={card1} color='red'></Card></div>
                            <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Members Online' imageUrl={card2} color='lightgreen'></Card></div>
                            <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Mens Online' imageUrl={card3} color='violet'></Card></div>
                            <div className='col-md-3 col-sm-6 cards' style={{ textAlign: 'center', padding: '2em' }}><Card title='10000' description='Women Online' imageUrl={card4} color='blue'></Card></div>
                        </div>
                    </div>
                    <Footer></Footer>
                </>}
        </div>
    )
}

export default Profile
