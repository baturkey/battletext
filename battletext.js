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

            $("input[type=radio]").each((_, e) => {
                if($(e).data('energy') > this.energy) {
                    $(e).attr('disabled', true);
                    $(e).parent().addClass('text-muted');
                } else {
                    $(e).attr('disabled', false);
                    $(e).parent().removeClass('text-muted');
                }
            });
        },
    };

    let weaponSettings = {};

    let player = [
        {
            id: 0,
            name: 'Omegaton Missile',
            type: 'weapons',
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
            type: 'weapons',
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
            type: 'weapons',
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
        {
            id: 3,
            name: 'Walking',
            type: 'movement',
            opts: [
                {
                    id: 1,
                    range: -1,
                    energy: 0,
                },
                {
                    id: 2,
                    range: 1,
                    energy: 0,
                },
                {
                    id: 3,
                    range: 2,
                    energy: 2,
                },
            ]
        },
        {
            id: 4,
            name: 'Chaff',
            type: 'equipment',
            opts: [
                {
                    id: 1,
                    range: 0,
                    energy: 0,
                }
            ]
        },
    ];

    const types = player.reduce((acc, cur) => {
        if (!acc.includes(cur.type)) {
            acc.push(cur.type);
        }
        return acc;
    }, []);

    for (let type of types) {
        $("#loadout").append("<h2>" + type[0].toUpperCase() + type.substr(1) + "</h2><ul id='" + type + "List' class='list-group'></ul>");
    }

    const dmgMap = ['success', 'warning', 'danger'];

    for (let x of player) {
        let list = "<li class='list-group-item d-flex'><h3 class='flex-fill text-" + dmgMap[x.dmg] + "'>" + x.name + "</h3><div class='btn-group btn-group-toggle flex-fill' data-toggle='buttons'>";
        list += "<label class='btn btn-secondary active'><input type='radio' name='weapon_" + x.id + "' id='weapon'" + x.id + "_0' data-energy='0' checked> Hold</label>";
        for (let opt of x.opts) {
            list += "<label class='btn btn-secondary'><input type='radio' name='weapon_" + x.id + "' id='weapon'" + x.id + "_" + opt.id + "' data-energy='" + opt.energy + "'> " + opt.range + "</label>";
        }
        list += "</div></li>";
        $("#" + x.type + "List").append(list);
    }

    $("input[type=radio]:checked").each(function() {
        weaponSettings[$(this).attr("name")] = $(this).data("energy");
    });

    $("input[type=radio]").change(function(e) {
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
