let bartKey = "MW9S-E7SL-26DU-VV8V";

let station = "24th";

let locationURL = `https://api.bart.gov/api/stn.aspx?cmd=stninfo&orig=${station}&key=${bartKey}&json=y`;
let arrivalURL = `https://api.bart.gov/api/etd.aspx?cmd=etd&orig=${station}&key=${bartKey}&json=y`

let nameElement = document.getElementById("name");
let locationElement = document.getElementById("location");
let arrivalElement = document.getElementById("arrival");
let arrivalToElement = document.getElementById("arrivalTo");

let address = "";
let sName = "";
let nextArrival = "";
let nextArrivalTime = ""

getLocationInfo();
getArrivalInfo();

async function getLocationInfo() {
    let response = await fetch(locationURL);

    let parsed = await response.json();

    sName = parsed.root.stations.station.name;

    address = String(parsed.root.stations.station.city + ", " + parsed.root.stations.station.address);

    nameElement.textContent += sName;
    locationElement.textContent += address;
}

async function getArrivalInfo() {
    let response = await fetch(arrivalURL);

    let parsed = await response.json();

    if (parsed.root.station[0].etd[0].estimate[0].minutes > parsed.root.station[0].etd[1].estimate[0].minutes) {
        nextArrival = parsed.root.station[0].etd[1].destination
        nextArrivalTime = parsed.root.station[0].etd[1].estimate[0].minutes
    } else {
        nextArrival = parsed.root.station[0].etd[0].destination
        nextArrivalTime = parsed.root.station[0].etd[0].estimate[0].minutes
    }

    arrivalElement.textContent += nextArrivalTime + " minutes";
    arrivalToElement.textContent += nextArrival;
}


