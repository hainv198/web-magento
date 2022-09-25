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
        <div style={{width:'100%', marginTop:100}} className=' my_account'>
            <div>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                {loading && <h3>Loading.....</h3>}
            </div>
            <div className="col-right">
                <h2>{isAdmin ? "Users" : "My Orders"}</h2>

                <div style={{overflowX: "auto"}}>
                    <table className="customers">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {
                                            user.role === 1
                                                ? "Admin"
                                                : "user"
                                        }
                                    </td>
                                    <td>
                                        <Link to={`/edit_user/${user._id}`}>
                                            Edit
                                        </Link>
                                        <span
                                           onClick={() => handleDelete(user._id)} > Delete
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusamus dolorum iure laborum magnam molestias neque nesciunt possimus vitae voluptatum! Exercitationem, minima possimus quisquam sapiente tenetur totam unde veritatis voluptatem.
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aut, doloremque dolores eos laboriosam maiores neque nihil quae quo quos rerum sapiente suscipit, vel? Dicta distinctio fugit illum sint voluptatibus?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus assumenda commodi consequatur cum cumque cupiditate delectus dolor id incidunt ipsa laboriosam molestias mollitia porro provident quae quis quisquam, vel voluptate!

        </div>
    );
};

export default MyAccount;