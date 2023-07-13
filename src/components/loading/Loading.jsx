import React from 'react'
import loading from '../images/loading.gif'

function Loading() {
  return (
    <div style={{textAlign:'center',padding:'5em'}}>
      <img className='img-fluid' src={loading} alt="loading...." style={{borderRadius:'2em',width:'20em'}} />
      <br /><br />
      <h1 style={{color:'#e94057'}}>Loading....</h1>
    </div>
  )
}

export default Loading
