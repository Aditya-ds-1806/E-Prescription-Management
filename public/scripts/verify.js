const status = document.querySelector("#status");
const submit = document.querySelector("#submit");
const spinner = document.querySelector("#spinner");

submit.addEventListener('click', async function (e) {
    e.preventDefault();
    var img = document.getElementById('prsc');
    var base64EncodedImg = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL($('input[type=file]')[0].files[0]);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    status.textContent = "";
    status.classList = "";
    img.setAttribute("src", "");
    spinner.classList.remove('d-none');
    $.ajax({
        type: "POST",
        url: "/verify",
        data: JSON.stringify({
            prscID: $('input')[0].value,
            prescription: base64EncodedImg,
        }),
        contentType: 'application/json',
        processData: false,
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
                win.addEventListener('focus', function () {
                    this.document.write(image.outerHTML);
                    this.document.body.setAttribute('style', 'display: flex; justify-content: center; align-items: center; margin: 0; background-color: #0e0e0e');
                });
                img.setAttribute('src', "data:image/png;base64," + res);
                status.textContent = 'true';
                status.classList.add("text-success");
            }
        }
    });
});
