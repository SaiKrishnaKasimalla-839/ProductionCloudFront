/* ============================================================
   TaskFlow — pure task logic.
   This file works in TWO places:
   1. The browser  ->  window.TaskLogic
   2. Node.js      ->  module.exports  (used by the CI tests)
   The functions are "pure": they never change the array you pass
   in, they always return a new one. That makes them easy to test.
   ============================================================ */
(function (root) {
  "use strict";

  /** Add a task. Returns { tasks, error }. */
  function addTask(tasks, title) {
    const trimmed = (title || "").trim();
    if (!trimmed) {
      return { tasks: tasks, error: "Task title cannot be empty." };
    }
    const nextId = tasks.reduce(function (max, t) {
      return Math.max(max, t.id);
    }, 0) + 1;
    const newTask = { id: nextId, title: trimmed, done: false };
    return { tasks: tasks.concat([newTask]), error: null };
  }

  /** Flip the done flag of one task (by id). */
  function toggleTask(tasks, id) {
    return tasks.map(function (t) {
      return t.id === id ? { id: t.id, title: t.title, done: !t.done } : t;
    });
  }

  /** Remove one task (by id). */
  function deleteTask(tasks, id) {
    return tasks.filter(function (t) {
      return t.id !== id;
    });
  }

  /** Filter: "all" | "active" | "done". */
  function filterTasks(tasks, filter) {
    if (filter === "active") {
      return tasks.filter(function (t) { return !t.done; });
    }
    if (filter === "done") {
      return tasks.filter(function (t) { return t.done; });
    }
    return tasks; // "all"
  }

  /** Small summary used by the stats bar. */
  function getStats(tasks) {
    const done = tasks.filter(function (t) { return t.done; }).length;
    return {
      total: tasks.length,
      done: done,
      active: tasks.length - done,
    };
  }

  const api = {
    addTask: addTask,
    toggleTask: toggleTask,
    deleteTask: deleteTask,
    filterTasks: filterTasks,
    getStats: getStats,
  };

  // Export for Node.js (tests) — but only when running under Node.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  // Export for the browser.
  root.TaskLogic = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
