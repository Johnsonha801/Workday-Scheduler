// Load schedule from localStorage or create empty array
var schedule = JSON.parse(localStorage.getItem("schedule")) || [
    {"time": "9:00AM", "task": ""},
    {"time": "10:00AM", "task": ""},
    {"time": "11:00AM", "task": ""},
    {"time": "12:00PM", "task": ""},
    {"time": "1:00PM", "task": ""},
    {"time": "2:00PM", "task": ""},
    {"time": "3:00PM", "task": ""},
    {"time": "4:00PM", "task": ""},
    {"time": "5:00PM", "task": ""}
];

// Display current date 
var displayCurrentDate = function() {
    // Get current date in specified format
    var currentDate = moment().format("dddd, MMMM Do");
    // Set element text to the currentDate formate
    $("#currentDay").text(currentDate);
}

// Check current time against hours and change styles 
var checkTime = function() {
    //Update displayed date in Jumbotron
    displayCurrentDate();

    // Get current time
    var currentTime = moment(moment(),"h:mm A");

    // Loop through and check current time against time blocks
    for(var i = 0; i < schedule.length; i++) {
        // grab time of current schedule item
        var scheduleTime = moment(schedule[i].time, 'h:mm A');
        var timeDifference = currentTime.diff(scheduleTime, "minutes");
        
        // Remove current classes
        $("[id='" + schedule[i].time + "']").removeClass("past present future");
        
        // Check if the time is past, present, or future
        if (timeDifference >= 60) {
            // Time has passed
            $("[id='" + schedule[i].time + "']").addClass("past");
        } else if (timeDifference < 60 && timeDifference > 0) {
            // In current hour
            $("[id='" + schedule[i].time + "']").addClass("present");
        } else {
            // Future hour
            $("[id='" + schedule[i].time + "']").addClass("future");
        }
    }
}

// display day schedule
var loadDaySchedule = function() {
    // Update Display Current Date
    displayCurrentDate();

    // Clear all child elements in the schedule container
    $('#schedule-container').empty(); 

    // Iterate over schedule array and add items to their corresponding time block
    for(var i = 0; i < schedule.length; i++) {
        // Add row
        var hourRow = $("<div>");
        hourRow.addClass("row");

        // Add input group 
        var inputGroup = $("<div>");
        inputGroup.addClass("input-group");

        // Time Text
        var hourText = $("<div>");
        hourText.addClass("hour").text(schedule[i].time);

        // Text Area
        var description = $("<textarea>");
        description.addClass("form-control description")
            .text(schedule[i].task)
            .attr("id", schedule[i].time);
        
        // Save Button
        var saveButton = $("<button>");
        saveButton.addClass("saveBtn");
        saveButton.attr("data-hour", schedule[i].time);
        // Include Save Icon from FontAwesome in button
        saveButton.html("<i class='fas fa-save'></i>");

        // Append children to input group
        inputGroup.append(hourText,description,saveButton);

        // append inputGroup to the hour row
        hourRow.append(inputGroup);        
        
        // add to container
        $("#schedule-container").append(hourRow);
    }

    // Check times against current time
    checkTime();
}

// Event Listener for hour save buttons
$(document).on('click', '.saveBtn', function() {
    // Get value from corresponding hour text box
    var hourChanged = $(this).attr("data-hour");
    var newEventText = $("[id='" + hourChanged + "']").val();
    
    // Loop through schedule array and update item based on hour saved
    for(var i = 0; i < schedule.length; i++) {
        if(schedule[i].time === hourChanged) {
            schedule[i].task = newEventText;
        }
    }

    // Save item in localStorage
    localStorage.setItem("schedule", JSON.stringify(schedule));
});

// Initiate applicaiton and load day schedule
loadDaySchedule();

// Set time interval to check time. Runs every minute
setInterval(function() {
    // Check times to adjust styling
    checkTime();
},(1000 * 60));
