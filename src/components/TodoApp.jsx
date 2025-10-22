import React, { useState, useEffect } from "react";

const TodoApp = ({ onLogout }) => {
 const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');

  
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

 
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost/todo-app/todo.php", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setTodos(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost/todo-app/todo.php", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      const data = await response.json();
      if (data.success) {
        setTodos([data.data, ...todos]);
        setNewTodo({
          title: "",
          description: "",
          dueDate: "",
          priority: "medium",
        });
        setShowAddForm(false);
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    if (!editingTodo.title.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost/todo-app/todo.php", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTodo),
      });

      const data = await response.json();
      if (data.success) {
        setTodos(todos.map((t) => (t.id === editingTodo.id ? data.data : t)));
        setShowEditForm(false);
        setEditingTodo(null);
        setError("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to update todo");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const response = await fetch("http://localhost/todo-app/todo.php", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todo.id,
          completed: !todo.completed,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTodos(todos.map((t) => (t.id === todo.id ? data.data : t)));
      }
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch("http://localhost/todo-app/todo.php", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: todoId }),
      });

      const data = await response.json();
      if (data.success) {
        setTodos(todos.filter((t) => t.id !== todoId));
      }
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  const openEditModal = (todo) => {
    setEditingTodo({
      id: todo.id,
      title: todo.title,
      description: todo.description || "",
      dueDate: todo.due_date || "",
      priority: todo.priority,
      completed: todo.completed,
    });
    setShowEditForm(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-pink-500 shadow-red-200";
      case "medium":
        return "from-yellow-500 to-orange-500 shadow-yellow-200";
      case "low":
        return "from-blue-500 to-emerald-500 shadow-blue-200";
      default:
        return "from-gray-500 to-gray-600 shadow-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔥";
      case "medium":
        return "⚡";
      case "low":
        return "🌱";
      default:
        return "📝";
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (activeFilter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const pendingTasks = todos.filter((todo) => !todo.completed).length;
  const completedTasks = todos.filter((todo) => todo.completed).length;

  const stats = [
    { label: "Total", value: todos.length, color: "text-blue-600" },
    { label: "Pending", value: pendingTasks, color: "text-orange-600" },
    { label: "Completed", value: completedTasks, color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            TODO WorkSpace
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back,{" "}
            <span className="font-semibold text-indigo-600">
              {user?.full_name}
            </span>
            ! Let's make today productive.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/90 z-10  rounded-2xl shadow-xl border border-white/20 p-6 text-center transform hover:scale-105 transition-all duration-300"
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label} Tasks
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 sticky top-6">
              {/* Quick Actions */}
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-6"
              >
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Task
                </span>
              </button>

              {/* Filters */}
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Filters</h3>
                {["all", "active", "completed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeFilter === filter
                        ? "bg-indigo-100 text-indigo-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeFilter === "all"
                    ? "All Tasks"
                    : activeFilter === "active"
                    ? "Active Tasks"
                    : "Completed Tasks"}
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredTodos.length}{" "}
                  {filteredTodos.length === 1 ? "task" : "tasks"}
                </div>
              </div>

              {/* Todo List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your tasks...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by creating your first task!
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Create Your First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredTodos.map((todo) => {
                    // Determine border color based on priority and completion status
                    let borderColorClass = "border-green-500"; // default for low priority
                    if (todo.completed === 1) {
                      borderColorClass = "border-green-500 bg-green-50/50";
                    } else {
                      switch (todo.priority) {
                        case "high":
                          borderColorClass = "border-red-500 bg-white";
                          break;
                        case "medium":
                          borderColorClass = "border-yellow-500 bg-white";
                          break;
                        case "low":
                          borderColorClass = "border-blue-500 bg-white";
                          break;
                        default:
                          borderColorClass = "border-gray-500 bg-white";
                      }
                    }

                    return (
                      <div
                        key={todo.id}
                        className={`group border-l-4 rounded-xl p-5 transition-all duration-300 hover:shadow-lg ${borderColorClass}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <button
                              onClick={() => handleToggleComplete(todo)}
                              className={`w-6 h-6 rounded-full border-2 mt-1 flex-shrink-0 transition-all duration-200 flex items-center justify-center ${
                                todo.completed === 1
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300 hover:border-green-500 hover:bg-green-50"
                              }`}
                            >
                              {todo.completed === 1 && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(
                                    todo.priority
                                  )} text-white shadow-sm whitespace-nowrap`}
                                >
                                  <span className="mr-1">
                                    {getPriorityIcon(todo.priority)}
                                  </span>
                                  <span>
                                    {todo.priority.charAt(0).toUpperCase() +
                                      todo.priority.slice(1)}
                                  </span>
                                </span>
                                {todo.due_date && (
                                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                                    📅{" "}
                                    {new Date(
                                      todo.due_date
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>

                              <h3
                                className={`font-semibold text-lg mb-2 ${
                                  todo.completed === 1
                                    ? "line-through text-gray-500"
                                    : "text-gray-800"
                                }`}
                              >
                                {todo.title}
                              </h3>

                              {todo.description && (
                                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                  {todo.description}
                                </p>
                              )}

                              <div className="flex items-center text-xs text-gray-500">
                                <span>
                                  Created:{" "}
                                  {new Date(
                                    todo.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button
                              onClick={() => openEditModal(todo)}
                              className="text-blue-500 hover:text-blue-700 p-1 transition-all duration-200 hover:bg-blue-50 rounded-lg"
                              title="Edit task"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="text-red-500 hover:text-red-700 p-1 transition-all duration-200 hover:bg-red-50 rounded-lg"
                              title="Delete task"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create New Task
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddTodo} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTodo.title}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    placeholder="What needs to be done?"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTodo.description}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    placeholder="Add some details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTodo.dueDate}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, dueDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTodo.priority}
                      onChange={(e) =>
                        setNewTodo({ ...newTodo, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    >
                      <option value="low">Low 🌱</option>
                      <option value="medium">Medium ⚡</option>
                      <option value="high">High 🔥</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      "Create Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditForm && editingTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Edit Task
                </h2>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingTodo(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditTodo} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) =>
                      setEditingTodo({ ...editingTodo, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    placeholder="What needs to be done?"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingTodo.description}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        description: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    placeholder="Add some details..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editingTodo.dueDate}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          dueDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={editingTodo.priority}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          priority: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    >
                      <option value="low">Low 🌱</option>
                      <option value="medium">Medium ⚡</option>
                      <option value="high">High 🔥</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={editingTodo.completed}
                    onChange={(e) =>
                      setEditingTodo({
                        ...editingTodo,
                        completed: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="completed"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Mark as completed
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingTodo(null);
                    }}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
