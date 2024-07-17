import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HeroSection from "./HeroSection";

const Header = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userPhoto,setUserPhoto]= useState("");
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      const photoUrl=user?.photoURL;
      setUserPhoto(photoUrl);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="px-10 h-screen flex flex-col">
      <div className="h-[10%] flex justify-between items-center">
        <div className="w-40">
          <Link to="/">
            <img src="logo_main.png" alt="site logo" className="font-semibold text-main" />
          </Link>
        </div>
        {authenticated ? (
          <Link to='/dashboard'>
          <img src={userPhoto} alt="userPhoto" className="h-10 rounded-full"/></Link>
        ) : (
          <div className="flex gap-5 items-center">
            <Link to="/signup">Sign up</Link>
            <Link className="px-3 py-2 text-white bg-main rounded-md" to="/login">
              Login
            </Link>
          </div>
        )}
      </div>
      <div className="h-[90%] px-2 md:px-10 flex flex-col justify-center md:flex-row md:justify-evenly md:gap-4">
        <HeroSection />
      </div>
    </div>
  );
};

export default Header;
