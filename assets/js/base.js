let romPatches;

let currentRomFile;
let currentRomDigest;
let currentRomData;

document.addEventListener("DOMContentLoaded", function () {
    fetch("assets/json/romPatches.json")
        .then((response) => response.json())
        .then((data) => romPatches = data);
});

function loadRomData() {
    currentRomData = null;
    romPatches.forEach(function (e) {
        if (e.digest == currentRomDigest) {
            currentRomData = e;
            loadRomImage();
            loadRomPatches();
        }
    })
}

function loadRomImage() {
    var image = document.getElementById("romImage");
    image.src = "assets/img/" + currentRomData.imgFile;
}

function loadRomPatches() {
    var select = document.getElementById("romPatchesSelector");

    select.innerHTML = "";

    for (var i = 0; i < currentRomData.patches.length; i++) {
        var patchInfo = currentRomData.patches[i];
        select.innerHTML += "<option value=\"" + i + "\">" + patchInfo.name + "</option>";
    }
}

function getRomFile(input) {
    currentRomFile = new MarcFile(input, () => getRomDigest().then((digest) => {
        currentRomDigest = digest;
        document.getElementById("step-2").style = "";
        loadRomData();
    }));
}

function onInputRomUploaded(input) {
    getRomFile(input);
}

function getRomDigest() {
    return window.crypto.subtle.digest('SHA-256', currentRomFile._u8array.buffer)
        .then(romHash => {
            let hashBytes = new Uint8Array(romHash);
            let hexString = '';
            for (let i = 0; i < hashBytes.length; i++) {
                hexString += padZeroes(hashBytes[i], 1);
            }
            return hexString;
        })
        .catch(function () {
            alert("Failed to calculate SHA-256 of your ROM.");
            return '';
        });
}

function patchRom() {
    if (currentRomFile == null) {
        alert("Please select a ROM.")
        return;
    }

    var selectedPatchIndex = document.getElementById("romPatchesSelector").value;
    var selectedPatch = currentRomData.patches[selectedPatchIndex];

    console.log();
}