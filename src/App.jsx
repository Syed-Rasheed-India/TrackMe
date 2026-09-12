import { BrowserRouter, Route, Routes } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./App.css";
import FocusStats from "./components/FocusStats";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Pomodoro from "./components/Pomodoro";
import Revision from "./components/Revision";
import DueToday from "./components/DueToday";
import Overdue from "./components/Overdue";
import Scheduled from "./components/Scheduled";
import Completed from "./components/Completed";
function Home() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <FocusStats />
      <Footer/>
    </div>
  );
}

function App(){
  return(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pomodoro" element={<Pomodoro/>}></Route>
            <Route path="/revision" element={<Revision/>}></Route>
            <Route path="/revision/due-today" element={<DueToday />} />
            <Route path="/revision/overdue" element={<Overdue />} />
            <Route path="/revision/scheduled" element={<Scheduled />} />
            <Route path="/revision/completed" element={<Completed />} />
        </Routes>

    </BrowserRouter>
  )
}



export default App;