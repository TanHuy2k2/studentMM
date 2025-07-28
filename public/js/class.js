function showClass() {
    hidePagging();
    document.getElementById('mainContent').innerHTML = `
    <h1>Class</h1>
    <button id="btn-check" style="float: right;" onclick="addCLass()">Add Class</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 20%;">Class</th>
          <th style="width: 20%;">Number students</th>
          <th style="width: 20%;">Max students</th>
          <th style="width: 30%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

    $.ajax({
        url: '/class/find',
        type: 'GET',
    }).then(response => {
        const tbody = document.getElementById('scoreBody');
        let i = 1;
        response.forEach(res => {
            const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${res.name}</td>
            <td>${res.number_student}</td>
            <td>${res.max_students}</td>
            <td id="col">
                <button id="btn-check" onclick="updateClass(this, ${res.id})">Edit</button>
                <button id="btn-check" onclick="deleteClass(${res.id})">Delete</button>
            </td>
          </tr>`;
            i++;
            tbody.innerHTML += row;
        });
    }).catch(error => {
        document.getElementById('mainContent').innerHTML = `<p>Unable to load course list. Please try again later.</p>`;
    });
}

function addCLass() {
    document.getElementById('mainContent').innerHTML = `
    <h1>Add Class</h1>
    <div class="form-group">
      <label>Class name:</label>
      <input type="text" id="className" placeholder="Input class name" required>
    </div>
    <div class="form-group">
      <label>Max students:</label>
      <input type="number" id="maxStudent" placeholder="Input max students" required>
    </div>
    <button class="submit-btn" onclick="saveClass()">Add</button>`;
}

function saveClass() {
    const className = $('#className').val();
    const maxStudent = $('#maxStudent').val()
    if (!className) {
        alert("Please enter Class name.");
        return;
    }

    $.ajax({
        url: '/class/add',
        type: 'POST',
        data: {
            className: className,
            maxStudent: maxStudent,
        }
    }).then(response => {
        if (response.success) {
            alert("Add Class successfully!");
            showClass();
        } else {
            alert("This class is exist!");
        }
    }).catch(error => {
        alert("An error occurred while adding Class.");
    });
}

function updateClass(button, class_id) {
    const row = button.closest("tr");
    const cell1 = row.cells[1];
    const className = cell1.textContent.trim();
    cell1.innerHTML = `<input type="text" value="${className}" style="width: 100px;" required>`;

    const cell3 = row.cells[3];
    const maxStudents = cell3.textContent.trim();
    cell3.innerHTML = `<input type="number" value="${maxStudents}" style="width: 100px;" required>`;
    button.textContent = "Save";
    button.onclick = function () {
        saveClassEdit(this, class_id, className);
    };
}

function saveClassEdit(button, class_id, className) {
    const row = button.closest("tr");
    const cell1 = row.cells[1];
    const editClassName = cell1.querySelector("input").value;
    const cell3 = row.cells[3];
    const maxStudents = cell3.querySelector("input").value;
    let duplicateClassName = true;

    if (!editClassName || !maxStudents) {
        alert("Please input Class name or max students.");
        return;
    }

    if (editClassName === className) {
        duplicateClassName = false;
    }

    $.ajax({
        url: '/class/update',
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify({
            classId: class_id,
            className: editClassName,
            maxStudent: maxStudents,
            duplicateClassName: duplicateClassName
        })
    }).then(response => {
        if (response.success) {
            alert("Update class successfully!");
            showClass();

            button.textContent = "Update";
            button.onclick = function () {
                updateClass(this, class_id);
            };
        } else {
            alert("This class is exist!");
        }
    }).catch(error => {
        alert(error['responseJSON']['error'].msg);
    });
}

function deleteClass(class_id) {
    if (!confirm("Are you sure you want to delete this Class?")) {
        return;
    }

    $.ajax({
        url: '/class/delete',
        type: 'DELETE',
        data: {
            classId: class_id,
        }
    }).then(response => {
        if (response.success) {
            alert("Delete class successfuly");
            showClass();
        } else {
            alert(response.message);
        }
    }).catch(error => {
        alert("An error occurred while delete class.");
    });
}