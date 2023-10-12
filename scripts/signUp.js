const formSubmit = document.getElementById("form-submit");
const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const userName = document.getElementById("user-name");
const phoneNumber = document.getElementById("phone-number");
const password = document.getElementById("password");

function validity(clickedSubmit) {
  //Submit:

  function validateSubmit(element, errorMessage, regex) {
    if (element) {
      const validElement = element.parentElement.querySelector(".form-message");
      var regex = new RegExp(regex);

      function submit() {
        validValue = element.value;

        if (!regex.test(validValue)) {
          validElement.parentElement.classList.add("invalid");
          validElement.innerHTML = errorMessage;

          return false;
        } else {
          return true;
        }
      }

      return submit();
    }
  }

  //SubmitCheck

  // 1. Full name
  var regexFullName = new RegExp(/^[a-z,',-]+(\s)[a-z,',-]+$/i);
  const fullNameErrorMessage =
    "Tên của bạn không hợp lệ, vui lòng nhập kí tự không dấu!";

  const fullNameValidCheck = validateSubmit(
    fullName,
    fullNameErrorMessage,
    regexFullName
  );

  //2. email
  const regexEmail = new RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  );
  const emailErrorMessage = "Email của bạn không hợp lệ! Vui lòng thử lại...";

  const emailValidCheck = validateSubmit(email, emailErrorMessage, regexEmail);

  //3. user name
  var regexUserName = new RegExp(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/i);
  const userNameErrorMessage = "Tên tài khoản của bạn không hợp lệ!";

  const userNameValidCheck = validateSubmit(
    userName,
    userNameErrorMessage,
    regexUserName
  );

  // 4. số điện thoại:
  const regexPhoneNumber = new RegExp(
    /(84|0[3|5|7|8|9])+([0-9]{8})\b|(0|0[3|5|7|8|9])+([0-9]{8})\b/g
  );
  const phoneNumberErrorMessage = "Số điện thoại của bạn không hợp lệ!";

  const phoneNumberValidCheck = validateSubmit(
    phoneNumber,
    phoneNumberErrorMessage,
    regexPhoneNumber
  );

  //5. password
  const regexPassword = new RegExp(/^[A-Za-z]\w{7,14}$/);
  const passwordErrorMessage = "Mật khẩu của bạn không hợp lệ!";

  const passwordValidCheck = validateSubmit(
    password,
    passwordErrorMessage,
    regexPassword
  );

  function validateLive(element, errorMessage, regex) {
    if (element) {
      const validElement = element.parentElement.querySelector(".form-message");
      var regex = new RegExp(regex);

      element.oninput = (e) => {
        validElement.parentElement.classList.remove("invalid");
        validElement.innerHTML = "";
      };

      element.onblur = (e) => {
        if (!regex.test(e.target.value)) {
          validElement.parentElement.classList.add("invalid");
          validElement.innerHTML = errorMessage;
        }
      };
    }
  }

  if (clickedSubmit) {
    // 1. Full name
    const fullName = document.getElementById("fullname");
    var regexFullName = new RegExp(/^[a-z,',-]+(\s)[a-z,',-]+$/i);
    const fullNameErrorMessage =
      "Tên của bạn không hợp lệ, vui lòng nhập kí tự không dấu!";

    validateLive(fullName, fullNameErrorMessage, regexFullName);

    //2. email
    const email = document.getElementById("email");
    const regexEmail = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );
    const emailErrorMessage = "Email của bạn không hợp lệ! Vui lòng thử lại...";

    validateLive(email, emailErrorMessage, regexEmail);

    //3. user name
    const userName = document.getElementById("user-name");
    var regexUserName = new RegExp(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/i);
    const userNameErrorMessage = "Tên tài khoản của bạn không hợp lệ!";

    validateLive(userName, userNameErrorMessage, regexUserName);

    // 4. số điện thoại:
    const phoneNumber = document.getElementById("phone-number");
    const regexPhoneNumber = new RegExp(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b|(0|0[3|5|7|8|9])+([0-9]{8})\b/g
    );
    const phoneNumberErrorMessage = "Số điện thoại của bạn không hợp lệ!";

    validateLive(phoneNumber, phoneNumberErrorMessage, regexPhoneNumber);

    //5. password
    const password = document.getElementById("password");
    const regexPassword = new RegExp(/^[A-Za-z]\w{7,14}$/);
    const passwordErrorMessage = "Mật khẩu của bạn không hợp lệ!";

    validateLive(password, passwordErrorMessage, regexPassword);
  }

  if (
    fullNameValidCheck &&
    emailValidCheck &&
    userNameValidCheck &&
    phoneNumberValidCheck & passwordValidCheck
  ) {
    return true;
  } else {
    return false;
  }
}

//Submit:
let accountsList = [];
let Accounts = JSON.parse(localStorage.getItem("Accounts"));

formSubmit.addEventListener("click", submit);

function submit(e) {
  e.preventDefault();
  let clickedSubmit = true;
  let validCheck = validity(clickedSubmit);

  Accounts = JSON.parse(localStorage.getItem("Accounts"));

  if (Accounts === null) {
    if (validCheck) {
      accountsList.push({
        id:Math.floor(Date.now()*Math.random()),
        email: email.value,
        userName: userName.value,
        password: password.value,
        phoneNumber: phoneNumber.value,
        projects: [],
      });
    }

    localStorage.setItem("Accounts", JSON.stringify(accountsList));

    setTimeout(window.location.replace("./logIn.html"), 2000);
  }

  if (Accounts) {
    if (validCheck) {
      let Accounts = JSON.parse(localStorage.getItem("Accounts"));

      Accounts.push({
        email: email.value,
        userName: userName.value,
        password: password.value,
        phoneNumber: phoneNumber.value,
        projects: [],
      });

      localStorage.setItem("Accounts", JSON.stringify(Accounts));

      setTimeout(window.location.replace("./logIn.html"), 2000);
    }
  }
}

const checkLogIn = () => {
  let loggedInAccount = JSON.parse(localStorage.getItem("loggedInAccount"));

  if (!(loggedInAccount === null)) {
    setTimeout(window.location.replace("./toDoApp.html"), 2000);
  }
};
