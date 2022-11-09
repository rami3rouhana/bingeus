import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import MainPage from './pages/Main';
import ProfilePage from './pages/Profile';
import SignUpPage from './pages/Signup';
import TheaterPage from './pages/Theater';

const Main = () => {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/theater" element={<TheaterPage />} />
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
}
export default Main;