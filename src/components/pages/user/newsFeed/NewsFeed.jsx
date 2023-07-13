import React, { useState, useEffect } from 'react'
import Navbar from '../../../navbar/Navbar'
import Footer from '../../../footer/Footer'
import './NewsFeed.css'
import createInstance from '../../../../constants/axiosApi';
import {AiFillLike} from 'react-icons/ai'
function NewsFeed() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState([]);
    const [posts, setPosts] = useState([]);
    const [updated, setUpdated] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [liked,setLiked] = useState(false)


    const postsPerPage = 20;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    const token = localStorage.getItem('token')

    const handleCaptionChange = (event) => {
        setCaption(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform any actions with the caption and imageURL, such as creating a new post.
        const axiosInstance = createInstance(token);
        const formData = new FormData();

        formData.append('caption', caption);
        formData.append('image', image)
        axiosInstance
            .post('/newsField', formData
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            .then((response) => {
                setUpdated(!updated)
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        closeModal();
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCaption('');
        setImage('');
    };
    const handleLike = (id) => {
        setLiked(!liked)
        console.log(id);
     const axiosInstance = createInstance(token)

     axiosInstance.patch('/newsFeed')
    };
    useEffect(() => {
        const callBack = () => {
            const axiosInstance = createInstance(token);

            axiosInstance.get('/newsField').then((res) => {
                if (res.data.status === 'ok') {
                    setPosts(res.data.posts)
                } else {
                    console.error('Error:', error);
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
        callBack();
    }, [updated])
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

    return (
        <div>
            <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed',]} user='true'></Navbar>
            <div style={{}} className='newsField'>
                <button onClick={openModal} className='create-post-button'>Create Post</button>

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Create Post</h2>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="caption">Caption:</label><br />
                                <input type="text" id="caption" name="caption" value={caption} onChange={handleCaptionChange} /><br />

                                <label >Image:</label><br />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="custom-input"
                                /><br />

                                <button type="submit">Create</button>
                                <br />
                                <button onClick={closeModal}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div className='postsField'>
                <div className="news-field">
                    <h2 style={{fontWeight:'bold'}}>Engaging Social Posts from Your Matches..</h2>
                    {posts.length===0?<p style={{fontSize:'2em'}}>Sorry no posts....</p>:''}
                    {currentPosts.map((posts, index) => (
                        <div key={index} className="news-item">
                            <div className="news-header">
                                <img src={`http://localhost:8000/images/${posts.image}`} alt="Author Avatar" className="author-avatar" />
                                <div>
                                    {/* <h3>{posts.title}</h3> */}
                                    <p>{posts.userId}</p>
                                </div>
                            </div>
                            <img src={`http://localhost:8000/images/${posts.image}`} alt="News Image" className="news-image" />
                            <p style={{ color: 'grey' }}>{posts.caption}</p>
                            <br />
                            <AiFillLike  style={{marginLeft:'1em'}}size={30} color={liked?'blue':'grey'} onClick={()=>{handleLike(posts._id)}}></AiFillLike>
                            <p1>{posts.likes}</p1>
                            <br /><br />
                        </div>

                    ))}
                </div>
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
                    disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                    style={{ borderRadius: '1em', border: 'none', backgroundColor: 'grey', margin: '.5em', color: 'white', width: '6em', height: '2em' }}
                >
                    Next
                </button>
            </div>
            <Footer></Footer>
        </div>
    )
}

export default NewsFeed
