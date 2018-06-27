$(document).ready(function(){
    'use strict';
    let range = {
        distance: 0,
        delta: function(diff) {
            return () => {
                this.distance += diff;
                $("#range").html(this.distance);
                $("#enemy").css("fontSize", (-this.distance / 4 + 5) + "rem");
            };
        },
    };

    range.delta(10)();

    $("#doit").click(range.delta(3));
    $("#near").click(range.delta(-1));
    $("#far").click(range.delta(1));
});
