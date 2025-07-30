const formatVietnamTime = (isoString) => {
    if (!isoString) return { weekday: "null", time: "null" };

    const date = new Date(isoString);

    const weekday = date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        timeZone: 'Asia/Ho_Chi_Minh'
    });

    const day = date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh'
    });

    const time = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    });

    return { weekday: `${weekday}, ${day}`, time };
}

const showSchedule = () => {
    document.getElementById('mainContent').innerHTML = `
    <h2>Teacher's Schedule</h2>
        <table>
            <thead>
                <tr>
                    <th id="col">Subject</th>
                    <th id="col">Day</th>
                    <th id="col">Start time</th>
                    <th id="col">End time</th>
                    <th id="col">Room</th>
                    <th id="col"></th>
                </tr>
            </thead>
            <tbody id="teacherSchedule"></tbody>
        </table>
    </div>`;

    $.ajax({
        url: '/subject/get-subject-teacher',
        type: 'GET',
        data: {
            teacherId: $('#ID').val(),
        }
    }).then(response => {
        const tbody = document.getElementById('teacherSchedule');
        response.forEach(subject => {
            const { weekday: startWeekday, time: startTime } = formatVietnamTime(subject.startTime);
            const { weekday: endWeekday, time: endTime } = formatVietnamTime(subject.endTime);
            const isCanceled = subject.isCanceled;
            const row = `
            <tr>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${subject.subject_name}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${startWeekday}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${startTime}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${endTime}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${subject.roomName}</td>
                <td id="col">
                ${isCanceled
                    ? `<span style="color: red;">Đã huỷ buổi học</span><br>
                    <button id="btn-check" onclick='makeUpSubject(${JSON.stringify(subject)})'>Reschedule</button>`
                    : `<button id="btn-check" onclick="cancelSubject(${subject.teacher_subject_id})">Cancel</button>`
                }
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }).catch(error => {
        document.getElementById('mainContent').innerHTML = `<p>Failed to load schedule. Please try again later.</p>`;
    });
}

const showScheduleStudent = () => {
    document.getElementById('mainContent').innerHTML = `
    <h2>Teacher's Schedule</h2>
        <table>
            <thead>
                <tr>
                    <th id="col">Subject</th>
                    <th id="col">Day</th>
                    <th id="col">Start time</th>
                    <th id="col">End time</th>
                    <th id="col">Room</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="teacherSchedule"></tbody>
        </table>
    </div>`;

    $.ajax({
        url: '/subject/get-subject-for-student',
        type: 'GET',
        data: {
            teacherId: $('#ID').val(),
        }
    }).then(response => {
        const tbody = document.getElementById('teacherSchedule');
        response.forEach(subject => {
            const { weekday: startWeekday, time: startTime } = formatVietnamTime(subject.startTime);
            const { weekday: endWeekday, time: endTime } = formatVietnamTime(subject.endTime);
            const isCanceled = subject.isCanceled;
            const row = `
            <tr>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${subject.subject_name}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${startWeekday}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${startTime}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${endTime}</td>
                <td id="col" style="${isCanceled ? 'opacity: 0.5;' : ''}">${subject.roomName}</td>
                <td id="col">
                ${isCanceled ? `<span style="color: red;">Class was cancel</span><br>` : ''}
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }).catch(error => {
        document.getElementById('mainContent').innerHTML = `<p>Failed to load schedule. Please try again later.</p>`;
    });
}

const cancelSubject = (id) => {
    $.ajax({
        url: '/subject/cancel-lesson',
        type: 'PATCH',
        data: {
            teacherSubjectId: id
        }
    }).then(response => {
        if (response.success) {
            alert("Cancel lesson successfully!");
            showSchedule();
        } else {
            alert("Cancel lesson unsuccessfully!");
        }
    }).catch(error => {
        alert("An error occurred while cancel lesson.");
    });
}

const makeUpSubject = (res) => {
    document.getElementById('mainContent').innerHTML = `
        <h1>Reschedule</h1>
        <div class="form-group">
            <label>Subject: ${res.subject_name}</label>
        </div>
        <div class="form-group">
            <label>Room:</label>
            <select id="roomSelect"></select>
        </div>
        <div class="form-group">
            <label>Start time:</label>
            <input type="datetime-local" id="startTime" required>
        </div>
        <div class="form-group">
            <label>End time:</label>
            <input type="datetime-local" id="endTime" required>
        </div>
        <button class="submit-btn" onclick="submitReschedule(${res.teacher_subject_id}, ${res.subject_id}, ${res.teacher_id})">Reschedule</button>`;

    $.ajax({
        url: '/room/find',
        type: 'GET',
    }).then(response => {
        const select = document.getElementById('roomSelect');
        response.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
        });
    }).catch(() => {
        alert('Failed to load Room list. Please try again later.');
    });
}

const submitReschedule = async (teacher_subject_id, subject_id, teacher_id) => {
    const roomId = $('#roomSelect').val();
    const startTime = $('#startTime').val();
    const endTime = $('#endTime').val();

    if (!teacher_id || !roomId || !startTime || !endTime) {
        alert("Please fill all information.");
        return;
    }

    try {
        const response_add_subject_teacher = await $.ajax({
            url: '/subject/update-teacher-subject',
            type: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                id: parseInt(teacher_subject_id),
                subjectId: subject_id,
                teacherId: parseInt(teacher_id),
                roomId: parseInt(roomId),
                startTime: startTime,
                endTime: endTime
            })
        });

        if (!response_add_subject_teacher.success) {
            return alert(response_add_subject_teacher.message);
        }

        alert('Change schedule successfully!');
        showSchedule();
    } catch (error) {
        alert(error['responseJSON']['error'].msg);
    }
}
