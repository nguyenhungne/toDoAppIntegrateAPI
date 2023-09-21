function redirect() {
  window.location.replace("./logIn.html");
}

const checkLogIn = () => {
  let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  if (loggedInAccount === null) {
    redirect();
  }
};

function projects() {
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

  let projectsArray = loggedInAccount.projects;

  let undoneProjects = [];
  let doneProjects = [];

  let projects = JSON.parse(localStorage.getItem("projects"));

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
  addButton.addEventListener("click", addTask);

  function addTask() {
    let id = Math.floor(Math.random() * Date.now());

    if ((taskInput.value != "") | taskInput.value.trim()) {
      undoneProjects.push({
        id: id,
        project: taskInput.value,
        done: false,
      });

      taskInput.value = "";
      taskInput.focus();
      renderProjects(undoneProjects);
      filterInput.value = "UNDONE";
      select();
      handleUpdate();

      if (projects.length == 0) {
        projects.push({
          projectsId: id,
          tasks: [],
          members: [
            {
              name: loggedInAccount.userName,
              role: "admin",
            },
          ],
        });
      } else {
        projects = [...projects];
        projects.push({
          projectsId: id,
          tasks: [],
          members: [],
        });
      }
    }
  }

  function select() {
    const detailButton = document.querySelectorAll(".select-button");

    for (let i = 0; i < detailButton.length; i++) {
      detailButton[i].addEventListener("click", accessToDetail);

      function accessToDetail(e) {
        localStorage.setItem(
          "currentIdProject",
          loggedInAccount.projects[i].id
        );

        window.location.replace("../htmls/toDoApp.html");
      }
    }

    //handle delete task:
    const deleteButton = document.querySelectorAll(".delete-button");

    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].addEventListener("click", handleDelete);

      function handleDelete() {
        undoneProjects.splice(i, 1);
        projects.splice(i, 1);
        renderProjects(undoneProjects);
        select();
        handleUpdate();

        localStorage.setItem("projects", JSON.stringify(projects));
      }

      localStorage.setItem("projects", JSON.stringify(projects));
    }

    const checkBoxDone = document.querySelectorAll(".to-do-done");

    for (let i = 0; i < undoneProjects.length; i++) {
      checkBoxDone[i].addEventListener("change", handleChecked);
      function handleChecked() {
        undoneProjects[i].done = true;
        doneProjects.push(undoneProjects[i]);
        undoneProjects.splice(i, 1);
        renderProjects(undoneProjects);
        select();
        handleUpdate();
      }
    }
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

  function handleUpdate() {
    let currentAccount = JSON.parse(localStorage.getItem("loggedInAccount"));
    currentAccount.projects = doneProjects.concat(undoneProjects);
    localStorage.setItem("loggedInAccount", JSON.stringify(currentAccount));
  }

  Accounts.forEach(function (account, index, array) {
    if (account.userName === loggedInAccount.userName) {
      array.splice(index, 1, loggedInAccount);
      localStorage.setItem("Accounts", JSON.stringify(array));
    }
  });
}

projects();
