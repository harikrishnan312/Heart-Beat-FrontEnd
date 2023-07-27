import React, { useState, useEffect } from 'react'
import Navbar from '../../../navbar/Navbar'
import Footer from '../../../footer/Footer'
import './NewsFeed.css'
import createInstance from '../../../../constants/axiosApi';
import { AiFillLike } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md';
import MyModal from '../../../modal/Modal';

function NewsFeed({ admin }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState([]);
    const [posts, setPosts] = useState([]);
    const [updated, setUpdated] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [liked, setLiked] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState();
    const [loading,setLoading] = useState(false)




    const postsPerPage = 20;

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    const token = localStorage.getItem('token')
    const adminToken = localStorage.getItem('adminToken')


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
            .post('/newsFeed', formData
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
    const handleLike = (id, index) => {
        const updatedLiked = [...liked];
        updatedLiked[index] = !updatedLiked[index];
        setLiked(updatedLiked);

        const axiosInstance = createInstance(token)
        const likes = updatedLiked[index]
        axiosInstance.patch('/newsFeed', { id, likes }).then((res) => {
            // console.log(res);
            setUpdated(!updated)
        })
    };
    const openModals = (id) => {

        setValue(id);
        setShowModal(true);
    };

    const HandleDelete = () => {
        const axiosInstance = createInstance(adminToken)
        axiosInstance.put('/admin/newsFeed', { id: value }).then((res) => {

            if (res.data.status === 'ok') {
                setUpdated(!updated);
                closeModals();
            }
        })
    }
    const closeModals = () => {
        setShowModal(false);
    };
    useEffect(() => {
        const callBack = () => {
            if (admin) {
                const axiosInstance = createInstance(adminToken);
                axiosInstance.get('/admin/newsFeed').then((res) => {
                    if (res.data.status === 'ok') {
                        setPosts(res.data.posts)
                        setLoading(true)
                    } else {
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                });
            } else {
                const axiosInstance = createInstance(token);
                axiosInstance.get('/newsFeed',).then((res) => {
                    if (res.data.status === 'ok') {
                        setPosts(res.data.posts)
                        setLoading(true)
                    } else {
                        console.error('Error:', error);
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                });
            }
        }
        callBack();
    }, [updated])
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

    return (
      
        <div>
            {admin ? <Navbar lists={['Dashboard', 'Newsfeed','Report', 'Logout']}></Navbar>
                : <Navbar lists={['Discover', 'Matches', 'Likes', 'Newsfeed', 'Messages']} user='true'></Navbar>
}
            {admin ? '' :
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
            }
            {loading?posts?
            <div className='postsField'>
                <div className="news-field">
                    {admin ? <h2 style={{ fontWeight: 'bold' }}>All posts...</h2> : <h2 style={{ fontWeight: 'bold' }}>Engaging Social Posts from Your Matches..</h2>}
                    {posts.length === 0 ? <p style={{ fontSize: '2em' }}>Sorry no posts....</p> : ''}
                    {currentPosts.map((posts, index) => (
                        <div key={index} className="news-item">
                            <div className="news-header">
                                {posts.user[0].image?<img src={`https://vanchi.online/images/${posts.user[0].image}`} alt="Author Avatar" className="author-avatar" />:''}
                                <div>
                                    <p>{posts.user[0].firstName}</p>
                                </div>
                            </div>
                            <img src={` https://vanchi.online/images/${posts.image}`} alt="News Image" className="news-image" />
                            <p style={{ color: 'grey' }}>{posts.caption}</p>
                            <br />
                            {admin ? <MdDelete style={{ marginLeft: '1em' }} size={30} color='red' onClick={() => { openModals(posts._id) }}></MdDelete> :
                                <><AiFillLike style={{ marginLeft: '1em' }} size={30} color={liked[index] ? 'blue' : 'grey'} onClick={() => { handleLike(posts._id, index) }}></AiFillLike>
                                    <span>{posts.likes}</span></>
                            }
                            <br /><br />
                        </div>

))}
                </div>
                
            </div>

:'':''}
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
            <MyModal
                showModal={showModal}
                closeModal={closeModals}
                handleSaveChanges={HandleDelete}
            ></MyModal>

            <Footer></Footer>
        </div>
    )
}

export default NewsFeed
