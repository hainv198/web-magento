import React from 'react'
import './notification.scss'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
export const showErrMsg = (msg) => {
    return(
        <div className="errMsg">
            <div className='left_err'>
            </div>
            <div className='message'>
                <ReportProblemIcon/>
                <span>{msg}</span>
            </div>
        </div>
        )

}

export const showSuccessMsg = (msg) => {
    return(
        <div className="successMsg">
            <div className='left_success'>
            </div>
                <div className='success'>
                <CheckCircleOutlineIcon/>
                <span>{msg}</span>
            </div>
        </div>
    )
}