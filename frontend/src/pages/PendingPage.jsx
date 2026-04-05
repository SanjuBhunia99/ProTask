import React, { useState, useMemo } from "react";
import { layoutClasses, SORT_OPTIONS } from "../assets/dummy.jsx";
import { ListChecks, Filter, Plus, Clock } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem.jsx";
import TaskModal from "../components/TaskModal.jsx";
import API from "../utils/api";

const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/tasks/${id}`); 
      refreshTasks();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await API.put(`/api/tasks/${id}`, {
        completed: !currentStatus,
      }); 
      refreshTasks();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter((t) => !t.completed);

    return filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "priority") {
        const order = { high: 3, medium: 2, low: 1 };
        return (
          (order[b.priority?.toLowerCase()] || 0) -
          (order[a.priority?.toLowerCase()] || 0)
        );
      }
      return 0;
    });
  }, [tasks, sortBy]);

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ListChecks className="text-blue-500" />
            Pending Task
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-7">
            {sortedPendingTasks.length} task
            {sortedPendingTasks.length !== 1 ? "s" : " "}
            needing your attention
          </p>
        </div>

        <div className={layoutClasses.sortBox}>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Sort By:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={layoutClasses.select}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>

          <div className={layoutClasses.tabWrapper}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={layoutClasses.tabButton(sortBy === opt.id)}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={layoutClasses.addBox}
        onClick={() => {
          setSelectedTask(null);
          setShowModal(true);
        }}>
        <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
            <Plus className="text-blue-500" size={18} />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
            <div className="max-w-xs mx-auto py-6">
              <div className={layoutClasses.emptyIconBg}>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                All caught up!
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                No pending tasks - great work!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className={layoutClasses.emptyBtn}
              >
                Create New Task
              </button>
            </div>
          </div>
        ) : (
          sortedPendingTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onDelete={() => handleDelete(task._id || task.id)}
              onToggleComplete={() =>
                handleToggleComplete(task._id || task.id, task.completed)
              }
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
          refreshTasks();
        }}
        taskToEdit={selectedTask}
      />
    </div>
  );
};
export default PendingPage;