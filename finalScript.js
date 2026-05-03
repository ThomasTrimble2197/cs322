
// Community key (replace with personal key later)
const bartKey = "MW9S-E7SL-26DU-VV8V";

let station1 = "";
let station2 = "";

// Enum for readability in future functions
const stationNum = {
    k1: "station1",
    k2: "station2"
}

// Station 1 elements
let nameElement = document.getElementById("name");
let locationElement = document.getElementById("location");
let arrivalElement = document.getElementById("arrival");
let goingToElement = document.getElementById("goingto");
let etdElement = document.getElementById("etd");
let fareElement = document.getElementById("fare");

// Station 2 Elements
let nameElement2 = document.getElementById("name2");
let locationElement2 = document.getElementById("location2");

// Popup elements
const popup1Element = document.getElementById("popup1");
const popup2Element = document.getElementById("popup2");

// Current station info (might not be needed, may remove later)
let sName = "";
let address = "";
let nextArrival = "";
let nextArrivalTime = "";
let finalArrival = "";
let cost = "";

// Gets all station buttons...
const stations = document.getElementsByClassName("station");

for (let i = 0; i < stations.length; i++) {

    // ... and makes them wait for a click
    stations[i].addEventListener("click", function() {

        // if popup 1 isnt open, then set popup to info of associated station
        if (popup1Element.hasAttribute("hidden")) {
            
            station1 = stations[i].getAttribute("id");

            getLocationInfo(station1, stationNum.k1);
            getArrivalInfo(station1, stationNum.k1);

            popup1Element.toggleAttribute("hidden");
        }

        // if popup 1 is open, but popup 2 isn't, then...
        else if (popup2Element.hasAttribute("hidden")) {
            
            station2 = stations[i].getAttribute("id");
            
            //...check to see if user clicked on the same button. if so, hide all popups
            if (station1 == station2) {
                station2 = ""
                hidePopUps();
            
            // otherwise, set popup2 to info of associated station
            } else {
                getLocationInfo(station2, stationNum.k2);
                // getArrivalInfo(station2, stationNum.k2);
                popup2Element.toggleAttribute("hidden");
            }
            
        }
        // if both popups are open, then hide all popups
        else {
            hidePopUps();
        }
    });
}

// Gets basic location info, the station name and the address

async function getLocationInfo(station, stationNum) {
    let response = await fetch(`https://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=${station}&key=${bartKey}&json=y`);

    let parsed = await response.json();

    sName = parsed.root.stations.station.name;

    address = String(parsed.root.stations.station.city + ", " + parsed.root.stations.station.address);

    //using enum info, writes data to approiate place
    if (stationNum == "station1") {
        nameElement.textContent = sName;
        locationElement.textContent = address;
    } else {
        nameElement2.textContent = sName;
        locationElement2.textContent = address;
    }
    
}


// This DESPERATELY needs to be corrected with the proper info
// Gets the next train departure

async function getArrivalInfo(station, stationNum) {
    let response = await fetch(`https://api.bart.gov/api/etd.aspx?cmd=etd&orig=${station}&key=${bartKey}&json=y`);

    let parsed = await response.json();

    if (parsed.root.station[0].etd[0].estimate[0].minutes > parsed.root.station[0].etd[1].estimate[0].minutes) {
        nextArrival = parsed.root.station[0].etd[1].destination;
        nextArrivalTime = parsed.root.station[0].etd[1].estimate[0].minutes;
    } else {
        nextArrival = parsed.root.station[0].etd[0].destination;
        nextArrivalTime = parsed.root.station[0].etd[0].estimate[0].minutes;
    }

    etdElement.textContent = nextArrivalTime + " minutes";
    arrivalElement.textContent = nextArrival;
}

// Hides both popups with one function call
function hidePopUps() {
    popup1Element.setAttribute("hidden", true);
    popup2Element.setAttribute("hidden", true);
}

