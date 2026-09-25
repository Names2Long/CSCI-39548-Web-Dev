// Ishraq Chowdhury
// File: script.js
// Assignment 2
// September 25, 2026
// Handles user input, validates integers, updates the array, and displays TwoSum results

// Constants from the LeetCode constraints
const maxValue = 1_000_000_000; // This is 10^9
const maxLength = 10_000;        // This is 10^4

// const bc we never reassign the array itself, only push/pop on it
// null means no valid target has been entered and zero is a valid target value
const nums = [];
let target = null;

// Elements from the DOM 
// querySelector uses HTML IDs to find the elements that this script reads and/or updates
const pushForm = document.querySelector("#push-form");
const pushInput = document.querySelector("#push-input");
const pushError = document.querySelector("#push-error");
const popButton = document.querySelector("#pop-button");
const clearButton = document.querySelector("#clear-button");
const targetInput = document.querySelector("#target-input");
const targetError = document.querySelector("#target-error");
const arrayView = document.querySelector("#array-view");
const resultOutput = document.querySelector("#result-output");
const resultDetail = document.querySelector("#result-detail");
const srStatus = document.querySelector("#sr-status");

// Helpers for functions to check inputs, formatting numbers, and displaying messages
// Turns the raw text of an input into a whole number, or explains an issue 
const parseWholeNumber = (rawValue) => {

  // Remove surrounding spaces before checking or converting the input
  const trimmed = rawValue.trim();

  if (trimmed === "") {
    return { error: "Enter a number first." };
  }

  // Edge cases 
  // Convert the text to a number. Also checks for fractions, non numbers, and values out of range 
  const value = Number(trimmed);

  if (!Number.isInteger(value)) {
    return { error: "Use a whole number, like 4 or -12." };
  } 
  if (Math.abs(value) > maxValue) {
    return { error: "Keep it between -1,000,000,000 and 1,000,000,000." };
  }

  // Return an object so callers can read either the validated value or an error message
  return { value };
};

// Add thousands separators for display without changing the stored numeric values
const formatNumber = (num) => num.toLocaleString("en-US");

// Puts text in the hidden live region so screen readers can announce it
const announce = (message) => {
  srStatus.textContent = message;
};

// Show the message and mark the field invalid, an empty message clears the error
const showError = (errorElement, inputElement, message) => {
  errorElement.textContent = message;
  inputElement.setAttribute("aria-invalid", message ? "true" : "false");
};

// Rendering to displaying or updating info / visuals 
// Rebuild the visible list from nums so its values and indices stay synched 
const renderArray = (matchPair, newestIndex) => {

  // Clear old list items before creating the current ones
  arrayView.innerHTML = "";

  nums.forEach((num, index) => {
    const item = document.createElement("li");
    item.className = "array-item";

    // Record matching indices for the reader label only
    const isMatch = matchPair !== null && matchPair.includes(index);

    const valueSpan = document.createElement("span");
    valueSpan.className = "array-value";

    // Insert the formatted value as plain text, rather than interpreting it as HTML
    valueSpan.textContent = formatNumber(num);

    const indexSpan = document.createElement("span");
    indexSpan.className = "array-index";
    indexSpan.textContent = `[${index}]`;

    item.appendChild(valueSpan);
    item.appendChild(indexSpan);

    // Give readers a full sentence instead of "7 [2]"
    item.setAttribute(
      "aria-label",
      `Index ${index}: ${num}${isMatch ? ", part of the answer" : ""}`
    );

    arrayView.appendChild(item);
  });

  const hasItems = nums.length > 0;
  arrayView.hidden = !hasItems;
};

// Display only the answer indices or a error/pending message
const renderResult = (matchPair) => {
  if (nums.length < 2 || target === null) {
    resultOutput.textContent = "";
    resultDetail.textContent = "";
    return;
  }

  if (matchPair === null) {
    resultOutput.textContent = "No Pair Found";
    resultDetail.textContent = "";
    return;
  }

  // Destructuring extracts the two indices returned by the algo
  const [firstIndex, secondIndex] = matchPair;
  resultOutput.textContent = `[${firstIndex}, ${secondIndex}]`;
  resultDetail.textContent = "";
};

// Runs TwoSum and redraws everything and called after every change
const updateView = (newestIndex = -1) => {

  // Only run the algo when at least two values and a valid target are available
  const canSolve = nums.length >= 2 && target !== null;
  const matchPair = canSolve ? twoSum(nums, target) : null;

  renderArray(matchPair, newestIndex);
  renderResult(matchPair);

  // Disable removal controls when there is nothing to remove
  popButton.disabled = nums.length === 0;
  clearButton.disabled = nums.length === 0;
};

// Event listeners to wait for user actions. 
// Clicks Push or Enter to add a number
// Clicks Pop Last to remove the last number
// Clicks Clear Array to remove all numbers
// Types in the Sum field to update the result

// Push a form submit, so pressing Enter on the keyboard works too
pushForm.addEventListener("submit", (event) => {

  // Stop the form from reloading the page so the array stays in memory
  event.preventDefault();

  if (nums.length >= maxLength) {
    showError(pushError, pushInput, `The array is full (${formatNumber(maxLength)} items max).`);
    return;
  }

  // Destructure the validation result before deciding whether to add the value
  const { value, error } = parseWholeNumber(pushInput.value);


  if (error) {
    showError(pushError, pushInput, error);
    pushInput.focus();
    return;
  }

  showError(pushError, pushInput, "");

  // Append a valid number, then redo and announce the change
  nums.push(value);
  updateView(nums.length - 1);
  announce(`Pushed ${value}. The array has ${nums.length} items.`);

  pushInput.value = "";
  pushInput.focus();
});

// Clear the error as soon as the user starts fixing it
pushInput.addEventListener("input", () => {
  if (pushError.textContent) {
    showError(pushError, pushInput, "");
  }
});

// If Pop Last then remove only the final array element
popButton.addEventListener("click", () => {
  if (nums.length === 0) {
    return;
  }

  const poppedValue = nums.pop();
  updateView();
  announce(`Popped ${poppedValue}. The array has ${nums.length} items.`);

  // The button becomes disabled when the array is empty
  if (nums.length === 0) {
    pushInput.focus();
  }
});

// Clear all values while preserving the same array object and the current target
clearButton.addEventListener("click", () => {
  nums.length = 0; // Empties a const array in place
  updateView();
  announce("Cleared the array.");
  pushInput.focus();
});

// Target updates live 
targetInput.addEventListener("input", () => {

  // Clearing the target also clears the displayed result
  if (targetInput.value.trim() === "") {
    target = null;
    showError(targetError, targetInput, "");
    updateView();
    return;
  }

  const { value, error } = parseWholeNumber(targetInput.value);

  if (error) {
    target = null;
    showError(targetError, targetInput, error);
  } else {
    target = value;
    showError(targetError, targetInput, "");
  }

  updateView();
});

// Initialize the empty page and disable Pop Last and Clear Array on first load
updateView();
