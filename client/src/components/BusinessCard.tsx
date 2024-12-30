import React from 'react'
import defaultImageSrc from '../../assets/defaultBusinessImage.jpg'

function BusinessCard( { businessInfo, handleSubscribe, handleUnSubscribe, handleDelete } ) {
    const { _id ,name, description, owner, reviews, subscribers, createdAt, updatedAt} = businessInfo;
    const imageSrc = businessInfo.imageSrc || defaultImageSrc
    const ownerId = owner._id;
    const ownerName = owner.name;
    const { email, plainPassword, plan } = owner;
    // console.log(owner);

  return (
    <div className='h-44 w-44 border border-1 rounded mb-4'>
      <button onClick={() => handleSubscribe(_id)} className='mr-2'>Subscribe</button>
      {/* <button onClick={() => handleUnSubscribe(_id)}></button> */}
      <button onClick={() => handleDelete(_id)}>Delete</button>
        <span className='z-10'>business:{name}</span>
        <br></br>
        <img className='h-1/3 z-0' src={imageSrc} />
        <span className='z-10'>owner:{ownerName}</span>
        <br></br>
        <span className='z-10'>email:{email}</span>
        <br></br>
        <span className='z-10'>password:{plainPassword}</span>
        <br></br>
        {/* <span className='z-10'>description:{description}</span> */}
    </div>
  )
}

export default BusinessCard