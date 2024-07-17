import React, { useState } from "react";
import { resetPassword, checkUserExists } from "../services/firebaseAuth";

interface PasswordResetFormProps {
  onClose: () => void;
  onNotification: (message: string) => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onClose, onNotification }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userExists = await checkUserExists(email);
      if (!userExists) {
        setError("User not found.");
        return;
      }
      
      await resetPassword(email);
      onNotification("Password reset email sent.");
      onClose();
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-[#576cce] rounded-md hover:bg-blue-600"
          >
            Send Reset Email
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PasswordResetForm;
