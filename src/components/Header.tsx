import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useTranslation } from 'react-i18next';
import HeroSection from "./HeroSection";
import LanguageSwitcher from "./LanguageSwitcher";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [authenticated, setAuthenticated] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      const photoUrl = user?.photoURL || "";
      setUserPhoto(photoUrl);
    });

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
            <img src={userPhoto} alt="userPhoto" className="h-10 rounded-full" />
            <LanguageSwitcher />
          </Link>
        ) : (
          <div className="flex gap-5 items-center">
            <Link to="/signup">{t('signup')}</Link>
            <Link className="px-3 py-2 text-white bg-main rounded-md" to="/login">
              {t('login')}
             
            </Link>
            <LanguageSwitcher />
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
