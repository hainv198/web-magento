import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Header from "./Components/Header/Header";
import Home from "./Page/Home/Home";
import Contact from "./Page/Contact/Contact";
import About from "./Page/About/About";
import Nopage from "./Page/Nopage/Nopage";
import Login from "./Components/Auth/SignIn";
import SignUp from "./Components/Auth/SignUp";
import ActivationEmail from "./Components/Auth/Validate/ActivationEmail";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import axios from "axios";
import {dispatchGetUser, dispatchLogin, fetchUser} from "./Redux/Acctions/authAcction";
import ForgotPassword from "./Components/Auth/ForgotPass";
import ResetPassword from "./Components/Auth/ResetPassword";
import Profile from "./Components/Auth/Profile";
import EditUser from "./Components/Auth/Profile/EditUser";
import Admin from "./Admin/Admin";
import MyAccount from "./Admin/Page/MyAccount";
import Product from "./Admin/Page/Product";
import Sidebar from "./Admin/Layout/SideBar";
import HomeAdmin from "./Admin/Page/Home";


function App() {

    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)

    const {isLogged} = auth

    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            const getToken = async () => {
                const res = await axios.post('/user/refresh_token', null)
                console.log(res)
                dispatch({type: 'GET_TOKEN', payload: res.data.access_token})
            }
            getToken()
        }
    },[auth.isLogger, dispatch])

    useEffect(() => {
        if(token) {
            const getUser = () => {
                dispatch(dispatchLogin())
                return fetchUser(token).then(res => {
                    dispatch(dispatchGetUser(res))
                })
            }
            getUser();
        }
    },[token, dispatch])

  return (
        <Router>
            <Routes>
                <Route path='/' element={<Header/>}>
                    <Route index element={<Home/>}/>
                    <Route path='/contact' element={<Contact/>}/>
                    <Route path='/About' element={<About/>}/>
                    <Route path='/login' element={ <Login/>}/>
                    <Route path='/signup' element={<SignUp/>}/>
                    <Route path='/forgot' element={<ForgotPassword/>}/>
                    <Route path='/profile' element={<Profile/>}/>
                    <Route  path="/user/reset/:token" element={<ResetPassword/>}/>
                    <Route path='/user/activate/:activation_token'element={<ActivationEmail/>}/>
                    <Route  path="/edit_user/:id" element={<EditUser/>}/>
                    <Route path='*' element={<Nopage/>}/>
                </Route>
                <Route path="/admin" element={<Admin/>}>
                    <Route index element={<HomeAdmin/>}/>
                    <Route path='home/employee' element={<MyAccount/>}/>
                    <Route path='home/products' element={<Product/>}/>
                    <Route path='*' element={<Nopage/>}/>
                </Route>
            </Routes>

        </Router>
  );
}

export default App;


