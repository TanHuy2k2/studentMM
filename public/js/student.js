function showStudent() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Lớp học</h1>
    <button id="btn-check" style="float: right;" onclick="addStudent()">Thêm học sinh</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 2%;" id="col">#</th>
          <th style="width: 10%;">Hình ảnh</th>
          <th style="width: 15%;">Tên</th>
          <th style="width: 20%;">Email</th>
          <th style="width: 10%;">Lớp học</th>
          <th style="width: 5%;" id="col">GPA</th>
          <th style="width: 10%;" id="col"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: '/student/get_all_students',
    type: 'GET',
  }).then(response => {
    const tbody = document.getElementById('scoreBody');
    let i = 1;
    response.forEach(res => {
      const row = `
          <tr>
            <td id="col">${i}</td>
            <td><img src="" style="width: 50px; height: 50px;"></td>
            <td>${res.name}</td>
            <td>${res.email}</td>
            <td>${res.class_name}</td>
            <td id="col">${res.gpa}</td>
            <td id="col">
              <button id="btn-check" onclick="updateStudent(${res.id})">Cập nhật</button>
              <button id="btn-check" onclick="deleteStudent(${res.id})">Xoá</button>
            </td>
          </tr>`;
      i++;
      tbody.innerHTML += row;
    });
  }).catch(error => {
    document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách học sinh. Vui lòng thử lại sau.</p>`;
  });
}

function addStudent() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Thêm học sinh</h1>
    <div class="form-group">
      <label>Tên học sinh:</label>
      <input type="text" id="studentName" placeholder="Nhập tên học sinh" required>
    </div>
    <div class="form-group">
      <label>Email:</label>
      <input type="email" id="studentEmail" placeholder="Nhập email" required>
    </div>
    <div class="form-group">
      <label>Password:</label>
      <input type="password" id="studentPassword" placeholder="Nhập password" required>
    </div>
    <div class="form-group">
      <label>Lớp học:</label>
      <select id="classSelect">
      </select>
    </div>
    <div class="form-group">
      <label>Hình ảnh:</label>
      <input type="file" id="studentImage" name="image" accept="image/*">
    </div>
    <button class="submit-btn" onclick="saveStudent()">Thêm</button>`;

  $.ajax({
    url: '/class/get_class_for_register',
    type: 'GET',
  }).then(response => {
    const classSelect = document.getElementById('classSelect');
    response.forEach(res => {
      const option = document.createElement('option');
      option.value = res.id;
      option.textContent = res.name;
      classSelect.appendChild(option);
    });
  }).catch(error => {
    alert('Không thể tải danh sách lớp học. Vui lòng thử lại sau.');
  });
}

async function saveStudent() {
  const name = document.getElementById('studentName').value;
  const email = document.getElementById('studentEmail').value;
  const password = document.getElementById('studentPassword').value;
  const classId = document.getElementById('classSelect').value;
  const imageFile = document.getElementById('studentImage').files[0];
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('role', 'student');
  formData.append('image', imageFile);

  if (!name || !email || !password || !classId || !imageFile) {
    alert('Vui lòng điền đầy đủ thông tin.');
    return;
  }

  try {
    const response_register = await $.ajax({
      url: '/account/register',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false
    });
    if (!response_register.success) {
      return alert(response_register.message);
    }

    const response_add = await $.ajax({
      url: '/student/add_student',
      type: 'POST',
      data: { account_id: response_register.id, class_id: classId },
    });
    if (!response_add.success) {
      throw new Error('Failed to add student');
    }

    alert('Thêm học sinh thành công!');
    showStudent();
  } catch (error) {
    alert('Không thể thêm học sinh. Vui lòng thử lại sau.');
  }

}