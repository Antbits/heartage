/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
function Q65_female_cvd(){
	var self = this
	this.cvd = function(form_data){
		for(var i in form_data){
			eval('var '+i+' = '+form_data[i])
		}
		var a;
		var Iethrisk = new Array(
			0,
			0,
			0.3519781359171325100000000,
			0.7125701233074622800000000,
			0.4744736904914790800000000,
			0.1277734031153024400000000,
			0.0276815264451465880000000,
			-0.3676643548251001300000000,
			-0.2636321488403285400000000,
			-0.0064333267101571784000000
		);
		var Ismoke = new Array(
			0,
			0.1609363217948046300000000,
			0.3282477751045009300000000,
			0.4541679502935254700000000,
			0.6076275665698729300000000
		);
		a=0;
		a += Iethrisk[ethrisk];
		a += Ismoke[smoke_cat];
		a += (Math.sqrt(bmi/10) - 1.605074524879456) * 0.2813726290228962300000000;
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
}