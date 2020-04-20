const newDrugButton = document.querySelector("#addNewDrug");
const deleteEntry = document.querySelector("#deleteLastEntry");
const prescription = document.querySelector("#prescription");

newDrugButton.addEventListener("click", function (e) {
    e.preventDefault();
    var num = (0.25 * prescription.childElementCount).toString();
    createNewFormInput("col-md-4", "drug" + num, "Drug", "Paracetamol");
    createNewFormInput("col-md-2", "dosage" + num, "Dosage", "100mg");
    createNewFormInput("col-md-2", "freq" + num, "Frequency", "1-0-0");
    createNewFormInput("col-md-2", "duration" + num, "Duration", "5 days");
});

deleteEntry.addEventListener("click", function (e) {
    e.preventDefault();
    const len = prescription.childElementCount;
    if (len > 4)
        for (let i = len - 1; i >= len - 4; i--)
            prescription.children[i].remove();
});

function createNewFormInput(className, labelFor, labelText, placeholder) {
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

    prescription.appendChild(div);
}