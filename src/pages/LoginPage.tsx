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
      <div className="lg:w-[25%] min-[600px]:w-[90%] flex flex-col items-center lg:-translate-y-1/2 shadow-lg shadow-slate-500 lg:h-fit min-[600px]:h-[90vh] bg-white z-[10] rounded-[16px] absolute lg:top-1/2 sm:top-10 lg:left-[17%] sm:left-1/2">
        {login ? <LoginForm /> : <SignUpForm />}
        <div className="">
          {login ? "Don't have an account?" : "Have an account?"}
          <button onClick={toggleForm} className="p-2 text-[#576cce]">
            {login ? "Signup" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
