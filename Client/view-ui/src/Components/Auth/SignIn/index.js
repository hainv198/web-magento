import React, {useState} from 'react';
import {Link} from "react-router-dom";
import FacebookLogin from 'react-facebook-login';
import './style.scss'
import axios from "axios";
import {showErrMsg, showSuccessMsg} from "../../Utils/Notification";
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from "react-redux";
import {dispatchLogin} from "../../../Redux/Acctions/authAcction";
import {useNavigate} from "react-router";
import { GoogleLogin } from 'react-google-login';

const initialState = {
    email:'',
    password:'',
    err:'',
    success:''
}

const SignIn  = () => {
    /*const notify = () => {
        if(success && showSuccessMsg(success)) {
            toast.success(showSuccessMsg(success), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        }else if(err && showErrMsg(err)) {
            toast.error(showErrMsg(err), {
                position: "top-right",
                autoClose: 5000,
                marginTop:100,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };*/

    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {email, password, err, success} = user

    const handleChangeInput = e => {
        const {name, value} = e.target
        setUser({...user, [name]:value, err: '', success: ''})
    }

    //
    const handleSubmits = async e => {
        e.preventDefault()
        try {
            const res = await axios.post('/user/login', {email, password})
            console.log(res)
            setUser({...user, err: '', success: res.data.msg})
            localStorage.setItem('firstLogin', true)
            dispatch(dispatchLogin())
            navigate('/');
        } catch (err) {
            err.response.data.msg &&
            setUser({...user, err: err.response.data.msg, success: ''})
        }
    }
    const responseGoogle = async (response) => {
        console.log(response)
        /*try {
            const res = await axios.post('/user/google_login', {tokenId: response.tokenId})
            setUser({...user, error:'', success: res.data.msg})
            localStorage.setItem('firstLogin', true)
            dispatch(dispatchLogin())
            navigate('/');
        } catch (err) {
            err.response.data.msg &&
            setUser({...user, err: err.response.data.msg, success: ''})
        }*/
    }

    const responseFacebook = async (response) => {
        console.log(response)
        try {
            const {accessToken, userID} = response
            const res = await axios.post('/user/facebook_login', {accessToken, userID})

            setUser({...user, error:'', success: res.data.msg})
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            navigate('/')
        } catch (err) {
            err.response.data.msg &&
            setUser({...user, err: err.response.data.msg, success: ''})
        }
    }

    return (
        <div className='container signin'>
            <div style={{width:400}}>

                <div>
                    <h1>Sign in to your account</h1>
                </div>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                <form className='sign-form' onSubmit={handleSubmits}>
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
                        <input type="checkbox"/>
                        <label> Remember me</label>
                    </div>
                    <button

                        // onFocus={handleSubmit(onSubmit)}
                        className='sign-btn' type='submit'>
                        Sign In
                    </button>

                    <p className='mt-5 text-center'>
                        Don't have an account yet?{' '}
                        <Link to='/signup' >
                            Sign up.
                        </Link><br/>

                    </p>
                    <p className=' text-center'>
                        <Link to='/forgot' style={{color:'#ff3300'}} >
                            Forgot your password ?
                        </Link>
                    </p>
                </form>
                {/*<div className="hr">
                    Oder With Login
                </div>
                <div className="social">
                    <GoogleLogin
                        clientId="264621632257-o8f7oj71vmqbj005uln8m76t4heh1mb8.apps.googleusercontent.com"
                        buttonText="Login with google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />

                    <FacebookLogin
                        appId=" 459091845834228"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                    />
                </div>*/}
            </div>
        </div>
    );
};

export default SignIn ;