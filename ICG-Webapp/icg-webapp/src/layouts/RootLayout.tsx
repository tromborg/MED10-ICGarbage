import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import themes from '../design/themes';
const RootLayout = () => {
    return (
        <div>
            <Navbar/>
            <div style={{backgroundColor: themes.primaryColours.white}}>
                <Outlet />
            </div>
        </div>
    )
}

export default RootLayout;