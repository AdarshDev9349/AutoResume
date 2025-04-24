import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ResumePage from "./components/resumepage";
import Home from "./components/homepage";
import PrintStyles from "./print";
import { useEffect } from "react";

function App() {
// React POST request
useEffect(()=>{
  const fetchData = async () => {
    const response = await fetch("http://localhost:5000/api/linkedin-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ linkedinUrl: "https://www.linkedin.com/in/example" })
    });
    const data = await response.json();
    console.log(data);
  };

  fetchData();
}

,[])

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume/:username" element={<ResumePage />} />
      </Routes>
    </Router>
  );
}

export default App;
