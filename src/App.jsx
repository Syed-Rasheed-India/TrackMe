import { BrowserRouter, Route, Routes } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./App.css";
import FocusStats from "./components/FocusStats";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Pomodoro from "./components/Pomodoro";
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
        </Routes>

    </BrowserRouter>
  )
}



export default App;