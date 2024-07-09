import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="px-10 pt-6 flex justify-between">
        <div>
          <Link  to={"/"}>
            <h2 className="text-2xl" >Split-Buddy</h2>
          </Link>
        </div>
        <div className="flex gap-5 items-center">
          <Link className="" to={"/signup"}>Sign up</Link>
          <Link className="px-3 py-2 text-white bg-blue-500 rounded-md" to={"/login"}>Login</Link>
        </div>
      </div>
    </>
  )
};

export default Header
