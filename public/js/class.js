function showClass() {
    hidePagging();
    document.getElementById('mainContent').innerHTML = `
    <h1>Class</h1>
    <button id="btn-check" style="float: right;" onclick="addCLass()">Add Class</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 60%;">Class</th>
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
            <td id="col">
                <button id="btn-check" onclick="updateClass(this, ${res.id})">Edit</button>
                <button id="btn-check" onclick="deleteSoftClass(${res.id})">Soft delete</button>
                <button id="btn-check" onclick="deleteHardClass(${res.id})">Delete</button>
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
    <button class="submit-btn" onclick="saveClass()">Add</button>`;
}

function saveClass() {
    const className = $('#className').val();
    if (!className) {
        alert("Please enter Class name.");
        return;
    }

    $.ajax({
        url: '/class/add',
        type: 'POST',
        data: {
            className: className,
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
        alert("Please input Class name.");
        return;
    }

    $.ajax({
        url: '/class/update',
        type: 'PATCH',
        data: {
            classId: class_id,
            className: newValue,
        }
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

function deleteSoftClass(class_id) {
    $.ajax({
        url: '/class/soft-delete',
        type: 'PATCH',
        data: {
            classId: class_id,
        }
    }).then(response => {
        if (response.success) {
            alert("Soft delete class successfully!");
            showClass();
        } else {
            alert("Soft delete class unsucessfully!");
        }
    }).catch(error => {
        alert("An error occurred while delete soft class.");
    });
}

function deleteHardClass(class_id) {
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
            alert("Delete class unsuccessfuly!");
        }
    }).catch(error => {
        alert("An error occurred while delete class.");
    });
}