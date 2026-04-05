import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Profile from "./components/Profile.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import PendingPage from "./pages/PendingPage.jsx";
import CompletePage from "./pages/CompletePage.jsx";

const App = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

    useEffect(() => {
      if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("currentUser");
      }
    }, [currentUser]);

    const handleAuthSubmit = (data) => {
      const user = {
        email: data.email,
        name: data.name || "User",
        avatar: "",
      };
      localStorage.setItem("token", data.token);
      setCurrentUser(user);

      navigate("/", { replace: true });
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);

      navigate("/login", { replace: true });
    };
   
      //   const ProtectedLayout = () => (
      //     <Layout user={currentUser} onLogout={handleLogout}>
      //       <Outlet />
      //     </Layout>
      //   );
  const isAuthenticated = !!localStorage.getItem("token");

  const ProtectedLayout = () => {
    return isAuthenticated ? (
      <Layout user={currentUser} onLogout={handleLogout} />
    ) : (
      <Navigate to="/login" replace />
    );
  };
return (
    <Routes>
      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <Signup
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />
         <Route
        path="/login"
        element={
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />
           <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/complete" element={<CompletePage />} />

        <Route
          path="/profile"
          element={
            <Profile setCurrentUser={setCurrentUser} onLogout={handleLogout} />
          }
        />
      </Route>

    
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;


  //       <Route
      //         element={
      //           currentUser ? <ProtectedLayout /> : <Navigate to="/signup" replace />
      //         }
      //       >
      //         <Route path="/" element={<Dashboard />} />
      //         <Route path="/pending" element={<PendingPage />} />
      //         <Route path="/complete" element={<CompletePage />} />
      //        
      //       </Route>
