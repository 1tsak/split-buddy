
import { FaGithub, FaGoogle } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn, signInWithGithub, signInWithGoogle } from "../../services/firebaseAuth";
import PasswordResetForm from "./PasswordResetForm";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setError("");
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      navigate("/dashboard");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleForgotPassword = () => {
    setShowResetForm(true);
  };

  const closeResetForm = () => {
    setShowResetForm(false);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 md:p-6 lg:px-10">
      <h1 className="text-2xl font-bold mb-2">{t('welcome_back')}</h1>
      <p className="text-gray-600 mb-6">{t('please_log_in')}</p>
      {notification && <div className="mb-4 text-green-600">{notification}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email", { required: true })}
          type="email"
          name="email"
          placeholder={t('email')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
        />
        {errors.email && <p className="text-sm text-red-600">{t('email_error')}</p>}
        
        <div className="relative">
          <input
            {...register("password", { required: true })}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2"
          >
            {!showPassword ? <IoIosEye className="text-xl" /> : <IoIosEyeOff className="text-xl" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{t('password_error')}</p>}
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 font-bold text-white bg-[#576cce] rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? t('logging_in') : t('log_in')}
        </button>
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-slate-700 text-sm w-full text-center"
        >
          {t('forgot_password')}
        </button>
        
        <div className="flex gap-4 mt-4 w-full justify-center">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="p-4 font-bold text-white bg-red-600 rounded-3xl duration-700 hover:bg-red-700 flex items-center justify-center"
          >
            <FaGoogle />
          </button>
          <button
            type="button"
            onClick={handleGithubSignIn}
            className="p-4 font-bold text-white bg-gray-800 rounded-full duration-700 hover:bg-gray-900 flex items-center justify-center"
          >
            <FaGithub />
          </button>
        </div>
      </form>
      
      {showResetForm && (
        <PasswordResetForm onClose={closeResetForm} onNotification={showNotification} />
      )}
    </div>
  );
};

export default LoginForm;
