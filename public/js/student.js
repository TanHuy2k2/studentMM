let currentPage = 1;

const getClassFilter = () => {
  $.ajax({
    url: '/class/find',
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
    alert('Unable to load class list. Please try again later.');
  });
}

getClassFilter();

const filterChange = () => {
  showStudent(1);
  updatePagination();
}

const restoreFilter = () => {
  document.getElementById('classFilter').value = '';
  document.getElementById('min_gpa').value = '';
  document.getElementById('max_gpa').value = '';
  filterChange();
}

function hidePagging() {
  document.getElementById('pagging').style.display = 'none';
  document.getElementById('search').style.display = 'none';
}

function showStudent(page = 1) {
  document.getElementById('search').style.display = 'flex';
  const classID = document.getElementById('classFilter').value;
  const minGpa = document.getElementById('min_gpa').value;
  const maxGpa = document.getElementById('max_gpa').value;

  document.getElementById('mainContent').innerHTML = `
    <button id="btn-check" style="float: right;" onclick="addStudent()">Add student</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 2%;" id="col">#</th>
          <th style="width: 10%;" id="col">image</th>
          <th style="width: 15%;">Name</th>
          <th style="width: 20%;">Email</th>
          <th style="width: 7%;">Class</th>
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
      maxGpa: maxGpa
    }
  }).then(response => {
    const tbody = document.getElementById('scoreBody');
    tbody.innerHTML = '';
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
            <button id="btn-check" onclick='updateStudent(${JSON.stringify(res)})'>Update</button>
            <button id="btn-check" onclick="deleteStudent(${res.acc_id}, ${res.student_id})">Delete</button>
          </td>
        </tr>`;
      i++;
      tbody.innerHTML += row;
    });
    document.getElementById('pagging').style.display = 'block';
  }).catch(error => {
    document.getElementById('mainContent').innerHTML = `<p>Unable to load class list. Please try again later.</p>`;
  });
}

function addStudent() {
  hidePagging();
  document.getElementById('mainContent').innerHTML = `
    <h1>Add student</h1>
    <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; 
            align-items: center;">
        <button id="col" onclick="showForm()">Form</button>
        <button id="col" onclick="showCSV()">CSV</button>
    </div>

    <div id="formContainer">
      <div class="form-group">
        <label>Student name:</label>
        <input type="text" id="studentName" placeholder="Enter student name" required>
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input type="email" id="studentEmail" placeholder="Enter email" required>
      </div>
      <div class="form-group">
        <label>Password:</label>
        <input type="password" id="studentPassword" placeholder="Enter password" required>
      </div>
      <div class="form-group">
        <label>Class:</label>
        <select id="classSelect">
        </select>
      </div>
      <div class="form-group">
        <label>Image:</label>
        <input type="file" id="studentImage" name="image" accept="image/*">
      </div>
      <button class="submit-btn" onclick="saveStudent()">Add</button>
    </div>
    <div id="csvContainer" style="display: none;">
        <div class="form-group">
        <label>Add from CSV file:</label>
        <input type="file" id="csvFileStudent" accept=".csv">
        </div>
        <button class="submit-btn" onclick="importCsvStudent()">Add CSV</button>
    </div>`;

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
    alert('Unable to load class list. Please try again later.');
  });
}

function showForm() {
  document.getElementById('formContainer').style.display = 'block';
  document.getElementById('csvContainer').style.display = 'none';
}

function showCSV() {
  document.getElementById('formContainer').style.display = 'none';
  document.getElementById('csvContainer').style.display = 'block';
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
    alert('Please fill in all information.');
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

    alert('Add student successfully!');
    filterChange();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function updateStudent(res) {
  document.getElementById('mainContent').innerHTML = `
    <h1>Update student</h1>
    <div class="form-group">
      <label>Image:</label>
      <img src="${res.image ? res.image : ''}" style="width: 50px; height: 50px;">
      <input type="hidden" id="oldImage" value="${res.image}">
      <input type="file" id="studentImage" name="image" accept="image/*">
    </div>
    <div class="form-group">
      <label>Student name:</label>
      <input type="text" id="studentName" placeholder="Enter student name" value="${res.name}" required>
    </div>
    <div class="form-group">
      <label>Email:</label>
      <input type="email" id="studentEmail" placeholder="Enter email" value="${res.email}" required>
    </div>
    <div class="form-group">
      <label>Class:</label>
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
    alert('Unable to load class list. Please try again later.');
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
    alert('Please fill in all information.');
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
      return alert("Update unsuccessful");
    }

    const response_update_student = await $.ajax({
      url: '/student/update',
      type: 'PATCH',
      data: { studentId: student_id, classId: classId },
    });
    if (!response_update_student.success) {
      return alert("Update unsuccessful");
    }

    alert('Update successful!');
    filterChange();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

async function deleteStudent(account_id, student_id) {
  if (!confirm("Are you sure to delete this student?")) {
    return;
  }

  try {
    const response_delete_score = await $.ajax({
      url: '/score/delete',
      type: 'DELETE',
      data: { studentId: student_id },
    });
    if (!response_delete_score.success) {
      return alert("Delete unsuccessful!");
    }

    const response_delete_stu = await $.ajax({
      url: '/student/delete',
      type: 'DELETE',
      data: { accountId: account_id },
    });
    if (!response_delete_stu.success) {
      return alert("Delete unsuccessful!");
    }

    const response_delete_acc = await $.ajax({
      url: '/account/delete',
      type: 'DELETE',
      data: { accountId: account_id }
    });
    if (!response_delete_acc.success) {
      return alert("Delete unsuccessful!");
    }

    alert('Delete student successful!');
    showStudent(currentPage);
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function updatePagination() {
  const classID = document.getElementById('classFilter').value;
  const minGpa = document.getElementById('min_gpa').value;
  const maxGpa = document.getElementById('max_gpa').value;

  $('#pagging').pagination({
    dataSource: `/student/find?page=1&classId=${classID}&minGpa=${minGpa}&maxGpa=${maxGpa}`,
    locator: 'result',
    totalNumberLocator: function (response) {
      return response.total;
    },
    pageSize: 4,
    afterPageOnClick: function (event, pageNumber) {
      currentPage = pageNumber;

      showStudent(pageNumber);
    },
    afterPreviousOnClick: function (event, pageNumber) {
      currentPage = pageNumber;

      showStudent(pageNumber);
    },
    afterNextOnClick: function (event, pageNumber) {
      currentPage = pageNumber;

      showStudent(pageNumber);
    },
  });
}

async function importCsvStudent() {
  const fileInput = document.getElementById('csvFileStudent');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a CSV file');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('role', 'student');

  try {
    const response_register = await $.ajax({
      url: '/account/insert-csv',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false
    })
    if (response_register.length) {
      return alert(response_register.message);
    }

    for (const item of response_register['result']) {
      const response_add = await $.ajax({
        url: '/student/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          accountId: item.id,
          classId: item.classId
        }),
      });
      if (!response_add.success) {
        return alert(response_add.message);
      }
    }

    alert('Insert student successfull!');
    filterChange();
  } catch (error) {
    alert(error['responseJSON']['error'].msg);
  }
}

function exportExcel() {
  const classID = document.getElementById('classFilter').value;
  const minGpa = document.getElementById('min_gpa').value;
  const maxGpa = document.getElementById('max_gpa').value;

  window.location.href = `/student/export?page=${currentPage}&classId=${classID}&minGpa=${minGpa}&maxGpa=${maxGpa}`;
}
