document.querySelector("#hello-button").addEventListener("click", async () => {
  const response = await fetch("/api/hello");
  if (!response.ok) {
    throw new Error("Could not get a message from the server");
  }

  const data = await response.json();
  document.querySelector("#message").textContent = data.message;
});