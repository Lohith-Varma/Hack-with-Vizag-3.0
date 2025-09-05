
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


// let map;

// async function initMap() {

//     const location = { lat: 17.8691423, lng: 83.2956262 }; //NSRIT CSE Block

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