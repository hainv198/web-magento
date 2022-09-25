import React, {useState} from 'react';
import {Link} from "react-router-dom";
import '../SignIn/style.scss'
import axios from "axios";
import {isEmpty, isMatch, isEmail, isLength} from "../../Utils/Validation";
import {showErrMsg, showSuccessMsg} from "../../Utils/Notification";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    name:'',
    email:'',
    password:'',
    cf_password:'',
    err:'',
    success:''
}

const SignUp  = () => {

    const [user, setUser] = useState(initialState)
    const {name,email, password,cf_password, err, success} = user

    const handleChangeInput = e => {
        const {name, value} = e.target
        setUser({...user, [name]:value, err: '', success: ''})
    }

    //
    const handleSubmits = async e => {
        e.preventDefault()
        if(isEmpty(name) || isEmpty(password))
            return setUser({...user, err: "Please fill in all fields.", success: ''})
        if(!isMatch(password, cf_password))
            return setUser({...user, err: "Password did not match.", success: ''})
        try {
            const res = await axios.post('/user/register', {
                name, email, password
            })

            setUser({...user, err: '', success: res.data.msg})
        } catch (err) {
            err.response.data.msg &&
            setUser({...user, err: err.response.data.msg, success: ''})
        }
    }


    return (
        <div className='container signin'>
            <div style={{width:400}}>

                <div>
                    <h1>Sign up for a free account</h1>
                </div>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                <form className='sign-form' onSubmit={handleSubmits}>
                    <div>
                        <label>Name</label><br/>
                        <input
                            className='input-signin'
                            id='name'
                            name='name'
                            value={name}
                            onChange={handleChangeInput}
                        />

                    </div>
                    <div >

                        <label>Email Address</label><br/>
                        <input
                            className='input-signin'
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div>
                        <label>Password</label><br/>
                        <input
                            className='input-signin'
                            type='password'
                            id='password'
                            name='password'
                            value={password}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div>
                        <label>Confirm Password</label><br/>
                        <input
                            className='input-signin'
                            type='password'
                            id='cf_password'
                            name='cf_password'
                            value={cf_password}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <p className='mt-5'></p>
                    <button
                        className='sign-btn' type='submit'>
                        Sign Up
                    </button>

                    <p className='mt-5 text-center'>
                        Already have an account yet?{' '}
                        <Link to='/login' >
                            Sign in.
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default SignUp ;