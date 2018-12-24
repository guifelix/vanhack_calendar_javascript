let arrAppointment;

$(function () {
    if (typeof (Storage) !== "undefined") {
        arrAppointment = localStorage.getItem("tbAppointment");
        arrAppointment = JSON.parse(arrAppointment);
        if (arrAppointment == null)
            arrAppointment = [];
    } else {
        alert("Sorry, but your web browser do not support localstorage, this app won't work. Try updating your browser first.")
    }
});

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
// let selectYear = document.getElementById("year");
// let selectMonth = document.getElementById("month");

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function showCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("days");

    tbl.innerHTML = "";

    $("#month").text(months[month]);
    $("#month").data("val", month);
    $("#year").text(year);

    let date = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("li");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                tbl.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                let cell = document.createElement("li");
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("active");
                } // color today's date
                cell.appendChild(cellText);
                tbl.appendChild(cell);
                date++;
            }
        }
    }

}



$("#days li").on("click", function () {
    $('#date').val($('#year').text() + "-" + $('#month').data('val') + "-" + $(this).text());
    $("#start_time").focus();
});

function make_appointment() {
    if (is_empty() == false) {
        compare();
        if (is_overlap() == false) {
            var appointment = JSON.stringify({
                Date: $("#date").val(),
                Start_Time: $("#start_time").val(),
                End_Time: $("#end_time").val(),
            });
            arrAppointment.push(appointment);
            // localStorage.setItem("tbAppointment", JSON.stringify(tbAppointment));
            localStorage.setItem("tbAppointment", arrAppointment);
            //call function to create badge and iterate the quantity of appointments in the respective date

            print(arrAppointment);

            $("#submit").prop('disabled', true);
            clear_input();
            alert("Appointment created");
        }
    } else {
        alert("All input fields are needed in order to make an appointment");
    }
}

$("#end_time").focusout(function () {
    compare();
});

$("#end_time, #start_time, #date").keyup(function () {
    if (is_empty() == true) {
        $("#submit").prop('disabled', true);
    } else {
        $("#submit").prop('disabled', false);
    }
});

function clear_input() {
    $("#date").val('');
    $("#start_time").val('');
    $("#end_time").val('');
}

function is_empty() {
    if (
        ($("#date").val() == null || $("#date").val() == '') ||
        ($("#start_time").val() == null || $("#start_time").val() == '') ||
        ($("#end_time").val() == null || $("#end_time").val() == '')
    ) {
        return true;
    }
    return false;
}



function compare() {
    var strStartTime = $("#start_time").val();
    var strEndTime = $("#end_time").val();

    var startTime = get_Date(strStartTime);
    var endTime = new Date(startTime)
    endTime = endTime.setHours(GetHours(strEndTime), GetMinutes(strEndTime), 0);
    if (startTime > endTime) {
        $("#submit").prop('disabled', true);
        clear_input();
        alert("Start Time is greater than end time");
    }
    if (startTime == endTime) {
        $("#submit").prop('disabled', true);
        clear_input();
        alert("Start Time equals end time");
    }
}

function GetDateInput() {
    var date = $("#date").val();
    return date.split("-");
}

function GetHours(d) {
    return parseInt(d.split(':')[0]);
}
function GetMinutes(d) {
    return parseInt(d.split(':')[1]);
}

function is_overlap(sTime, eTime) {
    debugger;
    if (sTime == undefined || eTime == undefined) {
        sTime = $("#start_time").val();
        eTime = $("#end_time").val();
    }
    if (+get_Date(sTime) < +get_Date(eTime)) {
        var timeList = localStorage.getItem("tbAppointment");
        timeList = JSON.parse(timeList);
        var len = timeList.length;
        return len > 0 ? (+get_Date(timeList[len - 1].endTime) < +get_Date(sTime)) : true;
    } else {
        return false;
    }
}

function get_Date(time) {
    var arrDate = GetDateInput();
    var date = new Date(arrDate[0], arrDate[1], arrDate[2], 0, 0, 0, 0);
    var _t = time.split(":");
    date.setHours(_t[0], _t[1], 0, 0);
    return date;
}


function print(data) {
    $("#appointment_list").html("<pre>" + JSON.stringify(data, 0, 4) + "</pre>");
}