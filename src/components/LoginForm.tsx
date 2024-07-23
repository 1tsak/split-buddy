import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { signIn, signInWithGoogle, signInWithGithub } from "../services/firebaseAuth";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FaGoogle, FaGithub } from "react-icons/fa";
import PasswordResetForm from "./PasswordResetForm";
import { useTranslation } from 'react-i18next';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2"
          >
            {!showPassword ? <IoIosEye className="text-xl" /> : <IoIosEyeOff className="text-xl" />}
          </button>
        </div>
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
            className=" p-4 font-bold text-white bg-gray-800 rounded-full  duration-700 hover:bg-gray-900 flex items-center justify-center"
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
