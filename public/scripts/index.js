const newDrugButton = document.querySelector("#addNewDrug");
const deleteEntry = document.querySelector("#deleteLastEntry");
const prescription = document.querySelector("#prescription");

window.onload = generateNewRow;

newDrugButton.addEventListener("click", generateNewRow);

deleteEntry.addEventListener("click", function (e) {
    e.preventDefault();
    const len = prescription.childElementCount;
    if (len > 2) {
        prescription.children[len - 1].remove();
        prescription.children[len - 2].remove();
    }
});

function generateNewRow(e) {
    e.preventDefault();
    var row = document.createElement('div');
    var num;
    row.classList.add("form-row");
    row.classList.add("justify-content-between");
    row.classList.add("mb-1");
    prescription.appendChild(row);
    num = (0.5 * (prescription.childElementCount - 1)).toString();
    var line = document.createElement("hr");
    line.classList.add("border-primary");

    createNewFormInput(row, "col-md-4", "drug" + num, "Drug", "Paracetamol");
    createNewFormInput(row, "col-md-2", "dosage" + num, "Dosage", "100mg");
    createNewFormInput(row, "col-md-2", "freq" + num, "Frequency", "1-0-0");
    createNewFormInput(row, "col-md-2", "duration" + num, "Duration", "5 days");
    prescription.appendChild(line);
}

function createNewFormInput(parent, className, labelFor, labelText, placeholder) {
    var div = document.createElement("div");
    var label = document.createElement("label");
    var input = document.createElement("input");

    label.setAttribute("for", labelFor);
    label.textContent = labelText;

    input.setAttribute("type", "text");
    input.setAttribute("id", labelFor);
    input.setAttribute("name", labelFor);
    input.setAttribute("placeholder", placeholder);
    input.classList.add("form-control");

    div.classList.add("form-group", className);
    div.appendChild(label);
    div.appendChild(input);

    parent.appendChild(div);
}