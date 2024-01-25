import { Outlet } from "react-router-dom"
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function Root() {
  return (
    <div>
      <Navbar />
      <div className="px-6">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Root
