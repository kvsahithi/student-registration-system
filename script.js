document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const studentList = document.getElementById("studentList");

  function loadStudents() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    studentList.innerHTML = "";

    students.forEach((student, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.studentId}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="<i class="edit" data-index="${index}"><i class="fa-solid fa-pen"></i></button></td>
                <td>
                    <button class="delete" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;

      studentList.appendChild(row);
    });

    addEventListeners();

    document.querySelector("#table-container").style.overflowY =
      students.length > 5 ? "auto" : "hidden";
  }

  function addEventListeners() {
    document.querySelectorAll(".edit").forEach((button) => {
      button.addEventListener("click", editStudent);
    });

    document.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", deleteStudent);
    });
  }

  function saveStudents(students) {
    localStorage.setItem("students", JSON.stringify(students));
  }

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

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("event called");
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

  function editStudent(event) {
    const index = event.target.dataset.index;
    let students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("studentId").value = student.studentId;
    document.getElementById("email").value = student.email;
    document.getElementById("contact").value = student.contact;

    students.splice(index, 1);
    saveStudents(students);
    loadStudents();
  }

  function deleteStudent(event) {
    const index = event.target.dataset.index;
    let students = JSON.parse(localStorage.getItem("students")) || [];

    students.splice(index, 1);
    saveStudents(students);
    loadStudents();
  }

  loadStudents();
});
