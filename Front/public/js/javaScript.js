const loginForm = document.getElementById("form-login");
const signupForm = document.getElementById("form-signup");
const preferenceForm = document.getElementById("preferenceForm");

if (loginForm)
  loginForm.addEventListener("submit", (e) =>
    handleFormSubmit(login, loginForm, e)
  );
if (signupForm)
  signupForm.addEventListener("submit", (e) =>
    handleFormSubmit(signup, signupForm, e)
  );

if (preferenceForm)
  preferenceForm.addEventListener("submit", (e) =>
    handleFormSubmit(setPreference, preferenceForm, e)
  );

const handleFormSubmit = async (handler, form, e) => {
  e.preventDefault();
  await handler(form);
};

const login = async (form) => {
  try {
    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;
    const res = await axios({
      method: form.method,
      url: form.action,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response?.data?.message || "An error occurred.");
  }
};

const signup = async (form) => {
  try {
    const name = form.querySelector("#name").value;
    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;
    const res = await axios({
      method: form.method,
      url: form.action,
      data: {
        name,
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Signed up successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response?.data?.message || "An error occurred.");
  }
};

const setPreference = async (form) => {
  try {
    const category = form.querySelector("#category").value;
    const text = form.querySelector("#customInput").value;
    const res = await axios({
      method: form.method,
      url: form.action,
      data: {
        category,
        text,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Preference updated successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response?.data?.message || "An error occurred.");
  }
};

const triggerUpdates = async () => {
  try {
    const response = await axios.post("/updates/get-updates");

    if (response.status === 200) {
      console.log("Updates triggered successfully:", response.data);
      showAlert("success", "News Updates are on the way!");
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    // Handle errors
    console.error(
      "Error triggering updates:",
      error.response?.data || error.message
    );
    showAlert("error", error.response?.data?.message || "An error occurred.");
  }
};

const showAlert = (type, message) => {
  const modal = document.getElementById("feedback");
  modal.textContent = message;
  modal.className = `modal ${type === "success" ? "success" : "error"}`;
  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("hidden"), 4000);
};
