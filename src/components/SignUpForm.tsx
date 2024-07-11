import React, { useState } from "react";
import { signUp, signIn, updateUserProfile } from "../services/firebaseAuth"; // import signIn
import { createUserDocument } from "../services/firestore";
import { User } from "../utils/types";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // import useNavigate

const SignUpForm: React.FC = () => {
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
  const navigate = useNavigate(); // useNavigate hook

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

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, numeric, and special characters."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signUp(email, password);
      const defaultProfileImageUrl = "https://example.com/default-profile-image.png"; // this is a temp link just for demo
      const displayName = `${firstName} ${lastName}`;

      // await updateUserProfile(userCredential.user, {
      //   displayName,
      //   photoURL: defaultProfileImageUrl,
      // });

      const newUser: User = {
        id: userCredential.user.uid,
        email,
        displayName,
        photoURL: defaultProfileImageUrl,
        groupsIn: [],
        createdAt: "", 
        updatedAt: ""  
      };

      await createUserDocument(newUser);
      await updateUserProfile(userCredential.user, {
        displayName,
        photoURL: defaultProfileImageUrl,
      });
      // Automatically sign in the user
      await signIn(email, password);

      setLoading(false);
      navigate("/dashboard"); // Navigate to the dashboard
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-4 md:p-6 lg:px-10">
      <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
      <p className="text-gray-600 mb-6">
        You'll need a valid email to confirm your registration.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
