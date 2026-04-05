import { LogIn, Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BUTTON_CLASSES, INPUTWRAPPER } from "../assets/dummy.jsx";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const INITIAL_FORM = { email: "", password: "" };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        
        const { data } = await API.get("/api/user/me");

        if (data?.success) {
          const userId = data.user?.id || data.user?._id;

          onSubmit?.({ token, userId, ...data.user });

          toast.success("Session restored.");
          navigate("/");
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    })();
  }, [navigate, onSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      
      const { data } = await API.post("/api/user/login", formData);

      if (!data?.token) {
        throw new Error(data?.message || "Login failed");
      }

      const userId = data.user?.id || data.user?._id;

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", userId);

      setFormData(INITIAL_FORM);

      onSubmit?.({
        token: data.token,
        userId,
        ...data.user,
      });

      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchModel = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  const FIELDS = [
    {
      name: "email",
      type: "email",
      placeholder: "Email Address",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-blue-100 rounded-xl p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-700 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to continue to ProTask
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={INPUTWRAPPER}>
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

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-3 w-3 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 block text-sm text-gray-700"
          >
            Remember Me
          </label>
        </div>

        <button type="submit" className={BUTTON_CLASSES} disabled={loading}>
          {loading ? (
            "Logging in..."
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Login
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
          onClick={handleSwitchModel}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;