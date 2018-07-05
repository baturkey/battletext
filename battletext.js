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

            $("input[type=radio]").each(function() {
            });
        },
    };

    let weaponSettings = {};

    let playerWeapons = [
        {
            id: 0,
            name: 'Omegaton Missile',
            opts: [
                {
                    id: 1,
                    range: 4,
                    energy: 1,
                },
                {
                    id: 2,
                    range: 5,
                    energy: 2,
                },
            ],
            dmg: 0,
        },
        {
            id: 1,
            name: 'Rivetripper Sword',
            opts: [
                {
                    id: 1,
                    range: 0,
                    energy: 1,
                },
                {
                    id: 2,
                    range: 1,
                    energy: 2,
                },
            ],
            dmg: 1,
        },
        {
            id: 2,
            name: 'Jigglywatt Laser',
            opts: [
                {
                    id: 1,
                    range: 3,
                    energy: 2,
                },
                {
                    id: 2,
                    range: 4,
                    energy: 3,
                },
            ],
            dmg: 2,
        },
    ];

    function populateWeaponList(w) {
        let list = "";

        const dmgMap = ['success', 'warning', 'danger'];

        w.forEach(function(x) {
            list += "<li class='list-group-item d-flex'><h3 class='flex-fill text-" + dmgMap[x.dmg] + "'>" + x.name + "</h3><div class='btn-group btn-group-toggle flex-fill' data-toggle='buttons'>";
            list += "<label class='btn btn-secondary active'><input type='radio' name='weapon_" + x.id + "' id='weapon'" + x.id + "_0' data-energy='0'> Do not fire</label>";
            x.opts.forEach(function(opt) {
                list += "<label class='btn btn-secondary'><input type='radio' name='weapon_" + x.id + "' id='weapon'" + x.id + "_" + opt.id + "' data-energy='" + opt.energy + "'> " + opt.range + "</label>";
            });
            list += "</div></li>";
        });

        $("#weaponList").html(list);
    }

    populateWeaponList(playerWeapons);

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
