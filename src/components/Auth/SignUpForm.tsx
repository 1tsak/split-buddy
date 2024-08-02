

import { FaGithub, FaGoogle } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { signInWithGithub, signInWithGoogle, signUp, updateUserProfile } from "../../services/firebaseAuth";
import { User } from "../../types/types";
import { createUserDocument } from "../../services/firestore";
import { getClientCurrentToken } from "../../services/notiService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setError("");
    setLoading(true);

    if (!validatePassword(data.password)) {
      setError(t("signUpForm.passwordError"));
      setLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError(t("signUpForm.passwordMismatchError"));
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signUp(data.email, data.password,data.firstName,data.lastName);
      const user = userCredential.user;
      const token = await getClientCurrentToken();
      const newUser: User = {
        id: user.uid,
        email: user.email as string,
        displayName: `${data.firstName} ${data.lastName}`,
        groupsIn: [],
        photoURL: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deviceToken: token,
      };
      await createUserDocument(newUser);

      await updateUserProfile(user, {
        displayName: `${data.firstName} ${data.lastName}`,
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("firstName", { required: true })}
          type="text"
          name="firstName"
          placeholder={t("signUpForm.firstNamePlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
        />
        {errors.firstName && <p className="text-sm text-red-600">{t("signUpForm.firstNameError")}</p>}
        
        <input
          {...register("lastName", { required: true })}
          type="text"
          name="lastName"
          placeholder={t("signUpForm.lastNamePlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
        />
        {errors.lastName && <p className="text-sm text-red-600">{t("signUpForm.lastNameError")}</p>}
        
        <input
          {...register("email", { required: true })}
          type="email"
          name="email"
          placeholder={t("signUpForm.emailPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
        />
        {errors.email && <p className="text-sm text-red-600">{t("signUpForm.emailError")}</p>}
        
        <div className="relative">
          <input
            {...register("password", { required: true })}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t("signUpForm.passwordPlaceholder")}
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
        {errors.password && <p className="text-sm text-red-600">{t("signUpForm.passwordError")}</p>}
        
        <div className="relative">
          <input
            {...register("confirmPassword", { required: true })}
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder={t("signUpForm.confirmPasswordPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:translate-x-2 duration-700"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-2"
          >
            {!showConfirmPassword ? <IoIosEye className="text-xl" /> : <IoIosEyeOff className="text-xl" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-600">{t("signUpForm.confirmPasswordError")}</p>}
        
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
            <FaGoogle />
          </button>
          <button
            type="button"
            onClick={handleGithubSignIn}
            className="p-4 font-bold text-white bg-gray-800 rounded-full duration-700 hover:opacity-75 flex items-center justify-center"
          >
            <FaGithub />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
