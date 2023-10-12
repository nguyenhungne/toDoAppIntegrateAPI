function redirect() {
  window.location.replace("./logIn.html");
}

const checkLogIn = () => {
  let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  if (loggedInAccount === null) {
    redirect();
  }
};

async function fetchAsync() {
  let response = await fetch("http://127.0.0.1:8000/tasks");
  let data = await response.json();
  return data;
}

fetchAsync()
  .then((data) => toDoApp(data))
  .catch((reason) => console.log(reason.message));

function toDoApp(tasks) {
  const taskInput = document.querySelector(".task-input");
  const addButton = document.querySelector(".add-button");
  const cancelButton = document.querySelector(".cancel-button");

  //get projects id
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const projectId = parseInt(urlParams.get("id"));

  let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  const headerToDo = document.querySelector(".to-do-app-header");
  const welcomeUserParagraph = document.createElement("p");
  welcomeUserParagraph.classList.add("wellcome-user");
  welcomeUserParagraph.textContent = `Well come ${loggedInAccount.userName} to ToDoApp 4.0`;

  headerToDo.appendChild(welcomeUserParagraph);

  const logoApp = document.querySelector(".logo-app");

  logoApp.addEventListener("click", showMenu);

  function showMenu() {
    const menu = document.getElementById("myDropdown");
    menu.classList.toggle("show");
  }

  cancelButton.addEventListener("click", handleCancel);

  function updateDataBase(path, data, method) {
    return fetch(path, {
      method: method,
      mode: "cors",
      credentials: "same-origin",
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
      toDoContent.dataset.id = element.id;

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
      toDoContent.dataset.id = element.id;

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
  renderTask(undoneTasks);
  select();

  //handle add task
  addButton.addEventListener("click", addTask);

  function addTask() {
    let id = Math.floor(Math.random() * Date.now());
    if ((taskInput.value != "") | taskInput.value.trim()) {
      // new task to add to database
      const newTask = {
        id: parseInt(id),
        projectId: projectId,
        task: taskInput.value,
        done: false,
        author: loggedInAccount.userName,
      };
      taskInput.value = "";
      taskInput.focus();
      renderTask(undoneTasks);
      filterInput.value = "UNDONE";
      select();
      updateDataBase("http://127.0.0.1:8000/tasks", newTask, "POST");
    }
  }

  function select() {
    const editButton = document.querySelectorAll(".edit-button");

    //handle edit task
    for (let i = 0; i < editButton.length; i++) {
      editButton[i].addEventListener("click", handleEdit);

      function handleEdit() {
        taskInput.value = "";
        taskInput.focus();
        undoneTasks.splice(i, 1);
        renderTask(undoneTasks);
        select();
      }
    }

    //handle delete task:
    let deleteButtons = document.querySelectorAll(".delete-button");

    deleteButtons = Array.from(deleteButtons);

    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", handleDelete);
      function handleDelete() {
        const id = deleteButton.parentElement.dataset.id;
        path = `http://127.0.0.1:8000/tasks/${id}`;
        updateDataBase(path, null, "DELETE");
      }
      

        
    })

    let checkBoxDone = document.querySelectorAll(".to-do-done");

    checkBoxDone = Array.from(checkBoxDone);

    checkBoxDone.forEach((checkBox) => {
      checkBox.addEventListener("change", handleChecked);
      function handleChecked() {
        const id = checkBox.parentElement.dataset.id;
        path = `http://127.0.0.1:8000/tasks/${id}`;
        const i = undoneTasks.findIndex(
          (task) => task.id === parseInt(id)
        );
        undoneTasks[i].done = true;
        undoneTasks.push(undoneTasks[i]);
        updateDataBase(path, undoneTasks[i], "PATCH");
        undoneTasks.splice(i, 1);
      }
    });
  }

  const filterInput = document.getElementById("filter-options");
  filterInput.addEventListener("change", filterInputHandler);

  function filterInputHandler() {
    if (filterInput.value === "DONE") {
      renderTaskDone(doneTasks);
      select();
    } else if (filterInput.value === "UNDONE") {
      renderTask(undoneTasks);
      select();
    }
  }
}