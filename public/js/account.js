const changePassword = () => {
    document.getElementById('mainContent').innerHTML = `
    <h3>Change password</h3>
    <div class="form-group">
        <label>Old password:</label>
        <input type="text" id="oldPassword" placeholder="Input old password" required>
    </div>
    <div class="form-group">
        <label>New password:</label>
        <input type="text" id="newPassword" placeholder="Input new password" required>
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
