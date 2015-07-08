/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
function Q65_male_cvd(){
	var self = this
	this.cvd = function(form_data){
		for(var i in form_data){
			eval('var '+i+' = '+form_data[i])
		}
		var a;
		var bmi_1;
		var Iethrisk = new Array(
			0,
			0,
			0.4035656542786645300000000,
			0.7159343574607238700000000,
			0.7588068966921870400000000,
			0.2778257996405138500000000,
			-0.3383277413537653700000000,
			-0.3626891973109574500000000,
			-0.2406220118164148500000000,
			-0.1055741084408314400000000
		);
		var Ismoke = new Array(
			0,
			0.1655389770495527800000000,
			0.3227167436634277900000000,
			0.4393091679622852500000000,
			0.5830168090609184600000000
		);
		a=0;
		a += Iethrisk[ethrisk];
		a += Ismoke[smoke_cat];
		a += (Math.log(bmi/10) - 0.967572152614594) * 0.4325953310683352500000000;
		a += (rati - 4.439734935760498) * 0.1616093175199347100000000;
		a += (sbp - 133.265686035156250) * 0.0051706475575211365000000;
		a += (town + 0.164980158209801) * 0.0118372789415412600000000;
		a += b_AF * 0.4871573476846625100000000;
		a += b_ra * 0.3165460738113234400000000;
		a += b_renal * 0.4665323499934942400000000;
		a += b_treatedhyp * 0.3146452536778831000000000;
		a += b_type2 * 0.4700445024972483300000000;
		a += fh_cvd * 0.6101222792348441900000000;
		return a;
	}
}