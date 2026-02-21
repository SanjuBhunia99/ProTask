import React, { useState } from "react";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import axios from "axios";
import {
  BUTTONCLASSES,
  Inputwrapper,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../assets/dummy.jsx";

const API_URL = "http://localhost:8085";



const INITIAL_FORM = { name: "", email: "", password: "" };
const FIELDS = [
  {
    name: "name",
    type: "text",
    placeholder: "Full Name",
    icon: User,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email Address",
    icon: Mail,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: Lock,
  },
];

const Signup = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/register`,
        formData,
      );

      console.log("Signup Successful:", data);

      setMessage({
        text: "Registration successful! You can now log in.",
        type: "success",
      });

      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error("Signup error:", err);
      setMessage({
        text:
          err.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-blue-100 rounded-xl p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-700 rounded-full mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Join ProTask to manage your tasks
        </p>
      </div>

      {message.text && (
        <div
          className={
            message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR
          }
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-blue-500 w-5 h-5 mr-2" />

            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
          </div>
        ))}

        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Signing Up..."
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Sign Up
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchMode}
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
