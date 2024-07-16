import { Link } from "react-router-dom";
import HeroSection from "./HeroSection"
const Header = () => {
  return (
    <>
      <div className="px-10 h-screen flex  flex-col">
        <div className="h-[10%] flex justify-between items-center">
            <div className="w-40"> 
            <Link  to={"/"}>
            <span className="font-semibold text-main ">
          <img src="logo_main.png" alt="site logo" />
        </span>
            </Link>
            </div>
            <div className="flex gap-5 items-center">
            <Link className="" to={"/signup"}>Sign up</Link>
            <Link className="px-3 py-2 text-white bg-main rounded-md" to={"/login"}>Login</Link>
            </div>
        </div>
        <div className="h-[90%] px-2 md:px-10 flex flex-col justify-center md:flex-row md:justify-evenly md:gap-4 ">
            <HeroSection/>
        </div>
      </div>
    </>
  )
};

export default Header
