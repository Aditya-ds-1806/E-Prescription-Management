const downloadButton = document.querySelector("#download");
const prscID = document.querySelector("#prscID").textContent.substring(18);

downloadButton.addEventListener('click', function (e) {
    e.preventDefault();
    var scrollPos = window.scrollY;
    window.scroll(0, 0);
    html2canvas(document.querySelector("article"), {
        x: 300,
        width: 900
    }).then(function (canvas) {
        window.scroll(0, scrollPos);
        var base64EncodedImg = canvas.toDataURL('image/png');
        $.ajax({
            type: "POST",
            url: "/prscImg",
            data: { image: base64EncodedImg, prscID: prscID },
            success: function (res) {
                console.log(res);
                var win = window.open();
                win.location = "/download?id=" + prscID;
            }
        });
    });
});