const downloadButton = document.querySelector("#download");
const spinner = document.querySelector("#spinner");
const prscID = document.querySelector("#prscID").textContent.substring(18);

downloadButton.addEventListener('click', async function (e) {
    e.preventDefault();
    spinner.classList.remove('d-none');
    var scrollPos = window.scrollY;
    document.body.style.overflowY = 'hidden';
    window.scroll(0, 0);
    var canvas = await html2canvas(document.querySelector("article")).catch(err => console.error(err));
    window.scroll(0, scrollPos);
    document.body.style.overflowY = 'visible';
    var base64EncodedImg = canvas.toDataURL('image/png');
    $.ajax({
        type: "POST",
        url: "/prscImg",
        data: { image: base64EncodedImg, prscID: prscID },
        success: function (res) {
            if (res === 'OK') {
                spinner.classList.add('d-none');
                window.open("/download?id=" + prscID, '_self').close();
            }
        }
    });
});