import React, { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './components/Navbar';
import { AppRouter } from './components/AppRouter';
import { check } from './http/userAPI';
import { RootContext } from './context/RootContext';

const App: React.FC = () => {
  const { user } = useContext(RootContext)

  useEffect(() => {
    check().then(data => {
      user.userName = data.userLogin;
      user.isAuth = true;
      console.log('user.isAuth = true');
    })
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
