const button = document.getElementById("test-button");
const statusText = document.getElementById("status-text");
const footerYear = document.getElementById("footer-year");

if (button && statusText) {
  button.addEventListener("click", () => {
    statusText.textContent =
      "Interaction works correctly. The prototype website is ready for demonstration and further expansion.";
  });
}

if (footerYear) {
  const year = new Date().getFullYear();
  footerYear.textContent = `© ${year} Automatic Shoe Sizing System`;
}
