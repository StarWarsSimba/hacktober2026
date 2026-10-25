// Cache references to the text input and output elements so the page can
// update the displayed value without re-querying the DOM each time.
const textInput = document.querySelector("#text-input");
const textOutput = document.querySelector("#text-output");
const nameInput = document.querySelector("#name-input");
const nameForm = document.querySelector("#name-form");
const storyContent = document.querySelector("#story-content");

// This block was left commented out because the page is currently using the
// dialogue system instead of the simple live-preview behavior.
// It would listen for every keystroke and mirror the input text into the output.
//textInput.addEventListener("input", () => {
  // Show the placeholder prompt again when the box is empty.
  //textOutput.textContent = textInput.value || "Your text will appear here.";
//});

// Build the story script as an array of message objects. Each message may have
// text, a speaker, a next index for linear progression, or choices for branching.
const dialogueMessages = [
  //{ text: "The journey begins.", next: 1 },
  //{
    //text: "A new path opens ahead. Which way will you go?",
    //choices: [
      //{ text: "Follow the lights", next: 2 },
      //{ text: "Enter the forest", next: 3 }
    //]
  //},
  //{
    //text: "The lights lead you toward a distant village.",
    //speaker: "Placeholder",
    //next: 4
  //},
  //{ text: "The forest path winds deeper into the unknown.", next: 4 },
  //{ text: "The story continues...", next: 5},
  //{ text: "... Why are you still here?", next: 6},
  //{ text: "I haven't gotten past this point in the project yet.", next: 7},
  //{ text: "...", next: 8},
  //{ text: "... I guess you can stay here..."}
  { text: "The sun beams down my eyes through the window shades.", next: 1},
  { text: "I guess that it's the start of another day.", next: 2},
  { text: "I take a look at my clock. '11:34'. I guess that's what happens when I stay up past midnight.", next: 3},
  { text: "It's not like I want to wake up this late, but I just struggle to go to bed at a reasonable time. It's probably a motivation thing or whatever.", next: 4},
  { text: "I wonder if there's anything that I can do today to make myself feel good about myself.", next: 5},
  {
    text: (name) => `"Ah, you're awake${name ? `, ${name}` : ""}!"`,
    speaker: "???",
    next: 6
  },
  { text: "A familiar girl's voice fills my ears.", next: 7},
  { text: "That girl is Aoi, my childhood friend.", next: 8},
  { text: "You know, that one friend that you've known since you were young?"}
];

// Grab the elements that render the active dialogue state so we can update the
// visible speaker, line text, and option buttons as the story changes.
const keyMessage = document.querySelector("#key-message");
const speakerName = document.querySelector("#speaker-name");
const dialogueOptions = document.querySelector("#dialogue-options");
const MAX_DIALOGUE_LINE_LENGTH = 70;

// Track which message in the conversation is currently being shown.
let currentMessageIndex = 0;
// Stores the timer that reveals the dialogue text one character at a time.
let messageRevealTimer;
// Indicates whether the current line is still being revealed to the user.
let isRevealingMessage = false;

function wrapDialogueText(text) {
  return text.split("\n").map((paragraph) => {
    const lines = [];
    let line = "";
    let lineLength = 0;

    for (const word of paragraph.trim().split(/\s+/).filter(Boolean)) {
      const characters = Array.from(word);
      const wordLength = characters.length;

      if (lineLength > 0 && lineLength + 1 + wordLength > MAX_DIALOGUE_LINE_LENGTH) {
        lines.push(line);
        line = "";
        lineLength = 0;
      }

      if (wordLength > MAX_DIALOGUE_LINE_LENGTH) {
        if (line) {
          lines.push(line);
          line = "";
          lineLength = 0;
        }

        for (let index = 0; index < wordLength; index += MAX_DIALOGUE_LINE_LENGTH) {
          const segment = characters
            .slice(index, index + MAX_DIALOGUE_LINE_LENGTH)
            .join("");
          if (index + MAX_DIALOGUE_LINE_LENGTH < wordLength) {
            lines.push(segment);
          } else {
            line = segment;
            lineLength = Array.from(segment).length;
          }
        }
      } else {
        line = line ? `${line} ${word}` : word;
        lineLength += (lineLength > 0 ? 1 : 0) + wordLength;
      }
    }

    lines.push(line);
    return lines.join("\n");
  }).join("\n");
}

// Render the current dialogue message and set up any button actions needed to
// continue the story or branch to a different scene.
function showDialogue() {
  // Pull the active message from the story array.
  const message = dialogueMessages[currentMessageIndex];
  const rawMessageText = typeof message.text === "function"
    ? message.text(nameInput.value.trim())
    : message.text;
  const messageText = wrapDialogueText(rawMessageText);
  // Show the speaker tag only when the line includes one.
  speakerName.textContent = message.speaker || "";
  // Clear any previous text before revealing the next message.
  keyMessage.textContent = "";
  dialogueOptions.replaceChildren();

  // Split the message into individual characters so the text can appear gradually.
  const characters = Array.from(messageText);
  let visibleCharacterCount = 0;

  // Finish the reveal immediately and display the full message plus any actions.
  function finishMessage() {
    clearTimeout(messageRevealTimer);
    isRevealingMessage = false;
    keyMessage.textContent = messageText;
    showMessageActions(message);
  }

  // Add one more character to the visible text and keep animating until complete.
  function revealNextCharacter() {
    visibleCharacterCount += 1;
    keyMessage.textContent = characters.slice(0, visibleCharacterCount).join("");

    if (visibleCharacterCount < characters.length) {
      messageRevealTimer = setTimeout(revealNextCharacter, 35);
    } else {
      finishMessage();
    }
  }

  // Add buttons for branching choices or the default continue action.
  function showMessageActions(currentMessage) {
    dialogueOptions.replaceChildren();

    if (currentMessage.choices) {
      for (const choice of currentMessage.choices) {
        const button = document.createElement("button");
        button.className = "choice-button";
        button.type = "button";
        button.textContent = choice.text;
        button.addEventListener("click", () => {
          // Jump to the selected branch and redraw the story from that point.
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

  // Respect reduced-motion accessibility settings by skipping the character-by-character
  // reveal when the user prefers less animation.
  isRevealingMessage = characters.length > 0 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isRevealingMessage) {
    finishMessage();
    return;
  }

  // Add a skip button during the reveal so users can jump straight to the full text.
  const skipButton = document.createElement("button");
  skipButton.className = "action-button";
  skipButton.type = "button";
  skipButton.textContent = "Skip";
  skipButton.addEventListener("click", finishMessage);
  dialogueOptions.append(skipButton);
  revealNextCharacter();
}

// Move forward in the dialogue only when the current line is fully revealed and
// no choice menu is waiting for input.
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

// Reveal the story only after the player submits a non-empty name.
nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  nameInput.value = nameInput.value.trim();

  if (!nameInput.value) {
    nameInput.focus();
    return;
  }

  nameForm.hidden = true;
  storyContent.hidden = false;
  showDialogue();
});

// Listen for keyboard input and either skip the reveal or continue the story when
// a standard key press occurs outside text-entry controls.
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
    // If the current line is still typing out, trigger the skip button.
    const skipButton = dialogueOptions.querySelector(".action-button");
    skipButton?.click();
  } else if (!dialogueMessages[currentMessageIndex].choices) {
    advanceDialogue();
  }
});

// Request the Flask backend greeting when the user clicks the button.
document.querySelector("#hello-button").addEventListener("click", async () => {
  // Fetch the JSON message from the Python API route.
  const response = await fetch("/api/hello");
  // If the response is not a successful HTTP status, stop and show the failure.
  if (!response.ok) {
    throw new Error("Could not get a message from the server");
  }

  // Convert the response body to JavaScript and display the message in the page.
  const data = await response.json();
  document.querySelector("#message").textContent = data.message;
});