// Executed when page loads.
// document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("user-input")
//     .addEventListener("change", hideSolution);
// });

/* Calculation Functions */

function ordinaryAnnuityPV(i, r, n) {
    let top = (1 + i) ** n - 1;
    let bottom = i * (1 + i) ** n;
    let PV = r * (top / bottom);
    return PV;
}

function ordinaryAnnuityFV(i, r, n) {
    let top = (1 + i) ** n - 1;
    let bottom = i;
    let FV = r * (top / bottom);
    return FV;
}

function annuityDuePV(i, r, n) {
    let top = 1 - (1 + i) ** (1 - n);
    let bottom = i;
    let PV = r * ((top / bottom) + 1);
    return PV;
}

function annuityDueFV(i, r, n) {
    let top = (1 + i) ** (n + 1) - 1;
    let bottom = i;
    let FV = r * ((top / bottom) - 1);
    return FV;
}


/* Signal Functions */

function execute() {
    // Get user input
    let i = getNumberInput("i");
    let r = getNumberInput("r");
    let n = getNumberInput("n");
    let annuityType = getStringInput("annuity-type");

    // Math
    let answer = calculate(i, r, n, annuityType);
    let PV = answer.PV;
    let FV = answer.FV;

    // HTML
    setAnswer(PV, FV, annuityType);
    setFormula(annuityType);
    showSolution();
}

function hideSolution() {
    document.getElementById("solution").classList.replace("d-block", "d-none");
}

function showSolution() {
    document.getElementById("solution").classList.replace("d-none", "d-block");
}


/* Helper Functions */

function calculate(i, r, n, annuityType) {
    switch (annuityType) {
        case "ordinary":
            PV = ordinaryAnnuityPV(i, r, n);
            FV = ordinaryAnnuityFV(i, r, n);
            break;
        case "due":
            PV = annuityDuePV(i, r, n);
            FV = annuityDueFV(i, r, n);
            break;
        default:
            console.log("Error: Annuity type is not set.");
            return null;
    }
    return {"PV": PV, "FV": FV};
}

function setAnswer(PV, FV, annuityType) {
    let pvElement = document.getElementById("annuity-pv");
    let fvElement = document.getElementById("annuity-fv");
    switch (annuityType) {
        case "ordinary":
            pvElement.innerHTML = "PV = " + PV;
            fvElement.innerHTML = "FV = " + FV;
            break;
        case "due":
            pvElement.innerHTML = "PV<sub>due</sub> = " + PV;
            fvElement.innerHTML = "FV<sub>due</sub> = " + FV;
            break;
        default:
            console.log("Error: Annuity type is not set.");
            return null;
    }
}

function setFormula(annuityType) {
    let pvOrdinary = document.getElementById("formula-pv-ordinary");
    let fvOrdinary = document.getElementById("formula-fv-ordinary");
    let pvDue = document.getElementById("formula-pv-due");
    let fvDue = document.getElementById("formula-fv-due");
    switch (annuityType) {
        case "ordinary":
            pvOrdinary.classList.remove("d-none");
            fvOrdinary.classList.remove("d-none");
            pvDue.classList.add("d-none");
            fvDue.classList.add("d-none");
            break;
        case "due":
            pvOrdinary.classList.add("d-none");
            fvOrdinary.classList.add("d-none");
            pvDue.classList.remove("d-none");
            fvDue.classList.remove("d-none");
    }
}

function getNumberInput(elementId) {
    return Number(document.getElementById(elementId).value);
}

function getStringInput(elementId) {
    return String(document.getElementById(elementId).value);
}
