function logOut() {
  function redirect(link) {
    window.location.replace(link);
  }

  const logOutButton = document.getElementById("form-log-out");

  logOutButton.addEventListener("click", logOutHandle);

  function logOutHandle() {
    localStorage.removeItem("loggedInAccount");
    sessionStorage.removeItem("loggedInAccount");
    redirect("http://127.0.0.1:5500/logIn.html");
  }
}

logOut();
