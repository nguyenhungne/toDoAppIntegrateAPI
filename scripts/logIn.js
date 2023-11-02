function Redirect() {
  window.location.replace("../htmls/projects.html");
}

// update database
function updateDataBase(path, data, method, contentType = "application/json") {
  return fetch(path, {
    method: method,
    mode: "cors",
    credentials: "same-origin",
    headers: {
      // 'bearer': loggedInAccount.token,
      'Content-Type': contentType,
    },
    body: JSON.stringify(data),
  });
}

function logIn(data) {
  const email = document.getElementById("email");
  const userName = document.getElementById("user-name");
  const password = document.getElementById("password");
  const formLogIn = document.getElementById("form-log-in");
  const rememberMe = document.getElementById("remember-me");

  formLogIn.addEventListener("click", validLogIn);

  async function validLogIn(e) {
    errorFormMessage = document.querySelector(".form-error-message");
    e.preventDefault();

    let account = {
      email: email.value,
      username: userName.value,
      password: password.value,
    }

    await updateDataBase("http://127.0.0.1:8000/users/verify", account, "POST", "application/json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data == "Username or password is incorrect.") {
          email.parentElement.classList.add("invalid");
          userName.parentElement.classList.add("invalid");
          password.parentElement.classList.add("invalid");
          password.parentElement.classList.add("invalid");
          errorFormMessage.textContent = "Bạn đã đăng nhập thất bại !!!";
          email.oninput = (e) => {
            email.parentElement.classList.remove("invalid");
          };
          userName.oninput = () => {
            userName.parentElement.classList.remove("invalid");
          };
          password.oninput = () => {
            password.parentElement.classList.remove("invalid");
          };
          return;
        }

        if (data) {
          const token = data.token;
          localStorage.setItem("token", JSON.stringify(token));
          checkLogIn();
        }

      })
      .catch((reason) => console.log(reason.message));

  }

  const signUpButton = document.getElementById("form-sign-up");

  signUpButton.addEventListener("click", signUpHandle);

  function signUpHandle(e) {
    e.preventDefault();
    window.location.replace("./signUp.html");
  }
}

logIn();

const checkLogIn = () => {
  const accessToken = JSON.parse(localStorage.getItem("token"));

  if (!(accessToken === null)) {
    setTimeout(window.location.replace("../htmls/projects.html"), 2000);
  }
};


