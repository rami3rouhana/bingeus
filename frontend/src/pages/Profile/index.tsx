import BlockList from "../../components/screen/BlockList";
import UserInfo from "../../components/screen/UserInfo";
import UserTheaters from "../../components/screen/UserTheaters";
import { useContext, useEffect, ReactElement, } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import { useNavigate } from "react-router-dom";
import './index.css';
import LogoutButton from '../../components/assets/LogoutButton.svg';
import BuLogo from '../../components/assets/BuLogo.png';

const ProfilePage: () => ReactElement<any, any> = () => {
    const userInfo = useContext(GlobalStateContext);
    const navigate = useNavigate();
    useEffect(() => {
        const auth = async () => {
            await userInfo.auth();
            if (!userInfo.user.loggedIn) {
                navigate('/login');
            }
        }
        auth();
    }, [])

    return (
        <div className="profile-page">
            <div className="header">
                <img src={BuLogo} onClick={() => navigate('/')}/>
                <div className="user-display">{
                    userInfo.user.loggedIn ?
                        <><div className="user-profile-header" onClick={() => navigate('/profile')}><img src={`http://localhost/image/` + userInfo.user.image} /><span className="display-user-name">{userInfo.user.name}</span></div><img onClick={() => { userInfo.logout(); window.location.reload(); }} className="logout-button" src={LogoutButton} /></> :
                        <><button className="user-edit-btn" onClick={() => navigate('login')}>Sign In</button></>

                }</div>
            </div>
            <div className="page-content">
                <div className="user-info-bar">
                    <UserInfo />
                    <BlockList />
                </div>
                <div>
                    <h1>Your Theatres</h1>
                    <div className="profile-theaters">
                        <UserTheaters />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProfilePage;