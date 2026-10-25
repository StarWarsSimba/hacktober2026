// Find the input box and the paragraph where its text will be displayed.
const textInput = document.querySelector("#text-input");
const textOutput = document.querySelector("#text-output");

// Update the displayed text whenever the input changes, including typing,
// pasting, or clearing the box.
textInput.addEventListener("input", () => {
  // Show the placeholder prompt again when the box is empty.
  textOutput.textContent = textInput.value || "Your text will appear here.";
});

// Show a message whenever a key is pressed.
document.addEventListener("keydown", (event) => {
  document.querySelector("#key-message").textContent = `You pressed: ${event.key}`;
});

// When clicked, request the greeting from the Flask API.
document.querySelector("#hello-button").addEventListener("click", async () => {
  const response = await fetch("/api/hello");
  // Stop and report an error if the server did not return a successful response.
  if (!response.ok) {
    throw new Error("Could not get a message from the server");
  }

  // Parse the JSON response and show its message on the page.
  const data = await response.json();
  document.querySelector("#message").textContent = data.message;
});