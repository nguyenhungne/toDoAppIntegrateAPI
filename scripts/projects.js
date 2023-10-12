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
  let response = await fetch("http://127.0.0.1:8000/projects");
  let data = await response.json();
  return data;
}

fetchAsync()
  .then((data) => projects(data))
  .catch((reason) => console.log(reason.message));

function projects(projects) {
  const taskInput = document.querySelector(".task-input");
  const addButton = document.querySelector(".add-button");
  const cancelButton = document.querySelector(".cancel-button");

  let Accounts = JSON.parse(localStorage.getItem("Accounts"));
  let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  const headerToDo = document.querySelector(".to-do-app-header");
  const welcomeUserParagraph = document.createElement("p");
  welcomeUserParagraph.classList.add("wellcome-user");
  welcomeUserParagraph.textContent = `Well come ${loggedInAccount.userName} to projects 4.0`;

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
    //    const toDoHandle = document.querySelector('.to-do-handle');
    taskInput.value = "";
    taskInput.focus();
  }

  function clearProjects() {
    const taskContent = document.querySelector(".task-content");
    taskContent.innerHTML = "";
  }

  function renderProjectsDone(projects) {
    clearProjects();

    projects.forEach((element) => {
      const toDoContent = document.createElement("div");
      toDoContent.classList.add("to-do-content");
      toDoContent.dataset.id = element.id;

      const doneMessage = document.createElement("p");
      doneMessage.classList.add("done-message");
      doneMessage.innerHTML = "DONE";

      const taskP = document.createElement("p");
      taskP.classList.add("task-done");
      taskP.textContent = `${element.project}`;

      toDoContent.appendChild(doneMessage);
      toDoContent.appendChild(taskP);

      const taskContent = document.querySelector(".task-content");

      taskContent.appendChild(toDoContent);
    });
  }

  function renderProjects(projects) {
    clearProjects();

    projects.forEach((element) => {
      const toDoContent = document.createElement("div");
      toDoContent.classList.add("to-do-content");
      toDoContent.dataset.id = element.id;

      const checkDone = document.createElement("input");
      checkDone.classList.add("to-do-done");
      checkDone.type = "checkbox";

      const taskP = document.createElement("p");
      taskP.classList.add("task");
      taskP.textContent = `${element.project}`;

      const detailButton = document.createElement("button");
      detailButton.classList.add("select-button", "button-handle");
      detailButton.textContent = "Detail";

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button", "button-handle");
      deleteButton.textContent = "Delete";

      toDoContent.appendChild(checkDone);
      toDoContent.appendChild(taskP);
      toDoContent.appendChild(detailButton);
      toDoContent.appendChild(deleteButton);

      const taskContent = document.querySelector(".task-content");

      taskContent.appendChild(toDoContent);
    });
  }

  let projectsArray = projects;

  let undoneProjects = [];
  let doneProjects = [];

  // let projects = JSON.parse(localStorage.getItem("projects"));

  projectsArray.forEach((project) => {
    if (project.done === false) {
      undoneProjects.push(project);
    } else if (project.done === true) {
      doneProjects.push(project);
    }
  });

  renderProjects(undoneProjects);
  select();

  //handle add task
  addButton.addEventListener("click", addProject);

  function addProject() {
    let id = Math.floor(Math.random() * Date.now());
    if ((taskInput.value != "") | taskInput.value.trim()) {
      // new project to add to database
      const newProject = {
        id: id,
        project: taskInput.value,
        done: false,
      };

      taskInput.value = "";
      taskInput.focus();
      renderProjects(undoneProjects);
      filterInput.value = "UNDONE";
      select();
      updateDataBase("http://127.0.0.1:8000/projects", newProject, "POST");

    }
  }

  function select() {
    let detailButtons = document.querySelectorAll(".select-button");
    detailButtons = Array.from(detailButtons);
    detailButtons.forEach((detailButton) => {
      detailButton.addEventListener("click",accessToDetail)
      function accessToDetail (){
        id = detailButton.parentElement.dataset.id;
        window.location.replace(`../htmls/toDoApp.html?id=${id}`);
      }
    });

    //handle delete task:
    let deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons = Array.from(deleteButtons);

    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener("click", handleDelete);

      function handleDelete() {
        const id = deleteButton.parentElement.dataset.id;
        path = `http://127.0.0.1:8000/projects/${id}`;
        updateDataBase(path, null, "DELETE");
      }
    });

    let checkBoxDone = document.querySelectorAll(".to-do-done");
    checkBoxDone = Array.from(checkBoxDone);

    checkBoxDone.forEach((checkBox) => {
      checkBox.addEventListener("change", handleChecked);
      function handleChecked() {
        const id = checkBox.parentElement.dataset.id;
        path = `http://127.0.0.1:8000/projects/${id}`;
        const i = undoneProjects.findIndex(
          (project) => project.id === parseInt(id)
        );
        undoneProjects[i].done = true;
        doneProjects.push(undoneProjects[i]);
        updateDataBase(path, undoneProjects[i], "PATCH");
        undoneProjects.splice(i, 1);
      }
    });
  }

  const filterInput = document.getElementById("filter-options");
  filterInput.addEventListener("change", filterInputHandler);

  function filterInputHandler() {
    if (filterInput.value === "DONE") {
      renderProjectsDone(doneProjects);
      select();
    } else if (filterInput.value === "UNDONE") {
      renderProjects(undoneProjects);
      select();
    }
  }

  Accounts.forEach(function (account, index, array) {
    if (account.userName === loggedInAccount.userName) {
      array.splice(index, 1, loggedInAccount);
      localStorage.setItem("Accounts", JSON.stringify(array));
    }
  });
}
