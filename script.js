// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const studentList = document.getElementById("studentList");

  // Load student records from localStorage and display them in the table
  function loadStudents() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    studentList.innerHTML = "";

    students.forEach((student, index) => {
      const row = document.createElement("tr");

      // Dynamically create table rows for each student
      row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.studentId}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="edit" data-index="${index}" title="Edit"><i class="fa-solid fa-pen"></i></button>
                </td>
                <td>
                    <button class="delete" data-index="${index}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;

      studentList.appendChild(row);
    });

    // Add event listeners to the new Edit/Delete buttons
    addEventListeners();

    // Add vertical scroll if number of records exceeds 5
    document.querySelector("#table-container").style.overflowY =
      students.length > 5 ? "auto" : "hidden";
  }

  // Add event listeners for Edit and Delete buttons
  function addEventListeners() {
    document.querySelectorAll(".edit").forEach((button) => {
      button.addEventListener("click", editStudent);
    });

    document.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", deleteStudent);
    });
  }

  // Save updated student list to localStorage
  function saveStudents(students) {
    localStorage.setItem("students", JSON.stringify(students));
  }

  // Input validation for name, email, ID, and contact
  function validateInput(name, studentId, email, contact) {
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name.match(nameRegex)) {
      alert("Invalid name. Only letters and spaces allowed.");
      return false;
    }

    if (!email.match(emailRegex)) {
      alert("Invalid email address.");
      return false;
    }

    if (isNaN(studentId) || isNaN(contact)) {
      alert("Student ID and Contact must be numbers.");
      return false;
    }

    return true;
  }

  // Handle form submission to register a new student
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const email = document.getElementById("email").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!name || !studentId || !email || !contact) {
      alert("All fields are required.");
      return;
    }

    if (!validateInput(name, studentId, email, contact)) return;

    let students = JSON.parse(localStorage.getItem("students")) || [];

    students.push({ name, studentId, email, contact });
    saveStudents(students);
    form.reset();
    loadStudents();
  });

  // Handle editing a student record
  function editStudent(event) {
    const button = event.target.closest("button");
    const index = button.dataset.index;
    let students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students[index];

    // Populate form with existing data
    document.getElementById("name").value = student.name;
    document.getElementById("studentId").value = student.studentId;
    document.getElementById("email").value = student.email;
    document.getElementById("contact").value = student.contact;

    // Remove the existing record so user can re-submit with changes
    students.splice(index, 1);
    saveStudents(students);
    loadStudents();
  }

  // Handle deleting a student record
  function deleteStudent(event) {
    const index = event.target.dataset.index;
    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (confirm("Are you sure you want to delete this record?")) {
      students.splice(index, 1);
      saveStudents(students);
      loadStudents();
    }
  }

  // Initial load
  loadStudents();
});
