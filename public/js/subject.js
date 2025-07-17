function showSubjectTeacher() {
  hidePagging();
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
    </table>`;

  $.ajax({
    url: '/class/get-subject-teacher',
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
      document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách môn học. Vui lòng thử lại sau.</p>`;
    });
}

function showSubject() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Môn học</h1>
    <button id="btn-check" style="float: right;" onclick="addSubject()">Thêm môn học</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 40%;">Môn học</th>
          <th style="width: 30%;">Giáo viên</th>
          <th style="width: 20%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: '/subject/find',
    type: 'GET',
  })
    .then(response => {
      const tbody = document.getElementById('scoreBody');
      let i = 1;
      response.forEach(subject => {
        const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${subject.subject_name}</td>
            <td>${subject.teacher_name}</td>
            <td id="col">
              <button id="btn-check" onclick='update(${JSON.stringify(subject)})'>Cập nhật</button>
              <button id="btn-check" onclick="deleteSubject(${subject.subject_id})">Xoá</button>
            </td>
          </tr>
        `;
        i++;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách môn học. Vui lòng thử lại sau.</p>`;
    });
}

function addSubject() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Thêm môn học</h1>
    <div class="form-group">
      <label>Tên môn học:</label>
      <input type="text" id="subjectName" placeholder="Nhập tên môn học" required>
    </div>
    <div class="form-group">
      <label>Giáo viên:</label>
      <select id="teacherSelect">
      </select>
    </div>
    <button class="submit-btn" onclick="saveSubject()">Thêm</button>`;

  $.ajax({
    url: '/teacher/find',
    type: 'GET',
  }).then(response => {
    const teacherSelect = document.getElementById('teacherSelect');
    response.forEach(res => {
      const option = document.createElement('option');
      option.value = res.teacher_id;
      option.textContent = res.teacher_name;
      teacherSelect.appendChild(option);
    });
  }).catch(error => {
    alert('Không thể tải danh sách lớp học. Vui lòng thử lại sau.');
  });
}

async function saveSubject() {
  const subjectName = $('#subjectName').val();
  const teacherId = $('#teacherSelect').val();

  if (!subjectName || !teacherId) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    const response_add_subject = await $.ajax({
      url: '/subject/add',
      type: 'POST',
      data: { subject_name: subjectName },
    });
    if (!response_add_subject.success) {
      return alert("Không thành công")
    }

    const response_add_subject_teacher = await $.ajax({
      url: '/subject/add-teacher-subject',
      type: 'POST',
      data: { subject_id: response_add_subject.subject_id, teacher_id: parseInt(teacherId) }
    });
    if (!response_add_subject_teacher.success) {
      return alert("Không thành công");
    }

    alert('Thêm môn học thành công!');
    showSubject();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function update(subject) {
  document.getElementById('mainContent').innerHTML = `
    <h1>Cập nhật môn học</h1>
    <div class="form-group">
      <label>Tên môn học:</label>
      <input type="text" id="subjectName" placeholder="Nhập tên môn học" value="${subject.subject_name}" required>
    </div>
    <div class="form-group">
      <label>Giáo viên:</label>
      <select id="teacherSelect">
      </select>
    </div>
    
    <button class="submit-btn" onclick="saveUpdate(${subject.subject_id}, ${subject.teacher_id})">Cập nhật</button>`;

  $.ajax({
    url: '/teacher/find',
    type: 'GET',
  }).then(response => {
    const teacherSelect = document.getElementById('teacherSelect');
    response.forEach(res => {
      const option = document.createElement('option');
      option.value = res.teacher_id;
      option.textContent = res.teacher_name;

      if (res.teacher_name === subject.teacher_name) {
        option.selected = true;
      }

      teacherSelect.appendChild(option);
    });
  }).catch(error => {
    alert('Không thể tải danh sách lớp học. Vui lòng thử lại sau.');
  });
}

async function saveUpdate(subject_id, teacher_id) {
  const subjectName = $('#subjectName').val();
  const teacherId = $('#teacherSelect').val();
  if (!subjectName) {
    alert("Vui lòng nhập tên môn học.");
    return;
  }

  try {
    const response_update_subject = await $.ajax({
      url: '/subject/update',
      type: 'PATCH',
      data: { subject_id: subject_id, subject_name: subjectName },
    });
    if (!response_update_subject.success) {
      return alert("Không thành công")
    }

    if (teacherId != teacher_id) {
      const response_update_subject_teacher = await $.ajax({
        url: '/subject/update-teacher-subject',
        type: 'PATCH',
        data: { subject_id: subject_id, teacher_id: teacherId }
      });
      if (!response_update_subject_teacher.success) {
        return alert("Không thành công");
      }
    }

    alert('Cập nhật môn học thành công!');
    showSubject();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

async function deleteSubject(subject_id) {
  if (!confirm("Bạn có chắc chắn muốn xoá môn học này?")) {
    return;
  }

  try {
    const response_delete = await $.ajax({
      url: '/subject/delete',
      type: 'DELETE',
      data: { subject_id: subject_id },
    });
    if (!response_delete.success) {
      return alert("Không thành công")
    }

    alert('Xoá môn học thành công!');
    showSubject();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function showSubjectForRegister() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Môn học</h1>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 40%;">Môn học</th>
          <th style="width: 30%;">Giáo viên</th>
          <th style="width: 20%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  const student_id = $('#ID').val();
  $.ajax({
    url: '/subject/get-subject-for-student',
    type: 'GET',
    data: {
      student_id: student_id,
    }
  })
    .then(response => {
      const tbody = document.getElementById('scoreBody');
      let i = 1;
      response.forEach(subject => {
        const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${subject.subject_name}</td>
            <td>${subject.teacher_name}</td>
            <td id="col">
              <button id="btn-check" onclick='registerSubject(${student_id}, ${subject.subject_id})'>Đăng kí</button>
            </td>
          </tr>
        `;
        i++;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách môn học. Vui lòng thử lại sau.</p>`;
    });
}

async function registerSubject(student_id, subject_id) {
  try {
    const response = await $.ajax({
      url: '/score/add',
      type: 'POST',
      data: { student_id: student_id, subject_id: subject_id },
    });
    if (!response.success) {
      return alert("Không thành công")
    }

    alert('Đăng kí môn học thành công!');
    showScore();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}