const changePassword = () => {
    document.getElementById('mainContent').innerHTML = `
    <h3>Change password</h3>
    <div class="form-group">
        <label>Old password:</label>
        <input type="password" id="oldPassword" placeholder="Input old password" required>
    </div>
    <div class="form-group">
        <label>New password:</label>
        <input type="password" id="newPassword" placeholder="Input new password" required>
    </div>
    <div class="form-group" style="width: 200px">
        <label>Code:</label><small>{code in your email.}</small>
        <div class="input-row">
            <input type="text" id="code" placeholder="Input code" required>
            <button class="submit-btn" onclick="sendMail()">Send</button>
        </div>
    </div>
    <button class="submit-btn" onclick="savePassword()">Change</button>`;
}

const sendMail = () => {
    const email = document.getElementById("userEmail").value;
    $.ajax({
        url: '/account/send-mail',
        type: 'GET',
        data: {
            email: email,
        }
    }).then(response => {
        alert("Send code successfully.");
    }).catch(error => {
        alert("Something is error.");
    });
}

const savePassword = () => {
    const email = document.getElementById("userEmail").value;
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const code = document.getElementById("code").value;

    $.ajax({
        url: '/account/change-password',
        type: 'PATCH',
        data: {
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword,
            code: code
        }
    }).then(response => {
        if (!response.success) {
            alert(response.message);
        } else {
            alert("Change password successfully");
            window.location.href = "/";
        }
    }).catch(error => {
        alert(error['responseJSON']['error'].msg);
    });
}
