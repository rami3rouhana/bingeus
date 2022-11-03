import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';

const Main = () => {

  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  );
}
export default Main;