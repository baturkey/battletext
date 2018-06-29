$(document).ready(function(){
    'use strict';
    const range = {
        distance: 0,
        delta: function(diff) {
            return () => {
                if (-diff > this.distance) {
                    $("#enemy").css("transition", "2s").css("transform", "rotateY(180deg)");
                }
                this.distance = Math.abs(this.distance + diff);
                $("#range").html(this.distance);
                $("#enemy").css("fontSize", (-this.distance / 4 + 5) + "rem");
            };
        },
    };

    const battery = {
        energy: 0,
        max: 100,
        delta: function(diff) {
            return () => {
                this.energy += diff;
                $("#battery")
                    .css("width", (this.energy * 100 / this.max) + "%")
                    .html(this.energy)
                    .attr("aria-valuenow", this.energy);
            }
        },
    };

    range.delta(10)();
    battery.delta(10)();

    $("#near").click(range.delta(-1));
    $("#far").click(range.delta(1));

    $("#add").click(battery.delta(1));
    $("#sub").click(battery.delta(-1));
});
