function showStudentScore() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Student Scores</h1>
    <table border="1">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Attendance</th>
          <th>Midterm</th>
          <th>Final</th>
          <th>Total</th>
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
      student_id: $('#studentId').val(),
    }
  })
    .then(response => {
      const tbody = document.getElementById('scoreBody');

      response.forEach(score => {
        const total = (score.attendance * 0.2 + score.midterm * 0.2 + score.final * 0.6).toFixed(2);

        const row = `
          <tr>
            <td>${score.subject_name}</td>
            <td>${score.attendance}</td>
            <td>${score.midterm}</td>
            <td>${score.final}</td>
            <td>${total}</td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });

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

function showAdd() {
  document.getElementById('mainContent').innerHTML = `
        <h1>Add New </h1>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" id="name">
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" id="email">
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input type="password" id="password">
        </div>
        <div class="form-group">
          <label>Role:</label>
          <select id="role">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button class="submit-btn" onclick="submitForm()">Submit</button>
      `;
}

function submitForm() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  alert(`Submitted:\nName: ${name}\nEmail: ${email}\nRole: ${role}`);
}