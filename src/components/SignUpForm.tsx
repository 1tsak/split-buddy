import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { signUp, signInWithGoogle, signInWithGithub, updateUserProfile } from "../services/firebaseAuth"; 
import { createUserDocument } from "../services/firestore";
import { User } from "../utils/types";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom"; 
import { FaGoogle, FaGithub } from "react-icons/fa";
import { getClientCurrentToken } from "../services/notiService";

const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validatePassword(formData.password)) {
      setError(t("signUpForm.passwordError"));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("signUpForm.passwordMismatchError"));
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signUp(formData.email, formData.password);
      const user = userCredential.user;
      const token = await getClientCurrentToken();
      const newUser: User = {
        id: user.uid,
        email: user.email as string,
        displayName: user.displayName as string,
        groupsIn: [],
        photoURL: "",
        createdAt: Date(),
        updatedAt: Date(),
        deviceToken: token,
      };
      await createUserDocument(newUser);

      await updateUserProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
        photoURL: "",
      });

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

  return (
    <div className="w-full max-w-md mx-auto py-4 md:p-6 lg:px-10">
      <h1 className="text-2xl font-bold mb-2">{t("signUpForm.title")}</h1>
      <p className="text-gray-600 mb-6">{t("signUpForm.description")}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder={t("signUpForm.firstNamePlaceholder")}
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder={t("signUpForm.lastNamePlaceholder")}
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={t("signUpForm.emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("signUpForm.passwordPlaceholder")}
            value={formData.password}
            onChange={handleChange}
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
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={t("signUpForm.confirmPasswordPlaceholder")}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2"
          >
            {!showConfirmPassword ? <IoIosEye className="text-xl" /> : <IoIosEyeOff className="text-xl" />}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 font-bold text-white bg-[#576cce] rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? t("signUpForm.signingUpButton") : t("signUpForm.signUpButton")}
        </button>
        <div className="flex gap-4 mt-4 w-full justify-center">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="p-4 font-bold text-white bg-red-600 rounded-3xl duration-700 hover:opacity-75 flex items-center justify-center"
          >
            <FaGoogle className="" />
            
          </button>
          <button
            type="button"
            onClick={handleGithubSignIn}
            className="p-4 font-bold text-white bg-gray-800 rounded-full duration-700 hover:opacity-75 flex items-center justify-center"
          >
            <FaGithub className="" />
           
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
