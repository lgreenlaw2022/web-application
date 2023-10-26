import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ListsPage from './pages/ListsPage';
import LoginPage from './pages/LoginPage';
import ApiProvider from './contexts/ApiProvider';
import RegistrationPage from './pages/RegistrationPage';
import UserProvider from './contexts/UserProvider';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Body from './components/Body';

//TODO: make tabs consistent size for all files
export default function App() {

  
  return (
    <div className="App">
      <BrowserRouter>
        <ApiProvider>
          {console.log('Rendering ApiProvider component')}  
          <UserProvider>
            {console.log('Rendering UserProvider component')}
            <Header />
            <Routes>
              {console.log('Rendering route component')}
              <Route path="/login" element={ 
                <PublicRoute><LoginPage /></PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute><RegistrationPage /></PublicRoute>
              } />
              {/* <Route path="/" element={
                <PublicRoute>
                  <Body />
                </PublicRoute>
              } /> */}
              <Route path="*" element={
                <PublicRoute>
                  {/* <PrivateRoute> */}
                  <Routes>
                    {/* TODO: fix  */}
                    <Route path="/lists" element={<ListsPage/>}/> 
                    {/* <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} /> */}
                    <Route path="*" element={<Navigate to="/login" />} />
                  </Routes>
                  {/* </PrivateRoute> */}
                </PublicRoute> 
              }/>
            </Routes>
          </UserProvider>
        </ApiProvider>
      </BrowserRouter>
    </div>
  );
}