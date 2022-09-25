import React, {useEffect, useState} from 'react';
import './profile.scss'
import {useDispatch, useSelector} from "react-redux";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {isLength, isMatch} from "../../Utils/Validation";
import axios from "axios";
// import {Link} from 'react-router-dom'
import {showErrMsg, showSuccessMsg} from "../../Utils/Notification";
import {dispatchGetAllUsers, fetchAllUsers} from "../../../Redux/Acctions/userAcction";
// import DeleteIcon from '@mui/icons-material/Delete';
// import BorderColorIcon from '@mui/icons-material/BorderColor';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
const initialState = {
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}
const Profile = () => {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {user, isAdmin} = auth
    const [data, setData] = useState(initialState)
    const {name, password, cf_password, err, success} = data

    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)

    const dispatch = useDispatch()
    useEffect(() => {
        if(isAdmin){
            fetchAllUsers(token).then(res =>{
                dispatch(dispatchGetAllUsers(res))
            })
        }
    },[token, isAdmin, dispatch, callback])
    const handleChange = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err:'', success: ''})
    }
    const changeAvatar = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]

            if(!file) return setData({...data, err: "No files were uploaded." , success: ''})

            if(file.size > 1024 * 1024)
                return setData({...data, err: "Size too large." , success: ''})

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setData({...data, err: "File format is incorrect." , success: ''})

            let formData =  new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload_avatar', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setAvatar(res.data.url)

        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const updateInfor = () => {
        try {
            axios.patch('/user/update', {
                name: name ? name : user.name,
                avatar: avatar ? avatar : user.avatar
            },{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "Updated Success!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const updatePassword = () => {
        if(isLength(password))
            return setData({...data, err: "Password must be at least 6 characters.", success: ''})

        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match.", success: ''})

        try {
            axios.post('/user/reset', {password},{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "Updated Success!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleUpdate = () => {
        if(name || avatar) updateInfor()
        if(password) updatePassword()
    }

    const handleDelete = async (id) => {
        try {
            if(user._id !== id){
                if(window.confirm("Are you sure you want to delete this account?")){
                    setLoading(true)
                    await axios.delete(`/user/delete/${id}`, {
                        headers: {Authorization: token}
                    })
                    setLoading(false)
                    setCallback(!callback)
                }
            }

        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    return (
        <div>

        {/*    */}

            <div className='container-fluid '>
                <div>
                    {err && showErrMsg(err)}
                    {success && showSuccessMsg(success)}
                    {loading && <h3>Loading.....</h3>}
                </div>
                <div className='profile_page row'>
                    <div className="col-left col-sm-3">
                        <h2>{isAdmin ? "Admin" : "User"}</h2>
                        <div className="avatar">
                            <img src={avatar ? avatar : user.avatar} alt="Avatar"/>
                            <span>
                        <CameraAltIcon/>
                        Change
                        <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                    </span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                name='name'
                                id='name'
                                placeholder="Your name"
                                defaultValue={user.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                placeholder="Your email address"
                                disabled
                                defaultValue={user.email}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">New Password:</label>
                            <input
                                type="password"
                                name='password'
                                id='password'
                                placeholder="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cf_password">Confirm New Password:</label>
                            <input
                                type="password"
                                name='cf_password'
                                id='cf_password'
                                placeholder="New Password"
                                value={cf_password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <em style={{color: "crimson"}}>
                                * If you update your password here, you will not be able
                                to login quickly using google and facebook.
                            </em>
                        </div>
                        <button
                            disabled={loading}
                            onClick={handleUpdate}
                        >Update</button>
                    </div>
                    <div className="col-right row col-sm-9">
                        <div className='col-sm-12  col-md-6 col-lg-3' >111</div>
                        <div className='col-sm-12  col-md-6 col-lg-3'  >222</div>
                        <div className='col-sm-12  col-md-6 col-lg-3' >333</div>
                        <div className='col-sm-12  col-md-6 col-lg-3' >444</div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Profile;