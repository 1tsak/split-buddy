import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "../components/LanguageSwitcher";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-[100vh] flex flex-row relative bg-red-100">
      
      <div className="h-[100vh] w-[30%] bg-[#576cce]"></div>
      <div className="h-[100vh] w-[70%] flex flex-col justify-center items-center object-contain bg-white">
        <img src="./image.png" className="w-[50%]" alt="splitbuddy" />
     
      </div>
      <div className="w-full h-[10vh] absolute top-0 left-0 flex flex-row px-10 items-center justify-between">
        <div className="flex  text-white gap-2 flex-row items-center justify-center">
          <Link to="/">
            <h1 className="text-2xl font-[600]">{t('sb')}</h1>
          </Link>
         
        </div>
        <LanguageSwitcher />
      </div>
      <div className="lg:w-[25%] min-[600px]:w-[90%] flex flex-col items-center lg:-translate-y-1/2 shadow-lg shadow-slate-500 lg:h-fit min-[600px]:h-[90vh] bg-white z-[10] rounded-[16px] absolute lg:top-1/2 sm:top-10 lg:left-[17%] sm:left-1/2">
        <LoginForm />
        <div className="">
          {t('dont_have_account')}
          <button className="p-2 text-blue-800 hover:opacity-70 duration-500">
            <Link to="/signup"><b>{t('signup')}</b></Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
