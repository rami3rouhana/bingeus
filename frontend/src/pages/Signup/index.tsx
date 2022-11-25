import { ChangeEvent, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../../context/GlobalState";
import BoyProfile from '../../components/assets/BoyProfile.png';
import './index.css';

const SignUpPage = () => {
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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleSubmit = async (e: ChangeEvent<any>) => {
        e.preventDefault();
        const data = { name, email, password, passwordConfirmation }
        passwordConfirmation ?
            await userInfo.signup(data) :
            console.log(Error('Confirm Password'));
    }

    return (
        <div className="login-signin" id="signup-page">
            <div className="left-pannel">
                <div className="login-div-container">
                    <span className="login-title">Register</span>
                    <form method="post" action="#" id="#" onSubmit={handleSubmit}>
                        <input className="input" type='text' placeholder='Display Name' onChange={(e) => setName(e.currentTarget.value)} />
                        <input className="input" type='email' placeholder='Email' onChange={(e) => setEmail(e.currentTarget.value)} />
                        <input className="input" type='password' placeholder='Password' onChange={(e) => setPassword(e.currentTarget.value)} />
                        <input className="input" type='password' placeholder='Confirm Password' onChange={(e) => e.currentTarget.value === password ? setPasswordConfirmation(e.currentTarget.value) : Error("Passwords don't match.")} />
                        <button type='submit' id="signup-page-btn">Submit</button>
                        <div className="login-link">
                            <span className="signup-link-left">Have an account?</span>
                            <span className="signup-link-right" onClick={() => navigate('/login')} id="signup-page-color"> Login</span>
                        </div>
                    </form>
                </div>
            </div>

            <div className="right-pannel" id="signup-page-bg">
                <span className="right-pannel-hero-span">
                    “It is alway a nice experiance to have people with similar interests drop by and watch with you.”                </span>
                <div className="user-quote">
                    <img src={BoyProfile} />
                    <span>
                        Marvin McKinney
                    </span>
                </div>
            </div>
        </div>
    )
}
export default SignUpPage;