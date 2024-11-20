function showModal(message, isSuccess) {
  const modal = document.getElementById("feedback");
  modal.textContent = message;
  modal.className = isSuccess ? "modal success" : "modal error";
  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("hidden"), 3000);
}

async function submitForm(form, event) {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(form.action, {
      method: form.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    showModal(result.message, response.ok);
  } catch (error) {
    showModal("An error occurred.", false);
  }
}

document
  .querySelectorAll("form")
  .forEach((form) =>
    form.addEventListener("submit", (event) => submitForm(form, event))
  );
