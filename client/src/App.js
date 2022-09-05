import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// screens
import { Register } from './screens/Auth/Register';
import { ActivationEmail } from './screens/Auth/ActivationEmail';
import { SetAvatar } from './screens/SetAvatar/SetAvatar';
import { Login } from './screens/Auth/Login';
import { ForgotPassword } from './screens/Auth/ForgotPassword';
import { ResetPassword } from './screens/Auth/ResetPassword';
import { Chat } from './screens/Chat/Chat';
import { NotFound } from './screens/NotFound/NotFound';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/user/activate/:activation_token' element={<ActivationEmail />} />
          <Route path='/setAvatar' element={<SetAvatar />} />
          
          <Route path='/login' element={ <Login /> } />
          <Route path='/forgot_password' element={ <ForgotPassword /> } />
          <Route path='/user/reset/:token' element={ <ResetPassword /> } />

          <Route path='/' element={<Chat />} />          
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>      
    </>
  );
}

export default App;
