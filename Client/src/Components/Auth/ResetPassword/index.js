import React, {useState} from 'react'
import axios from 'axios'
import '../SignIn/style.scss'
import {useParams} from 'react-router-dom'
import {showErrMsg, showSuccessMsg} from "../../Utils/Notification";
import {isLength, isMatch} from "../../Utils/Validation";


const initialState = {
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

function ResetPassword() {
    const [data, setData] = useState(initialState)
    const {token} = useParams()

    const {password, cf_password, err, success} = data

    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '', success: ''})
    }


    const handleResetPass = async () => {
        if(isLength(password))
            return setData({...data, err: "Password must be at least 6 characters.", success: ''})

        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match.", success: ''})

        try {
            const res = await axios.post('/user/reset', {password}, {
                headers: {Authorization: token}
            })

            return setData({...data, err: "", success: res.data.msg})

        } catch (err) {
            err.response.data.msg && setData({...data, err: err.response.data.msg, success: ''})
        }

    }


    return (
        <div className="fg_pass">
            <div className='forgot_pass'>
                <div style={{textAlign:'center', marginTop:40}} >
                    <h1>Reset Your Password</h1>
                </div>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                <div className='container signin' style={{marginTop:0}}>
                    <div className='row'>
                        <label htmlFor="password">Password</label><br/>
                        <input
                            className='input-signin'
                            type='password'
                            id='password'
                            name='password'
                            value={password}
                            onChange={handleChangeInput}
                        />
                        <label htmlFor="cf_password">Confirm Password</label><br/>
                        <input
                            className='input-signin'
                            type='password'
                            id='cf_password'
                            name='cf_password'
                            value={cf_password}
                            onChange={handleChangeInput}
                        />
                        <button
                            style={{width:160, marginTop:10}}
                            onClick={handleResetPass}
                            className='sign-btn' type='submit'>
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ResetPassword