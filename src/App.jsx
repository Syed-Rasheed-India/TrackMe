import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./App.css";
import FocusStats from "./components/FocusStats";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <FocusStats />
    </div>
  );
}

export default App;