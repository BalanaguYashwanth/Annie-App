import './App.css';
import {Home} from './screens/Home';
import Dashboard from './screens/Dashboard';
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routers>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
      <Routes>
      <Route path='/leaderboard' element={<Dashboard/>} />
      </Routes>
    </Routers>
  );
}

export default App;
{/* <Route index element={<Home />} /> */}