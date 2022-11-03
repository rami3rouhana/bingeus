import { useContext, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";

const LoginPage = () => {
    const userInfo = useContext(GlobalStateContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        const data = { email, password }
        await userInfo.login(data);
    }

    return (
        <>
            <input type='text' placeholder='Email' onChange={(e) => { setEmail(e.currentTarget.value) }} />
            <input type='password' placeholder='Password' onChange={(e) => { setPassword(e.currentTarget.value) }} />
            <button onClick={handleSubmit}>Login</button>
        </>
    )
}
export default LoginPage;