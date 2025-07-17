function showTeacher() {
    hidePagging();
    document.getElementById('mainContent').innerHTML = `
    <button id="btn-check" style="float: right;" onclick="addteacher()">Thêm giáo viên</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 2%;" id="col">#</th>
          <th style="width: 10%;" id="col">Hình ảnh</th>
          <th style="width: 15%;">Tên</th>
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
              <button id="btn-check" onclick='updateTeacher(${JSON.stringify(res)})'>Cập nhật</button>
              <button id="btn-check" onclick="deleteTeacher(${res.account_id})">Xoá</button>
            </td>
          </tr>`;
            i++;
            tbody.innerHTML += row;
        });
    }).catch(error => {
        document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách giáo viên. Vui lòng thử lại sau.</p>`;
    });
}

function addteacher() {
    document.getElementById('mainContent').innerHTML = `
    <h1>Thêm giáo viên</h1>
    <div class="form-group">
      <label>Tên giáo viên:</label>
      <input type="text" id="teacherName" placeholder="Nhập tên giáo viên" required>
    </div>
    <div class="form-group">
      <label>Email:</label>
      <input type="email" id="teacherEmail" placeholder="Nhập email" required>
    </div>
    <div class="form-group">
      <label>Password:</label>
      <input type="password" id="teacherPassword" placeholder="Nhập password" required>
    </div>
    <div class="form-group">
      <label>Hình ảnh:</label>
      <input type="file" id="teacherImage" name="image" accept="image/*">
    </div>
    <button class="submit-btn" onclick="saveTeacher()">Thêm</button>`;
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
            url: '/teacher/add',
            type: 'POST',
            data: { account_id: response_register.id },
        });
        if (!response_add.success) {
            throw new Error('Failed to add teacher');
        }

        alert('Thêm giáo viên thành công!');
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
    formData.append('acc_id', acc_id);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('image', imageFile);

    if (!name || !email || !imageFile) {
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

        alert('Cập nhật thông tin thành công!');
        showTeacher();
    } catch (error) {
        alert(error['responseJSON']['error'].msg);
    }
}

async function deleteTeacher(account_id) {
    if (!confirm("Bạn có chắc chắn muốn xoá giáo viên này?")) {
        return;
    }

    try {
        const response_delete_teacher = await $.ajax({
            url: '/teacher/delete',
            type: 'DELETE',
            data: { account_id: account_id },
        });
        if (!response_delete_teacher.success) {
            return alert("Không thành công")
        }

        const response_delete_acc = await $.ajax({
            url: '/account/delete',
            type: 'DELETE',
            data: { account_id: account_id }
        });
        if (!response_delete_acc.success) {
            return alert("Không thành công");
        }

        alert('Xoá giáo viên thành công!');
        showTeacher();
    } catch (error) {
        alert(error['responseJSON']['error'].msg);
    }
}