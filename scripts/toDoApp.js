function redirect() {
  window.location.replace("./logIn.html");
}

const checkLogIn = () => {
  let accessToken = JSON.parse(localStorage.getItem("token"));

  if (accessToken === null) {
    redirect();
  }
};

token = JSON.parse(localStorage.getItem("token"));
const payload = token.split(".")[1];
const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
const jsonPayload = decodeURIComponent(
  atob(base64)
    .split("")
    .map(function (c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    })
    .join("")
);
const userIdParse = JSON.parse(jsonPayload).id;


// load data from database
async function fetchAsync(path = "http://127.0.0.1:8000/tasks") {
  let response = await fetch(path, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  let data = await response.json();
  return data;
}

fetchAsync()
  .then((data) => toDoApp(data))
  // .catch((reason) => console.log(reason.message));

  //update database
  function updateDataBase(path, data, method, contentType = "application/json") {
    return fetch(path, {
      method: method,
      mode: "cors",
      credentials: "same-origin",
      headers: {
        'bearer': token,
        'Content-Type': contentType,
      },
      body: JSON.stringify(data),
    });
  }


function toDoApp(tasks) {
  const taskInput = document.querySelector(".task-input");
  const addButton = document.querySelector(".add-button");
  const cancelButton = document.querySelector(".cancel-button");

  //get projects id
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const projectId = urlParams.get("id")

  // let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  const headerToDo = document.querySelector(".to-do-app-header");
  const welcomeUserParagraph = document.createElement("p");
  welcomeUserParagraph.classList.add("wellcome-user");
  welcomeUserParagraph.textContent = `Well come to ToDoApp 4.0`;

  headerToDo.appendChild(welcomeUserParagraph);

  const logoApp = document.querySelector(".logo-app");

  logoApp.addEventListener("click", showMenu);

  function showMenu() {
    const menu = document.getElementById("myDropdown");
    menu.classList.toggle("show");
  }

  cancelButton.addEventListener("click", handleCancel);

  function updateDataBase(path, data, method, contentType = "application/json") {
    return fetch(path, {
      method: method,
      mode: "cors",
      credentials: "same-origin",
      headers: {
        'bearer': token,
        'Content-Type': contentType,
      },
      body: JSON.stringify(data),
    });
  }

  function handleCancel() {
    taskInput.value = "";
    taskInput.focus();
  }

  function clearTasks() {
    const taskContent = document.querySelector(".task-content");
    taskContent.innerHTML = "";
  }

  function renderTaskDone(tasks) {
    clearTasks();

    tasks.forEach((element) => {
      const toDoContent = document.createElement("div");
      toDoContent.classList.add("to-do-content");
      toDoContent.dataset.id = element._id;

      const doneMessage = document.createElement("p");
      doneMessage.classList.add("done-message");
      doneMessage.innerHTML = "DONE";

      const taskP = document.createElement("p");
      taskP.classList.add("task-done");
      taskP.textContent = `${element.task}`;

      toDoContent.appendChild(doneMessage);
      toDoContent.appendChild(taskP);

      const taskContent = document.querySelector(".task-content");

      taskContent.appendChild(toDoContent);
    });
  }

  function renderTask(tasks) {
    clearTasks();

    tasks.forEach((element) => {
      const toDoContent = document.createElement("div");
      toDoContent.classList.add("to-do-content");
      toDoContent.dataset.id = element._id;

      const checkDone = document.createElement("input");
      checkDone.classList.add("to-do-done");
      checkDone.type = "checkbox";

      const taskP = document.createElement("p");
      taskP.classList.add("task");
      taskP.textContent = `${element.task}`;

      const editButton = document.createElement("button");
      editButton.classList.add("edit-button", "button-handle");
      editButton.textContent = "Edit";

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button", "button-handle");
      deleteButton.textContent = "Delete";

      toDoContent.appendChild(checkDone);
      toDoContent.appendChild(taskP);
      toDoContent.appendChild(editButton);
      toDoContent.appendChild(deleteButton);

      const taskContent = document.querySelector(".task-content");

      taskContent.appendChild(toDoContent);
    });
  }

  let tasksArray = [];
  tasks.forEach((task) => {
    if (task.projectId == projectId) {
      tasksArray.push(task);
    }
  });

  let undoneTasks = [];
  let doneTasks = [];
  tasksArray.forEach((task) => {
    if (task.done === false) {
      undoneTasks.push(task);
    } else if (task.done === true) {
      doneTasks.push(task);
    }
  });
  renderTask(undoneTasks);

  //handle add task
  addButton.addEventListener("click", addTask);

  async function addTask() {
    if ((taskInput.value != "") | taskInput.value.trim()) {


      // new task to add to database
      const newTask = {
        projectId: projectId,
        task: taskInput.value,
        done: false,
        author: userIdParse,
      };
      taskInput.value = "";
      taskInput.focus();
      filterInput.value = "UNDONE";
      await updateDataBase("http://127.0.0.1:8000/tasks", newTask, "POST", "application/json");

      await fetchAsync()
        .then((tasks) => {
          let tasksArray = [];
          tasks.forEach((task) => {
            if (task.projectId ==projectId) {
              tasksArray.push(task);
            }
          });

          let undoneTasks = [];
          let doneTasks = [];
          tasksArray.forEach((task) => {
            if (task.done === false) {
              undoneTasks.push(task);
            } else if (task.done === true) {
              doneTasks.push(task);
            }
          });

          return undoneTasks;
        })
        .then((data) => renderTask(data))
        .catch((reason) => console.log(reason.message));
    }
  }

  let containerTodo = document.querySelector(".task-content");
  containerTodo.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("delete-button")) {
      handleDelete(event.target);
    }

    if (event.target && event.target.classList.contains("to-do-done")) {
      handleChecked(event.target);
    }

    if (event.target && event.target.classList.contains("edit-button")) {
      handleEdit(event.target);
    }
  });

  //handle edit task

  async function handleEdit(editButton) {
    taskInput.value = "";
    taskInput.focus();

    const id = await editButton.parentElement.dataset.id;
    path = await `http://127.0.0.1:8000/tasks/${id}`;
    await updateDataBase(path, null, "DELETE");
    await fetchAsync()
      .then((tasks) => {
        let tasksArray = [];
        tasks.forEach((task) => {
          if (task.projectId === parseInt(projectId)) {
            tasksArray.push(task);
          }
        });
        let undoneTasks = [];
        let doneTasks = [];
        tasksArray.forEach((task) => {
          if (task.done === false) {
            undoneTasks.push(task);
          } else if (task.done === true) {
            doneTasks.push(task);
          }
        });
        return undoneTasks;
      })
      .then((data) => renderTask(data))
      .catch((reason) => console.log(reason.message));
  }

  //handle delete task:
  async function handleDelete(deleteButton) {
    const id = await deleteButton.parentElement.dataset.id;
    path = await `http://127.0.0.1:8000/tasks/${id}`;
    await updateDataBase(path, null, "DELETE","text/plain");
    await fetchAsync()
      .then((tasks) => {
        let tasksArray = [];
        tasks.forEach((task) => {
          if (task.projectId == projectId ) {
            tasksArray.push(task);
          }
        });
        let undoneTasks = [];
        let doneTasks = [];
        tasksArray.forEach((task) => {
          if (task.done === false) {
            undoneTasks.push(task);
          } else if (task.done === true) {
            doneTasks.push(task);
          }
        });
        return undoneTasks;
      })
      .then((data) => renderTask(data))
      .catch((reason) => console.log(reason.message));
  }

  //handle is done
  function handleChecked(checkBox) {
    fetchAsync().then((tasks) => {
      let tasksArray = [];
      tasks.forEach((task) => {
        if (task.projectId == projectId ) {
          tasksArray.push(task);
        }
      });

      let undoneTasks = [];
      let doneTasks = [];
      tasksArray.forEach((task) => {
        if (task.done === false) {
          undoneTasks.push(task);
        } else if (task.done === true) {
          doneTasks.push(task);
        }
      });

      const id = checkBox.parentElement.dataset.id;
      path = `http://127.0.0.1:8000/tasks/${id}`;
      const i = undoneTasks.findIndex((task) => task._id == id);
      undoneTasks[i].done = true;
      updateDataBase(path, undoneTasks[i], "PATCH", "application/json");
      undoneTasks.splice(i, 1);
      renderTask(undoneTasks);
    });
  }

  const filterInput = document.getElementById("filter-options");
  filterInput.addEventListener("change", filterInputHandler);

  async function filterInputHandler() {
    await fetchAsync()
        .then((data) => {
          let tasksArray = data;
          let undoneTasks = [];
          let doneTasks = [];
          tasksArray.forEach((task) => {
            if (task.done === false) {
              undoneTasks.push(task);
            } else if (task.done === true) {
              doneTasks.push(task);
            }
          });
          if (filterInput.value === "DONE") {
            renderTaskDone(doneTasks)
          }

          if (filterInput.value === "UNDONE") {
            renderTask(undoneTasks)
          }

        })
        .catch((reason) => console.log(reason.message));
  }
}
