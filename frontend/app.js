
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');

  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });


const countdownDate = new Date("Sep 26, 2025 07:00:00").getTime();

const countdownFunction = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
        clearInterval(countdownFunction);
        document.getElementById("countdown").innerHTML = "<h3>The Hackathon has started!</h3>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

}, 1000);

const text = "Join the ultimate 36-hour coding marathon to solve real-world problems.";
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

  const responseMessageElement = document.getElementById("responseMessage");
  responseMessageElement.textContent = 'Submitting...';
  responseMessageElement.style.color = 'white';
  
  const teamName = document.getElementById("teamName").value;
  const collegeName = document.getElementById("collegeName").value;

  const leader = {
    name: document.getElementById("leaderName").value,
    roll: document.getElementById("leaderRoll").value,
    email: document.getElementById("leaderEmail").value,
    phone: document.getElementById("leaderPhone").value
  };  

  const members = [];

  members.push({
    name: document.getElementById("member2Name").value,
    roll: document.getElementById("member2Roll").value
  });

  const member2Name = document.getElementById("member2Name").value.trim();
    if (member2Name) {
      members.push({
            name: member2Name,
            roll: document.getElementById("member2Roll").value,
      });
  }

   const member3Name = document.getElementById("member3Name").value.trim();
    if (member3Name) {
        members.push({
            name: member3Name,
            roll: document.getElementById("member3Roll").value,
        });
    }

     const registrationData = {
        teamName,
        collegeName,
        leader,
        members,
    };

    try{

      const response = await fetch("https://www.localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if(response.ok){
        responseMessageElement.textContent = data.message;
        responseMessageElement.style.color = "lightgreen";
        document.getElementById("registrationForm").reset();
      } 
      else{
        responseMessageElement.textContent = `Error: ${data.message}`;
        responseMessageElement.style.color = 'salmon';
      }
    }

      catch (error) {
        console.error("Submission Error: ", error);
        responseMessageElement.textContent = "Error: Could not connect to the Server.";
        responseMessageElement.style.color = "salmon";
      }
    
});


  // responseMessageElement.textContent = "";

//   const teamName = document.getElementById("team-name").value.trim();
//   const collegeName = document.getElementById("college-name").value.trim();
//   const leaderName = document.getElementById("leader-name").value.trim();
//   const leaderRoll = document.getElementById("leader-roll").value.trim();
//   const leaderEmail = document.getElementById("leader-mail").value.trim();
//   const leaderPhone = document.getElementById("leader-phone").value.trim();
//   const member2Name = document.getElementById("member2-name").value.trim();
//   const member2Roll = document.getElementById("member2-roll").value.trim();
//   const member3Name = document.getElementById("member3-name").value.trim();
//   const member3Roll = document.getElementById("member3-roll").value.trim();
//   const member4Name = document.getElementById("member4-name").value.trim();
//   const member4Roll = document.getElementById("member4-roll").value.trim();

//   if (!teamName || !collegeName || !leaderName || !leaderRoll || !leaderEmail || !leaderPhone || !member2Name || !member2Roll || !member3Name || !member3Roll) {
//       responseMessageElement.textContent = "Please fill out all required fields.";
//       responseMessageElement.style.color = "red";
//       return; // Stop the function if validation fails
//   }

//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if(!emailPattern.test(leaderEmail)) {
//     responseMessageElement.textContent = "Please enter a valid email address.";
//     responseMessageElement.style.color = "red";
//     return;
//   }

//   const phonePattern = /^\d{10}$/;
//   if(!phonePattern.test(leaderPhone)) {
//     responseMessageElement.textContent = "Please enter a valid 10-digit mobile number.";
//     responseMessageElement.style.color = "red";
//     return;
//   }

//   const registrationData = {
//     teamName,
//     collegeName,
//     leader: {
//       name: leaderName,
//       roll: leaderRoll,
//       email: leaderEmail,
//       phone: leaderPhone,
//     },
//     members: [
//       {name: member2Name, roll: member2Roll},
//       {name: member3Name, roll: member3Roll},
//     ],
//   };

//   if (member4Name && member4Roll) {
//       registrationData.members.push({ name: member4Name, roll: member4Roll });
//   }

//   try{
//     responseMessageElement.textContent = "Submitting...";
//     responseMessageElement.style.color = "orange";

//     const response = await fetch("https://hackwithvizag-backend.onrender.com/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(registrationData),
//     }); 

//     const data = await response.json();

//     responseMessageElement.textContent = data.message;
//     responseMessageElement.style.color = response.ok ? "green" : "red";

//     if(response.ok) {
//       document.getElementById("registrationForm").reset();
//     }
//   }

//   catch (error) {
//     console.error("Error:", error); 
//     responseMessageElement.textContent = "Error: Could not connect to the server.";
//     responseMessageElement.style.color = "red";
//   }

// });



// let map;

//     async function initMap() {

//         const location = { lat: 17.8691423, lng: 83.2956262 }; //NSRIT CSE Block

//     const { Map } = await google.maps.importLibrary("maps");

//     // The map, centered at the specified location
//     map = new Map(document.getElementById("map"), {
//         zoom: 16,
//         center: location,
//     });

//     // Add a marker for the location
//     new google.maps.Marker({
//         position: location,
//         map: map,
//         title: "New York City"
//     });
// }

    // Get the button element by its ID
const backToTopButton = document.getElementById("back-to-top-btn");

// Show the button when the user scrolls down 200px from the top
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
  // Check both documentElement and body for cross-browser compatibility
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
}

// When the user clicks on the button, scroll to the top of the document smoothly
backToTopButton.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const faqComponent = document.querySelector('.faq-container');

if (faqComponent) {
const faqItems = faqComponent.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');

        questionButton.addEventListener('click', () => {
            const currentlyActiveItem = faqComponent.querySelector('.faq-item.active');
            
            if (currentlyActiveItem && currentlyActiveItem !== item) {
                currentlyActiveItem.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });
}