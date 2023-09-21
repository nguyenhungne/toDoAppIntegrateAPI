function redirect() {
  window.location.replace("./logIn.html");
}

const checkLogIn = () => {
  let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  console.log(loggedInAccount);

  if (loggedInAccount === null) {
    redirect();
  }
};

function toDoApp() {
  const taskInput = document.querySelector(".task-input");
  const addButton = document.querySelector(".add-button");
  const cancelButton = document.querySelector(".cancel-button");

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

  function handleCancel() {
    //    const toDoHandle = document.querySelector('.to-do-handle');
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

  let tasksArray = [
    {
      task: "task",
      done: false,
    },
  ];

  let undoneTask = [];
  let doneTask = [];

  tasksArray.forEach((task) => {
    if (task.done === false) {
      undoneTask.push(task);
    } else if (task.done === true) {
      doneTask.push(task);
    }
  });

  renderTask(undoneTask);
  select();

  //handle add task
  addButton.addEventListener("click", addTask);

  function addTask() {
    if ((taskInput.value != "") | taskInput.value.trim()) {
      undoneTask.push({
        task: taskInput.value,
        done: false,
      });

      taskInput.value = "";
      taskInput.focus();
      renderTask(undoneTask);
      filterInput.value = "UNDONE";
      select();
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
        undoneTask.splice(i, 1);
        renderTask(undoneTask);
        select();
      }
    }

    //handle delete task:
    const deleteButton = document.querySelectorAll(".delete-button");

    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].addEventListener("click", handleDelete);

      function handleDelete() {
        undoneTask.splice(i, 1);
        renderTask(undoneTask);
        select();
      }
    }

    const checkBoxDone = document.querySelectorAll(".to-do-done");

    for (let i = 0; i < undoneTask.length; i++) {
      checkBoxDone[i].addEventListener("change", handleChecked);
      function handleChecked() {
        undoneTask[i].done = true;
        doneTask.push(undoneTask[i]);
        undoneTask.splice(i, 1);
        renderTask(undoneTask);
        select();
      }
    }
  }

  const filterInput = document.getElementById("filter-options");
  filterInput.addEventListener("change", filterInputHandler);

  function filterInputHandler() {
    if (filterInput.value === "DONE") {
      renderTaskDone(doneTask);
      select();
    } else if (filterInput.value === "UNDONE") {
      renderTask(undoneTask);
      select();
    }
  }

  let currentAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  // person["address"] = "123 Main Street";

  // currentAccount = JSON.stringify(tasksArray);

  // localStorage.setItem('loggedInAccount', JSON.stringify(currentAccount));
}


toDoApp();
