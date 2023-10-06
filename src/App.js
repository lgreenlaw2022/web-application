import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
// import components

function App() {
  return (

    <div className="App">
      <Header />
      <Body />
    </div>
  );
}

export default App;


// import Container from 'react-bootstrap/Container';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/Header';
// import HomePage from './pages/HomePage';
// import AddTaskPage from './pages/AddTaskPage';
// import NavBar from './components/NavBar';

// export default function App() {
//   return (
//     <Container fluid className="App">
//       <BrowserRouter>
//         <NavBar />
//         <Header />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/addtask" element={<AddTaskPage />} />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </BrowserRouter>
//     </Container>
//   );
// }