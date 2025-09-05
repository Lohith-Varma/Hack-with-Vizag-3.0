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

document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value;
  const leaderName = document.getElementById("leaderName").value;
  const member1 = document.getElementById("member1").value;
  const member2 = document.getElementById("member2").value;
  const member3 = document.getElementById("member3").value;
  const email = document.getElementById("email").value;
  const college = document.getElementById("college").value;
  const phonenum = document.getElementById("phonenum").value;


  const teamMembers = [member1, member2, member3].filter((m) => m.trim() !== "");

  try{
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers:{ "Content-Type": "application/json" },
      body: JSON.stringify({teamName, leaderName, teamMembers, email, college, phonenum}),
    });

    const data = await response.json();
    document.getElementById("responseMessage").textContent = data.message;
    document.getElementById("responseMessage").style.color = response.ok ? "green" : "red";
  }
    catch (error) {
    document.getElementById("responseMessage").textContent = "Error connecting to server!";
    document.getElementById("responseMessage").style.color = "red";
  }
  
});