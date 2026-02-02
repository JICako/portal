const students = ["Аманова Еркежан", "Алдаберген Аружан", "Акимов Нұрдаулет"];

window.onload = () => {
  const savedStudent = localStorage.getItem("studentName");
  const studentSelect = document.getElementById("studentName");

  // студент тізімі
  students.forEach(s => {
    const option = document.createElement("option");
    option.value = s;
    option.textContent = s;
    studentSelect.appendChild(option);
  });

  if (savedStudent) {
    document.getElementById("role").value = "student";
    studentSelect.classList.remove("hidden");
    studentSelect.value = savedStudent;
    showStudentDashboard(savedStudent);
  }
};

function handleRoleChange() {
  const role = document.getElementById("role").value;
  const studentSelect = document.getElementById("studentName");

  if (role === "student") {
    studentSelect.classList.remove("hidden");
    studentSelect.onchange = () => {
      const selectedName = studentSelect.value;
      localStorage.setItem("studentName", selectedName);
      showStudentDashboard(selectedName);
    };
  } else if (role === "teacher") {
    showTeacherDashboard();
  }
}

function logout() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login-page").classList.remove("hidden");
}

function showTeacherDashboard() {
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("role-title").innerText = "Оқытушы панелі";
  document.querySelectorAll(".teacher-only").forEach(el => el.style.display = "");
  document.querySelectorAll("#gradeTable tbody tr").forEach(row => row.style.display = "");
}

function showStudentDashboard(studentName) {
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("role-title").innerText = `Білім алушы: ${studentName}`;
  document.querySelectorAll(".teacher-only").forEach(el => el.style.display = "none");

  const rows = document.querySelectorAll("#gradeTable tbody tr");
  rows.forEach(row => {
    const name = row.cells[1].textContent.trim();
    row.style.display = name === studentName ? "" : "none";
  });
}

function editGrade(button) {
  const cell = button.closest("tr").querySelector(".grade");
  const newGrade = prompt("Жаңа бағаны енгізіңіз:", cell.textContent);
  if (newGrade !== null && !isNaN(newGrade)) {
    cell.textContent = newGrade;
  }
}

function addRow() {
  const table = document.querySelector("#gradeTable tbody");
  const newRow = table.insertRow();
  const rowCount = table.rows.length;

  const name = prompt("Білім алушының аты-жөнін енгізіңіз:");
  const group = prompt("Тобы:");
  const spec = prompt("Мамандық:");
  const subject = prompt("Пән атауы:");
  const date = prompt("Сабақ күні (мысалы: 10.11.2025):");
  const teacher = prompt("Оқытушы аты-жөні:");
  const grade = prompt("Баға:");

  if (!name || !group || !spec || !subject || !date || !teacher || !grade) {
    alert("Барлық өрістерді толтырыңыз!");
    newRow.remove();
    return;
  }

  newRow.innerHTML = `
    <td>${rowCount}</td>
    <td>${name}</td>
    <td>${group}</td>
    <td>${spec}</td>
    <td>${subject}</td>
    <td>${date}</td>
    <td>${teacher}</td>
    <td class="grade">${grade}</td>
    <td class="teacher-only"><button onclick="editGrade(this)">Өзгерту</button></td>
  `;
}

function filterTable() {
  const groupFilter = document.getElementById("groupFilter").value.toLowerCase();
  const specFilter = document.getElementById("specFilter").value.toLowerCase();
  const rows = document.querySelectorAll("#gradeTable tbody tr");

  rows.forEach(row => {
    const group = row.cells[2].textContent.toLowerCase();
    const spec = row.cells[3].textContent.toLowerCase();
    const groupMatch = groupFilter === "all" || group.includes(groupFilter);
    const specMatch = specFilter === "all" || spec.includes(specFilter);
    row.style.display = groupMatch && specMatch ? "" : "none";
  });
}

function downloadExcel() {
  const table = document.getElementById("gradeTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Журнал" });
  XLSX.writeFile(wb, "Elektrondy_Jurnal.xlsx");
}
