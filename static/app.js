// Cache references to the text input and output elements so the page can
// update the displayed value without re-querying the DOM each time.
const textInput = document.querySelector("#text-input");
const textOutput = document.querySelector("#text-output");
const nameInput = document.querySelector("#name-input");
const nameForm = document.querySelector("#name-form");
const storyContent = document.querySelector("#story-content");
const introScreen = document.querySelector("#intro-screen");
const introMessage = document.querySelector("#intro-message");
const introDialogue = document.querySelector("#intro-dialogue");

const introMessages = [
  "This game is inspired by Doki Doki Literature Club! by Dan Salvato, and was initially built during an 8-hour hackathon.",
  "Please excuse my storywriting, this was made in under eight hours. Plus, writing is not my strong suit.",
];
let introMessageIndex = 0;
let isIntroActive = true;

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
  { text: "I take a look at my clock. It was 7:30. I guess that's what happens when I stay up past midnight.", next: 3},
  { text: "It's funny, really. No matter how late I stay up, I always seem to wake up before school starts.", next: 4},
  { text: "I sit up and stretch my arms, when I notice that another person is in my room.", next: 5},
  {
    text: (name) => `"Ah, you're awake${name ? `, ${name}` : ""}!"`,
    speaker: "???",
    next: 6
  },
  { text: "A familiar girl's voice fills my ears.", next: 7},
  { text: "That girl is Savori, my childhood friend and nextdoor neighbor.", next: 8},
  { text: "You know, that one friend that you've known since you were young?", next: 9},
  {
    text: "Since my parents are currently working overseas, Savori has been coming into my house to make sure I get out the door on time.",
    next: 10
  },
  {
    text: "While it is kind of embarrasing to have to rely on someone else to get ready for the day when I'm in my final year of highschool, I can't say that she hasn't saved me from being late a few times.",
    next: 11
  },
  {
    text: "\"You know, you should really start going to bed sooner. It's important that you do well in school.\"",
    speaker: "Savori", next: 12
  },
  { text: "\"Sooner or later, all this staying up late might catch up to you.\"", speaker: "Savori", next: 13},
  { text: "\"Can you promise me you'll try to be more responsible?\"", speaker: "Savori", next: 14},
  { text: "I stood up and started walking toward my door, and let out a sigh.", next: 15},
  {
    text: "\"Alright, I'll try.\"",
    speaker: (name) => name, next: 16
  },
  { text: "After eating breakfast (that Savori had made for me), we made our way out the door and walked to school", next: 17},
  { text: "\"So, have you given any thought to joining a club yet?\"", speaker: "Savori", next: 18},
  { text: "\"A club?\"", speaker: (name) => name, next: 19},
  {
    text: "\"Yes, a club! Remember you told me last year that you would join a club, but you didn't want to because it was during the middle of the school year already?\"",
    speaker: "Savori", next: 20
  },
  { text: "\"Did I say that...?\"", speaker: (name) => name, next: 21},
  { text: "There's a good chance I said that just to make Savori stop worrying about me.", next: 22},
  {
    text: "I would have felt weird about joining a club in the middle of the school year. Everyone else would already know what they were doing, and I wouldn't have wanted to drag them down.",
    next: 23
  },
  {
    text: "\"Yes! Clubs are an integral part of youth. If you don't join a club, you're in danger of becoming a NEET!\"",
    speaker: "Savori", next: 24
  },
  { text: "\"Just promise me you'll check out some clubs today?\"", speaker: "Savori", next: 25},
  { text: "\"Alright, I promise\"", speaker: (name) => name, next: 26},
  { text: "\"Thanks!~\"", speaker: "Savori", next: 27},
  { text: "The school day was the same as it always was, and before I knew it, the day was over.", next: 28},
  { text: (name) => `"${name ? `${name}` : ""}?"`, speaker: "Savori", next: 29},
  { text: "Savori must have come into the classroom I was in while I was spacing out.", next: 30},
  { text: "\"Savori? What are you doing? Aren't you usually busy after school?\"", speaker: (name) => name, next: 31},
  { text: "\"Well, yeah, but I thought you might need some help choosing a club.\"", speaker: "Savori", next: 32},
  { text: "\"Why do you care so much about me joining a club?\"", speaker: (name) => name, next: 33},
  { text: "\"I just thought, y'know... maybe you could come to my club!\"", speaker: "Savori", next: 34},
  { text: "\"You can't be serious...\"", speaker: (name) => name, next: 35},
  { text: "Savori is the vice president of the Programming Club.", next: 36},
  {
    text: "I've never really considered myself much of a programmer, but I've take coding classes for a few years and it's been enjoyable.",
    next: 37
  },
  { text: "\"It's no big deal if you join! Everyone's really friendly!\"", speaker: "Savori", next: 38},
  {
    text: "\"Plus, I kinda already told them I would bring in a new member, and Natsuko already made cupcakes and everything...\"",
    speaker: "Savori", next: 39
  },
  { text: "\"Don't make a promise you can't keep!\"", speaker: (name) => name, next: 40},
  { text: "\"Come on, will you at least come to this meeting?\"", speaker: "Savori", next: 41},
  { text: "I let out a sigh.", next: 42},
  { text: "\"Fine, I can stay for a cupcake.\"", speaker: (name) => name, next: 43},
  { text: "\"Yes! Let's go!~\"", speaker: "Savori", next: 44},
  {
    text: "Savori grabs me by the hand and pulls me out of the classroom and down the hallway to an area of the school I rarely visit, stopping in front of a classroom door.",
    next: 45
  },
  { text: "Savori swings open the door, full of energy.", next: 46},
  { text: "\"Everyone, I brought a new member!\"", speaker: "Savori", next: 47},
  { text: "\"Don't call me a new member-\"", speaker: (name) => name, next: 48},
  {
    text: "I take a look around the classroom. Aside from me and Savori, there are three girls here.",
    next: 49
  },
  { text: "\"Welcome to the Programming Club. It's a pleasure to see a new face.\"", speaker: "Girl 1", next: 50},
  { text: "\"Ugh, a boy? There goes the atmosphere.\"", speaker: "Girl 2", next: 51},
  { text: (name) => `"Ah, ${name ? `${name}` : ""}! Welcome to the club!"`, speaker: "Girl 3", next: 52},
  { text: "...", next: 53},
  { text: "All words escape me in this moment. This club...", next: 54},
  { text: "Is full of incredibly cute girls!!!", next: 55},
  { text: "Pretend you just witnessed some more plot that I unfortunately had to leave out (for now) due to time constraints.", next: 56},
  { text: "Minigame: pick words from here:",
    choices: [
      { text: "Hex", next: 57},
      { text: "Assembler", next: 58},
      { text: "C", next: 59},
      { text: "Fortran", next: 60},
      { text: "SQL", next: 61},
      { text: "Python", next: 62},
      { text: "Ruby", next: 63},
      { text: "Java", next: 64},
      { text: "C#", next: 65},
      { text: "Javascript", next: 66}
    ]
  },
  { text: "Holy unc dude", next: 67},
  { text: "Baaalright", next: 67},
  { text: "C deez nuts ahhhahahaha", next: 67},
  { text: "Who are you gng", next: 67},
  { text: "Yo I learned this one over the summer", next: 67},
  { text: "🐍", next: 67},
  { text: "I don't know this one", next: 67},
  { text: "I learned this once a while ago", next: 67},
  { text: "I haven't learned this one yet", next: 67},
  { text: "One of the programming languages of all time", next: 67},
  { text: "Thanks for playing I guess"}
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
  const rawSpeakerName = typeof message.speaker === "function"
    ? message.speaker(nameInput.value.trim())
    : message.speaker;
  // Show the speaker tag only when the line includes one.
  speakerName.textContent = rawSpeakerName || "";
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

function showIntroDialogue() {
  introMessage.textContent = introMessages[introMessageIndex];
  introDialogue.replaceChildren();

  const button = document.createElement("button");
  button.className = "action-button";
  button.type = "button";
  button.textContent = introMessageIndex === introMessages.length - 1
    ? "Enter your name"
    : "Continue";
  button.addEventListener("click", advanceIntroDialogue);
  introDialogue.append(button);
}

function advanceIntroDialogue() {
  if (!isIntroActive) {
    return;
  }

  introMessageIndex += 1;
  if (introMessageIndex < introMessages.length) {
    showIntroDialogue();
    return;
  }

  isIntroActive = false;
  introScreen.hidden = true;
  nameForm.hidden = false;
  nameInput.focus();
}

showIntroDialogue();

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

  if (isIntroActive) {
    advanceIntroDialogue();
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
const helloButton = document.querySelector("#hello-button");
if (helloButton) {
  helloButton.addEventListener("click", async () => {
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
}