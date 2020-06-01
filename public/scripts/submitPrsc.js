const downloadButton = document.querySelector("#download");
const spinner = document.querySelector("#spinner");
const prscID = document.querySelector("#prscID").textContent.substring(18);

downloadButton.addEventListener('click', async function (e) {
    e.preventDefault();
    spinner.classList.remove('d-none');
    var scrollPos = window.scrollY;
    window.scroll(0, 0);
    var canvas = await html2canvas(document.querySelector("article")).catch(err => console.error(err));
    window.scroll(0, scrollPos);
    var base64EncodedImg = canvas.toDataURL('image/png');
    $.ajax({
        type: "POST",
        url: "/prscImg",
        data: { image: base64EncodedImg, prscID: prscID },
        success: function (res) {
            spinner.classList.add('d-none');
            console.log(res);
            var win = window.open();
            win.location = "/download?id=" + prscID;
        }
    });
});