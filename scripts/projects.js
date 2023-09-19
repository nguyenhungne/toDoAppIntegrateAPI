// Math.floor(Math.random()*Date.now()) cai nay la id ne`.

let loggedInAccount = JSON.parse(localStorage.getItem('loggedInAccount'));

console.log(loggedInAccount);

const headerToDo = document.querySelector('.to-do-app-header');
    const welcomeUserParagraph = document.createElement('p');
    welcomeUserParagraph.classList.add('wellcome-user');
    welcomeUserParagraph.textContent = `Well come ${loggedInAccount.userName} to ToDoApp 4.0`;

    headerToDo.appendChild(welcomeUserParagraph);

    const logoApp = document.querySelector('.logo-app');
    
    logoApp.addEventListener('click', showMenu );

    function showMenu() {
        const menu = document.getElementById('myDropdown');
        
        menu.classList.toggle('show');        
    }