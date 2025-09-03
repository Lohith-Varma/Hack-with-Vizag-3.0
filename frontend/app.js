const text = "Join the ultimate 24-hour coding marathon to solve real-world problems.";
const typingElement = document.getElementById("typing-text");
let index = 0;

function typeLetterByLetter() {
    if (index < text.length) {
      typingElement.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeLetterByLetter, 25); // speed (lower = faster)
  }
}

window.onload = typeLetterByLetter;
