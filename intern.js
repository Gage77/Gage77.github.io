window.onload = function() {
    updateDisplayedPoints();
};

function incPoints(num) {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.points) {
            localStorage.points = Number(localStorage.points) + num;
        }
        else {
            localStorage.points = 1;
        }

        console.log(localStorage.points + " Yay mor points nom nom nom");
        updateDisplayedPoints()
    }
    else {
        alert("Ya dun f'd up. Browser does not support web storage.");
    }
}

function decPoints(num) {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.points) {
            localStorage.points = Number(localStorage.points) - num;
        }
        else {
            localStorage.points = -1;
        }

        console.log(localStorage.points + " Aww less points, sad face");
        updateDisplayedPoints()
    }
    else {
        alert("Ya dun f'd up. Browser does not support web storage.");
    }
}

function updateDisplayedPoints() {
    var pnts = document.getElementById("current_points");
    pnts.innerHTML = localStorage.points;
}
