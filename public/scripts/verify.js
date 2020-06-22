const status = document.querySelector("#status");
const submit = document.querySelector("#submit");
const spinner = document.querySelector("#spinner");

submit.addEventListener('click', function (e) {
    e.preventDefault();
    var img = document.getElementById('prsc');
    var formData = new FormData();
    status.textContent = "";
    status.classList = "";
    img.setAttribute("src", "");
    spinner.classList.remove('d-none');
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
            if (!res) {
                status.textContent = res;
                status.classList.add("text-danger");
            }
            else {
                var win = window.open("");
                var image = new Image();
                image.src = "data:image/png;base64," + res;
                image.setAttribute('style', 'height: 100vmin');
                win.document.write(image.outerHTML);
                win.document.body.setAttribute('style', 'display: flex; justify-content: center; align-items: center; margin: 0; background-color: #0e0e0e');
                img.setAttribute('src', "data:image/png;base64," + res);
                status.textContent = 'true';
                status.classList.add("text-success");
            }
        }
    });
});