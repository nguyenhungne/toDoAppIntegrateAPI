// const jwt = require("jsonwebtoken");

function redirect() {
  window.location.replace("./logIn.html");
}

const token = JSON.parse(localStorage.getItem("token"));
const payload = token.split('.')[1];
const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));

//userId
const userIdParse = JSON.parse(jsonPayload).id;

function checkLogIn() {
  if (token === null) {
    redirect();
  }
 }

// load data from database
async function fetchAsync(path = "http://127.0.0.1:8000/projects") {
  let response = await fetch(path, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  let data = await response.json();
  return data;
}

fetchAsync()
  .then((data) => projects(data))
  .catch((reason) => console.log(reason.message));

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

function projects(projects) {
  const taskInput = document.querySelector(".task-input");
  const addButton = document.querySelector(".add-button");
  const cancelButton = document.querySelector(".cancel-button");

  let Accounts = JSON.parse(localStorage.getItem("Accounts"));
  // let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  const headerToDo = document.querySelector(".to-do-app-header");
  const welcomeUserParagraph = document.createElement("p");
  welcomeUserParagraph.classList.add("wellcome-user");

  welcomeUserParagraph.textContent = `Well come to projects 4.0`;

  headerToDo.appendChild(welcomeUserParagraph);

  const logoApp = document.querySelector(".logo-app");

  logoApp.addEventListener("click", showMenu);

  function showMenu() {
    const menu = document.getElementById("myDropdown");
    menu.classList.toggle("show");
  }

  cancelButton.addEventListener("click", handleCancel);

  function handleCancel() {
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
      toDoContent.dataset.id = element._id;

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
      toDoContent.dataset.id = element._id;

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
  // console.log(projectsArray);

  let undoneProjects = [];
  let doneProjects = [];

  projectsArray.forEach((project) => {
    if (project.done === false) {
      undoneProjects.push(project);
    } else if (project.done === true) {
      doneProjects.push(project);
    }
  });

  renderProjects(undoneProjects);

  //handle add project
  addButton.addEventListener("click", addProject);

  async function addProject() {
    if ((taskInput.value != "") | taskInput.value.trim()) {
      // new project to add to database
      let newProject = {
        project: taskInput.value,
        done: false,
      };

      taskInput.value = "";
      taskInput.focus();
      filterInput.value = "UNDONE";
      const response = await updateDataBase(
        "http://127.0.0.1:8000/projects",
        newProject,
        "POST"
      );
      const data = await response.json();
      const projectId = data._id;
      const userId = userIdParse; 

      // create a new projectUser
      let newProjectUser = {
        projectId: projectId,
        userId: userId,
        role: 'admin'
      };


      await updateDataBase(
        "http://127.0.0.1:8000/projectUsers",
        newProjectUser,
        "POST"
      );

      await fetchAsync()
        .then((data) => {
          let projectsArray = data;
          let undoneProjects = [];
          let doneProjects = [];
          projectsArray.forEach((project) => {
            if (project.done === false) {
              undoneProjects.push(project);
            } else if (project.done === true) {
              doneProjects.push(project);
            }
          });
          return undoneProjects;
        })
        .then((data) => renderProjects(data))
        .catch((reason) => console.log(reason.message));
    }
  }

  let containerTodo = document.querySelector(".task-content");
  containerTodo.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("delete-button")) {
      handleDelete(event.target);
    }

    if (event.target && event.target.classList.contains("select-button")) {
      accessToDetail(event.target);
    }

    if (event.target && event.target.classList.contains("to-do-done")) {
      handleChecked(event.target);
    }
  });

  //handle detail project
  function accessToDetail(detailButton) {
    id = detailButton.parentElement.dataset.id;
    window.location.replace(`../htmls/toDoApp.html?id=${id}`);
  }

  //handle delete project:
  async function handleDelete(deleteButton) {
    const id = await deleteButton.parentElement.dataset.id;
    console.log(id);
    path = await `http://127.0.0.1:8000/projects/${id}`;
    await updateDataBase(path, null, "DELETE","text/plain");
    await fetchAsync()
      .then((data) => {
        let projectsArray = data;
        let undoneProjects = [];
        let doneProjects = [];
        projectsArray.forEach((project) => {
          if (project.done === false) {
            undoneProjects.push(project);
          } else if (project.done === true) {
            doneProjects.push(project);
          }
        });
        return undoneProjects;
      })
      .then((data) => renderProjects(data))
      .catch((reason) => console.log(reason.message));
  }

  //handle isDone
  async function handleChecked(checkBox) {
    await fetchAsync()
      .then((data) =>{
        let projectsArray = data;
        let undoneProjects = [];
        let doneProjects = [];
        projectsArray.forEach((project) => {
          if (project.done === false) {
            undoneProjects.push(project);
          } else if (project.done === true) {
            doneProjects.push(project);
          }
        });

        const id = checkBox.parentElement.dataset.id;
        path = `http://127.0.0.1:8000/projects/${id}`;
        const i = undoneProjects.findIndex(
            (project) => project._id == id
          );
          console.log(i);
        undoneProjects[i].done = true;
        console.log(undoneProjects[i]);
        updateDataBase(path, undoneProjects[i], "PATCH", "application/json");
        undoneProjects.splice(i, 1);
        renderProjects(undoneProjects);
      })
      .catch((reason) => console.log(reason.message));
  }

  const filterInput = document.getElementById("filter-options");
  filterInput.addEventListener("change", filterInputHandler);

  async function filterInputHandler() {
    await fetchAsync()
        .then((data) => {
          let projectsArray = data;
          let undoneProjects = [];
          let doneProjects = [];
          projectsArray.forEach((project) => {
            if (project.done === false) {
              undoneProjects.push(project);
            } else if (project.done === true) {
              doneProjects.push(project);
            }
          });
          if (filterInput.value === "DONE") {
            renderProjectsDone(doneProjects)
          }

          if (filterInput.value === "UNDONE") {
            renderProjects(undoneProjects)
          }

        })
        .catch((reason) => console.log(reason.message));
  }

  // Accounts.forEach(function (account, index, array) {
  //   if (account.userName === loggedInAccount.userName) {
  //     array.splice(index, 1, loggedInAccount);
  //     localStorage.setItem("Accounts", JSON.stringify(array));
  //   }
  // });
}
