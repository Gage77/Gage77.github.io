const storageSupported = typeof(Storage) !== "undefined";

window.onload = function() {
    if (storageSupported) {
        updateDisplayedPoints();
    } else {
        alert("Ya dun f'd up. Browser does not support web storage.");
    }
    erodePoints();
};

function addPoints(num) {
    if (storageSupported) {
        if (localStorage.points) {
            localStorage.points = Number(localStorage.points) + num;
        }
        else {
            localStorage.points = num;
        }

        console.log(makeLogMessage(num, localStorage.points));

        updateDisplayedPoints()
    } else {
        alert("Yer browser still don't support web storage, ya dink.")
    }
}

function makeLogMessage(num, currentPoints) {
    let message;
    if (num > 0) {
        message = "Yay mor points nom nom nom";
    } else if (num < 0) {
        message = "Aww less points, sad face";
    } else {
        message = "Points be the same, boss";
    }
    return `${currentPoints} ${message}`;
}

function updateDisplayedPoints() {
    var pnts = document.getElementById("current_points");
    pnts.innerHTML = localStorage.points || '0';
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function erodePoints() {
    setTimeout(function() {
        addPoints(randomIntFromInterval(1, 10));
        erodePoints();
    }, randomIntFromInterval(30e3, 500e3));
}
