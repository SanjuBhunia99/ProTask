// import React, { useEffect, useState, useCallback } from "react";
// import {baseControlClasses, DEFAULT_TASK, priorityStyles,} from "../assets/dummy.jsx";
// import {Calendar,X,CheckCircle,Flag,PlusCircle,AlignLeft,Save,} from "lucide-react";

// const API_BASE = "https://protask-0xfu.onrender.com/api/tasks";

// const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
//   const [taskData, setTaskData] = useState(DEFAULT_TASK);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     if (!isOpen) return;

//     if (taskToEdit) {
//       const normalized =
//         taskToEdit.completed === "Yes" || taskToEdit.completed === true
//           ? "Yes"
//           : "No";
//       setTaskData({
//         ...DEFAULT_TASK,
//         title: taskToEdit.title || "",
//         description: taskToEdit.description || "",
//         priority: taskToEdit.priority || "Low",
//         dueDate: taskToEdit.dueDate || "",

//         completed: normalized,
//         id: taskToEdit.id || null,
//       });
//     } else {
//       setTaskData(DEFAULT_TASK);
//     }

//     setError(null);
//   }, [isOpen, taskToEdit]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setTaskData((prev) => ({ ...prev, [name]: value }));
//   }, []);

//   const getHeaders = useCallback(() => {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("No auth token found");

//     return {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };
//   }, []);

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       if (taskData.dueDate && taskData.dueDate < today) {
//         setError("Due date cannot be in the past.");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const isEdit = Boolean(taskData.id);
//         const url = isEdit
//           ? `${API_BASE}/${taskData.id}/gp`
//           : `${API_BASE}/gp`;

//         const resp = await fetch(url, {
//           method: isEdit ? "PUT" : "POST",
//           headers: getHeaders(),
//           body: JSON.stringify(taskData),
//         });

//         if (!resp.ok) {
//           if (resp.status === 401) return onLogout?.();

//           const err = await resp.json();
//           throw new Error(err.message || "Failed to save task");
//         }

//         const saved = await resp.json();
//         onSave?.(saved);
//         onClose();
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "An unexpected error occurred");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [taskData, getHeaders, onSave, onClose, onLogout, today]
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
//       <div className="bg-white border border-blue-100 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn">

//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             {taskData.id ? (
//               <Save className="text-blue-500 w-5 h-5" />
//             ) : (
//               <PlusCircle className="text-blue-500 w-5 h-5" />
//             )}
//             {taskData.id ? "Edit Task" : "Create New Task"}
//           </h2>

//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-gray-500 hover:text-blue-700"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {error && (
//             <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Task Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               required
//               value={taskData.title}
//               onChange={handleChange}
//               className={baseControlClasses}
//               placeholder="Enter task title"
//             />
//           </div>

//           <div>
//             <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
//               <AlignLeft className="w-4 h-4 text-blue-500" />
//               Description
//             </label>
//             <textarea
//               name="description"
//               rows="3"
//               value={taskData.description}
//               onChange={handleChange}
//               className={baseControlClasses}
//               placeholder="Add details about your task"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
//                 <Flag className="w-4 h-4 text-blue-500" />
//                 Priority
//               </label>
//               <select
//                 name="priority"
//                 value={taskData.priority}
//                 onChange={handleChange}
//                 className={`${baseControlClasses} ${priorityStyles[taskData.priority]}`}
//               >
//                 <option value="Low">Low</option>
//                 <option value="Medium">Medium</option>
//                 <option value="High">High</option>
//               </select>
//             </div>

//             <div>
//               <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
//                 <Calendar className="w-4 h-4 text-blue-500" />
//                 Due Date
//               </label>
//               <input
//                 type="date"
//                 name="dueDate"
//                 required
//                 min={today}
//                 value={taskData.dueDate}
//                 onChange={handleChange}
//                 className={baseControlClasses}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
//               <CheckCircle className="w-4 h-4 text-blue-500" />
//               Status
//             </label>

//             <div className="flex gap-4">
//               {[
//                 { val: "Yes", label: "Completed" },
//                 { val: "No", label: "In Progress" },
//               ].map(({ val, label }) => (
//                 <label key={val} className="flex items-center">
//                   <input
//                     type="radio"
//                     name="completed"
//                     value={val}
//                     checked={taskData.completed === val}
//                     onChange={handleChange}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                   />
//                   <span className="ml-2 text-sm text-gray-700">
//                     {label}
//                   </span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-linear-to-r from-blue-500 to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200"
//           >
//             {loading ? (
//               "Saving..."
//             ) : taskData.id ? (
//               <>
//                 <Save className="w-4 h-4" /> Update Task
//               </>
//             ) : (
//               <>
//                 <PlusCircle className="w-4 h-4" /> Create Task
//               </>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default TaskModal;

// import React, { useEffect, useState, useCallback } from "react";
// import {
//   baseControlClasses,
//   DEFAULT_TASK,
//   priorityStyles,
// } from "../assets/dummy.jsx";
// import {
//   Calendar,
//   X,
//   CheckCircle,
//   Flag,
//   PlusCircle,
//   AlignLeft,
//   Save,
// } from "lucide-react";

// const API_BASE = "https://protask-backend-7znq.onrender.com/api/tasks";

// const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
//   const [taskData, setTaskData] = useState(DEFAULT_TASK);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     if (!isOpen) return;

//     if (taskToEdit) {
//       setTaskData({
//         ...DEFAULT_TASK,
//         title: taskToEdit.title || "",
//         description: taskToEdit.description || "",
//         priority: taskToEdit.priority || "Low",
//         dueDate: taskToEdit.dueDate
//           ? taskToEdit.dueDate.split("T")[0]
//           : "",
//         completed: taskToEdit.completed ? true : false, // ✅ FIXED
//         id: taskToEdit._id || taskToEdit.id || null, // ✅ FIXED
//       });
//     } else {
//       setTaskData({
//         ...DEFAULT_TASK,
//         completed: false,
//       });
//     }

//     setError(null);
//   }, [isOpen, taskToEdit]);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;

//     // ✅ FIXED: convert radio to boolean
//     if (name === "completed") {
//       setTaskData((prev) => ({
//         ...prev,
//         completed: value === "Yes",
//       }));
//     } else {
//       setTaskData((prev) => ({ ...prev, [name]: value }));
//     }
//   }, []);

//   const getHeaders = useCallback(() => {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("No auth token found");

//     return {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };
//   }, []);

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();

//       if (taskData.dueDate && taskData.dueDate < today) {
//         setError("Due date cannot be in the past.");
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const isEdit = Boolean(taskData.id);

//         const url = isEdit
//           ? `${API_BASE}/${taskData.id}` // ✅ FIXED
//           : `${API_BASE}`; // ✅ FIXED

//         const resp = await fetch(url, {
//           method: isEdit ? "PUT" : "POST",
//           headers: getHeaders(),
//           body: JSON.stringify(taskData),
//         });

//         if (!resp.ok) {
//           if (resp.status === 401) return onLogout?.();

//           const err = await resp.json();
//           throw new Error(err.message || "Failed to save task");
//         }

//         const saved = await resp.json();

//         onSave?.(saved);
//         onClose();
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "An unexpected error occurred");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [taskData, getHeaders, onSave, onClose, onLogout, today]
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
//       <div className="bg-white border border-blue-100 rounded-xl max-w-md w-full shadow-lg relative p-6">

//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             {taskData.id ? (
//               <Save className="text-blue-500 w-5 h-5" />
//             ) : (
//               <PlusCircle className="text-blue-500 w-5 h-5" />
//             )}
//             {taskData.id ? "Edit Task" : "Create New Task"}
//           </h2>

//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-blue-100 rounded-lg"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {error && (
//             <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           <input
//             type="text"
//             name="title"
//             required
//             value={taskData.title}
//             onChange={handleChange}
//             className={baseControlClasses}
//             placeholder="Enter task title"
//           />

//           <textarea
//             name="description"
//             rows="3"
//             value={taskData.description}
//             onChange={handleChange}
//             className={baseControlClasses}
//           />

//           <select
//             name="priority"
//             value={taskData.priority}
//             onChange={handleChange}
//             className={`${baseControlClasses} ${priorityStyles[taskData.priority]}`}
//           >
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>

//           <input
//             type="date"
//             name="dueDate"
//             min={today}
//             value={taskData.dueDate}
//             onChange={handleChange}
//             className={baseControlClasses}
//           />

//           <div className="flex gap-4">
//             {[
//               { val: "Yes", label: "Completed" },
//               { val: "No", label: "In Progress" },
//             ].map(({ val, label }) => (
//               <label key={val}>
//                 <input
//                   type="radio"
//                   name="completed"
//                   value={val}
//                   checked={
//                     taskData.completed === (val === "Yes")
//                   }
//                   onChange={handleChange}
//                 />
//                 {label}
//               </label>
//             ))}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-500 text-white py-2 rounded"
//           >
//             {loading ? "Saving..." : "Save Task"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaskModal;

import React, { useEffect, useState, useCallback } from "react";
import {
  baseControlClasses,
  DEFAULT_TASK,
  priorityStyles,
} from "../assets/dummy.jsx";
import { X, PlusCircle, Save } from "lucide-react";
import API from "../utils/api"; // ✅ NEW

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "",
        completed: !!taskToEdit.completed,
        id: taskToEdit._id || taskToEdit.id || null,
      });
    } else {
      setTaskData({
        ...DEFAULT_TASK,
        completed: false,
      });
    }

    setError(null);
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "completed") {
      setTaskData((prev) => ({
        ...prev,
        completed: value === "Yes",
      }));
    } else {
      setTaskData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (taskData.dueDate && taskData.dueDate < today) {
        setError("Due date cannot be in the past.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const isEdit = Boolean(taskData.id);

        let response;

        if (isEdit) {
          // ✅ UPDATE
          response = await API.put(`/api/tasks/${taskData.id}`, taskData);
        } else {
          // ✅ CREATE
          response = await API.post(`/api/tasks`, taskData);
        }

        const saved = response.data;

        onSave?.(saved);
        onClose();
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          return onLogout?.();
        }

        setError(err.response?.data?.message || "Failed to save task");
      } finally {
        setLoading(false);
      }
    },
    [taskData, onSave, onClose, onLogout, today],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-blue-100 rounded-xl max-w-md w-full shadow-lg relative p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {taskData.id ? (
              <Save className="text-blue-500 w-5 h-5" />
            ) : (
              <PlusCircle className="text-blue-500 w-5 h-5" />
            )}
            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <input
            type="text"
            name="title"
            required
            value={taskData.title}
            onChange={handleChange}
            className={baseControlClasses}
            placeholder="Enter task title"
          />

          <textarea
            name="description"
            rows="3"
            value={taskData.description}
            onChange={handleChange}
            className={baseControlClasses}
          />

          <select
            name="priority"
            value={taskData.priority}
            onChange={handleChange}
            className={`${baseControlClasses} ${priorityStyles[taskData.priority]}`}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="date"
            name="dueDate"
            min={today}
            value={taskData.dueDate}
            onChange={handleChange}
            className={baseControlClasses}
          />

          <div className="flex gap-4">
            {[
              { val: "Yes", label: "Completed" },
              { val: "No", label: "In Progress" },
            ].map(({ val, label }) => (
              <label key={val}>
                <input
                  type="radio"
                  name="completed"
                  value={val}
                  checked={taskData.completed === (val === "Yes")}
                  onChange={handleChange}
                />
                {label}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {loading ? "Saving..." : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;