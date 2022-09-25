import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import './Activation.scss'
import {Link} from 'react-router-dom'
import {showErrMsg, showSuccessMsg} from "../../Utils/Notification";


function ActivationEmail() {
    const {activation_token} = useParams()
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if(activation_token){
            const activationEmail = async () => {
                try {
                    const res = await axios.post('/user/activation', {activation_token})
                    setSuccess(res.data.msg)
                } catch (err) {
                    err.response.data.msg && setErr(err.response.data.msg)
                }
            }
            activationEmail()
        }
    },[activation_token])

    return (
        <div className='acction_submit' style={{margin:"auto"}}>
            {(success && showErrMsg(success)) ?
                <div className="active_page">
                    {success && showSuccessMsg(success)}
                {/*{err && showErrMsg(err)}*/}
                    <Link to='/login'>
                        <button className="learn-more">
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Sign in</span>
                        </button>
                    </Link>
                </div> :
                <div className="active_page">
                    {/*{success && showSuccessMsg(success)}*/}
                    {err && showErrMsg(err)}
                    <Link to='/'>
                        <button className="learn-more">
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Go to home !</span>
                        </button>
                    </Link>
                </div>
            }
        </div>
    )
}

export default ActivationEmail