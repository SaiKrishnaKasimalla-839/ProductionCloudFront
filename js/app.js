/* ============================================================
   TaskFlow — user interface code.
   Uses the pure logic from tasks.js and draws it on the page.
   Tasks are saved in the browser's localStorage so they survive
   a page refresh.
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "taskflow.tasks";
  var state = { tasks: [], filter: "all" };

  // ---- helpers -------------------------------------------------
  function loadTasks() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (e) {
      /* storage full or blocked — ignore */
    }
  }

  // Never trust user input — stop people injecting HTML (<script> etc).
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ---- rendering -----------------------------------------------
  function render() {
    var list = document.getElementById("task-list");
    var visible = TaskLogic.filterTasks(state.tasks, state.filter);
    list.innerHTML = "";

    visible.forEach(function (task) {
      var li = document.createElement("li");
      if (task.done) li.className = "done";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", function () {
        state.tasks = TaskLogic.toggleTask(state.tasks, task.id);
        saveTasks();
        render();
      });

      var title = document.createElement("span");
      title.className = "task-title";
      title.innerHTML = escapeHtml(task.title);

      var del = document.createElement("button");
      del.className = "delete-btn";
      del.title = "Delete task";
      del.textContent = "✕";
      del.addEventListener("click", function () {
        state.tasks = TaskLogic.deleteTask(state.tasks, task.id);
        saveTasks();
        render();
      });

      li.appendChild(checkbox);
      li.appendChild(title);
      li.appendChild(del);
      list.appendChild(li);
    });

    document.getElementById("empty-message").classList.toggle(
      "hidden",
      state.tasks.length !== 0
    );

    var stats = TaskLogic.getStats(state.tasks);
    document.getElementById("stats").textContent =
      stats.total + " total · " + stats.active + " active · " + stats.done + " done";
  }

  // ---- events --------------------------------------------------
  function wireEvents() {
    document.getElementById("task-form").addEventListener("submit", function (event) {
      event.preventDefault(); // stop the page from reloading
      var input = document.getElementById("task-input");
      var errorBox = document.getElementById("form-error");

      var result = TaskLogic.addTask(state.tasks, input.value);
      if (result.error) {
        errorBox.textContent = result.error;
        errorBox.classList.remove("hidden");
        return;
      }
      errorBox.classList.add("hidden");
      state.tasks = result.tasks;
      input.value = "";
      saveTasks();
      render();
    });

    var buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        state.filter = btn.getAttribute("data-filter");
        render();
      });
    });
  }

  // ---- start ---------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    state.tasks = loadTasks();
    wireEvents();
    render();
  });
})();
