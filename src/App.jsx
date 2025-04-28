import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ResumePage from "./components/resumepage";
import Home from "./components/homepage";

import Homepp from "./components/landing";


function App() {


  
  return (
    <Router>

      <Routes>
  
        <Route path="/" element={<Homepp />} />
        <Route path="/generate-resume" element={<Home />} />
        <Route path="/resume/:username" element={<ResumePage />} />
      </Routes>
    </Router>
  );
}

export default App;
