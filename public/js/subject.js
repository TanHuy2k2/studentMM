function formatTime(time) {
  if (!time) return "null";
  const date = new Date(time);

  const options = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const localTime = date.toLocaleString('vi-VN', options);
  return localTime;
}

function formatDateTime(time) {
  if (!time) return "null";
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function showSubjectTeacher() {
  hidePagging();
  document.getElementById('mainContent').innerHTML = `
    <h1>Subject</h1>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 20%;">Subject</th>
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
          <th style="width: 30%;">Subject</th>
          <th style="width: 30%;">Teacher</th>
          <th style="width: 30%;"></th>
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
              <button id="btn-check" onclick='showDetail(${JSON.stringify(subject)})'>Detail</button>
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

function showDetail(subject) {
  document.getElementById('mainContent').innerHTML = `
    <h1>Detail</h1>
    <div class="form-group">
      <label><b>Subject:</b> ${subject.subject_name}</label>
      
    </div>
    <div class="form-group">
      <label><b>Teacher:</b> ${subject.teacher_name}</label>
    </div>
    <div class="form-group">
      <label><b>Room:</b> ${subject.roomName}</label>
    </div>
    <div class="form-group">
      <label><b>Start time:</b> ${formatTime(subject.startTime)}</label>
    </div>
    <div class="form-group">
      <label><b>End time:</b> ${formatTime(subject.endTime)}</label>
    </div>
    
    <button class="submit-btn" onclick="showSubject()">Back</button>`;
}

function populateSelect(url, selectId, valueKey, textKey, errorMessage) {
  $.ajax({
    url: url,
    type: 'GET',
  }).then(response => {
    const select = document.getElementById(selectId);
    response.forEach(item => {
      const option = document.createElement('option');
      option.value = item[valueKey];
      option.textContent = item[textKey];
      select.appendChild(option);
    });
  }).catch(() => {
    alert(errorMessage);
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
    <div class="form-group">
      <label>Room:</label>
      <select id="roomSelect">
      </select>
    </div>
    <div class="form-group">
      <label>Start time:</label>
      <input type="datetime-local" id="startTime" placeholder="Enter start time" required>
    </div>
    <div class="form-group">
      <label>End time:</label>
      <input type="datetime-local" id="endTime" placeholder="Enter end time" required>
    </div>
    <button class="submit-btn" onclick="saveSubject()">Add</button>`;

  populateSelect('/teacher/find', 'teacherSelect', 'teacher_id', 'teacher_name', 'Failed to load Teacher list. Please try again later.');
  populateSelect('/room/find', 'roomSelect', 'id', 'name', 'Failed to load Room list. Please try again later.');
}

async function saveSubject() {
  const subjectName = $('#subjectName').val();
  const teacherId = $('#teacherSelect').val();
  const roomId = $('#roomSelect').val();
  const startTime = $('#startTime').val();
  const endTime = $('#endTime').val();

  if (!subjectName || !teacherId || !roomId || !startTime || !endTime) {
    alert("Please fill all information.");
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
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        subjectId: response_add_subject.subject_id,
        teacherId: parseInt(teacherId),
        roomId: parseInt(roomId),
        startTime: startTime,
        endTime: endTime
      })
    });

    if (!response_add_subject_teacher.success) {
      return alert(response_add_subject_teacher.message);
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
    <div class="form-group">
      <label>Room:</label>
      <select id="roomSelect">
      </select>
    </div>
    <div class="form-group">
      <label>Start time:</label>
      <input type="datetime-local" id="startTime" placeholder="Enter start time" value="${formatDateTime(subject.startTime)}" required>
    </div>
    <div class="form-group">
      <label>End time:</label>
      <input type="datetime-local" id="endTime" placeholder="Enter end time" value="${formatDateTime(subject.endTime)}" required>
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

  $.ajax({
    url: '/room/find',
    type: 'GET',
  }).then(response => {
    const roomSelect = document.getElementById('roomSelect');
    response.forEach(res => {
      const option = document.createElement('option');
      option.value = res.id;
      option.textContent = res.name;

      if (res.name === subject.roomName) {
        option.selected = true;
      }

      roomSelect.appendChild(option);
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