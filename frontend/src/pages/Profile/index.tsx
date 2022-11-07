import BlockList from "../../components/ui/BlockList";
import UserInfo from "../../components/ui/UserInfo";
import UserTheaters from "../../components/ui/UserTheaters";
import { useContext, useEffect, ReactElement, } from "react";
import { GlobalStateContext } from "../../context/GlobalState";
import { useNavigate } from "react-router-dom";

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
        <>
            <UserInfo />
            <BlockList />
            <UserTheaters />
        </>
    )
}
export default ProfilePage;