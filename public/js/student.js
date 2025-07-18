const getClassFilter = () => {
  $.ajax({
    url: '/class/get-class-for-register',
    type: 'GET',
  }).then(response => {
    const classSelect = document.getElementById('classFilter');
    response.forEach(response => {
      const option = document.createElement('option');
      option.value = response.id;
      option.textContent = response.name;

      classSelect.appendChild(option);
    });
  }).catch(error => {
    alert('Không thể tải danh sách lớp học. Vui lòng thử lại sau.');
  });
}

getClassFilter();

const filterChange = (check) => {
  showStudent(1, check);
  updatePagination(check);
}

const restoreFilter = () => {
  document.getElementById('classFilter').value = '';
  document.getElementById('min_gpa').value = '';
  document.getElementById('max_gpa').value = '';
  filterChange(0);
}

function hidePagging() {
  document.getElementById('pagging').style.display = 'none';
  document.getElementById('search').style.display = 'none';
}

function showStudent(page = 1, filter = 0) {
  document.getElementById('search').style.display = 'flex';
  const classID = document.getElementById('classFilter').value;
  const minGpa = document.getElementById('min_gpa').value;
  const maxGpa = document.getElementById('max_gpa').value;

  document.getElementById('mainContent').innerHTML = `
    <button id="btn-check" style="float: right;" onclick="addStudent()">Thêm học sinh</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 2%;" id="col">#</th>
          <th style="width: 10%;" id="col">Hình ảnh</th>
          <th style="width: 15%;">Tên</th>
          <th style="width: 20%;">Email</th>
          <th style="width: 7%;">Lớp học</th>
          <th style="width: 5%;" id="col">GPA</th>
          <th style="width: 13%;" id="col"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: `/student/find`,
    type: 'GET',
    data: {
      page: page,
      classId: classID,
      minGpa: minGpa,
      maxGpa: maxGpa,
      filter: filter
    }
  }).then(response => {
    const tbody = document.getElementById('scoreBody');
    tbody.innerHTML = ''; // Clear previous data
    let i = 1;
    response['result'].forEach(res => {
      const row = `
        <tr>
          <td id="col">${i}</td>
          <td id="col"><img src="${res.image ? res.image : ''}" style="width: 50px; height: 50px;"></td>
          <td>${res.name}</td>
          <td>${res.email}</td>
          <td>${res.class_name}</td>
          <td id="col">${res.gpa}</td>
          <td id="col">
            <button id="btn-check" onclick='updateStudent(${JSON.stringify(res)})'>Cập nhật</button>
            <button id="btn-check" onclick="deleteStudent(${res.acc_id})">Xoá</button>
          </td>
        </tr>`;
      i++;
      tbody.innerHTML += row;
    });

    document.getElementById('pagging').style.display = 'block';
  }).catch(error => {
    document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách học sinh. Vui lòng thử lại sau.</p>`;
  });
}

function addStudent() {
  hidePagging();
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
      <label>Mật khẩu:</label>
      <input type="password" id="studentPassword" placeholder="Nhập mật khẩu" required>
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
    url: '/class/get-class-for-register',
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
      url: '/student/add',
      type: 'POST',
      data: { accountId: response_register.id, classId: classId },
    });
    if (!response_add.success) {
      throw new Error('Failed to add student');
    }

    alert('Thêm học sinh thành công!');
    showStudent();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function updateStudent(res) {
  document.getElementById('mainContent').innerHTML = `
    <h1>Cập nhật học sinh</h1>
    <div class="form-group">
      <label>Hình ảnh:</label>
      <img src="${res.image ? res.image : ''}" style="width: 50px; height: 50px;">
      <input type="hidden" id="oldImage" value="${res.image}">
      <input type="file" id="studentImage" name="image" accept="image/*">
    </div>
    <div class="form-group">
      <label>Tên học sinh:</label>
      <input type="text" id="studentName" placeholder="Nhập tên học sinh" value="${res.name}" required>
    </div>
    <div class="form-group">
      <label>Email:</label>
      <input type="email" id="studentEmail" placeholder="Nhập email" value="${res.email}" required>
    </div>
    <div class="form-group">
      <label>Lớp học:</label>
      <select id="classSelect">
      </select>
    </div>
    
    <button class="submit-btn" onclick="saveUpdateStudent(${res.acc_id}, ${res.student_id})">Cập nhật</button>`;

  $.ajax({
    url: '/class/get-class-for-register',
    type: 'GET',
  }).then(response => {
    const classSelect = document.getElementById('classSelect');
    response.forEach(response => {
      const option = document.createElement('option');
      option.value = response.id;
      option.textContent = response.name;

      if (response.name === res.class_name) {
        option.selected = true;
      }

      classSelect.appendChild(option);
    });
  }).catch(error => {
    alert('Không thể tải danh sách lớp học. Vui lòng thử lại sau.');
  });
}

async function saveUpdateStudent(acc_id, student_id) {
  const name = document.getElementById('studentName').value;
  const email = document.getElementById('studentEmail').value;
  const classId = document.getElementById('classSelect').value;
  const imageFile = document.getElementById('studentImage').files[0] || document.getElementById('oldImage').value;
  const formData = new FormData();
  formData.append('accId', acc_id);
  formData.append('name', name);
  formData.append('email', email);
  formData.append('image', imageFile);

  if (!name || !email || !classId || !imageFile) {
    alert('Vui lòng điền đầy đủ thông tin.');
    return;
  }

  try {
    const response_update_acc = await $.ajax({
      url: '/account/update',
      type: 'PATCH',
      data: formData,
      processData: false,
      contentType: false
    });
    if (!response_update_acc.success) {
      return alert("Không thành công");
    }

    const response_update_student = await $.ajax({
      url: '/student/update',
      type: 'PATCH',
      data: { studentId: student_id, classId: classId },
    });
    if (!response_update_student.success) {
      throw new Error('Không thể sửa dữ liệu');
    }

    alert('Cập nhật thông tin thành công!');
    showStudent();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

async function deleteStudent(account_id) {
  if (!confirm("Bạn có chắc chắn muốn xoá học sinh này?")) {
    return;
  }

  try {
    const response_delete_stu = await $.ajax({
      url: '/student/delete',
      type: 'DELETE',
      data: { accountId: account_id },
    });
    if (!response_delete_stu.success) {
      return alert("Không thành công")
    }

    const response_delete_acc = await $.ajax({
      url: '/account/delete',
      type: 'DELETE',
      data: { accountId: account_id }
    });
    if (!response_delete_acc.success) {
      return alert("Không thành công");
    }

    alert('Xoá học sinh thành công!');
    showStudent();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function updatePagination(filter = 0) {
  const classID = document.getElementById('classFilter').value;
  const minGpa = document.getElementById('min_gpa').value;
  const maxGpa = document.getElementById('max_gpa').value;

  $('#pagging').pagination({
    dataSource: `/student/find?page=1&classId=${classID}&minGpa=${minGpa}&maxGpa=${maxGpa}&filter=${filter}`,
    locator: 'result',
    totalNumberLocator: function (response) {
      return response.total;
    },
    pageSize: 4,
    afterPageOnClick: function (event, pageNumber) {
      showStudent(pageNumber, filter);
    },
    afterPreviousOnClick: function (event, pageNumber) {
      showStudent(pageNumber, filter);
    },
    afterNextOnClick: function (event, pageNumber) {
      showStudent(pageNumber, filter);
    },
  });
}