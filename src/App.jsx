import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ResumePage from "./components/resumepage";
import Home from "./components/homepage";
import PrintStyles from "./print";

function App() {
  return (
    <Router>
      <PrintStyles/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume/:username" element={<ResumePage />} />
      </Routes>
    </Router>
  );
}

export default App;
