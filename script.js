const button = document.getElementById("test-button");
const statusText = document.getElementById("status-text");

if (button && statusText) {
  button.addEventListener("click", () => {
    statusText.textContent =
      "Interaction works correctly. The prototype website is ready for demonstration and further expansion.";
  });
}
