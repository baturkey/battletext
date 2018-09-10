/* eslint-env jquery */
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
                if($(e).data('energy') && $(e).data('energy') > this.energy) {
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
            /*
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
            */
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
                id: 0,
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
            /*
            {
                id: 4,
                name: 'Massive Armor Plating',
                dmg: 0,
            }
            */
        ],
        limbs: [
            "}=H",
            "H={",
            "}=H",
            "H={",
        ],
        getMovement: function() {
            return -1;
        },
        getWeapons: function() {
            /* AI Actions */
            if (range.distance < 2) {
                for (let weapon of this.equipment) {
                    if (weapon.id < this.limbs.length) {
                        log (this.name + " strikes you with " + weapon.name + "!");
                        player.equipment = addDmg(player.equipment);
                    }
                }
            }
        }
    };

    const instructions = [
        "You are a robot fighting another robot.",
        "Your equipment is listed on the left and your enemy's is listed on the right. The game ends when one robot's equipment is destroyed.",
        "To play, select which weapons you want to fire and how far you want to move. Lasers target the distance between you and the enemy before movement, and missiles target the distance after movement.",
        "Firing missiles uses up ammunition, displayed to the right of the weapon name",
        "Firing lasers uses energy, displayed in the bottom right. Lasers have a limited range so you must move closer to fire them. Lasers use less energy as you get closer. You gain 5 energy a turn.",
    ];

    let turn = 1;

    function addDmg(list) {
        if (!list.length) {
            return [];
        }
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

    function log(s) {
        $("#gameLog").append(s + "<br />");
        var objDiv = document.getElementById("gameLog");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    function gameOver(result) {
        $("#result").html(result);
        $("#endModal").modal("show");
    }

    function printOptions(opts, type, item, itemIndex) {
        let output = "";
        for (let opt of opts) {
            if (!opt.fast || opt.range == range.distance) {
                let title = "Speed: " + (opt.fast ? "Fast" : "Slow") + "\n" + "Energy: " + opt.energy;
                if (opt.effect) {
                    for (let e of opt.effect) {
                        title += "\nRange " + e.range + ": " + e.dmg + " damage";
                    }
                }

                const label = (type == "equipment" ? "Fire at range " : (opt.range < 0 ? "Back " : "Forward ")) + Math.abs(opt.range);
                output += "<label class='btn btn-info' data-toggle='tooltip' title='" + title + "'><input type='radio' name='" + type + "_" + item.id + "' id='" + type + "_" + item.id + "_" + opt.id + "' " + datify(opt) + (typeof item.ammo == 'number' ? " data-ammo='" + itemIndex + "'" : "") + " data-name='" + item.name + "'> " + label + "</label>";
            }
        }
        return output;
    }

    /** Populate the UI */
    function populate() {
        const dmgMap = ['success', 'warning', 'danger'];
        const dmgAdj = ['', 'Lightly Damaged', 'Heavily Damaged'];

        for (let type of Object.keys(player)) {
            $("#" + type + "List").html('');
            for (let itemIndex in player[type]) {
                const item = player[type][itemIndex];
                let list = "<li class='list-group-item d-flex'><b class='flex-fill w-25 text-" + dmgMap[item.dmg] + "'>" + (typeof item.dmg != "undefined" ? dmgAdj[item.dmg] + " " : "") + item.name;
                if (typeof item.ammo == 'number') {
                    list += " <span class='badge badge-pill badge-dark'>" + item.ammo + "</span>";
                }
                list += "</b>";

                if (item.opts && (typeof item.ammo != 'number' || item.ammo > 0)) {
                    list += "<div class='btn-group btn-group-toggle flex-fill w-75' data-toggle='buttons'>";
                    list += printOptions(item.opts.filter(o => o.range < 0), type, item, itemIndex);
                    list += "<label class='btn btn-secondary active' data-toggle='tooltip' title='Do not use'><input type='radio' name='" + type + "_" + item.id + "' id='" + type + "_" + item.id + "_0' data-range='0' data-energy='0' checked> Hold</label>";
                    list += printOptions(item.opts.filter(o => o.range > 0), type, item, itemIndex);
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

        log ("== Turn " + turn++ + " ==");
    }

    $("#doit").click(function() {
        const botMovement = enemy.getMovement();
        const movement = $("input[name=movement_0]:checked")[0];
        const playerMovement = -$(movement).data("range");
        const diff = botMovement + playerMovement;
        const newdistance = range.distance + diff;

        log(enemy.name + " moves " + (botMovement < 0 ? "closer " : "back ") + Math.abs(botMovement) + " space.");
        if (playerMovement) {
            log('You move ' + (playerMovement < 0 ? "closer " : " back") + Math.abs(playerMovement) + " space.");
        }

        /* Player actions */
        $("#equipmentList input[type=radio]:checked").each(function() {
            if (typeof $(this).data('ammo') == 'number') {
                player.equipment[$(this).data('ammo')].ammo--;
            }
            if ($(this).data("fast") && $(this).data("dmg-" + range.distance)) {
                for (let i = 0; i < $(this).data("dmg-" + range.distance); i++) {
                    enemy.equipment = addDmg(enemy.equipment);
                }
                log("Your " + $(this).data("name") + " hits " + enemy.name + "!");
            } else if (!$(this).data("fast") && $(this).data("dmg-" + newdistance)) {
                for (let i = 0; i < $(this).data("dmg-" + newdistance); i++) {
                    enemy.equipment = addDmg(enemy.equipment);
                }
                log("Your " + $(this).data("name") + " hits " + enemy.name + "!");
            } else if ($(this).data("name")) {
                log("Your " + $(this).data("name") + " misses " + enemy.name + "!");
            }
        });

        enemy.getWeapons();

        /* Check for game end */
        if (enemy.equipment.length == 0 && player.equipment.length == 0) {
            gameOver("tied");
        } else if(enemy.equipment.length == 0) {
            gameOver("won");
        } else if(player.equipment.length == 0) {
            gameOver("lost");
        } else {
            /* Begin next turn */
            range.delta(diff);
            battery.delta(5);
            populate();
        }
    });

    /* Set up new game */
    $('[data-toggle="tooltip"]').tooltip();

    for (let type of Object.keys(player)) {
        $("#loadout").append("<h2>" + type[0].toUpperCase() + type.substr(1) + "</h2><ul id='" + type + "List' class='list-group'></ul>");
    }

    $("#enemyName").html(enemy.name);

    $("#playAgain").click(function() {
        window.location.reload(false);
    });

    range.delta(10);
    battery.delta(10);
    populate();
    $(".instructions").each(function(e) {
        $(this).html(instructions.map(s => "<p>" + s + "</p>").join("\n"));
    });
    $("#welcomeModal").modal("show");
});
