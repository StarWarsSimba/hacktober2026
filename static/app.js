// Find the input box and the paragraph where its text will be displayed.
const textInput = document.querySelector("#text-input");
const textOutput = document.querySelector("#text-output");

// Update the displayed text whenever the input changes, including typing,
// pasting, or clearing the box.
//textInput.addEventListener("input", () => {
  // Show the placeholder prompt again when the box is empty.
  //textOutput.textContent = textInput.value || "Your text will appear here.";
//});

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
  {
    text: "The lights lead you toward a distant village.",
    speaker: "Placeholder",
    next: 4
  },
  { text: "The forest path winds deeper into the unknown.", next: 4 },
  { text: "The story continues...", next: 5},
  { text: "... Why are you still here?", next: 6},
  { text: "I haven't gotten past this point in the project yet.", next: 7},
  { text: "...", next: 8},
  { text: "... I guess you can stay here..."}
];
const keyMessage = document.querySelector("#key-message");
const speakerName = document.querySelector("#speaker-name");
const dialogueOptions = document.querySelector("#dialogue-options");
let currentMessageIndex = 0;
let messageRevealTimer;
let isRevealingMessage = false;

function showDialogue() {
  const message = dialogueMessages[currentMessageIndex];
  speakerName.textContent = message.speaker || "";
  speakerName.hidden = !message.speaker;
  keyMessage.textContent = "";
  dialogueOptions.replaceChildren();

  const characters = Array.from(message.text);
  let visibleCharacterCount = 0;

  function finishMessage() {
    clearTimeout(messageRevealTimer);
    isRevealingMessage = false;
    keyMessage.textContent = message.text;
    showMessageActions(message);
  }

  function revealNextCharacter() {
    visibleCharacterCount += 1;
    keyMessage.textContent = characters.slice(0, visibleCharacterCount).join("");

    if (visibleCharacterCount < characters.length) {
      messageRevealTimer = setTimeout(revealNextCharacter, 35);
    } else {
      finishMessage();
    }
  }

  function showMessageActions(currentMessage) {
    dialogueOptions.replaceChildren();

    if (currentMessage.choices) {
      for (const choice of currentMessage.choices) {
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
    } else if (currentMessage.next !== undefined) {
      const button = document.createElement("button");
      button.className = "action-button";
      button.type = "button";
      button.textContent = "Continue";
      button.addEventListener("click", advanceDialogue);
      dialogueOptions.append(button);
    }
  }

  isRevealingMessage = characters.length > 0 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isRevealingMessage) {
    finishMessage();
    return;
  }

  const skipButton = document.createElement("button");
  skipButton.className = "action-button";
  skipButton.type = "button";
  skipButton.textContent = "Skip";
  skipButton.addEventListener("click", finishMessage);
  dialogueOptions.append(skipButton);
  revealNextCharacter();
}

function advanceDialogue() {
  if (isRevealingMessage) {
    return;
  }

  const message = dialogueMessages[currentMessageIndex];
  if (message.next !== undefined) {
    currentMessageIndex = message.next;
    showDialogue();
  }
}

showDialogue();

// During a reveal, a key completes the line; otherwise it advances dialogue.
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isFormControl = target instanceof HTMLElement &&
    (target.isContentEditable || target.closest("input, textarea, select, button"));
  const isModifierKey = ["Alt", "Control", "Meta", "Shift"].includes(event.key);

  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey ||
      isModifierKey || isFormControl) {
    return;
  }

  if (isRevealingMessage) {
    const skipButton = dialogueOptions.querySelector(".action-button");
    skipButton?.click();
  } else if (!dialogueMessages[currentMessageIndex].choices) {
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