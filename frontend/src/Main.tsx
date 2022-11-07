import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import SignUpPage from './pages/Signup';

const Main = () => {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  );
}
export default Main;