function Redirect() {
    window.location.replace('./toDoApp.html');
 }


function logIn () {
const email = document.getElementById('email');
const userName = document.getElementById('user-name');
const password = document.getElementById('password');
const formLogIn = document.getElementById('form-log-in');
const rememberMe = document.getElementById('remember-me');

formLogIn.addEventListener('click' ,validLogIn);

function validLogIn (e) {
    errorFormMessage = document.querySelector('.form-error-message')
    e.preventDefault();

    let accounts = JSON.parse( localStorage.getItem('Accounts'));


    accounts.forEach(element => {
       if (email.value === element.email && userName.value === element.userName && password.value === element.password  ) {
            // if (rememberMe.checked === true) {
                const loggedInAccount = element;
                localStorage.setItem('loggedInAccount', JSON.stringify(loggedInAccount));
            // }

            // if (rememberMe.checked === false) {
            //     const loggedInAccount = element;
            //     sessionStorage.setItem('loggedInAccount', JSON.stringify(loggedInAccount));
            // }
            
            Redirect();
            return;
       } else {
            email.parentElement.classList.add('invalid');
            userName.parentElement.classList.add('invalid');
            password.parentElement.classList.add('invalid');
            password.parentElement.classList.add('invalid');
            errorFormMessage.textContent = 'Bạn đã đăng nhập thất bại !!!';
            email.oninput = (e) => {
                email.parentElement.classList.remove('invalid');
            }
            userName.oninput = () => {
                userName.parentElement.classList.remove('invalid');
            }
            password.oninput = () => {
                password.parentElement.classList.remove('invalid');
            }

       }


    });
}

const signUpButton = document.getElementById('form-sign-up');

signUpButton.addEventListener('click', signUpHandle);

function signUpHandle (e) {
    e.preventDefault();
    window.location.replace('./signUp.html')
}


}

logIn()

const checkLogIn = () => {
    let loggedInAccount = JSON.parse(localStorage.getItem('loggedInAccount'));

    if (!(loggedInAccount === null)){
        setTimeout(window.location.replace('./toDoApp.html'),2000)
    }
 }