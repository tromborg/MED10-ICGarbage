import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/Users";
import RootLayout from "./layouts/RootLayout";
import LoginPage from "./components/UserComponents/LoginPage";
import SignupPage from "./components/UserComponents/SignupPage";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);

  return (
    <Routes>
      {!isLoggedIn ? (
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      ) : (
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
