import { Route,Routes } from "react-router-dom"
import ProtectedRoute from "./authentication/ProtectedRoute"
import Home from "./pages/Home"
import AuthCallback from "./authentication/AuthCallback"
import About from "./pages/About"
import Layout from "./components/main/Layout"
import UserForm from "./components/forms/UserForm"
import Notfound from "./pages/Notfound"
import Events from "./pages/Events"
import EventForm from "./components/forms/EventForm"
import CalendarView from "./pages/CalenderView"
const App = () => {
  return (
    <Layout>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/auth/callback" element={<AuthCallback/>}/>
        <Route path="/about" element={<About/>}/>

        <Route element={<ProtectedRoute/>}/>

        <Route path="/user/form" element={<UserForm/>}/>
        <Route path="/events" element={<Events/>}/>
        <Route path="/events/create" element={<EventForm/>}/>
        <Route path="/calender" element={<CalendarView/>}/>





        <Route path="*" element={<Notfound/>}/>
        
    </Routes>
    </Layout>
  )
}

export default App