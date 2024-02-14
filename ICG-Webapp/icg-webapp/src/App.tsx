import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import RootLayout from "./layouts/RootLayout";
function App() {
  return (
    
    <Routes>
      <Route path="/" element={<RootLayout/> }>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>
    </Routes>
    
  );
}

export default App;
