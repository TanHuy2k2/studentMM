function showSubjectTeacher() {
  hidePagging();
  document.getElementById('mainContent').innerHTML = `
    <h1>Subject</h1>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 80%;">Subject</th>
          <th style="width: 10%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: '/subject/get-subject-teacher',
    type: 'GET',
    data: {
      teacherId: $('#ID').val(),
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
      document.getElementById('mainContent').innerHTML = `<p>Failed to load Subject list. Please try again later.</p>`;
    });
}

function showSubject() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Subject</h1>
    <button id="btn-check" style="float: right;" onclick="addSubject()">Add Subject</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 40%;">Subject</th>
          <th style="width: 30%;">Teacher</th>
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
              <button id="btn-check" onclick='update(${JSON.stringify(subject)})'>Update</button>
              <button id="btn-check" onclick="deleteSubject(${subject.subject_id})">Delete</button>
            </td>
          </tr>
        `;
        i++;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      document.getElementById('mainContent').innerHTML = `<p>Failed to load Subject list. Please try again later.</p>`;
    });
}

function addSubject() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Add Subject</h1>
    <div class="form-group">
      <label>Subject name:</label>
      <input type="text" id="subjectName" placeholder="Enter subject name" required>
    </div>
    <div class="form-group">
      <label>Teacher:</label>
      <select id="teacherSelect">
      </select>
    </div>
    <button class="submit-btn" onclick="saveSubject()">Add</button>`;

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
    alert('Failed to load Subject list. Please try again later.');
  });
}

async function saveSubject() {
  const subjectName = $('#subjectName').val();
  const teacherId = $('#teacherSelect').val();

  if (!subjectName || !teacherId) {
    alert("Please fill in information.");
    return;
  }

  try {
    const response_add_subject = await $.ajax({
      url: '/subject/add',
      type: 'POST',
      data: { subjectName: subjectName },
    });
    if (!response_add_subject.success) {
      return alert("Add unsuccessful")
    }

    const response_add_subject_teacher = await $.ajax({
      url: '/subject/add-teacher-subject',
      type: 'POST',
      data: { subjectId: response_add_subject.subject_id, teacherId: parseInt(teacherId) }
    });
    if (!response_add_subject_teacher.success) {
      return alert("Add unsuccessful");
    }

    alert('Add Subject successfully!');
    showSubject();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function update(subject) {
  document.getElementById('mainContent').innerHTML = `
    <h1>Update Subject</h1>
    <div class="form-group">
      <label>Subject name:</label>
      <input type="text" id="subjectName" placeholder="Enter subject name" value="${subject.subject_name}" required>
    </div>
    <div class="form-group">
      <label>Teacher:</label>
      <select id="teacherSelect">
      </select>
    </div>
    
    <button class="submit-btn" onclick="saveUpdate(${subject.subject_id}, ${subject.teacher_id})">Update</button>`;

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
    alert('Failed to load Subject list. Please try again later.');
  });
}

async function saveUpdate(subject_id, teacher_id) {
  const subjectName = $('#subjectName').val();
  const teacherId = $('#teacherSelect').val();
  if (!subjectName) {
    alert("Please enter subject name.");
    return;
  }

  try {
    const response_update_subject = await $.ajax({
      url: '/subject/update',
      type: 'PATCH',
      data: { subjectId: subject_id, subjectName: subjectName },
    });
    if (!response_update_subject.success) {
      return alert("Update unsuccessful")
    }

    if (teacherId != teacher_id) {
      const response_update_subject_teacher = await $.ajax({
        url: '/subject/update-teacher-subject',
        type: 'PATCH',
        data: { subjectId: subject_id, teacherId: teacherId }
      });
      if (!response_update_subject_teacher.success) {
        return alert("Update unsuccessful");
      }
    }

    alert('Update subject successfully!');
    showSubject();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

async function deleteSubject(subject_id) {
  if (!confirm("Are you sure to delete this Subject??")) {
    return;
  }

  try {
    const response_delete = await $.ajax({
      url: '/subject/delete',
      type: 'DELETE',
      data: { subjectId: subject_id },
    });
    if (!response_delete.success) {
      return alert("Delete unsuccessful")
    }

    alert('Delete Subject successful!');
    showSubject();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function showSubjectForRegister() {
  document.getElementById('mainContent').innerHTML = `
    <h1>Subject</h1>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 40%;">Subject</th>
          <th style="width: 30%;">Teacher</th>
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
      studentId: student_id,
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
              <button id="btn-check" onclick='registerSubject(${student_id}, ${subject.subject_id})'>Register</button>
            </td>
          </tr>
        `;
        i++;
        tbody.innerHTML += row;
      });
    })
    .catch(error => {
      document.getElementById('mainContent').innerHTML = `<p>Failed to load Subject list. Please try again later.</p>`;
    });
}

async function registerSubject(student_id, subject_id) {
  try {
    const response = await $.ajax({
      url: '/score/add',
      type: 'POST',
      data: { studentId: student_id, subjectId: subject_id },
    });
    if (!response.success) {
      return alert("Add score unsuccessfully")
    }

    alert('Add Subject successfully!');
    showSubjectForRegister();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}