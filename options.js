$("input.cb").on("change", function () {
    $("p#status").text("Saving..");
    chrome.storage.sync.set({
        icons: $("input.gm_icons").prop('checked'),
        text: $("input.gm_text").prop('checked')
    }, function () {
        setTimeout(function () {
            $("p#status").text("Settings saved. Please reload your Gmail website");
        }, 2000);
    });
});
$(document).ready(function () {
    chrome.storage.sync.get({
        icons: true,
        text: true
    }, function (items) {
        $("input.gm_icons").prop('checked', items.icons);
        $("input.gm_text").prop('checked', items.text);
    });
});