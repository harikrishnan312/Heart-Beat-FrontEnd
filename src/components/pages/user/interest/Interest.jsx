import React, { useState } from 'react'
import baseApiCall from '../../../../constants/fetchApi';

import logo from '../../../images/logo.jpeg'
import { useNavigate } from 'react-router-dom';



function Interest() {
    const [checkedValues, setCheckedValues] = useState([]);

    const navigate = useNavigate();

    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");

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

    const HandleSubmit = async () => {

        let options = {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            }, body: JSON.stringify({
                interests: checkedValues,
                id: id
            })
        }

        const data = await baseApiCall('interest', options);
        console.log(data.status);
        if (data.status == 'ok') {
            navigate('/login')
        }
    }
    return (
        <div className='container'>
            <div style={{ paddingLeft: '3em' }} className='row'>
                <div className="col-lg-12">

                    <div className='logoFrame'><img className='logo' src={logo} alt="" /></div>
                    <h1>Your interests</h1>
                </div>

                <div style={{ color: 'grey', fontSize: '1em', padding: '2em' }} className='col-md-12 des'><p >Select a few of your interests and let everyone know what you’re passionate about.</p></div>

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

                <div onClick={HandleSubmit} style={{ textAlign: 'center' }}><button type="submit">Submit</button></div>
                <br></br>

            </div>
        </div>
    )
}

export default Interest
