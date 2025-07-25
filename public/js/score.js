function showScore() {
  hidePagging();
  document.getElementById('mainContent').innerHTML = `
    <h1>Results</h1>
    <table border="1">
      <thead>
        <tr>
          <th>Subject</th>
          <th id="col">Attendance</th>
          <th id="col">Midterm</th>
          <th id="col">Final</th>
          <th id="col">Average</th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: '/score/find-one',
    type: 'GET',
    data: {
      studentId: $('#ID').val(),
    }
  }).then(response => {
    const tbody = document.getElementById('scoreBody');

    response.forEach(score => {
      const row = `
          <tr>
            <td>${score.subject_name}</td>
            <td id="col">${score.attendance}</td>
            <td id="col">${score.midterm}</td>
            <td id="col">${score.final}</td>
            <td id="col">${score.avg_socre}</td>
          </tr>`;
      tbody.innerHTML += row;
    });
  }).catch(error => {
    document.getElementById('mainContent').innerHTML = `<p>Unable to load results. Please try again later.</p>`;
  });
}

function showStudentScore(subject_id) {
  document.getElementById('mainContent').innerHTML = `
    <h1>Subject</h1>
    <table border="1" style="text-align: center;">
      <thead>
        <tr>
          <th style="width: 5%;" id="col">#</th>
          <th style="width: 35%;">Name student</th>
          <th style="width: 12%;" id="col">Attendance</th>
          <th style="width: 12%;" id="col">Midterm</th>
          <th style="width: 12%;" id="col">Final</th>
          <th style="width: 12%;" id="col">Average</th>
          <th style="width: 12%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: '/score/get-student-score',
    type: 'GET',
    data: {
      subjectId: subject_id,
    }
  }).then(response => {
    const tbody = document.getElementById('scoreBody');
    let i = 1;
    response.forEach(score => {
      const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${score.name}</td>
            <td id="col">${score.attendance}</td>
            <td id="col">${score.midterm}</td>
            <td id="col">${score.final}</td>
            <td id="col">${score.avg_socre}</td>
            <td id="col"><button id="btn-check" onclick="editScore(this, ${subject_id}, ${score.student_id})">Edit</button></td>
          </tr>
        `;
      i++;
      tbody.innerHTML += row;
    });
  }).catch(error => {
    document.getElementById('mainContent').innerHTML = `<p>Unable to load results. Please try again later.</p>`;
  });
}

function editScore(button, subject_id, student_id) {
  const row = button.closest("tr");
  const originalValues = [];

  for (let i = 2; i < 5; i++) {
    const cell = row.cells[i];
    const value = cell.textContent.trim();
    originalValues.push(value);
    cell.innerHTML = `<input type="number" value="${value}" style="width: 60px;">`;
  }

  button.textContent = "Save";
  button.onclick = function () {
    saveScore(this, subject_id, student_id);
    document.removeEventListener("keydown", escHandler);
  };

  function escHandler(e) {
    if (e.key === "Escape") {
      for (let j = 2; j < 5; j++) {
        row.cells[j].textContent = originalValues[j - 2];
      }

      button.textContent = "Edit";
      button.onclick = function () {
        editScore(this, subject_id, student_id);
      };

      document.removeEventListener("keydown", escHandler);
    }
  }

  document.addEventListener("keydown", escHandler);
}

function saveScore(button, subject_id, student_id) {
  const row = button.closest("tr");
  const attendance = row.cells[2].querySelector("input").value;
  const midterm = row.cells[3].querySelector("input").value;
  const final = row.cells[4].querySelector("input").value;
  const total = ((parseFloat(attendance) + parseFloat(midterm) + parseFloat(final)) / 3).toFixed(2);

  $.ajax({
    url: '/score/update',
    type: 'PATCH',
    data: {
      subjectId: subject_id,
      studentId: student_id,
      attendance: attendance,
      midterm: midterm,
      final: final
    }
  }).then(data => {
    alert("Update successfully!");

    row.cells[2].textContent = parseFloat(attendance);
    row.cells[3].textContent = parseFloat(midterm);
    row.cells[4].textContent = parseFloat(final);
    row.cells[5].textContent = parseFloat(total);

    button.textContent = "Edit";
    button.onclick = function () {
      editScore(this, subject_id, student_id);
    };
  }).catch(err => {
    alert(err['responseJSON']['error'].msg);
  });
}