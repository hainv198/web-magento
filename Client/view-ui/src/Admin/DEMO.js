import React, {useEffect, useState} from 'react';
import './MyAccount.scss'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {dispatchGetAllUsers, fetchAllUsers} from "../../../Redux/Acctions/userAcction";
import axios from "axios";
import {isLength, isMatch} from "../../../Components/Utils/Validation";
import {showErrMsg, showSuccessMsg} from "../../../Components/Utils/Notification";

const initialState = {
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

const MyAccount = () => {

    /*const [data, setData] = useState(null)

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/employee")
            .then((res) => res.json())
            .then((res) => {
                setData(res)
            })
    },[])
    var listUser = []
    if(data !== null) {
        listUser = data.map((item) => {
            return(
                <tbody>
                <tr>
                    <th scope="row">{item.id}</th>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                </tr>

                </tbody>
            )
        })
    }
*/

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
        <div style={{width:'85%'}} className=' my_account'>
            <div className=' col profiles'>
                <div style={{padding:'unset'}}>
                    <div>
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                        {loading && <h3>Loading.....</h3>}
                    </div>
                    <h1 style={{padding:10}}>My Account</h1>
                    <div className='form_account'>
                        <div className='banner'></div>
                        <div className='info_account'>
                            <img src={avatar ? avatar : user.avatar} alt="Avatar"/>
                            {/*chang avatar*/}
                            <div className='info_name'>
                                <div>
                                    <span>{user.name}</span>
                                </div>
                                <button >
                                    <Link to='#'>Edit Profile</Link>
                                </button>
                            </div>
                        </div>
                        <div className='edit_profile'>
                            <div className='edit_profile_name'>
                                <span>
                                    <strong>Tên đăng nhập :</strong><br/>
                                    <span>Hải Nguyễn</span>
                                </span>

                                <button>
                                    <Link to='/'>Edit</Link>
                                </button>
                            </div><br/>
                            <div className='edit_profile_name'>
                                <span>
                                    <strong>Email :</strong><br/>
                                    <span>abc@gmail.com</span>
                                </span>

                                <button>
                                    <Link to='/'>Edit</Link>
                                </button>
                            </div><br/>
                            <div className='edit_profile_name'>
                                <span>
                                    <strong>Password :</strong><br/>
                                    <span>************</span>
                                </span>

                                <button>
                                    <Link to='/'>Edit</Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Email</th>
                </tr>
                </thead>
            </table>
        </div>
    );
};

export default MyAccount;