function showClass() {
    document.getElementById('mainContent').innerHTML = `
    <h1>Lớp học</h1>
    <button id="btn-check" style="float: right;" onclick="addCLass()">Thêm lớp học</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 60%;">Lớp học</th>
          <th style="width: 30%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

    $.ajax({
        url: '/class/get_all_class',
        type: 'GET',
    }).then(response => {
        const tbody = document.getElementById('scoreBody');
        let i = 1;
        response.forEach(res => {
            const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${res.name}</td>
            <td id="col">
            <button id="btn-check" onclick="updateClass(this, ${res.id})">Cập nhật</button>
            ${res.isDelete ?
                    `<button id="btn-check" onclick="cancelDeleteSoftClass(${res.id})">Huỷ xoá mềm</button>`
                    :
                    `<button id="btn-check" onclick="deleteSoftClass(${res.id})">Xoá mềm</button>`
                }
            <button id="btn-check" onclick="deleteHardClass(${res.id})">Xoá cứng</button>
            </td>
          </tr>`;
            i++;
            tbody.innerHTML += row;
        });
    }).catch(error => {
        document.getElementById('mainContent').innerHTML = `<p>Không thể tải danh sách môn học. Vui lòng thử lại sau.</p>`;
    });
}

function addCLass() {
    document.getElementById('mainContent').innerHTML = `
    <h1>Thêm lớp học</h1>
    <div class="form-group">
      <label>Tên lớp học:</label>
      <input type="text" id="className" placeholder="Nhập tên lớp học" required>
    </div>
    <button class="submit-btn" onclick="saveClass()">Submit</button>`;
}

function saveClass() {
    const className = $('#className').val();
    if (!className) {
        alert("Vui lòng nhập tên lớp học.");
        return;
    }

    $.ajax({
        url: '/class/add_class',
        type: 'POST',
        data: {
            class_name: className,
        }
    }).then(response => {
        if (response.success) {
            alert("Thêm lớp học thành công!");
            showClass();
        } else {
            alert(response.message || "Thêm lớp học thất bại!");
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi thêm lớp học.");
    });
}

function updateClass(button, class_id) {
    const row = button.closest("tr");
    const cell = row.cells[1];
    const value = cell.textContent.trim();
    cell.innerHTML = `<input type="text" value="${value}" style="width: 100px;" required>`;

    button.textContent = "Save";
    button.onclick = function () {
        saveClassEdit(this, class_id);
    };
}

function saveClassEdit(button, class_id) {
    const row = button.closest("tr");
    const cell = row.cells[1];
    const newValue = cell.querySelector("input").value;
    if (!newValue) {
        alert("Vui lòng nhập tên lớp học.");
        return;
    }

    $.ajax({
        url: '/class/update_class',
        type: 'PATCH',
        data: {
            class_id: class_id,
            class_name: newValue,
        }
    }).then(response => {
        if (response.success) {
            alert("Cập nhật lớp học thành công!");
            showClass();

            button.textContent = "Update";
            button.onclick = function () {
                updateClass(this, class_id);
            };
        } else {
            alert(response.message || "Thêm lớp học thất bại!");
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi cập nhật lớp học.");
    });
}

function deleteSoftClass(class_id) {
    $.ajax({
        url: '/class/delete_soft_class',
        type: 'PATCH',
        data: {
            class_id: class_id,
        }
    }).then(response => {
        if (response.success) {
            alert("Xoá mềm lớp học thành công!");
            showClass();
        } else {
            alert(response.message || "Xoá mềm lớp học thất bại!");
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi xoá mềm lớp học.");
    });
}

function cancelDeleteSoftClass(class_id) {
    $.ajax({
        url: '/class/cancel_delete_soft_class',
        type: 'PATCH',
        data: {
            class_id: class_id,
        }
    }).then(response => {
        if (response.success) {
            alert("Huỷ xoá mềm lớp học thành công!");
            showClass();
        } else {
            alert(response.message || "Xoá mềm lớp học thất bại!");
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi xoá mềm lớp học.");
    });
}

function deleteHardClass(class_id) {
    if (!confirm("Bạn có chắc chắn muốn xoá lớp học này?")) {
        return;
    }

    $.ajax({
        url: '/class/delete_hard_class',
        type: 'DELETE',
        data: {
            class_id: class_id,
        }
    }).then(response => {
        if (response.success) {
            alert("Xoá lớp học thành công!");
            showClass();
        } else {
            alert(response.message || "Xoá lớp học thất bại!");
        }
    }).catch(error => {
        alert("Đã xảy ra lỗi khi xoá cứng lớp học.");
    });
}