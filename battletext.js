$(document).ready(function(){
    'use strict';

    $('[data-toggle="tooltip"]').tooltip();

    const range = {
        distance: 0,
        delta: function(diff) {
            if (-diff > this.distance) {
                $("#enemy").css("transition", "2s").css("transform", "rotateY(180deg)");
            }
            this.distance = Math.abs(this.distance + diff);
            $("#range").html(this.distance);
            $("#enemy").css("fontSize", (-this.distance / 4 + 5) + "rem");
        },
    };

    const battery = {
        energy: 0,
        max: 100,
        delta: function(diff) {
            this.energy += diff;
            $("#battery")
                .css("width", (this.energy * 100 / this.max) + "%")
                .html(this.energy)
                .attr("aria-valuenow", this.energy);
        },
    };

    let weaponSettings = {};

    $("input[type=radio]:checked").each(function() {
        weaponSettings[$(this).attr("name")] = $(this).data("energy");
    });

    $("input[type=radio]").change(function(e) {
        console.log($(this).data("energy"), $(this).attr("name"), weaponSettings);
        battery.delta(weaponSettings[$(this).attr("name")] - $(this).data("energy"));
        weaponSettings[$(this).attr("name")] = $(this).data("energy");
    });

    range.delta(10);
    battery.delta(10);

    $("#doit").click(function() {
        $("input[type=radio]:checked").each(function() {
            console.log(this);
        });

        range.delta(Math.floor(Math.random() * 4) - 3);
    });
});
