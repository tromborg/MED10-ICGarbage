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
import { userSessionDb } from "./components/SessionDB";
import { setLogin } from "./store/reducers/login";
import { AppDispatch } from "./store/store";
import { useDispatch } from "react-redux";
import { FunctionComponent, useEffect} from "react";

const App: FunctionComponent = () => {
  const loginDispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.login.isLoggedIn);
  useEffect(() => {
    const SetLoginSesh = async () => {
        let usersesh = await userSessionDb.getUserFromSessionDb();
        if (usersesh !== undefined){
          loginDispatch(setLogin(usersesh.isLoggedIn!));
        } else {
          loginDispatch(setLogin(false));
        }
    }
    SetLoginSesh();
    console.log("check");
  }, []);

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
