import React, { useRef, useState } from 'react'
import baseApiCall from '../../../../constants/fetchApi';


import logo from '../../../images/logo.jpeg'
import { AiFillCamera } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';

function ProfileAdd() {

    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");

    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [location, setLocation] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('')
    const [mobile, setMobile] = useState('')
    const [about, setAbout] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [openSuggestion, setOpenSuggestions] = useState(false)
    const [dob, setDob] = useState('');


    const handleChange = (e) => {
        setDob(e.target.value);
    };


    const fileInputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const handleIconClick = () => {
        fileInputRef.current.click();
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedImage) {
            setError('Please upload profile pic...')

        }
        else if (!gender) {
            setError('Please select gender...')
        } else {
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('id', id);
            formData.append('firstName', fname);
            formData.append('lastName', lname);
            formData.append('age', dob);
            formData.append('location', location);
            formData.append('gender', gender);
            formData.append('mobile', mobile);
            formData.append('about', about);




            let options = {
                method: 'POST',
                body: formData
            }

            const data = await baseApiCall('profileAdd', options);
            if (data.status == 'ok') {
                navigate(`/interest?id=${id}`)
            }
        }
    }

    const CheckLocation = async (e) => {
        setLocation(e.target.value);
        let locations = e.target.value;
        setOpenSuggestions(true)
        let options = {
            method: 'get',
            params: {
                query: locations
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
    return (
        <div>
            <div className='container'>
                <div className='logoFrame'><img className='logo' src={logo} alt="" /></div>
                <h1>Profile</h1>
                <form onSubmit={HandleSubmit}>
                    <div className="custom-upload-button" onClick={handleIconClick}>
                        {selectedImage ? (
                            <div style={{ textAlign: 'center' }}><img className='preview' src={URL.createObjectURL(selectedImage)} alt="Image Preview" style={{
                                width: '8em', height: '8em', borderRadius: '4em'
                            }} />
                                <div style={{ textAlign: 'center' }}><AiFillCamera size={40} color='#e94057' /></div></div>
                        ) : (
                            <div style={{ textAlign: 'center' }}><AiFillCamera size={30} color='#e94057' /></div>)}
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </div>
                    <label className='text'>Firstname:</label>
                    <input type="text" value={fname} onChange={(e) => { setFname(e.target.value) }} pattern="[A-Za-z]+" required />
                    <label className='text'>Lastname:</label>
                    <input type="text" value={lname} onChange={(e) => { setLname(e.target.value) }} pattern="[A-Za-z]+" required />
                    <label className='text'>Date of Birth:</label>
                    <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={handleChange}
                    />
                    <label className='text'>Mobile:</label>
                    <input type="number" value={mobile} onChange={(e) => { setMobile(e.target.value) }} required />
                    <div>
                        <label className='text'>Location:</label>
                        <input type="text" value={location} onChange={CheckLocation} required />
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
                    <label className='text'>About:</label>
                    <input type="text" value={about} onChange={(e) => { setAbout(e.target.value) }} required />
                    <div >
                        <div className="form-check form-check-inline">
                            <input onChange={(e) => { setGender(e.target.value) }} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="male" style={{ backgroundColor: '#e94057' }} />
                            <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input onChange={(e) => { setGender(e.target.value) }} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="female" style={{ backgroundColor: '#e94057' }} />
                            <label className="form-check-label" htmlFor="inlineRadio1">Female</label>
                        </div>

                        <div className="form-check form-check-inline">
                            <input onChange={(e) => { setGender(e.target.value) }} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="other" style={{ backgroundColor: '#e94057' }} />
                            <label className="form-check-label" htmlFor="inlineRadio3">Other</label>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}><button type="submit">Confirm</button></div>
                    <br></br>
                </form>
                <div style={{ textAlign: 'center' }}><span style={{ color: 'red' }}>{error}</span></div>
            </div>
        </div>
    )
}

export default ProfileAdd
