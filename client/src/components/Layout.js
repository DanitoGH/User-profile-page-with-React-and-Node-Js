import { Outlet } from "react-router-dom";
import Navbar from './Navbar/Navbar'

const Layout = () => {
    return (
       <main className="App">
           <Navbar />
         <div className="wrapper">
            <Outlet />
          </div> 
      </main>
    );
}

export default Layout;