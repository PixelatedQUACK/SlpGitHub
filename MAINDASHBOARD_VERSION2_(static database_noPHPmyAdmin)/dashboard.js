document.addEventListener('DOMContentLoaded', function () { //check if naka open
    const idnumber = document.getElementById('idnumber');
    const name = document.getElementById('name');
    const course = document.getElementById('course');
    const id = document.getElementById('id');
    const AmPm = document.getElementById('AmPm');
    const timeInOut = document.getElementById('timeInOut');
    const tableAMBody = document.querySelector('#attendanceTableAM tbody');
    const tablePMBody = document.querySelector('#attendanceTablePM tbody');
    const register = document.getElementById('register');
    const exportBtn = document.getElementById('export');
    const deleteBtn = document.getElementById('delete');

    //fake database to be changed
    const fakeDatabase = {
        "1001": { id: "1001", name: "Person1", course: "CPE" },
        "1002": { id: "1002", name: "Person2", course: "CPE" },
        "1003": { id: "1003", name: "Person3", course: "CPE" }
    };

    // idk tbh getting the variables from the user input
    function updateRecordCount() {
        document.getElementById('recordAM').textContent = tableAMBody.querySelectorAll('tr').length;
        document.getElementById('recordPM').textContent = tablePMBody.querySelectorAll('tr').length;
    }

    //register button
    register.addEventListener('click', function () {
        const enterId = idnumber.value.trim();
        const selectAmPm = AmPm.value;
        const selectTimeType = timeInOut.value;
        if (!enterId) return alert("Please enter an ID.");
        if (!fakeDatabase[enterId]) return alert("ID not found in database!");

        //gets the fake data
        name.value = fakeDatabase[enterId].name;
        course.value = fakeDatabase[enterId].course;
        id.value = fakeDatabase[enterId].id;

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        const targetTable = selectAmPm === "AM" ? tableAMBody : tablePMBody;
        let rowFound = false;

        targetTable.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowId = cells[0].textContent;
            const rowDate = cells[5].textContent;

            if (rowId === enterId && rowDate === currentDate) {
                if (selectTimeType === "TimeIn") cells[3].textContent = currentTime;
                else if (selectTimeType === "TimeOut") cells[4].textContent = currentTime;
                rowFound = true;
            }
        });

        if (!rowFound) {
            const timeIn = selectTimeType === "TimeIn" ? currentTime : "";
            const timeOut = selectTimeType === "TimeOut" ? currentTime : "";

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <td>${enterId}</td>
            <td>${fakeDatabase[enterId].name}</td>
            <td>${fakeDatabase[enterId].course}</td>
            <td>${timeIn}</td>
            <td>${timeOut}</td>
            <td>${currentDate}</td>
        `;
            targetTable.appendChild(newRow);
        }

        updateRecordCount();
        idnumber.value = "";
    });

    //delete button
    deleteBtn.addEventListener('click', function () {
        const enterId = idnumber.value.trim();
        const selectAmPm = AmPm.value; // AM or PM
        if (!enterId) return alert("Please enter an ID to delete.");

        const currentDate = new Date().toLocaleDateString();
        const targetTable = selectAmPm === "AM" ? tableAMBody : tablePMBody;
        let found = false;

        targetTable.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowId = cells[0].textContent;
            const rowDate = cells[5].textContent;

            if (rowId === enterId && rowDate === currentDate) {
                row.remove(); // delete the row
                found = true;
            }
        });

        if (found) {
            alert("Record deleted.");
            updateRecordCount();
        } else {
            alert("No matching record found.");
        }

        idnumber.value = "";
    });

    //export to excell
    exportBtn.addEventListener('click', function () {
        let csvContent = "";

        [tableAMBody, tablePMBody].forEach(tableBody => {
            tableBody.querySelectorAll('tr').forEach(row => {
                const cols = row.querySelectorAll('td');
                const rowData = Array.from(cols).map(cell => `"${cell.textContent}"`).join(",");
                csvContent += rowData + "\n";
            });
        });

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "attendance_records.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    //updates the counter
    updateRecordCount();
    idnumber.value = "";
});
