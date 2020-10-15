/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2020 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
It also contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
function heartageObj(src) {
    var self = this;
    this.lifetimeObj = null
    var statusObj = {
        'status_str': 'Loading lookup data',
        'status': 0,
        'result': null,
        'user_data': null
    };
    this.data = null;
    this.init = function(src) {
        self.loadJSON(function(response) {
            self.lookup_data = JSON.parse(response);
            statusObj.status_str = 'Lookup data loaded';
            statusObj.status = 1;
            self.lifetimeObj = new Q65_lifetime(self.lookup_data);
        }, src);
    }
    this.getStatus = function() {
        return statusObj;
    }
    this.getHeartage = function(data) {
		if (statusObj.status < 1) {
			return statusObj;
		} else {
			statusObj.result = null;
			statusObj.user_data = data;
			statusObj.result = self.lifetimeObj.lifetimeRisk(data)
			statusObj.status_str = 'Result set successfully generated';
			statusObj.status = 2;
			return statusObj;
		}
	}
        // utilities;
    this.loadJSON = function(callback, src) {
            var xobj = new XMLHttpRequest();
            //xobj.overrideMimeType("application/json");// caused failure to load on dev server
            xobj.open('GET', src, true);
            xobj.onreadystatechange = function() {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    callback(xobj.responseText);
                } else {
                    statusObj.status_str = 'Lookup data not found please check src parameter';
                }
            }
            xobj.send(null);;
        }
        // Qrisk gendered routines;
    function Q65_female_cvd(data_obj) {
        for (var i in data_obj) {
            eval('var ' + i + ' = ' + data_obj[i]);
        }
        var a;
        var Iethrisk = new Array(
            0,
            0,
            0.3519781359171325100000000,
            0.7125701233074622800000000,
            0.4744736904914790800000000,
            0.1277734031153024400000000,
            0.0276815264451465880000000, -0.3676643548251001300000000, -0.2636321488403285400000000, -0.0064333267101571784000000
        );
        var Ismoke = new Array(
            0,
            0.1609363217948046300000000,
            0.3282477751045009300000000,
            0.4541679502935254700000000,
            0.6076275665698729300000000
        );
        a = 0;
        a += Iethrisk[ethrisk];
        a += Ismoke[smoke_cat];
        a += (Math.sqrt(bmi / 10) - 1.605074524879456) * 0.2813726290228962300000000;
        a += (rati - 3.705839872360230) * 0.1551217926855477100000000;
        a += (sbp - 129.823593139648440) * 0.0062458135965802464000000;
        a += (town + 0.301369071006775) * 0.0239763590547845720000000;
        a += b_AF * 0.6363540037072725800000000;
        a += b_ra * 0.3607328778130438100000000;
        a += b_renal * 0.5144859684018359100000000;
        a += b_treatedhyp * 0.2825312388249602800000000;
        a += b_type2 * 0.5114309272510256800000000;
        a += fh_cvd * 0.5135507323965317100000000;
        return a;
    }

    function Q65_male_cvd(data_obj) {
        for (var i in data_obj) {
            eval('var ' + i + ' = ' + data_obj[i]);
        }
        var a;
        var bmi_1;
        var Iethrisk = new Array(
            0,
            0,
            0.4035656542786645300000000,
            0.7159343574607238700000000,
            0.7588068966921870400000000,
            0.2778257996405138500000000, -0.3383277413537653700000000, -0.3626891973109574500000000, -0.2406220118164148500000000, -0.1055741084408314400000000
        );
        var Ismoke = new Array(
            0,
            0.1655389770495527800000000,
            0.3227167436634277900000000,
            0.4393091679622852500000000,
            0.5830168090609184600000000
        );
        a = 0;
        a += Iethrisk[ethrisk];
        a += Ismoke[smoke_cat];
        a += (Math.log(bmi / 10) - 0.967572152614594) * 0.4325953310683352500000000;
        a += (rati - 4.439734935760498) * 0.1616093175199347100000000;
        a += (sbp - 133.265686035156250) * 0.0051706475575211365000000;
        a += (town + 0.164980158209801) * 0.0118372789415412600000000;
        a += b_AF * 0.4871573476846625100000000;
        a += b_ra * 0.3165460738113234400000000;
        a += b_renal * 0.4665323499934942400000000;
        a += b_treatedhyp * 0.3146452536778831000000000;
        a += b_type2 * 0.4700445024972483300000000;
        a += fh_cvd * 0.6101222792348441900000000;
		//console.log('MALE cvd = '+a)
        return a;
    }

    function Q65_female_death(data_obj) {
        for (var i in data_obj) {
            eval('var ' + i + ' = ' + data_obj[i]);
        }
        var a;
        var bmi_1;
        var Iethrisk = new Array(
            0,
            0, -0.7691412217114335100000000, -0.4813884489809012200000000, -0.6649693187337454300000000, -0.9806514018090445300000000, -0.7665687475367323200000000, -0.3079908452168220200000000, -1.1084520766868413000000000, -0.9729355194482460800000000
        );
        var Ismoke = new Array(
            0,
            0.2343310901409800500000000,
            0.5870690502658261200000000,
            0.7964460203072020200000000,
            1.0533145224303277000000000
        );
        var dbmi = bmi;
        dbmi = dbmi / 10;
        bmi_1 = Math.pow(dbmi, .5);
        a = 0;
        a += Iethrisk[ethrisk];
        a += Ismoke[smoke_cat];
        a += (Math.sqrt(bmi / 10) - 1.605074524879456) * -0.1081416642130314200000000;
        a += (rati - 3.705839872360230) * 0.0273178320909109660000000;
        a += (sbp - 129.823593139648440) * -0.0008337937584279265700000;
        a += (town + 0.301369071006775) * 0.0366304184773099120000000;
        a += b_AF * 0.5484061247122409300000000;
        a += b_ra * 0.4667078978482423500000000;
        a += b_renal * 1.0288138959180866000000000;
        a += b_treatedhyp * -0.0500562994738190240000000;
        a += b_type2 * 0.6543819525425483800000000;
        a += fh_cvd * -0.4629154246984292800000000;
        return a;
    }

    function Q65_male_death(data_obj) {
        for (var i in data_obj) {
            eval('var ' + i + ' = ' + data_obj[i]);
        }
        var a;
        var Iethrisk = new Array(
            0,
            0, -0.7959493840935216700000000, -0.8983542916653508600000000, -0.8464836394282484500000000, -1.3907364202494530000000000, -0.7939585494106227200000000, -0.6696772151327180500000000, -1.3074649266863319000000000, -1.0983395480170892000000000
        );
        var Ismoke = new Array(
            0,
            0.2306667408386281800000000,
            0.5716670855343914900000000,
            0.7849316319893276900000000,
            1.0119244230108204000000000
        );
        a = 0;
        a += Iethrisk[ethrisk];
        a += Ismoke[smoke_cat];
        a += (Math.log(bmi / 10) - 0.967572152614594) * -0.4077463700204617700000000;
        a += (rati - 4.439734935760498) * -0.0137508433127115260000000;
        a += (sbp - 133.265686035156250) * 0.0005828619709622257200000;
        a += (town + 0.164980158209801) * 0.0509394028862269410000000;
        a += b_AF * 0.4141766179931511400000000;
        a += b_ra * 0.4757132805164633300000000;
        a += b_renal * 0.8498597130356305700000000;
        a += b_treatedhyp * 0.0722059208073983630000000;
        a += b_type2 * 0.4918060293979553700000000;
        a += fh_cvd * -0.3664212379436541700000000;
        return a;
    };
    // main lifetime object
    function Q65_lifetime(lookup_data) {
        var self = this;
        var a_cvd_obj_0, a_cvd_obj_1, a_death_obj_0, a_death_obj_1;
        var compare_period = 10;
        var centerings = [{
            bmi: 10 * 1.605074524879456 * 1.605074524879456,
            rati: 3.5,
            sbp: 120,
            town: -0.301369071006775
        }, {
            bmi: 10 * Math.exp(0.967572152614594),
            rati: 3.5,
            sbp: 120,
            town: -0.164980158209801
        }];
        this.lookup = lookup_data;
        this.find_biggest_t_below_number_in_array = function(number, array, arrayNumberOfRows) {
            var i;
            var found = 0;
            if (array._t[0] >= number) {
                return -2;
            }
            for (i = 0; i < arrayNumberOfRows; i++) {
                if (array._t[i] >= number) {
                    found = 1;
                    break;
                }
            }
            if (found) {
                i--;
            } else {
                i = -1;
            }
            return (i);
        }
        this.produceLifetimeRiskTable = function(timeTable, from, to, a_cvd, a_death, sex, followupYear) {
            var resultArray = new Array();
            var annualRiskTable = new Array();
            var annualRiskTable_int = new Array();
            var sage = 30;
            var lage = 95;
            var timeTableIndex = from;;
            var exp_a_cvd = Math.exp(a_cvd);
            var exp_a_death = Math.exp(a_death);
            var t0 = Math.round(timeTable[timeTableIndex][0]);
            var lastRow;
            var newRow;
            var lastRow_int;
            var newRow_int;
            var nYearRisk = 0;
            var t = t0 - 1;
            var sum_e_int = 0;
            for (var i = 0; i <= (timeTable.length - from - 2); i++) {
                var baseHazard = {
                    "death": timeTable[timeTableIndex][1] * exp_a_death,
                    "cvd": timeTable[timeTableIndex][2] * exp_a_cvd
                }
                var baseHazard_int = {
                    "death": timeTable[timeTableIndex][1] * exp_a_death,
                    "cvd": timeTable[timeTableIndex][2] * exp_a_cvd
                }
                if (i == 0) {
                    lastRow = new LifetimeRiskRow(
                        1 - baseHazard.cvd - baseHazard.death,
                        baseHazard.cvd,
                        baseHazard.death,
                        1 - baseHazard.cvd,
                        baseHazard.cvd
                    );
                    lastRow_int = new LifetimeRiskRow(
                        1 - baseHazard_int.cvd - baseHazard_int.death,
                        baseHazard_int.cvd,
                        baseHazard_int.death,
                        1 - baseHazard_int.cvd,
                        baseHazard_int.cvd
                    );
                } else {
                    newRow = new LifetimeRiskRow(
                        lastRow.S_1 * (1 - baseHazard.cvd - baseHazard.death),
                        lastRow.cif_cvd + lastRow.S_1 * baseHazard.cvd,
                        lastRow.cif_death + lastRow.S_1 * baseHazard.death,
                        lastRow.S_noDeath * (1 - baseHazard.cvd),
                        lastRow.cvd_noDeath + lastRow.S_noDeath * baseHazard.cvd
                    );
                    newRow_int = new LifetimeRiskRow(
                        lastRow_int.S_1 * (1 - baseHazard_int.cvd - baseHazard_int.death),
                        lastRow_int.cif_cvd + lastRow_int.S_1 * baseHazard_int.cvd,
                        lastRow_int.cif_death + lastRow_int.S_1 * baseHazard_int.death,
                        lastRow_int.S_noDeath * (1 - baseHazard_int.cvd),
                        lastRow_int.cvd_noDeath + lastRow_int.S_noDeath * baseHazard_int.cvd
                    );
                    lastRow = newRow;
                    lastRow_int = newRow_int;
                }
                t1 = Math.floor(timeTable[timeTableIndex][0]);
                if (t1 > t) {
                    t = t1;
                    annualRiskTable.push(lastRow);
                    annualRiskTable_int.push(lastRow_int);
                };
                if (t >= followupYear - 1) {;
                    nYearRisk = lastRow.cif_cvd;
                }
				
                timeTableIndex++;
            }
            annualRiskTable.push(lastRow);
            annualRiskTable_int.push(lastRow_int);
            for (i = 0; i < annualRiskTable.length; i++) {
                sum_e_int += 100 * annualRiskTable[i].S_1;
            }
            return {
                "life": (sum_e_int / 100),
                "annualRiskTable_int": annualRiskTable_int,
                "annualRiskTable": annualRiskTable,
                "nYearRisk": nYearRisk,
                "hazard": self.getNoDeathHazardAt(annualRiskTable, 0)
            }
        }
        this.produceLifetimeRiskTable_int = function(timeTable, from, to, a_cvd, a_death, sex, followupYear) {
            var timeTableIndex = from;
            var timeTableIndex_int = from;
            var t0 = parseInt(timeTable[timeTableIndex][0]);
            var t0_int = parseInt(timeTable[timeTableIndex][0]);
            var annualRiskTable = new Array();
            var annualRiskTable_int = new Array();
            var lastRow, lastRow_int, newRow, newRow_int;
            var nYearRisk = 0;
            var exp_a_cvd = Math.exp(a_cvd);
            var exp_a_death = Math.exp(a_death);
            var t = t0 - 1;
            var f = from;
            for (i = f - from; i < (timeTable.length - from - 2); f++, i++) {;
                var baseHazard = {
                    "death": timeTable[timeTableIndex][1] * exp_a_death,
                    "cvd": timeTable[timeTableIndex][2] * exp_a_cvd
                }
                var baseHazard_int = {
                    "death": timeTable[timeTableIndex][1] * exp_a_death,
                    "cvd": timeTable[timeTableIndex][2] * exp_a_cvd
                }
                if (i == 0) {
                    lastRow = new LifetimeRiskRow(
                        1 - baseHazard.cvd - baseHazard.death,
                        baseHazard.cvd,
                        baseHazard.death,
                        1 - baseHazard.cvd,
                        baseHazard.cvd
                    );
                    lastRow_int = new LifetimeRiskRow(
                        1 - baseHazard_int.cvd - baseHazard_int.death,
                        baseHazard_int.cvd,
                        baseHazard_int.death,
                        1 - baseHazard_int.cvd,
                        baseHazard_int.cvd
                    );
                } else {
                    newRow = new LifetimeRiskRow(
                        lastRow.S_1 * (1 - baseHazard.cvd - baseHazard.death),
                        lastRow.cif_cvd + lastRow.S_1 * baseHazard.cvd,
                        lastRow.cif_death + lastRow.S_1 * baseHazard.death,
                        lastRow.S_noDeath * (1 - baseHazard.cvd),
                        lastRow.cvd_noDeath + lastRow.S_noDeath * baseHazard.cvd
                    );
                    newRow_int = new LifetimeRiskRow(
                        lastRow_int.S_1 * (1 - baseHazard_int.cvd - baseHazard_int.death),
                        lastRow_int.cif_cvd + lastRow_int.S_1 * baseHazard_int.cvd,
                        lastRow_int.cif_death + lastRow_int.S_1 * baseHazard_int.death,
                        lastRow_int.S_noDeath * (1 - baseHazard_int.cvd),
                        lastRow_int.cvd_noDeath + lastRow_int.S_noDeath * baseHazard_int.cvd
                    );
                    lastRow = newRow;
                    lastRow_int = newRow_int;
                }
                t1 = Math.floor(timeTable[timeTableIndex][0]);
                if (t1 > t) {
                    t = t1;
                    annualRiskTable.push(lastRow);
                    annualRiskTable_int.push(lastRow_int);
                }
                if (t >= followupYear - 1) {
                    nYearRisk = lastRow.cif_cvd;
                }
                timeTableIndex++;
            }
            annualRiskTable.push(lastRow);
            annualRiskTable_int.push(lastRow_int);;
            // set summary result;
            return {
                "annualRiskTable_int": annualRiskTable_int,
                "annualRiskTable": annualRiskTable,
                "nYearRisk": nYearRisk,
                "hazard": self.getNoDeathHazardAt(annualRiskTable, 0)
            }
        }
        this.getNoDeathHazardAt = function(rows, index) {
            index = Math.min(index, rows.length - 2);
            if (index < 0) {
                return 0;
            } else {
				
                return (rows[index + 1].cvd_noDeath - rows[index].cvd_noDeath) / rows[index].S_noDeath;
            }
        }
        this.lifetimeRisk = function(user_data) {
            var cage = user_data.age;
            var sex = user_data.gender;
            var noOfFollowupYears = compare_period;
            var startRow, baseArray, finishRow, resultArraySize, lifetimeRisk, followupIndex, nYearRisk, followupRow, a_cvd, a_death, timeTable, arrayNumberOfRows, resultArray, last, base_data, life;
            if (sex == 0) {
                a_cvd = Q65_female_cvd(user_data);
                a_death = Q65_female_death(user_data);
                timeTableRaw = self.lookup.female;
                arrayNumberOfRows = self.lookup.female._t.length;
            } else {
                a_cvd = Q65_male_cvd(user_data);
                a_death = Q65_male_death(user_data);
                timeTableRaw = self.lookup.male;
                arrayNumberOfRows = self.lookup.male._t.length;
            };
			
            var possibly_younger = false;
            var sage = 30;
            var lage = 95;
            var heartage = cage - 1;
            var baseResult, baseResult_int, userResult, userResult_int;
            var timeTable = new Array();
            for (var i = 0; i <= timeTableRaw._t.length; i++) {
                timeTable.push([timeTableRaw._t[i], timeTableRaw.basehaz_death_0_30[i], timeTableRaw.basehaz_cvd_0_30[i]]);
            };
            startRow = Math.max(0, self.find_biggest_t_below_number_in_array(cage - sage, timeTableRaw, arrayNumberOfRows) + 1);
            finishRow = arrayNumberOfRows - 1;
            resultArraySize = finishRow - startRow;
            userResult = self.produceLifetimeRiskTable(timeTable, startRow, finishRow, a_cvd, a_death, sex, lage - sage);
            life = (cage + userResult.life);
            userResult_int = self.produceLifetimeRiskTable_int(timeTable, startRow, finishRow, a_cvd, a_death, sex, lage - sage);
			
            followupIndex = cage - sage + noOfFollowupYears;
            base_data = {};
            base_data.town = centerings[sex].town;
            base_data.bmi = centerings[sex].bmi;
            base_data.sbp = centerings[sex].sbp;
            base_data.rati = centerings[sex].rati;
            base_data.ethrisk = user_data.ethrisk;
            base_data.b_type1 = false;
            base_data.b_type2 = false;
            base_data.b_AF = false;
            base_data.b_ra = false;
            base_data.b_renal = false;
            base_data.b_treatedhyp = false;
            base_data.fh_cvd = false;
            base_data.smoke_cat = 0;
            base_data.surv = noOfFollowupYears;
            if (sex == 0) {
                a_cvd = Q65_female_cvd(base_data);
                a_death = Q65_female_death(base_data);
            } else {
                a_cvd = Q65_male_cvd(base_data);
                a_death = Q65_male_death(base_data);
            };
            baseResult = self.produceLifetimeRiskTable(timeTable, startRow, finishRow, a_cvd, a_death, sex, lage - sage);
            for (var i in baseResult.annualRiskTable_int) {
                if (self.getNoDeathHazardAt(baseResult.annualRiskTable_int, i) > userResult.hazard) {
                    if (i == 0) {
                        possibly_younger = true;
                    }
					
                    break;
                }
            };
            if (possibly_younger) {
                var d_gp = self.getNoDeathHazardAt(baseResult.annualRiskTable_int, 1) - self.getNoDeathHazardAt(baseResult.annualRiskTable_int, 0);
                var gpHazard = self.getNoDeathHazardAt(baseResult.annualRiskTable_int, 0);
                while ((i > -5) && (gpHazard -= d_gp) > userResult.hazard) {
                    i--;
                }
            } else {
                var myHazard = userResult_int.hazard;
                var h_i = self.getNoDeathHazardAt(baseResult.annualRiskTable_int, i);
                var h_i_1 = self.getNoDeathHazardAt(baseResult.annualRiskTable_int, i - 1);
                if (h_i != h_i_1) {
                    i -= (h_i - myHazard) / (h_i - h_i_1);
                }
            }
            heartage = Math.min(95, Math.round(parseFloat(cage) + parseFloat(i)));
            var compare_index = Math.min(compare_period, userResult.annualRiskTable_int.length - 1);
            return {
                'life': life,
                'heartage': heartage,
                'risk': userResult.hazard,
                '10_yr_risk': Math.round((userResult.annualRiskTable_int[compare_index].cvd_noDeath) * 1000) / 10,
				'nYearRisk': userResult.nYearRisk
            }
        }

        function LifetimeRiskRow(S_1, cif_cvd, cif_death, S_noDeath, cvd_noDeath) {
            this.S_1 = S_1
            this.cif_cvd = cif_cvd
            this.cif_death = cif_death
            this.S_noDeath = S_noDeath
            this.cvd_noDeath = cvd_noDeath
        }
    }
    this.init(src);
}