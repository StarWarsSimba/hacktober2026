// Find the input box and the paragraph where its text will be displayed.
const textInput = document.querySelector("#text-input");
const textOutput = document.querySelector("#text-output");

// Update the displayed text whenever the input changes, including typing,
// pasting, or clearing the box.
textInput.addEventListener("input", () => {
  // Show the placeholder prompt again when the box is empty.
  textOutput.textContent = textInput.value || "Your text will appear here.";
});

// Add choices to a dialogue entry to pause progression and let the player choose a path.
const dialogueMessages = [
  { text: "The journey begins.", next: 1 },
  {
    text: "A new path opens ahead. Which way will you go?",
    choices: [
      { text: "Follow the lights", next: 2 },
      { text: "Enter the forest", next: 3 }
    ]
  },
  { text: "The lights lead you toward a distant village.", next: 4 },
  { text: "The forest path winds deeper into the unknown.", next: 4 },
  { text: "The story continues..." }
];
const keyMessage = document.querySelector("#key-message");
const dialogueOptions = document.querySelector("#dialogue-options");
let currentMessageIndex = 0;

function showDialogue() {
  const message = dialogueMessages[currentMessageIndex];
  keyMessage.textContent = message.text;
  dialogueOptions.replaceChildren();

  if (message.choices) {
    for (const choice of message.choices) {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      button.textContent = choice.text;
      button.addEventListener("click", () => {
        currentMessageIndex = choice.next;
        showDialogue();
      });
      dialogueOptions.append(button);
    }
  } else if (message.next !== undefined) {
    const button = document.createElement("button");
    button.className = "action-button";
    button.type = "button";
    button.textContent = "Continue";
    button.addEventListener("click", advanceDialogue);
    dialogueOptions.append(button);
  }
}

function advanceDialogue() {
  const message = dialogueMessages[currentMessageIndex];
  if (message.next !== undefined) {
    currentMessageIndex = message.next;
    showDialogue();
  }
}

showDialogue();

// Advance ordinary dialogue with a key press; questions wait for a choice.
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isFormControl = target instanceof HTMLElement &&
    (target.isContentEditable || target.closest("input, textarea, select, button"));
  const isModifierKey = ["Alt", "Control", "Meta", "Shift"].includes(event.key);

  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
      isModifierKey || isFormControl) {
    return;
  }

  if (!dialogueMessages[currentMessageIndex].choices) {
    advanceDialogue();
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