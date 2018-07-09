$(document).ready(function(){
    'use strict';

    /** Tracks distance between player and enemy */
    const range = {
        distance: 0,
        delta: function(diff) {
            if (-diff > this.distance) {
                $("#enemy").css("transition", "2s").css("transform", "rotateY(180deg)");
            }
            this.distance = Math.abs(this.distance + diff);
            $("#range").html(this.distance);
            $("#enemy").css("fontSize", (-this.distance / 5 + 4) + "rem");
        },
    };

    /** Tracks player's battery power */
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

    const weaponSettings = {};

    const player = {
        equipment: [
            {
                id: 0,
                name: 'Omegaton Missile',
                opts: [
                    {
                        id: 1,
                        range: 4,
                        energy: 0,
                        fast: false,
                        effect: [
                            {
                                range: 3,
                                dmg: 1,
                            },
                            {
                                range: 4,
                                dmg: 3,
                            },
                            {
                                range: 5,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 2,
                        range: 5,
                        energy: 0,
                        fast: false,
                        effect: [
                            {
                                range: 4,
                                dmg: 1,
                            },
                            {
                                range: 5,
                                dmg: 3,
                            },
                            {
                                range: 6,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 3,
                        range: 6,
                        energy: 0,
                        fast: false,
                        effect: [
                            {
                                range: 5,
                                dmg: 1,
                            },
                            {
                                range: 6,
                                dmg: 3,
                            },
                            {
                                range: 7,
                                dmg: 1,
                            },
                        ],
                    },
                ],
                ammo: 5,
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
                        fast: true,
                        effect: [
                            {
                                range: 0,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 2,
                        range: 1,
                        energy: 2,
                        fast: false,
                        effect: [
                            {
                                range: 1,
                                dmg: 1,
                            },
                        ],
                    },
                ],
                dmg: 0,
            },
            {
                id: 2,
                name: 'Jigglywatt Laser',
                opts: [
                    {
                        id: 1,
                        range: 1,
                        energy: 1,
                        fast: true,
                        effect: [
                            {
                                range: 1,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 2,
                        range: 2,
                        energy: 1,
                        fast: true,
                        effect: [
                            {
                                range: 2,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 3,
                        range: 3,
                        energy: 2,
                        fast: true,
                        effect: [
                            {
                                range: 3,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 4,
                        range: 4,
                        energy: 3,
                        fast: true,
                        effect: [
                            {
                                range: 4,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 5,
                        range: 5,
                        energy: 5,
                        fast: true,
                        effect: [
                            {
                                range: 5,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 6,
                        range: 6,
                        energy: 8,
                        fast: true,
                        effect: [
                            {
                                range: 6,
                                dmg: 1,
                            },
                        ],
                    },
                    {
                        id: 7,
                        range: 7,
                        energy: 13,
                        fast: true,
                        effect: [
                            {
                                range: 7,
                                dmg: 1,
                            },
                        ],
                    },
                ],
                dmg: 0,
            },
            {
                id: 4,
                name: 'Massive Armor Plating',
                dmg: 0,
            },
            {
                id: 5,
                name: 'Massive Armor Plating',
                dmg: 0,
            },
        ],
        movement: [
            {
                id: 3,
                name: 'Walking',
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
        ],
    };

    const enemy = {
        name: "PUNCH-BOT",
        equipment: [
            {
                id: 0,
                name: 'Right Hand',
                dmg: 0,
            },
            {
                id: 1,
                name: 'Left Hand',
                dmg: 0,
            },
            {
                id: 2,
                name: 'Gripping Hand',
                dmg: 0,
            },
            {
                id: 3,
                name: 'Poking Hand',
                dmg: 0,
            },
            {
                id: 4,
                name: 'Massive Armor Plating',
                dmg: 0,
            }
        ],
        limbs: [
            "}=H",
            "H={",
            "}=H",
            "H={",
        ],
    };

    function addDmg(list) {
        list[Math.floor(Math.random() * list.length)].dmg++;
        return list.filter(l => l.dmg < 3);
    }

    function datify(opt) {
        let output = [];
        for (let key of Object.keys(opt)) {
            if (key == "effect") {
                for (let dmg of opt[key]) {
                    output.push("data-dmg-" + dmg.range + "=" + dmg.dmg);
                }
            } else {
                output.push("data-" + key + "='" + opt[key] + "'");
            }
        }
        return output.join(" ");
    }

    function redraw() {
        const dmgMap = ['success', 'warning', 'danger'];

        for (let type of Object.keys(player)) {
            $("#" + type + "List").html('');
            for (let itemIndex in player[type]) {
                const item = player[type][itemIndex];
                let list = "<li class='list-group-item d-flex'><h3 class='flex-fill text-" + dmgMap[item.dmg] + "'>" + item.name;
                if (typeof item.ammo == 'number') {
                    list += " <span class='badge badge-pill badge-dark'>" + item.ammo + "</span>";
                }
                list += "</h3>";

                if (item.opts && (typeof item.ammo != 'number' || item.ammo > 0)) {
                    list += "<div class='btn-group btn-group-toggle flex-fill' data-toggle='buttons'>";
                    list += "<label class='btn btn-secondary active'><input type='radio' name='" + item.type + "_" + item.id + "' id='" + item.type + "'" + item.id + "_0' data-energy='0' checked> Hold</label>";
                    for (let opt of item.opts) {
                        if (!opt.fast || opt.range == range.distance) {
                            list += "<label class='btn btn-secondary'><input type='radio' name='" + item.type + "_" + item.id + "' id='" + item.type + "_" + item.id + "_" + opt.id + "' " + datify(opt) + " data-ammo='" + itemIndex + "'> " + opt.range + "</label>";
                        }
                    }
                    list += "</div>";
                }
                list += "</li>";
                $("#" + type + "List").append(list);
            }
        }

        for (let limbno in enemy.limbs) {
            $("#enemy" + limbno).html("   ");
        }

        $("#enemyList").html("");
        for (let weapon of enemy.equipment) {
            if (weapon.id < enemy.limbs.length) {
                $("#enemy" + weapon.id)
                    .removeClass()
                    .addClass("d-inline")
                    .addClass("text-" + dmgMap[weapon.dmg])
                    .html(enemy.limbs[weapon.id]);
            }
            $("#enemyList").append("<li class='list-group-item text-" + dmgMap[weapon.dmg] + "'>" + weapon.name + "</li>");
        }

        $("input[type=radio]:checked").each(function() {
            weaponSettings[$(this).attr("name")] = $(this).data("energy");
        });

        $("input[type=radio]").change(function() {
            battery.delta(weaponSettings[$(this).attr("name")] - $(this).data("energy"));
            weaponSettings[$(this).attr("name")] = $(this).data("energy");
        });
    }

    $("#doit").click(function() {
        const diff = Math.floor(Math.random() * 4) - 3;
        const newdistance = range.distance + diff;

        /* Player actions */
        $("input[type=radio]:checked").each(function() {
            if (typeof $(this).data('ammo') == 'number') {
                player.equipment[$(this).data('ammo')].ammo--;
            }
            if ($(this).attr('name').substr(0, 7) == "weapons") {
                if ($(this).data("fast") && $(this).data("dmg-" + range.distance)) {
                    console.log("fast hit");
                    enemy.equipment = addDmg(enemy.equipment);
                } else if (!$(this).data("fast") && $(this).data("dmg-" + newdistance)) {
                    console.log("slow hit");
                    enemy.equipment = addDmg(enemy.equipment);
                } else {
                    console.log("miss");
                }
            }
        });

        /* AI Actions */
        player.equipment = addDmg(player.equipment);

        /* Check for game end */
        if (enemy.length == 0) {
            alert('hooray');
        }

        /* Begin next turn */
        range.delta(diff);
        battery.delta(5);

        redraw();
    });

    /* Set up new game */
    $('[data-toggle="tooltip"]').tooltip();

    for (let type of Object.keys(player)) {
        $("#loadout").append("<h2>" + type[0].toUpperCase() + type.substr(1) + "</h2><ul id='" + type + "List' class='list-group'></ul>");
    }

    $("#enemyName").html(enemy.name);

    redraw();

    range.delta(10);
    battery.delta(10);
});
