import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Profile = () => {

    const { authUser, updateUser } = useContext(AuthContext)
    const [selectedImage, setSelectedImage] = useState(null)
    const [name, setName] = useState(authUser.fullName)
    const [bio, setBio] = useState(authUser.bio)
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        if(!selectedImage){
            await updateUser({fullName:name,bio})
            navigate('/')
            return
        }
        const reader = new FileReader()
        reader.readAsDataURL(selectedImage)

        reader.onload = async ()=>{
            const base64Image = reader.result
            await updateUser({profilePic:base64Image,fullname:name,bio})
            navigate('/')
        }
    }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
        <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between rounded-lg max-sm:flex-col-reverse '>
            <form onSubmit={handleSubmit} className='flex flex-col p-10 gap-5 flex-1'> 
                <h3 className='text-lg'>Profile Details</h3>
                <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                    <input onChange={(e)=>setSelectedImage(e.target.files[0])} type="file" id="avatar" accept='.jpg, .png, .jpeg' hidden />
                    <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} className={`w-12 h-12 ${selectedImage && 
                        "rounded-full"
                    }`}  alt="" />
                    Upload Profile Image
                </label>
                <input type="text" onChange={(e)=>setName(e.target.value)} value={name} placeholder='Your Name' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
                <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Write profile bio' required rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' ></textarea>
                <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
            </form>
            <img src={authUser?.profilePic ? authUser.profilePic :assets.logo_icon} className= {` max-w-44 aspect-square rounded-full mx-10 mx-sm:mt-10 ${selectedImage && 
                        "rounded-full"}`} alt="" />
        </div>
    </div>
  )
}

export default Profile