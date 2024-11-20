exports.preferencePage = (req, res) => {
  res.status(200).render("preferences", {
    title: "preferences",
  });
};

exports.dashboardPage = (req, res) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
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
