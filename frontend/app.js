const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const navLinks = navbar.querySelectorAll("a");

// Toggle open/close on button click
menuToggle.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

// Close menu when clicking a link
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navbar.classList.remove("active");
  });
});




// ===============================================================================================================
// Countdown
// ===============================================================================================================

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

// ===============================================================================================================
// Hero Section Typing Effect
// ===============================================================================================================

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

  responseMessageElement.textContent = "";

  const teamName = document.getElementById("team-name").value.trim();
  const collegeName = document.getElementById("college-name").value.trim();
  const leaderName = document.getElementById("leader-name").value.trim();
  const leaderRoll = document.getElementById("leader-roll").value.trim();
  const leaderEmail = document.getElementById("leader-mail").value.trim();
  const leaderPhone = document.getElementById("leader-phone").value.trim();
  const member2Name = document.getElementById("member2-name").value.trim();
  const member2Roll = document.getElementById("member2-roll").value.trim();
  const member3Name = document.getElementById("member3-name").value.trim();
  const member3Roll = document.getElementById("member3-roll").value.trim();
  const member4Name = document.getElementById("member4-name").value.trim();
  const member4Roll = document.getElementById("member4-roll").value.trim();

  if (!teamName || !collegeName || !leaderName || !leaderRoll || !leaderEmail || !leaderPhone || !member2Name || !member2Roll || !member3Name || !member3Roll) {
      responseMessageElement.textContent = "Please fill out all required fields.";
      responseMessageElement.style.color = "red";
      return; // Stop the function if validation fails
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(leaderEmail)) {
    responseMessageElement.textContent = "Please enter a valid email address.";
    responseMessageElement.style.color = "red";
    return;
  }

  const phonePattern = /^\d{10}$/;
  if(!phonePattern.test(leaderPhone)) {
    responseMessageElement.textContent = "Please enter a valid 10-digit mobile number.";
    responseMessageElement.style.color = "red";
    return;
  }

  const registrationData = {
    teamName,
    collegeName,
    leader: {
      name: leaderName,
      roll: leaderRoll,
      email: leaderEmail,
      phone: leaderPhone,
    },
    teamMembers: [
      {name: member2Name, StudentId: member2Roll},
      {name: member3Name, StudentId: member3Roll},
    ],
    transactionId: document.getElementById("transactionId").value
  };

  if (member4Name && member4Roll) {
      registrationData.teamMembers.push({ name: member4Name, StudentId: member4Roll });
  }

  try{
    responseMessageElement.textContent = "Submitting...";
    responseMessageElement.style.color = "orange";

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    }); 

    const data = await response.json();

    responseMessageElement.textContent = data.message;
    responseMessageElement.style.color = response.ok ? "green" : "red";

    if(response.ok) {
      document.getElementById("registrationForm").reset();
    }
  }

  catch (error) {
    console.error("Error:", error); 
    responseMessageElement.textContent = "Error: Could not connect to the server.";
    responseMessageElement.style.color = "red";
  }

});



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


// ===============================================================================================================
// FAQ Section
// ===============================================================================================================

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

// // ==========================================================================================================================================
// // Registration Form
// // ==========================================================================================================================================

// // --- Step 1: DOM Element Selection ---
// const sections = document.querySelectorAll('.form-section');
// const prevBtn = document.getElementById('previous-button');
// const nextBtn = document.getElementById('next-button');
// const registerBtn = document.getElementById('register-button');
// const teamSizeSelect = document.getElementById('team-size');
// const memberFieldsDiv = document.getElementById('member-fields');
// const form = document.getElementById('registration-form');
// const summaryDiv = document.getElementById('summary');
// // You may need to add this to your HTML: <div id="loading-message" style="display:none;">Loading...</div>
// const loadingMessage = document.getElementById('loading-message'); 
// let currentSectionIndex = 0;

// // --- Step 2: Section Navigation Logic ---
// const showSection = (index) => {
//     sections.forEach((section) => {
//         section.classList.remove('active');
//     });
//     sections[index].classList.add('active');
//     prevBtn.style.display = index === 0 ? 'none' : 'block';
//     nextBtn.style.display = index === sections.length - 1 ? 'none' : 'block';
//     registerBtn.style.display = index === sections.length - 1 ? 'block' : 'none';
// };

// // --- Step 3: Dynamic Team Member Fields Generation ---
// const generateMemberFields = () => {
//     const teamSize = parseInt(teamSizeSelect.value);
//     memberFieldsDiv.innerHTML = '';
//     for (let i = 0; i < teamSize - 1; i++) {
//         const memberDiv = document.createElement('div');
//         memberDiv.innerHTML = `
//             <h3>Member ${i + 1}</h3>
//             <label for="member-${i + 1}-name">Name:</label>
//             <input type="text" id="member-${i + 1}-name" name="member-${i + 1}-name" required>
//             <label for="member-${i + 1}-student-id">Student ID:</label>
//             <input type="text" id="member-${i + 1}-student-id" name="member-${i + 1}-student-id" required>
//         `;
//         memberDiv.classList.add('member-field-group');
//         memberFieldsDiv.appendChild(memberDiv);
//     }
// };

// teamSizeSelect.addEventListener('change', generateMemberFields);

// // --- Step 4: Form Validation, Data Collection, and Summary ---
// const validateCurrentSection = () => {
//     const currentSection = sections[currentSectionIndex];
//     const inputs = currentSection.querySelectorAll('input, select');
//     for (const input of inputs) {
//         if (input.hasAttribute('required') && input.value.trim() === '') {
//             alert('Please fill out all required fields.');
//             input.focus();
//             return false;
//         }
//     }
//     return true;
// };

// const validateUniqueKeys = () => {
//     const leaderStudentId = document.getElementById('team-leader-student-id').value.trim();
//     const memberStudentIds = [];
//     const teamSize = parseInt(teamSizeSelect.value);

//     for (let i = 0; i < teamSize - 1; i++) {
//         const memberId = document.getElementById(`member-${i + 1}-student-id`).value.trim();
//         if (memberId !== '') { 
//             memberStudentIds.push(memberId);
//         }
//     }

//     if (leaderStudentId !== '' && memberStudentIds.includes(leaderStudentId)) {
//         alert("The Team Leader's Student ID is duplicated by a Team Member's ID. Please ensure all IDs are unique.");
//         return false;
//     }

//     const uniqueMemberIds = new Set(memberStudentIds);
//     if (uniqueMemberIds.size !== memberStudentIds.length) {
//         alert("Duplicate Student IDs found among team members. Please ensure all IDs are unique.");
//         return false;
//     }
//     return true;
// };

// const collectFormData = () => {
//     const formData = {
//         teamName: document.getElementById('team-name').value,
//         collegeName: document.getElementById('college-name').value,
//         teamSize: parseInt(teamSizeSelect.value),
//         leaderName: document.getElementById('team-leader-name').value,
//         leaderEmail: document.getElementById('team-leader-email').value,
//         leaderPhone: document.getElementById('team-leader-phone-number').value,
//         leaderStudentId: document.getElementById('team-leader-student-id').value,
//         teamMembers: []
//     };
//     const teamSize = parseInt(teamSizeSelect.value);
//     for (let i = 0; i < teamSize - 1; i++) {
//         formData.teamMembers.push({
//             name: document.getElementById(`member-${i + 1}-name`).value,
//             studentId: document.getElementById(`member-${i + 1}-student-id`).value
//         });
//     }
//     return formData;
// };

// const displaySummary = () => {
//     const formData = collectFormData();
//     const summaryHtml = `
//         <h3>Team Information</h3>
//         <p><strong>Team Name:</strong> ${formData.teamName}</p>
//         <p><strong>College:</strong> ${formData.collegeName}</p>
//         <p><strong>Team Size:</strong> ${formData.teamSize}</p>
//         <h3>Team Leader</h3>
//         <p><strong>Name:</strong> ${formData.leaderName}</p>
//         <p><strong>Email:</strong> ${formData.leaderEmail}</p>
//         <p><strong>Phone:</strong> ${formData.leaderPhone}</p>
//         <p><strong>Student ID:</strong> ${formData.leaderStudentId}</p>
//         <h3>Team Members</h3>
//         <ul>
//             ${formData.teamMembers.map(member => `
//                 <li><strong>Name:</strong> ${member.name}, <strong>Student ID:</strong> ${member.studentId}</li>
//             `).join('')}
//         </ul>
//         <h3>Registration Fee</h3>
//         <p><strong>Total Amount:</strong> ₹${formData.teamSize * 400}</p>
//     `;
//     summaryDiv.innerHTML = summaryHtml;
// };

// // --- Step 5: Main Event Listeners and Logic ---
// nextBtn.addEventListener('click', async () => {
//     if (validateCurrentSection()) {
//         if (currentSectionIndex === 1 || currentSectionIndex === 2) {
//             if (!validateUniqueKeys()) {
//                 return;
//             }
//         }
        
//         // This is where you might check the database before showing the summary.
//         // if (currentSectionIndex === sections.length - 2) {
//         //     loadingMessage.style.display = 'block';
//         //     const isUnique = await checkDatabaseForDuplicates(); // You would need to create this function.
//         //     loadingMessage.style.display = 'none';
//         //     if (!isUnique) {
//         //         return;
//         //     }
//         // }

//         if (currentSectionIndex < sections.length - 1) {
//             currentSectionIndex++;
//             if (currentSectionIndex === sections.length - 1) {
//                 displaySummary();
//             }
//             showSection(currentSectionIndex);
//         }
//     }
// });

// prevBtn.addEventListener('click', () => {
//     if (currentSectionIndex > 0) {
//         currentSectionIndex--;
//         showSection(currentSectionIndex);
//     }
// });

// registerBtn.addEventListener('click', () => {
//     const formData = collectFormData();
//     const amount = formData.teamSize * 400 * 100; // Amount in paise

//     const options = {
//         key: 'rzp_test_RFQtXJEh3wImMo', // IMPORTANT: Replace with your actual key
//         amount: amount,
//         currency: 'INR',
//         name: 'Hackathon Registration',
//         description: 'Team Registration',
//         prefill: {
//             name: formData.leaderName,
//             email: formData.leaderEmail,
//             contact: formData.leaderPhone
//         },
//         handler: async function(response) {
//             loadingMessage.textContent = 'Payment successful. Saving your registration...';
//             loadingMessage.style.display = 'block';
//             form.style.display = 'none';

//             try {
//                 const registrationResponse = await fetch('/api/register', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ ...formData, paymentId: response.razorpay_payment_id })
//                 });
//                 const data = await registrationResponse.json();
                
//                 if (data.success) {
//                     alert('Registration successful and payment confirmed!');
//                     form.reset();
//                     showSection(0);
//                 } else {
//                     alert('Registration failed after payment. Please contact support with your payment ID: ' + response.razorpay_payment_id);
//                 }
//             } catch (e) {
//                 console.error("Error saving registration to database: ", e);
//                 alert('Registration failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
//             } finally {
//                 loadingMessage.style.display = 'none';
//                 form.style.display = 'block';
//             }
//         },
//         modal: {
//             ondismiss: function() {
//                 alert('Payment was cancelled.');
//             }
//         }
//     };

//     const rzp = new Razorpay(options);
//     rzp.open();
// });

// // --- Step 6: Initial Setup ---
// // Generate fields for the default team size on page load
// generateMemberFields(); 
// // Show the first section of the form
// showSection(currentSectionIndex);



document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('.form-section');
  const prevBtn = document.getElementById('previous-button');
  const nextBtn = document.getElementById('next-button');
  const registerBtn = document.getElementById('register-button');
  const teamSizeSelect = document.getElementById('team-size');
  const memberFieldsDiv = document.getElementById('member-fields');
  const form = document.getElementById('registration-form');
  const summaryDiv = document.getElementById('summary');
  const loadingMessage = document.getElementById('loading-message');
  const responseMessage = document.getElementById('responseMessage');

  let currentSectionIndex = 0;

  // Change this if you serve backend from a different host/port.
  // If you serve frontend from the backend (Option B), you can set API_BASE = '' and fetch('/api/register') will work.
  const API_BASE = 'http://localhost:5000';

  const showSection = (index) => {
    sections.forEach(section => section.classList.remove('active'));
    sections[index].classList.add('active');
    prevBtn.style.display = index === 0 ? 'none' : 'block';
    nextBtn.style.display = index === sections.length - 1 ? 'none' : 'block';
    document.getElementById('button-container').style.display = index === sections.length -1 ? 'none' : 'flex';
  };

  const generateMemberFields = () => {
    const teamSize = parseInt(teamSizeSelect.value);
    memberFieldsDiv.innerHTML = '';
    for (let i = 0; i < teamSize - 1; i++) {
      const memberDiv = document.createElement('div');
      memberDiv.innerHTML = `
        <h3>Member ${i + 1}</h3>
        <label for="member-${i + 1}-name">Name:</label>
        <input type="text" id="member-${i + 1}-name" name="member-${i + 1}-name" required>
        <label for="member-${i + 1}-student-id">Student ID:</label>
        <input type="text" id="member-${i + 1}-student-id" name="member-${i + 1}-student-id" required>
      `;
      memberFieldsDiv.appendChild(memberDiv);
    }
  };

  const validateCurrentSection = () => {
    const currentSection = sections[currentSectionIndex];
    const inputs = currentSection.querySelectorAll('input[required], select[required]');
    for (const input of inputs) {
      if (!input.value.trim()) {
        responseMessage.textContent = 'Please fill out all required fields.';
        responseMessage.style.color = 'red';
        input.focus();
        return false;
      }
    }
    responseMessage.textContent = '';
    return true;
  };

  const validateUniqueKeys = () => {
    const leaderStudentId = document.getElementById('team-leader-student-id').value.trim();
    const memberStudentIds = [];
    if (leaderStudentId) memberStudentIds.push(leaderStudentId);

    const teamSize = parseInt(teamSizeSelect.value);
    for (let i = 0; i < teamSize - 1; i++) {
      const memberId = document.getElementById(`member-${i + 1}-student-id`).value.trim();
      if (memberId) memberStudentIds.push(memberId);
    }

    const uniqueMemberIds = new Set(memberStudentIds);
    if (uniqueMemberIds.size !== memberStudentIds.length) {
      responseMessage.textContent = 'Duplicate Student IDs found among team members. Please ensure all IDs are unique.';
      responseMessage.style.color = 'red';
      return false;
    }
    return true;
  };

  const collectFormData = () => {
    const formData = {
      teamName: document.getElementById('team-name').value.trim(),
      collegeName: document.getElementById('college-name').value.trim(),
      teamSize: parseInt(teamSizeSelect.value),
      leaderName: document.getElementById('team-leader-name').value.trim(),
      leaderEmail: document.getElementById('team-leader-email').value.trim(),
      leaderPhone: document.getElementById('team-leader-phone-number').value.trim(),
      leaderStudentId: document.getElementById('team-leader-student-id').value.trim(),
      teamMembers: []
    };
    const teamSize = parseInt(teamSizeSelect.value);
    for (let i = 0; i < teamSize - 1; i++) {
      formData.teamMembers.push({
        name: document.getElementById(`member-${i + 1}-name`).value.trim(),
        studentId: document.getElementById(`member-${i + 1}-student-id`).value.trim()
      });
    }
    return formData;
  };

  const displaySummary = () => {
    const formData = collectFormData();
    const qrImage = document.getElementById('qr-code-image');
    const summaryHtml = `
      <h3>Team Information</h3>
      <p><strong>Team Name:</strong> ${formData.teamName}</p>
      <p><strong>College:</strong> ${formData.collegeName}</p>
      <p><strong>Team Size:</strong> ${formData.teamSize}</p>
      <h3>Team Leader</h3>
      <p><strong>Name:</strong> ${formData.leaderName}</p>
      <p><strong>Email:</strong> ${formData.leaderEmail}</p>
      <p><strong>Phone:</strong> ${formData.leaderPhone}</p>
      <p><strong>Student ID:</strong> ${formData.leaderStudentId}</p>
      <h3>Team Members</h3>
      <ul>
        ${formData.teamMembers.map(member => `<li><strong>Name:</strong> ${member.name}, <strong>Student ID:</strong> ${member.studentId}</li>`).join('')}
      </ul>
      <h3>Registration Fee</h3>
      <p><strong>Total Amount:</strong> ₹${formData.teamSize * 400}</p>
    `;
    // set qr image by team size if you have two images
    if (formData.teamSize === 3) {
      qrImage.src = 'assets/UPI_1200.jpg';
    } else {
      qrImage.src = 'assets/UPI_1600.jpg';
    }
    summaryDiv.innerHTML = summaryHtml;
  };

  nextBtn.addEventListener('click', () => {
    if (validateCurrentSection()) {
      if ((currentSectionIndex === 1 || currentSectionIndex === 2) && !validateUniqueKeys()) {
        return;
      }
      if (currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
        if (currentSectionIndex === sections.length - 1) displaySummary();
        showSection(currentSectionIndex);
      }
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
      currentSectionIndex--;
      showSection(currentSectionIndex);
    }
  });

  registerBtn.addEventListener('click', async () => {
    const formData = collectFormData();
    const transactionIdInput = document.getElementById('transactionId');
    if (!transactionIdInput.value.trim()) {
      responseMessage.textContent = 'Please enter the UPI Transaction ID.';
      responseMessage.style.color = 'red';
      transactionIdInput.focus();
      return;
    }
    formData.transactionId = transactionIdInput.value.trim();

    loadingMessage.textContent = 'Submitting registration...';
    loadingMessage.style.display = 'block';
    responseMessage.textContent = '';

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        loadingMessage.style.display = 'none';
        form.style.display = 'none';
        responseMessage.style.color = 'green';
        responseMessage.innerHTML = `<h2>Registration Successful!</h2><p>${data.message}</p><p>You can now close this page.</p>`;
      } else {
        responseMessage.textContent = `Error: ${data.message || 'Something went wrong'}`;
        responseMessage.style.color = 'red';
      }
    } catch (err) {
      console.error('Submission Error: ', err);
      responseMessage.textContent = 'A network error occurred. Please try again.';
      responseMessage.style.color = 'red';
    } finally {
      loadingMessage.style.display = 'none';
    }
  });

  // init
  generateMemberFields();
  showSection(currentSectionIndex);
  teamSizeSelect.addEventListener('change', generateMemberFields);
});

