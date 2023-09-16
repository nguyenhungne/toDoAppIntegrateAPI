function redirect() {
    window.location.replace('./logIn.html');
}

function toDoApp () {
    const taskInput = document.querySelector('.task-input');
    const addButton = document.querySelector('.add-button')
    const cancelButton = document.querySelector('.cancel-button');


    cancelButton.addEventListener('click', cancelHandel );

    function cancelHandel() { 
       const toDoHandle = document.querySelector('.to-do-handle');
       toDoHandle.classList.add('hidden');
    }

    function clearTasks () {
        const taskContent = document.querySelector('.task-content');
        taskContent.innerHTML = '';
    }


    function renderTaskDone (tasks) {
        clearTasks();

        tasks.forEach(element => {
            const toDoContent = document.createElement("div");
            toDoContent.classList.add("to-do-content");

            const toDoDoneInput = document.createElement("input");
            toDoDoneInput.classList.add("to-do-done");
            toDoDoneInput.type = "checkbox";
            toDoDoneInput.setAttribute("checked", "checked");

            const taskP = document.createElement("p");
            taskP.classList.add("task");
            taskP.textContent = `${element.task}`

            const editButton = document.createElement("button");
            editButton.classList.add("edit-button", "button-handle");
            editButton.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button", "button-handle");
            deleteButton.textContent = "Delete";

            toDoContent.appendChild(toDoDoneInput);
            toDoContent.appendChild(taskP);
            toDoContent.appendChild(editButton);
            toDoContent.appendChild(deleteButton);

            const taskContent = document.querySelector(".task-content");

            taskContent.appendChild(toDoContent);
            
        });

    }

    function renderTask (tasks) {
        clearTasks();

        tasks.forEach(element => {
            const toDoContent = document.createElement("div");
            toDoContent.classList.add("to-do-content");

            const toDoDoneInput = document.createElement("input");
            toDoDoneInput.classList.add("to-do-done");
            toDoDoneInput.type = "checkbox";

            const taskP = document.createElement("p");
            taskP.classList.add("task");
            taskP.textContent = `${element.task}`

            const editButton = document.createElement("button");
            editButton.classList.add("edit-button", "button-handle");
            editButton.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button", "button-handle");
            deleteButton.textContent = "Delete";

            toDoContent.appendChild(toDoDoneInput);
            toDoContent.appendChild(taskP);
            toDoContent.appendChild(editButton);
            toDoContent.appendChild(deleteButton);

            const taskContent = document.querySelector(".task-content");

            taskContent.appendChild(toDoContent);
            
        });

    }

    let tasksArray = [];

let undoneTask = [];
let doneTask=[];
renderTask(tasksArray);

tasksArray.forEach((task) => {
    if (task.done === false) {
        undoneTask.push(task);
    } else if(task.done === true) {
        doneTask.push(task);
    }
})

renderTask(undoneTask);

//handle add task
addButton.addEventListener('click', addTask);

function addTask () {
    
  if (taskInput.value != '' | taskInput.value.trim()) { 
        undoneTask.push({
        task: taskInput.value,
        done: false,
    });
    
    taskInput.value = '';
    taskInput.focus();
    renderTask(undoneTask);
    select();
    }
}

function select() {

        

    const editButton = document.querySelectorAll('.edit-button');


    //handle edit task 
    for (let i = 0; i < editButton.length; i++) {
        editButton[i].addEventListener('click',editHandle);

        function editHandle () {
                taskInput.value = '';
                taskInput.focus();
                undoneTask.splice(i, 1);
                renderTask(undoneTask);
                select();

    
        }
    }




    //handle delete task:
const deleteButton = document.querySelectorAll('.delete-button');

for(let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener('click', deleteHandle);

        function deleteHandle() {
                undoneTask.splice(i, 1);
                renderTask(undoneTask);
                select();
        }
}

const checkBoxDone = document.querySelectorAll('.to-do-done');

for (let i = 0; i < undoneTask.length; i++) {
    console.log(checkBoxDone[i]);
    checkBoxDone[i].addEventListener('change', checkedHandle);
    function checkedHandle () {
        console.log(undoneTask[i]);
        undoneTask[i].done = true;
        doneTask.push(undoneTask[i]);
        undoneTask.splice(i, 1);
        renderTask(undoneTask);
        select();
    }
 }


}


const filterInput = document.getElementById('filter-options');
filterInput.addEventListener('change',filterInputHandler)

function filterInputHandler() {
    clearTasks();

    if (filterInput.value === 'DONE') {
        renderTaskDone(doneTask);
        select();
        
} else if (filterInput.value === 'UNDONE') {
        renderTask(undoneTask);
        select();
}

}



let currentAccount = JSON.parse(localStorage.getItem('loggedInAccount'));

console.log(currentAccount);

// person["address"] = "123 Main Street";

currentAccount["tasks"] = JSON.stringify(tasksArray);

localStorage.setItem('loggedInAccount', JSON.stringify(currentAccount));
};

toDoApp()

const checkLogIn = () => {
    let loggedInAccount = JSON.parse(localStorage.getItem('loggedInAccount'));

    if ((loggedInAccount === null)){
        redirect();
    }
 }

 