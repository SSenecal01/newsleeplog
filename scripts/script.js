let sleepData = [];
let editIndex = null;

// Load initial JSON data
$(document).ready(function() {
    fetch('data/sleepLog.json')
    .then(response => response.json())
    .then(data => {
        sleepData = data;
        renderTable();
    });

    $("#sleepDate").datepicker({ dateFormat: 'yy-mm-dd' });

    $("#loginBtn").click(() => $("#loginModal").modal('show'));

    $("#loginForm").submit(function(e) {
        e.preventDefault();
        const username = $("#username").val();
        $("#loginBtn").text(`Logout (${username})`).off('click').click(logout);
        $("#loginModal").modal('hide');
    });

    $("#sleepForm").submit(function(e) {
        e.preventDefault();
        const newEntry = {
            date: $("#sleepDate").val(),
            hours: $("#sleepHours").val(),
            notes: $("#sleepNotes").val()
        };
        if (editIndex !== null) {
            sleepData[editIndex] = newEntry;
            editIndex = null;
        } else {
            sleepData.push(newEntry);
        }
        renderTable();
        this.reset();
    });

    $("#loadSample").click(function() {
        $("#sleepDate").val("2025-04-27");
        $("#sleepHours").val(8);
        $("#sleepNotes").val("Sample Good Sleep");
    });

    $("#exportBtn").click(function() {
        console.log(JSON.stringify(sleepData, null, 2));
    });
});

function renderTable() {
    const tbody = $("#sleepTable tbody");
    tbody.empty();
    sleepData.forEach((entry, index) => {
        const row = `
            <tr>
                <td>${entry.date}</td>
                <td>${entry.hours}</td>
                <td>${entry.notes}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editEntry(${index})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEntry(${index})">Delete</button>
                </td>
            </tr>`;
        tbody.append(row);
    });
}

function editEntry(index) {
    const entry = sleepData[index];
    $("#sleepDate").val(entry.date);
    $("#sleepHours").val(entry.hours);
    $("#sleepNotes").val(entry.notes);
    editIndex = index;
}

function deleteEntry(index) {
    if (confirm("Are you sure you want to delete this entry?")) {
        sleepData.splice(index, 1);
        renderTable();
    }
}

function logout() {
    $("#loginBtn").text("Login").off('click').click(() => $("#loginModal").modal('show'));
}