// --- Step 1: DOM Element Selection ---
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

const API_BASE = 'https://hackwithvizag-backend.onrender.com';

// --- Step 2: Section Navigation Logic ---
const showSection = (index) => {
    sections.forEach(section =>
        section.classList.remove('active')
    );
    sections[index].classList.add('active');
    prevBtn.style.display = index === 0 ? 'none' : 'block';
    nextBtn.style.display = index === sections.length - 1 ? 'none' : 'block';
    document.getElementById('button-container').style.display = index === sections.length - 1 ? 'none' : 'flex';
};

// --- Step 3: Dynamic Team Member Fields Generation ---
const generateMemberFields = () => {
    const teamSize = parseInt(teamSizeSelect.value);
    memberFieldsDiv.innerHTML = '';
    for (let i = 1; i < teamSize; i++) {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('member-field-group');
        memberDiv.innerHTML = `
            <h3>Member ${i}</h3>
            <label for="member-${i}-name">Name:</label>
            <input type="text" id="member-${i}-name" name="member-${i}-name" required>
            <label for="member-${i}-student-id">Student ID:</label>
            <input type="text" id="member-${i}-student-id" name="member-${i}-student-id" required>
        `;
        memberFieldsDiv.appendChild(memberDiv);
    }
}

// --- Step 4: Form Validation, Data Collection, and Summary ---
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

//function for validating unique student IDs
const validateUniqueKeys = () => {
    const leaderStudentId = document.getElementById('team-leader-student-id').value.trim();
    const memberStudentIds = [];
    const teamSize = parseInt(teamSizeSelect.value);

    //collect member student IDs
    for (let i = 1; i < teamSize; i++) {
        const memberIdInput = document.getElementById(`member-${i}-student-id`);
        if (memberIdInput) {
            memberStudentIds.push(memberIdInput.value.trim());
        }
    }

    //combine all IDs and filter out empty ones
    const allIds = [leaderStudentId, ...memberStudentIds].filter(id => id);

    const uniqueIds = new Set(allIds);

    if (uniqueIds.size !== allIds.length) {
        responseMessage.textContent = 'Duplicate Student IDs found. Please ensure all Student IDs are unique.';
        responseMessage.style.color = 'red';
        return false;
    }
    return true;
};

const collectFormData = () => {
    const teamSize = parseInt(teamSizeSelect.value);
    const members = [];
    for (let i = 1; i < teamSize; i++) {
        members.push({
            name: document.getElementById(`member-${i}-name`).value.trim(),
            StudentId: document.getElementById(`member-${i}-student-id`).value.trim(),
        });
    }

    const formData = {
        teamName: document.getElementById('team-name').value.trim(),
        collegeName: document.getElementById('college-name').value.trim(),
        leader: {
            name: document.getElementById('team-leader-name').value.trim(),
            email: document.getElementById('team-leader-email').value.trim(),
            phone: document.getElementById('team-leader-phone-number').value.trim(),
            roll: document.getElementById('team-leader-student-id').value.trim(),
        },
        teamMembers: members,
        transactionId: document.getElementById('transactionId').value.trim(),
        driveLink: document.getElementById('driveLink').value.trim()
    };

    return formData;
};

const displaySummary = () => {
    const formDataForSummary = {
        teamName: document.getElementById('team-name').value,
        collegeName: document.getElementById('college-name').value,
        teamSize: parseInt(teamSizeSelect.value),
        leaderName: document.getElementById('team-leader-name').value,
        leaderEmail: document.getElementById('team-leader-email').value,
        leaderPhone: document.getElementById('team-leader-phone-number').value,
        leaderStudentId: document.getElementById('team-leader-student-id').value,
        teamMembers: []
    };
    const teamSize = parseInt(teamSizeSelect.value);
    for (let i = 1; i < teamSize; i++) {
        formDataForSummary.teamMembers.push({
            name: document.getElementById(`member-${i}-name`).value,
            studentId: document.getElementById(`member-${i}-student-id`).value
        });
    }

    const summaryHtml = `
            <h3>Team Information</h3>
            <p><strong>Team Name:</strong> ${formDataForSummary.teamName}</p>
            <p><strong>College:</strong> ${formDataForSummary.collegeName}</p>
            <p><strong>Team Size:</strong> ${formDataForSummary.teamSize}</p>
            <hr>
            <h3>Team Leader</h3>
            <p><strong>Name:</strong> ${formDataForSummary.leaderName}</p>
            <p><strong>Email:</strong> ${formDataForSummary.leaderEmail}</p>
            <p><strong>Phone:</strong> ${formDataForSummary.leaderPhone}</p>
            <p><strong>Student ID:</strong> ${formDataForSummary.leaderStudentId}</p>
            <hr>
            <h3>Team Members</h3>
            <ul>
                ${formDataForSummary.teamMembers.map(member => `
                    <li><strong>Name:</strong> ${member.name}, <strong>Student ID:</strong> ${member.studentId}</li>
                `).join('')}
            </ul>
            <hr>
            <h3>Registration Fee: ₹${formDataForSummary.teamSize === 3 ? 1200 : 1600}</h3>
        `;
    summaryDiv.innerHTML = summaryHtml;


    const qrImage = document.getElementById('qr-code-image');
    if (formDataForSummary.teamSize === 3) {
        qrImage.src = 'assets/UPI_1200.jpg';
    } else {
        qrImage.src = 'assets/UPI_1600.jpg';
    }
};

nextBtn.addEventListener('click', () => {
    if (validateCurrentSection()) {
        //run unique key validation only after members section is filled
        if (currentSectionIndex === 2) {
            if (!validateUniqueKeys()) {
                return; //stop if id's are not unique
            }
        }

        if (currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            if (currentSectionIndex === sections.length - 1) {
                displaySummary();
            }
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
    const transactionIdInput = document.getElementById('transactionId');
    if (!transactionIdInput.value.trim()) {
        responseMessage.textContent = 'Please enter the UPI Transaction ID';
        responseMessage.style.color = 'red';
        transactionIdInput.focus();
        return;
    }

    const registrationData = collectFormData();
    loadingMessage.textContent = 'Submitting registration...';
    loadingMessage.style.display = 'block';
    responseMessage.textContent = '';

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData)
        });
        const data = await res.json();

        if (res.ok) {
            form.innerHTML = `<h2>Registration Successful! </h2><p>${data.message}</p><p>You can now close this page.</p>`;
            form.style.textAlign = 'center';
        } else {
            responseMessage.textContent = `Error: ${data.message}`;
            responseMessage.style.color = 'red';
        }
    } catch (err) {
        responseMessage.textContent = 'A network error occurred.';
        responseMessage.style.color = 'red';
        console.error("Submission Error: ", err);
    } finally {
        loadingMessage.style.display = 'none';
    }
});

// --- Step 6: Initial Setup ---
generateMemberFields();
showSection(currentSectionIndex);
teamSizeSelect.addEventListener('change', generateMemberFields);