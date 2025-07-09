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
    </table>
  `;

  $.ajax({
    url: '/score/get_score',
    type: 'GET',
    data: {
      student_id: $('#ID').val(),
    }
  })
    .then(response => {
      const tbody = document.getElementById('scoreBody');

      response.forEach(score => {
        const total = ((score.attendance + score.midterm + score.final) / 3).toFixed(2);

        const row = `
          <tr>
            <td>${score.subject_name}</td>
            <td id="col">${score.attendance}</td>
            <td id="col">${score.midterm}</td>
            <td id="col">${score.final}</td>
            <td id="col">${total}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });

}
function showSubject() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Môn học</h1>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 80%;">Môn học</th>
          <th style="width: 10%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>
  `;

  $.ajax({
    url: '/class/get_subject',
    type: 'GET',
    data: {
      teacher_id: $('#ID').val(),
    }
  })
    .then(response => {
      const tbody = document.getElementById('scoreBody');
      let i = 1;
      response.forEach(subject => {
        const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${subject.name}</td>
            <td id="col"><button id="btn-check" onclick="showStudentScore(${subject.subject_id})">check</button></td>
          </tr>
        `;
        i++;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu:", error);
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
          <th style="width: 12%;" id="col">Tổng điểm</th>
          <th style="width: 12%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>
  `;

  $.ajax({
    url: '/score/get_student_score',
    type: 'GET',
    data: {
      subject_id: subject_id,
    }
  })
    .then(response => {
      const tbody = document.getElementById('scoreBody');
      let i = 1;
      response.forEach(score => {
        const total = ((score.attendance + score.midterm + score.final) / 3).toFixed(2);
        const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${score.name}</td>
            <td id="col">${score.attendance}</td>
            <td id="col">${score.midterm}</td>
            <td id="col">${score.final}</td>
            <td id="col">${total}</td>
            <td id="col"><button id="btn-check" onclick="editRow(this, ${subject_id}, ${score.student_id})">Edit</button></td>
          </tr>
        `;
        i++;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });
}

function editRow(button, subject_id, student_id) {
  const row = button.closest("tr");

  for (let i = 2; i < 5; i++) {
    const cell = row.cells[i];
    const value = cell.textContent.trim();
    cell.innerHTML = `<input type="number" value="${value}" style="width: 60px;">`;
  }

  button.textContent = "Save";
  button.onclick = function () {
    saveRow(this, subject_id, student_id);
  };
}

function saveRow(button, subject_id, student_id) {
  const row = button.closest("tr");

  const attendance = row.cells[2].querySelector("input").value;
  const midterm = row.cells[3].querySelector("input").value;
  const final = row.cells[4].querySelector("input").value;

  const total = ((parseFloat(attendance) + parseFloat(midterm) + parseFloat(final)) / 3).toFixed(2);
  row.cells[5].textContent = total;

  row.cells[2].textContent = attendance;
  row.cells[3].textContent = midterm;
  row.cells[4].textContent = final;

  $.ajax({
    url: '/score/update_score',
    type: 'PUT',
    data: {
      subject_id: subject_id,
      student_id: student_id,
      attendance: attendance,
      midterm: midterm,
      final: final
    }
  }).then(data => {
    alert("Cập nhật thành công!");
  })
    .catch(err => {
      console.error("Error saving:", err);
      alert("Lỗi khi lưu dữ liệu!");
    });
  button.textContent = "Edit";
  button.onclick = function () {
    editRow(this);
  };
}

function logout() {
  $.ajax({
    url: '/account/logout',
    type: 'GET',
  })
    .then(response => {
      if (response.success) {
        alert("Đăng xuất thành công!");
        window.location.href = "/";
      } else {
        alert("Đăng xuất thất bại!");
      }
    })
    .catch(error => {
      console.error("Lỗi khi đăng xuất:", error);
      alert("Đã xảy ra lỗi khi đăng xuất.");
    });
}

// function showAdd() {
//   document.getElementById('mainContent').innerHTML = `
//         <h1>Add New </h1>
//         <div class="form-group">
//           <label>Name:</label>
//           <input type="text" id="name">
//         </div>
//         <div class="form-group">
//           <label>Email:</label>
//           <input type="email" id="email">
//         </div>
//         <div class="form-group">
//           <label>Password:</label>
//           <input type="password" id="password">
//         </div>
//         <div class="form-group">
//           <label>Role:</label>
//           <select id="role">
//             <option value="student">Student</option>
//             <option value="teacher">Teacher</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>
//         <button class="submit-btn" onclick="submitForm()">Submit</button>
//       `;
// }

// function submitForm() {
//   const name = document.getElementById('name').value;
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;
//   const role = document.getElementById('role').value;

//   alert(`Submitted:\nName: ${name}\nEmail: ${email}\nRole: ${role}`);
// }