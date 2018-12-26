let arrAppointment;

$(function () {
    if (typeof (Storage) !== "undefined") {
        arrAppointment = localStorage.getItem("tbAppointment");
        arrAppointment = JSON.parse(arrAppointment);
        if (arrAppointment == null){
            var arrAppointment = [];
            arrAppointment.push(JSON.parse(localStorage.getItem('tbAppointment')));
            localStorage.setItem('tbAppointment', JSON.stringify(arrAppointment));
        }
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

    print();

});

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    // for (let i = 0; i < 6; i++) {
    //     let week = tbl.append(`<tr id="week_${i}"></tr>`);
    //     for (let j = 0; j < 7; j++) {
    //         if (i === 0 && j < firstDay) {
    //             week.append(`<td></td>`);
    //             // tbl.append(`<li></li>`);
    //             // let cell = document.createElement("li");
    //             // let cellText = document.createTextNode("");
    //             // cell.appendChild(cellText);
    //             // tbl.appendChild(cell);
    //         } else if (date > daysInMonth) {
    //             break;
    //         } else {
    //             // let cell = document.createElement("li");
    //             // let cellText = document.createTextNode(date);
    //             if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
    //                 week.find(`tr:eq(${i})`).append(`<td><a class="active text-white bg-dark today p-1 font-weight-bolder">${date}</a></td>`);
    //                 // tbl.append(`<li><a class="active text-white bg-dark today p-1 font-weight-bolder">${date}</a></li>`);
    //                 // cell.classList.add("today");
    //                 // cell.classList.add("active");
    //             } // color today's date
    //             else if(date < today.getDate() && year <= today.getFullYear() && month <= today.getMonth()) {
    //                 week.find(`tr:eq(${i})`).append(`<td><a class="inactive text-muted" disabled="disabled">${date}</a></td>`);
    //                 // tbl.append(`<li><a class="inactive text-muted" disabled="disabled">${date}</a></li>`);
    //                 // cell.classList.add("inactive");
    //                 // cell.setAttribute('disabled', 'disabled');
    //             }
    //             else if (date >= today.getDate() && year >= today.getFullYear() && month >= today.getMonth()) {
    //                 week.find(`tr:eq(${i})`).append(`<td><a class="active text-dark font-weight-bolder">${date}</a></td>`);
    //                 // tbl.append(`<li><a class="active text-dark font-weight-bolder">${date}</a></li>`);
    //                 // cell.classList.add("active");
    //             }
    //             // cell.appendChild(cellText);
    //             // tbl.appendChild(cell);
    //             date++;
    //         }
    //     }
    // }

    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");
        row.className = `week week_${i}`;

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.classList.add("inactive");
                cell.classList.add("bg-secondary");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                let cell = document.createElement("td");
                let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("active");
                    cell.classList.add("text-white");
                    cell.classList.add("bg-primary");
                    cell.classList.add("today");
                    cell.classList.add("text-center");
                    cell.classList.add("font-weight-bold");
                } else if(date < today.getDate() && year <= today.getFullYear() && month <= today.getMonth()){
                    cell.classList.add("inactive");
                    cell.classList.add("text-white");
                    cell.classList.add("bg-light");
                    cell.classList.add("text-muted");
                    cell.classList.add("text-center");
                    cell.classList.add("font-weight-light");
                    cell.setAttribute('disabled', 'disabled');
                } else if (date >= today.getDate() && year >= today.getFullYear() && month >= today.getMonth()) {
                    cell.classList.add("active");
                    cell.classList.add("text-dark");
                    cell.classList.add("bg-white");
                    cell.classList.add("text-center");
                    cell.classList.add("font-weight-bold");
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }


        }

        tbl.appendChild(row); // appending each row into calendar body.
    }

}

$("#days td.active").on("click", function () {
    $('#date').val($(this).text() + "/" + ($('#month').data('val') + 1) + "/" + $('#year').text());
    $("#start_time").focus();
});

$("#days td.inactive").on("click", function () {
    iziToast.error({
        title: 'Error',
        message: "You can make appointments just today and foward",
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
            var appointment = {
                // @todo
                // add description
                date: $("#date").val(),
                start_time: $("#start_time").val(),
                end_time: $("#end_time").val(),
            };

            SaveDataToLocalStorage(appointment);
            $("#btn_clear_storage").prop('disabled', false);

            // @todo add badge of appointment counter
            // var label = GetDateInput();

            // var td = $('.wwek > td.active').filter(function(){
            //     return $(this).text() === label[0];
            // });

            // // find span to iterate counter
            // td.find("span")

            // .append(`<span style="margin-left:5px" data-day="${label[0]}" class="badge badge-info badge-corner radius-3">7</span>`);

            print();

            clear_input();
            iziToast.success({
                title: 'Success',
                message: 'Appointment created',
            });
        } else {
            clear_input();
            iziToast.error({
                title: 'Error',
                message: "This appointment is overlaping another one",
                overlay: true,
                zindex: 999,
                position: 'center',
                timeout: 3000,
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
    $("#submit").prop('disabled', true);
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
    var arrDate = GetDateInput();
    var selected_date = new Date(arrDate[2], arrDate[1]-1, arrDate[0], 0, 0, 0, 0);
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
        if (timeList == null || timeList == "[null]"){
            return false
        } else {
            timeList = JSON.parse(timeList);
        }

        for (let i = 0; i < timeList.length; i++) {
            const element = timeList[i];
            if (element.date == $("#date").val()) {
                if (
                    sTime < element.start_time && eTime > element.start_time ||
                    sTime < element.end_time && eTime > element.end_time
                ) {
                    return true;
                }
            }
        }
        return false;
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

function print() {
    var data = localStorage.getItem("tbAppointment");
    if (data == null){
        $("#appointment_list > tbody").html("");
        return false
    };
    data = JSON.parse(data);
    if (data[0] !== null) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            $("#appointment_list > tbody").append(
                `
                <tr>
                    <td>${element.date}</td>
                    <td>${element.start_time}</td>
                    <td>${element.end_time}</td>
                </tr>
                `
            );
        }
    }
}

function SaveDataToLocalStorage(data)
{
    var a = [];
    // Parse the serialized data back into an aray of objects
    a = JSON.parse(localStorage.getItem('tbAppointment'));
    var a = a.filter(function (el) {
        return el != null;
    });

    // Push the new data (whether it be an object or anything else) onto the array
    a.push(data);
    // Re-serialize the array back into a string and store it in localStorage
    localStorage.setItem('tbAppointment', JSON.stringify(a));
}

function clear_storage(){
    localStorage.clear();
    var arrAppointment = [];
    arrAppointment.push(JSON.parse(localStorage.getItem('tbAppointment')));
    localStorage.setItem('tbAppointment', JSON.stringify(arrAppointment));
    $("#btn_clear_storage").prop('disabled', true);
    print();
}