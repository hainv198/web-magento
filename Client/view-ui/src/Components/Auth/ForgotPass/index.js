import React, {useState} from 'react';
import {showErrMsg, showSuccessMsg} from "../../Utils/Notification";
import '../SignIn/style.scss'
import axios from "axios";
import {isEmail} from "../../Utils/Validation";



const initialState = {
    email: '',
    err: '',
    success: ''
}

const ForgotPassword = () => {
    const [data, setData] = useState(initialState)
    const {email, err, success} = data
    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '', success: ''})
    }

    const forgotPassword = async () => {
        if(!isEmail(email))
            return setData({...data, err: 'Invalid emails.', success: ''})

        try {
            const res = await axios.post('/user/forgot', {email})

            return setData({...data, err: '', success: res.data.msg})
        } catch (err) {
            err.response.data.msg && setData({...data, err:  err.response.data.msg, success: ''})
        }
    }
    return (
        <div className='forgot_pass'>

            <div style={{textAlign:'center', marginTop:40}} >
                <h1>Forgot Your Password</h1>
            </div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <div className='container signin' style={{marginTop:0}}>
                <div className='row'>

                    <label>Email your email address</label><br/>
                    <input
                        className='input-signin'
                        type='email'
                        id='email'
                        name='email'
                        value={email}
                        onChange={handleChangeInput}
                    />

                    <button
                        style={{width:160, marginTop:10}}
                        onClick={forgotPassword}
                        className='sign-btn' type='submit'>
                        Verify your email
                    </button>
                </div>
            </div>
        </div>

    );
};

export default ForgotPassword;