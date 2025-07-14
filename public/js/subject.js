function showSubjectTeacher() {
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
    <button id="btn-check" style="float: right;" onclick="">Thêm môn học</button>
    <table border="1">
      <thead>
        <tr>
          <th style="width: 10%;" id="col">#</th>
          <th style="width: 40%;">Môn học</th>
          // <th style="width: 30%;">Giáo viên</th>
          <th style="width: 20%;"></th>
        </tr>
      </thead>
      <tbody id="scoreBody">
      </tbody>
    </table>`;

  $.ajax({
    url: '/subject/get-all-subject',
    type: 'GET',
  })
    .then(response => {
      const tbody = document.getElementById('scoreBody');
      let i = 1;
      response.forEach(subject => {
        const row = `
          <tr>
            <td id="col">${i}</td>
            <td>${subject.name}</td>
            // <td>${subject}</td>
            <td id="col">
              <button id="btn-check" onclick="">Cập nhật</button>
              <button id="btn-check" onclick="">Xoá</button>
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