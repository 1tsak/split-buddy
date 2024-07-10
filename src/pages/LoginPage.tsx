import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState<boolean>(true);

  const toggleForm = () => {
    setLogin(!login);
  };

  return (
    <div className="w-full h-[100vh] flex flex-row relative bg-red-100">
      <div className="h-[100vh] w-[30%] bg-[#576cce]"></div>
      <div className="h-[100vh] w-[70%] flex flex-col justify-center items-center object-contain bg-white">
        <img src="./image.png" className="w-[50%]" alt="splitbuddy" />
      </div>
      <div className="w-full h-[10vh] absolute top-0 left-0 flex flex-row px-10 items-center justify-between">
        <div className="flex text-white gap-2 flex-row items-center justify-center">
          <h1 className="text-2xl font-[600]">SB</h1>
          <h1 className="text-xl">splitbuddy</h1>
        </div>
        <h1>home</h1>
      </div>
      <div className="w-[25%] flex flex-col justify-center items-center shadow-lg shadow-slate-500 h-[70vh] bg-white z-[10] rounded-[16px] absolute top-1/2 left-[17%] transform  -translate-y-1/2">
        {login ? <LoginForm /> : <SignUpForm />}
        <div className="absolute bottom-10">
        {login ? "Dont have an account" : "have an account?"}
        <button
          onClick={toggleForm}
          className="mt-4 p-2 text-[#576cce]"
        >
          {login ? " Signup" : "Login"}
        </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
