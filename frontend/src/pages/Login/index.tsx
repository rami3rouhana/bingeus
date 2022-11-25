import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../../context/GlobalState";
import './index.css';
import GirlProfile from '../../components/assets/GirlProfile.png';

const LoginPage = () => {
    const userInfo = useContext(GlobalStateContext);
    const navigate = useNavigate();
    const auth: any = async () => {
        await userInfo.auth();
        if (userInfo.user.loggedIn) {
            navigate('/');
        }
    };
    useEffect(() => {
        auth();
    })
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        const data = { email, password }
        await userInfo.login(data);
    }

    return (
        <div className="login-signin">
            <div className="left-pannel">
                <div className="login-message">
                    <span>
                        Welcome Back
                    </span>
                </div>
                <div className="login-div-container">
                    <span className="login-title">Login</span>
                    <input className="input" type='text' placeholder='Email' onChange={(e) => { setEmail(e.currentTarget.value) }} />
                    <input className="input" type='password' placeholder='Password' onChange={(e) => { setPassword(e.currentTarget.value) }} />
                    <button onClick={handleSubmit}>Login</button>
                    <div className="signup-link">
                        <span className="signup-link-left">Don’t have an account?</span>
                        <span className="signup-link-right" onClick={() => navigate('/signup')}> Signup</span>
                    </div>
                </div>
            </div>
            <div className="right-pannel" id="left-pannel">
                <span className="right-pannel-hero-span">
                    “You made it so simple. My friends and I can now watch all the movies and series together...”
                </span>
                <div className="user-quote">
                    <img src={GirlProfile} />
                    <span>
                        Leslie Alexander
                    </span>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;