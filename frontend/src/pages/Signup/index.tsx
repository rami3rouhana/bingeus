import { ChangeEvent, useContext, useState } from "react";
import { GlobalStateContext } from "../../context/GlobalState";

const SignUpPage = () => {
    const userInfo = useContext(GlobalStateContext);

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
        <form method="post" action="#" id="#" onSubmit={handleSubmit}>
            <input type='text' placeholder='Display Name' onChange={(e) => setName(e.currentTarget.value)} />
            <input type='email' placeholder='Email' onChange={(e) => setEmail(e.currentTarget.value)} />
            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.currentTarget.value)} />
            <input type='password' placeholder='Confirm Password' onChange={(e) => e.currentTarget.value === password ? setPasswordConfirmation(e.currentTarget.value) : Error("Passwords don't match.")} />
            <button type='submit'>Submit</button>
        </form>
    )
}
export default SignUpPage;