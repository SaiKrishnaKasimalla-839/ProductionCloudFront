/* ============================================================
   Unit tests for js/tasks.js — this is what GitHub Actions runs
   on every Pull Request. If ANY test fails, the PR cannot merge.
   Run locally with:   node --test tests/
   ============================================================ */
const { test } = require("node:test");
const assert = require("node:assert");

const { addTask, toggleTask, deleteTask, filterTasks, getStats } =
  require("../js/tasks.js");

test("addTask adds a task and trims whitespace", () => {
  const result = addTask([], "  Buy milk  ");
  assert.strictEqual(result.error, null);
  assert.strictEqual(result.tasks.length, 1);
  assert.strictEqual(result.tasks[0].title, "Buy milk");
  assert.strictEqual(result.tasks[0].done, false);
});

test("addTask rejects an empty title", () => {
  const result = addTask([], "    ");
  assert.strictEqual(result.error, "Task title cannot be empty.");
  assert.strictEqual(result.tasks.length, 0);
});

test("addTask gives increasing ids", () => {
  const r1 = addTask([], "first");
  const r2 = addTask(r1.tasks, "second");
  assert.strictEqual(r1.tasks[0].id, 1);
  assert.strictEqual(r2.tasks[1].id, 2);
});

test("addTask does not modify the original array", () => {
  const original = [];
  addTask(original, "hello");
  assert.strictEqual(original.length, 0);
});

test("toggleTask flips done and back", () => {
  let tasks = addTask([], "task").tasks;
  tasks = toggleTask(tasks, 1);
  assert.strictEqual(tasks[0].done, true);
  tasks = toggleTask(tasks, 1);
  assert.strictEqual(tasks[0].done, false);
});

test("deleteTask removes the right task", () => {
  let tasks = addTask([], "one").tasks;
  tasks = addTask(tasks, "two").tasks;
  tasks = deleteTask(tasks, 1);
  assert.strictEqual(tasks.length, 1);
  assert.strictEqual(tasks[0].title, "two");
});

test("filterTasks filters all / active / done", () => {
  let tasks = addTask([], "a").tasks;
  tasks = addTask(tasks, "b").tasks;
  tasks = toggleTask(tasks, 1); // "a" is done

  assert.strictEqual(filterTasks(tasks, "all").length, 2);
  assert.strictEqual(filterTasks(tasks, "active").length, 1);
  assert.strictEqual(filterTasks(tasks, "active")[0].title, "b");
  assert.strictEqual(filterTasks(tasks, "done").length, 1);
  assert.strictEqual(filterTasks(tasks, "done")[0].title, "a");
});

test("getStats counts totals correctly", () => {
  let tasks = addTask([], "a").tasks;
  tasks = addTask(tasks, "b").tasks;
  tasks = addTask(tasks, "c").tasks;
  tasks = toggleTask(tasks, 2);

  const stats = getStats(tasks);
  assert.deepStrictEqual(stats, { total: 3, done: 1, active: 2 });
});
