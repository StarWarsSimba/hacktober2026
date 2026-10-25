// Find the input box and the paragraph where its text will be displayed.
const textInput = document.querySelector("#text-input");
const textOutput = document.querySelector("#text-output");

// Update the displayed text whenever the input changes, including typing,
// pasting, or clearing the box.
textInput.addEventListener("input", () => {
  // Show the placeholder prompt again when the box is empty.
  textOutput.textContent = textInput.value || "Your text will appear here.";
});

// Edit this array to set the dialogue and the order it appears in.
const dialogueMessages = [
  "The journey begins.",
  "A new path opens ahead.",
  "The story continues..."
];
const keyMessage = document.querySelector("#key-message");
let currentMessageIndex = 0;

keyMessage.textContent = dialogueMessages[currentMessageIndex];

// Advance the dialogue once for each key press, stopping at the final message.
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isFormControl = target instanceof HTMLElement &&
    (target.isContentEditable || target.closest("input, textarea, select, button"));
  const isModifierKey = ["Alt", "Control", "Meta", "Shift"].includes(event.key);

  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
      isModifierKey || isFormControl) {
    return;
  }

  if (currentMessageIndex < dialogueMessages.length - 1) {
    currentMessageIndex += 1;
    keyMessage.textContent = dialogueMessages[currentMessageIndex];
  }
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