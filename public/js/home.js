function showSubject() {
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
    url: '/class/get_subject',
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

function toggleExtraButtons() {
  const extraBtns = document.getElementById("extraBtns");
  extraBtns.style.display = (extraBtns.style.display === "none" || extraBtns.style.display === "") ? "block" : "none";
}

function logout() {
  $.ajax({
    url: '/account/logout',
    type: 'GET',
  }).then(response => {
    if (response.success) {
      alert("Đăng xuất thành công!");
      window.location.href = "/";
    } else {
      alert("Đăng xuất thất bại!");
    }
  }).catch(error => {
    alert("Đã xảy ra lỗi khi đăng xuất.");
  });
}