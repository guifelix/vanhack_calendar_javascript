let arrAppointment;

$(function () {
    if (typeof (Storage) !== "undefined") {
        arrAppointment = localStorage.getItem("tbAppointment");
        arrAppointment = JSON.parse(arrAppointment);
        if (arrAppointment == null)
            arrAppointment = [];
    } else {
        iziToast.warning({
            title: 'Caution',
            message: "Sorry, but your web browser do not support localstorage, this app won't work. Try updating your browser first.",
            overlay: true,
            zindex: 999,
            position: 'center',
            timeout: 20000,
        });
    }

    $("#start_time").inputmask("hh:mm", {placeholder: "hh:mm", alias: "datetime", oncomplete: function(){ $("#end_time").focus(); }});
    $("#end_time").inputmask("hh:mm", {placeholder: "hh:mm", alias: "datetime", oncomplete: function(){ compare(); $("#submit").focus(); }});
    $(".date-input").inputmask("dd/mm/yyyy", {placeholder: "dd/mm/yyyy", alias: "datetime"});

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
                    cell.classList.add("today");
                    cell.classList.add("active");
                } // color today's date
                if (date < today.getDate() && year <= today.getFullYear() && month <= today.getMonth()) {
                    cell.classList.add("inactive");
                    cell.setAttribute('disabled', 'disabled');
                }
                if (date >= today.getDate() && year >= today.getFullYear() && month >= today.getMonth()) {
                    cell.classList.add("active");
                }
                cell.appendChild(cellText);
                tbl.appendChild(cell);
                date++;
            }
        }
    }

}



$("#days li.active").on("click", function () {
    $('#date').val($(this).text() + "/" + ($('#month').data('val') + 1) + "/" + $('#year').text());
    $("#start_time").focus();
});

$("#days li.inactive").on("click", function () {
    iziToast.error({
        title: 'Error',
        message: "You can make appointments just this day and foward",
        overlay: true,
        zindex: 999,
        position: 'center',
        timeout: 3000,
    });
});

function make_appointment() {
    if (is_empty() == false) {
        is_past_date();
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
            iziToast.success({
                title: 'Success',
                message: 'Appointment created',
            });
        }
    } else {
        iziToast.error({
            title: 'Error',
            message: "All input fields are needed in order to make an appointment",
            overlay: true,
            zindex: 999,
            position: 'center',
            timeout: 3000,
        });
    }
}

$("#end_time, #start_time").focusout(function () {
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
    var startTime = Date.parse(get_Date($("#start_time").val()));
    var endTime = Date.parse(get_Date( $("#end_time").val()));

    if (startTime > endTime) {
        $("#submit").prop('disabled', true);
        clear_input();
        iziToast.warning({
            title: 'Caution',
            message: "Start Time is greater than end time",
            overlay: true,
            zindex: 999,
            position: 'center',
            timeout: 2000,
        });
    }
    if (startTime == endTime) {
        $("#submit").prop('disabled', true);
        clear_input();
        iziToast.warning({
            title: 'Caution',
            message: "Start Time equals end time",
            overlay: true,
            zindex: 999,
            position: 'center',
            timeout: 2000,
        });
    }
}

function is_past_date() {
    var today = new Date();
    var selected_date = get_Date();
    if (selected_date < today) {
        return true;
    }
    return false;
}

function GetDateInput() {
    var date = $("#date").val();
    return date.split("/");
}

function is_overlap(sTime, eTime) {
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
    var date = new Date(arrDate[2], arrDate[1]-1, arrDate[0], 0, 0, 0, 0);
    var _t = time.split(":");
    date.setHours(_t[0], _t[1], 0, 0);
    return date;
}


function print(data) {
    $("#appointment_list").html("<pre>" + JSON.stringify(data, 0, 4) + "</pre>");
}