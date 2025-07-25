function showTeacher() {
    hidePagging();
    document.getElementById('mainContent').innerHTML = `
    <button id="btn-check" style="float: right;" onclick="addteacher()">Add teacher</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 2%;" id="col">#</th>
          <th style="width: 10%;" id="col">Image</th>
          <th style="width: 15%;">Name</th>
          <th style="width: 20%;">Email</th>
          <th style="width: 13%;" id="col"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

    $.ajax({
        url: '/teacher/find',
        type: 'GET',
    }).then(response => {
        const tbody = document.getElementById('scoreBody');
        let i = 1;
        response.forEach(res => {
            const row = `
          <tr>
            <td id="col">${i}</td>
            <td id="col"><img src="${res.image ? res.image : ''}" style="width: 50px; height: 50px;"></td>
            <td>${res.teacher_name}</td>
            <td>${res.email}</td>
            <td id="col">
              <button id="btn-check" onclick='updateTeacher(${JSON.stringify(res)})'>Update</button>
              <button id="btn-check" onclick="deleteTeacher(${res.account_id}, ${res.teacher_id})">Delete</button>
            </td>
          </tr>`;
            i++;
            tbody.innerHTML += row;
        });
    }).catch(error => {
        document.getElementById('mainContent').innerHTML = `<p>Failed to load Subject list. Please try again later.</p>`;
    });
}

function addteacher() {
    document.getElementById('mainContent').innerHTML = `
    <h1>Add teacher</h1>
    <div style="display: flex; gap: 10px; margin-bottom: 10px; justify-content: center; 
            align-items: center;">
        <button id="col" onclick="showForm()">Form</button>
        <button id="col" onclick="showCSV()">CSV</button>
    </div>

    <div id="formContainer">
        <div class="form-group">
        <label>Teacher name:</label>
        <input type="text" id="teacherName" placeholder="Enter teacher name" required>
        </div>
        <div class="form-group">
        <label>Email:</label>
        <input type="email" id="teacherEmail" placeholder="Enter email" required>
        </div>
        <div class="form-group">
        <label>Password:</label>
        <input type="password" id="teacherPassword" placeholder="Enter password" required>
        </div>
        <div class="form-group">
        <label>Image:</label>
        <input type="file" id="teacherImage" name="image" accept="image/*">
        </div>
        <button class="submit-btn" onclick="saveTeacher()">Add</button>
    </div>

    <div id="csvContainer" style="display: none;">
        <div class="form-group">
        <label>Add file csv:</label>
        <input type="file" id="csvFile" accept=".csv">
        </div>
        <button class="submit-btn" onclick="importCSV()">Add CSV</button>
    </div>`;
}

function showForm() {
    document.getElementById('formContainer').style.display = 'block';
    document.getElementById('csvContainer').style.display = 'none';
}

function showCSV() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('csvContainer').style.display = 'block';
}

async function saveTeacher() {
    const name = document.getElementById('teacherName').value;
    const email = document.getElementById('teacherEmail').value;
    const password = document.getElementById('teacherPassword').value;
    const imageFile = document.getElementById('teacherImage').files[0];
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', 'teacher');
    formData.append('image', imageFile);

    if (!name || !email || !password || !imageFile) {
        alert('Please fill all information.');
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
            url: '/teacher/add',
            type: 'POST',
            data: { accountId: response_register.id },
        });
        if (!response_add.success) {
            return alert("Add teacher unsuccessfully!");
        }

        alert('Add teacher successfully!');
        showTeacher();
    } catch (error) {
        alert(error['responseJSON']['error'].msg);
    }
}

function updateTeacher(teacher) {
    document.getElementById('mainContent').innerHTML = `
    <h1>Cập nhật giáo viên</h1>
    <div class="form-group">
      <label>Hình ảnh:</label>
      <img src="${teacher.image ? teacher.image : ''}" style="width: 50px; height: 50px;">
      <input type="hidden" id="oldImage" value="${teacher.image}">
      <input type="file" id="teacherImage" name="image" accept="image/*">
    </div>
    <div class="form-group">
      <label>Tên giáo viên:</label>
      <input type="text" id="teacherName" placeholder="Nhập tên giáo viên" value="${teacher.teacher_name}" required>
    </div>
    <div class="form-group">
      <label>Email:</label>
      <input type="email" id="teacherEmail" placeholder="Nhập email" value="${teacher.email}" required>
    </div>
    
    <button class="submit-btn" onclick="saveUpdateTeacher(${teacher.account_id})">Cập nhật</button>`;
}

async function saveUpdateTeacher(acc_id) {
    const name = document.getElementById('teacherName').value;
    const email = document.getElementById('teacherEmail').value;
    const imageFile = document.getElementById('teacherImage').files[0] || document.getElementById('oldImage').value;
    const formData = new FormData();
    formData.append('accId', acc_id);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('image', imageFile);

    if (!name || !email || !imageFile) {
        alert('Please fill all information.');
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
            return alert("Update unsuccessfully.");
        }

        alert('Update teacher successfully!');
        showTeacher();
    } catch (error) {
        alert(error['responseJSON']['error'].msg);
    }
}

async function deleteTeacher(account_id, teacher_id) {
    if (!confirm("Are you sure you want to delete this teacher?")) {
        return;
    }

    try {
        const response_delete_teacher = await $.ajax({
            url: '/teacher/delete',
            type: 'DELETE',
            data: { teacherId: teacher_id },
        });
        if (!response_delete_teacher.success) {
            return alert("Delete unsuccessfully")
        }

        const response_delete_acc = await $.ajax({
            url: '/account/delete',
            type: 'DELETE',
            data: { accountId: account_id }
        });
        if (!response_delete_acc.success) {
            return alert("Delete unsuccessfully");
        }

        alert('Delete teacher successfully!');
        showTeacher();
    } catch (error) {
        alert(error['responseJSON']['error'].msg);
    }
}

async function importCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a CSV file');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', 'teacher');

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
                url: '/teacher/add',
                type: 'POST',
                data: { accountId: item.id },
            });
            if (!response_add.success) {
                return alert(response_add.message);
            }
        }

        alert('Add teacher successfully!');
        showTeacher();
    } catch (error) {
        alert(error['responseJSON']['error'].msg);
    }
}
