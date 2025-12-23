import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashBoard from './pages/DashBoard';
import FindGroup from './pages/FindGroup';
import MyGroups from './pages/MyGroups';
import ProfilePage from './pages/Profile';
import Settings from './pages/Settings';
// import Navbar from './componets/Navbar';
import MainLayout from './layouts/MainLayout';
import CreateGroups from './pages/CreateGroup';
import Conversation from './pages/Conversation';
import { SocketProvider } from './context/SocketProvider';

function App() {

  return (
    <SocketProvider>
      <Routes>


        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/find-group" element={<FindGroup />} />
          <Route path="/my_groups" element={<MyGroups />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/setting" element={<Settings />} />
          <Route path="/createGroups" element={<CreateGroups />} />
        </Route>
        <Route path="/conversation/:id" element={<Conversation />} />
      </Routes>
    </SocketProvider>

  )
}

export default App
