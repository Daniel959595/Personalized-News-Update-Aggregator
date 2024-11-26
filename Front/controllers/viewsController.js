exports.preferencePage = (req, res) => {
  res.status(200).render("preferences", {
    title: "preferences",
  });
};

exports.homePage = (req, res) => {
  const user = req.user;
  const userName = user?.name || "Friend";
  res.status(200).render("home", {
    userName,
    title: "Home",
    user: user,
  });
};

exports.dashboardPage = (req, res) => {
  const user = req.user;
  res.status(200).render("dashboard", {
    title: "Dashboard",
    user: user,
  });
};

exports.loginPage = (req, res) => {
  res.status(200).render("login", {
    title: "Login",
  });
};

exports.signupPage = (req, res) => {
  res.status(200).render("signup", {
    title: "Signup",
  });
};
