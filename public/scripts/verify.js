const status = document.querySelector("#status");
const submit = document.querySelector("#submit");
const spinner = document.querySelector("#spinner");

submit.addEventListener('click', function (e) {
    e.preventDefault();
    status.textContent = "";
    status.classList = "";
    spinner.classList.remove('d-none');
    var formData = new FormData();
    formData.append("prescription", $('input[type=file]')[0].files[0]);
    formData.append("prscID", $('input')[0].value);
    $.ajax({
        type: "POST",
        url: "/verify",
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        success: function (res) {
            spinner.classList.add('d-none');
            status.textContent = res;
            if (!res) status.classList.add("text-danger")
            else status.classList.add("text-success");
        }
    });
});