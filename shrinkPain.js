$(function () {
    let pains = $(".shrink-pain");
    pains.children().children(".pain-head").click(toggleGrow)
});

function toggleGrow(event) {
    let target = $(event.target).closest(".pain");
    let targetBody = target.find(".pain-body");
    let active = target.css("flex-grow");
    if (active == 1) {
        target.css("flex-grow", 0);
        targetBody.hide()
    } else {
        target.css("flex-grow", 1);
        targetBody.show()
    }
}