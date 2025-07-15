function showScore() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Kết quả học tập</h1>
    <table border="1">
      <thead>
        <tr>
          <th>Môn học</th>
          <th id="col">Chuyên cần</th>
          <th id="col">Giữa kì</th>
          <th id="col">Cuối kì</th>
          <th id="col">Điểm tổng</th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: '/score/find-one',
    type: 'GET',
    data: {
      student_id: $('#ID').val(),
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
    document.getElementById('mainContent').innerHTML = `<p>Không thể tải kết quả học tập. Vui lòng thử lại sau.</p>`;
  });
}

function showStudentScore(subject_id) {
  document.getElementById('mainContent').innerHTML = `
    <h1>Môn học</h1>
    <table border="1" style="text-align: center;">
      <thead>
        <tr>
          <th style="width: 5%;" id="col">#</th>
          <th style="width: 35%;">Tên học sinh</th>
          <th style="width: 12%;" id="col">Chuyên cần</th>
          <th style="width: 12%;" id="col">Giữa kì</th>
          <th style="width: 12%;" id="col">Cuối kì</th>
          <th style="width: 12%;" id="col">Điểm trung bình</th>
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
      subject_id: subject_id,
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
            <td id="col"><button id="btn-check" onclick="editScore(this, ${subject_id}, ${score.student_id})">Cập nhật</button></td>
          </tr>
        `;
      i++;
      tbody.innerHTML += row;
    });
  }).catch(error => {
    document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách học sinh. Vui lòng thử lại sau.</p>`;
  });
}

function editScore(button, subject_id, student_id) {
  const row = button.closest("tr");
  for (let i = 2; i < 5; i++) {
    const cell = row.cells[i];
    const value = cell.textContent.trim();
    cell.innerHTML = `<input type="number" value="${value}" style="width: 60px;">`;
  }

  button.textContent = "Save";
  button.onclick = function () {
    saveScore(this, subject_id, student_id);
  };
}

function saveScore(button, subject_id, student_id) {
  const row = button.closest("tr");
  const attendance = row.cells[2].querySelector("input").value;
  const midterm = row.cells[3].querySelector("input").value;
  const final = row.cells[4].querySelector("input").value;
  const total = ((parseFloat(attendance) + parseFloat(midterm) + parseFloat(final)) / 3).toFixed(2);
  row.cells[2].textContent = attendance;
  row.cells[3].textContent = midterm;
  row.cells[4].textContent = final;
  row.cells[5].textContent = total;

  $.ajax({
    url: '/score/update',
    type: 'PATCH',
    data: {
      subject_id: subject_id,
      student_id: student_id,
      attendance: attendance,
      midterm: midterm,
      final: final
    }
  }).then(data => {
    alert("Cập nhật thành công!");

    button.textContent = "Edit";
    button.onclick = function () {
      editScore(this, subject_id, student_id);
    };
  }).catch(err => {
    alert("Lỗi khi lưu dữ liệu!");
  });
}