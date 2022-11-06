import BlockList from "../../components/ui/BlockList";
import UserInfo from "../../components/ui/UserInfo";
import UserTheaters from "../../components/ui/UserTheaters";
import { useContext, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";

const ProfilePage = () => {
    const userInfo = useContext(GlobalStateContext);

    return (
        <>
            <UserInfo />
            <BlockList />
            <UserTheaters />
        </>
    )
}
export default ProfilePage;