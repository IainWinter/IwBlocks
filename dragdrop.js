let draging;
let halfDragingWidth, halfDragingHeight;

$(function () {
    let blocks = $(".block");
    blocks.mousedown(down);
    $("#code").mouseup(up);
    $("html").mousemove(drag);
});

function down(event) {
    draging = $(event.target).closest(".block").clone();
    halfDragingWidth = draging.width() / 2;
    halfDragingHeight = draging.height() / 2;

    $("#code").append(draging);
    draging.css('position', 'absolute');
}

function drag(event) {
    if (draging) {
        draging.css("left", event.pageX - halfDragingWidth);
        draging.css("top", event.pageY - halfDragingHeight);
        console.log(event.pageX);
        console.log(event.pageY);
    }
}

function up(event) {
    draging = null;
    halfDragingWidth = 0;
    halfDragingHeight = 0;
}