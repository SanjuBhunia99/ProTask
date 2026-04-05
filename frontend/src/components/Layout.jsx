// import React, { useCallback, useEffect, useState, useMemo } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import { useNavigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import { Circle, Clock, TrendingUp, Zap } from "lucide-react";

// const API_BASE = "https://protask-backend-7znq.onrender.com/api/tasks";

// const Layout = ({ onLogout, user }) => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//    const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         navigate("/login");
//         return;
//       }




//       const arr = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.tasks)
//           ? data.tasks
//           : Array.isArray(data?.data)
//             ? data.data
//             : [];

//       setTasks(arr);
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Could not load tasks.");
//       if (err.response?.status === 401) onLogout();
//     } finally {
//       setLoading(false);
//     }
//   }, [onLogout]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   const stats = useMemo(() => {
//     const completedTasks = tasks.filter(
//       (t) =>
//         t.completed === true ||
//         t.completed === 1 ||
//         (typeof t.completed === "string" &&
//           t.completed.toLowerCase() === "yes"),
//     ).length;

//     const totalCount = tasks.length;
//     const pendingCount = totalCount - completedTasks;
//     const completionPercentage = totalCount
//       ? Math.round((completedTasks / totalCount) * 100)
//       : 0;

//     return {
//       totalCount,
//       completedTasks,
//       pendingCount,
//       completionPercentage,
//     };
//   }, [tasks]);

//   const StatCard = ({ title, value, icon }) => (
//     <div className="p-2 sm:p-3 rounded-xl bg-white shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300 hover:border-blue-200 group">
//       <div className="flex items-center gap-2">
//         <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500/10 to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20">
//           {icon}
//         </div>
//         <div className="min-w-0">
//           <p className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
//             {value}
//           </p>
//           <p className="text-xs text-gray-500 font-medium">{title}</p>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
//       </div>
//     );

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
//         <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md">
//           <p className="font-medium mb-2">Error loading tasks</p>
//           <p className="text-sm">{error}</p>
//           <button
//             onClick={fetchTasks}
//             className="mt-4 py-2 px-4 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar user={user} onLogout={onLogout} />
//       <Sidebar user={user} tasks={tasks} />

//       <div className="ml-0 xl:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
//           <div className="xl:col-span-2 space-y-3 sm:space-y-4">
//             <Outlet context={{ tasks, refreshTask: fetchTasks }} />
//           </div>

//           <div className="xl:col-span-1 space-y-4 sm:space-y-6">

//             <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-blue-100">
//               <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
//                 <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
//                 Task Statistics
//               </h3>

//               <div className="grid grid-cols-2 gap-3 sm:mb-6">
//                 <StatCard
//                   title="Total Tasks"
//                   value={stats.totalCount}
//                   icon={<Circle className="w-4 h-4 text-blue-500" />}
//                 />
//                 <StatCard
//                   title="Completed"
//                   value={stats.completedTasks}
//                   icon={<Circle className="w-4 h-4 text-blue-500" />}
//                 />
//                 <StatCard
//                   title="Pending"
//                   value={stats.pendingCount}
//                   icon={<Circle className="w-4 h-4 text-blue-500" />}
//                 />
//                 <StatCard
//                   title="Completion Rate"
//                   value={`${stats.completionPercentage}%`}
//                   icon={<Zap className="w-4 h-4 text-blue-500" />}
//                 />
//               </div>

//               <hr className="my-3 sm:my-4 border-blue-100" />

//               <div className="space-y-2 sm:space-y-3">
//                 <div className="flex items-center justify-between text-gray-700">
//                   <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
//                     <Circle className="w-3 h-3 text-blue-500 fill-blue-500" />
//                     Task Progress
//                   </span>
//                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                     {stats.completedTasks}/{stats.totalCount}
//                   </span>
//                 </div>

//                 <div className="flex-1 h-2 sm:h-3 bg-blue-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-linear-to-r from-blue-500 to-blue-700 transition-all duration-500"
//                     style={{ width: `${stats.completionPercentage}%` }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-blue-100">
//               <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center gap-2">
//                 <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
//                 Recent Activity
//               </h3>

//               <div className="space-y-2 sm:space-y-3">
//                 {tasks.slice(0, 3).map((task) => (
//                   <div
//                     key={task._id || task.id}
//                     className="flex items-center justify-between p-2 sm:p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-100"
//                   >
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-700 break-word">
//                         {task.title}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {task.createdAt
//                           ? new Date(task.createdAt).toLocaleDateString()
//                           : "No date"}
//                       </p>
//                     </div>

//                     <span
//                       className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
//                         task.completed
//                           ? "bg-green-100 text-green-700"
//                           : "bg-blue-100 text-blue-700"
//                       }`}
//                     >
//                       {task.completed ? "Done" : "Pending"}
//                     </span>
//                   </div>
//                 ))}

//                 {tasks.length === 0 && (
//                   <div className="text-center py-6">
//                     <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
//                       <Clock className="w-8 h-8 text-blue-500" />
//                     </div>
//                     <p className="text-sm text-gray-500">No recent activity</p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       Tasks will appear here
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;





// import React, { useCallback, useEffect, useState, useMemo } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import { useNavigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import { Circle, Clock, TrendingUp, Zap } from "lucide-react";

// const API_BASE = "https://protask-backend-7znq.onrender.com/api/tasks";

// const Layout = ({ onLogout, user }) => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//    const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await axios.get(API_BASE, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 15000, 
//       });

//       console.log("API RESPONSE:", res.data);

    
//       const tasksArray = res.data?.tasks || [];
//       setTasks(tasksArray);
//     } catch (err) {
//       console.error("FETCH ERROR:", err);

     
//       if (err.code === "ECONNABORTED") {
//         setError("⏳ Server is waking up... please wait and retry.");
//       } else if (err.response?.status === 401) {
//         onLogout?.();
//       } else if (err.response?.status === 404) {
//         setError(" API not found (Check backend URL)");
//       } else {
//         setError(err.response?.data?.message || "Failed to load tasks");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate, onLogout]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

 
//   const stats = useMemo(() => {
//     const completedTasks = tasks.filter((t) => t.completed === true).length;

//     const totalCount = tasks.length;
//     const pendingCount = totalCount - completedTasks;
//     const completionPercentage = totalCount
//       ? Math.round((completedTasks / totalCount) * 100)
//       : 0;

//     return {
//       totalCount,
//       completedTasks,
//       pendingCount,
//       completionPercentage,
//     };
//   }, [tasks]);


//   const StatCard = ({ title, value, icon }) => (
//     <div className="p-3 rounded-xl bg-white shadow border hover:shadow-md transition">
//       <div className="flex items-center gap-2">
//         <div className="p-2 bg-blue-100 rounded">{icon}</div>
//         <div>
//           <p className="text-xl font-bold">{value}</p>
//           <p className="text-xs text-gray-500">{title}</p>
//         </div>
//       </div>
//     </div>
//   );


//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

  
//   if (error) {
//     return (
//       <div className="min-h-screen flex justify-center items-center px-4">
//         <div className="bg-red-100 p-6 rounded-xl text-center max-w-md">
//           <p className="text-red-600 font-medium">{error}</p>

//           <button
//             onClick={fetchTasks}
//             className="mt-4 px-4 py-2 bg-red-200 hover:bg-red-300 rounded-lg transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

 
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar user={user} onLogout={onLogout} />
//       <Sidebar user={user} tasks={tasks} />

//       <div className="ml-0 md:ml-16 xl:ml-64 pt-16 p-4">
//         <div className="grid xl:grid-cols-3 gap-6">
       
//           <div className="xl:col-span-2">
//             <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
//           </div>

         
//           <div className="space-y-6">
            
//             <div className="bg-white p-4 rounded shadow">
//               <h3 className="font-semibold mb-4 flex items-center gap-2">
//                 <TrendingUp className="text-blue-500" />
//                 Task Stats
//               </h3>

//               <div className="grid grid-cols-2 gap-3">
//                 <StatCard
//                   title="Total"
//                   value={stats.totalCount}
//                   icon={<Circle />}
//                 />
//                 <StatCard
//                   title="Completed"
//                   value={stats.completedTasks}
//                   icon={<Circle />}
//                 />
//                 <StatCard
//                   title="Pending"
//                   value={stats.pendingCount}
//                   icon={<Circle />}
//                 />
//                 <StatCard
//                   title="Progress"
//                   value={`${stats.completionPercentage}%`}
//                   icon={<Zap />}
//                 />
//               </div>

//               <div className="mt-4">
//                 <div className="flex justify-between text-sm">
//                   <span>Progress</span>
//                   <span>
//                     {stats.completedTasks}/{stats.totalCount}
//                   </span>
//                 </div>

//                 <div className="h-2 bg-gray-200 rounded mt-1">
//                   <div
//                     className="h-2 bg-blue-500 rounded"
//                     style={{ width: `${stats.completionPercentage}%` }}
//                   />
//                 </div>
//               </div>
//             </div>

            
//             <div className="bg-white p-4 rounded shadow">
//               <h3 className="font-semibold mb-4 flex items-center gap-2">
//                 <Clock className="text-blue-500" />
//                 Recent Tasks
//               </h3>

//               {tasks.slice(0, 3).map((task) => (
//                 <div key={task._id} className="flex justify-between mb-2">
//                   <span className="truncate">{task.title}</span>
//                   <span
//                     className={
//                       task.completed ? "text-green-600" : "text-blue-600"
//                     }
//                   >
//                     {task.completed ? "Done" : "Pending"}
//                   </span>
//                 </div>
//               ))}

//               {tasks.length === 0 && (
//                 <p className="text-gray-500 text-sm">No tasks yet</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;









import React, { useCallback, useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { useNavigate, Outlet } from "react-router-dom";
import API from "../utils/api"; // ✅ NEW
import { Circle, Clock, TrendingUp, Zap } from "lucide-react";

const Layout = ({ onLogout, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // ✅ API call (auto token attach)
      const res = await API.get("/api/tasks");

      console.log("API RESPONSE:", res.data);

      const tasksArray = res.data?.tasks || [];
      setTasks(tasksArray);
    } catch (err) {
      console.error("FETCH ERROR:", err);

      if (err.code === "ECONNABORTED") {
        setError("⏳ Server is waking up... please wait and retry.");
      } else if (err.response?.status === 401) {
        onLogout?.();
      } else if (err.response?.status === 404) {
        setError("API not found (Check backend URL)");
      } else {
        setError(err.response?.data?.message || "Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed === true).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  const StatCard = ({ title, value, icon }) => (
    <div className="p-3 rounded-xl bg-white shadow border hover:shadow-md transition">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-100 rounded">{icon}</div>
        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4">
        <div className="bg-red-100 p-6 rounded-xl text-center max-w-md">
          <p className="text-red-600 font-medium">{error}</p>

          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-red-200 hover:bg-red-300 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 md:ml-16 xl:ml-64 pt-16 p-4">
        <div className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className="space-y-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                Task Stats
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <StatCard title="Total" value={stats.totalCount} icon={<Circle />} />
                <StatCard title="Completed" value={stats.completedTasks} icon={<Circle />} />
                <StatCard title="Pending" value={stats.pendingCount} icon={<Circle />} />
                <StatCard title="Progress" value={`${stats.completionPercentage}%`} icon={<Zap />} />
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${stats.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="text-blue-500" />
                Recent Tasks
              </h3>

              {tasks.slice(0, 3).map((task) => (
                <div key={task._id || task.id} className="flex justify-between mb-2">
                  <span className="truncate">{task.title}</span>
                  <span
                    className={
                      task.completed ? "text-green-600" : "text-blue-600"
                    }
                  >
                    {task.completed ? "Done" : "Pending"}
                  </span>
                </div>
              ))}

              {tasks.length === 0 && (
                <p className="text-gray-500 text-sm">No tasks yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;