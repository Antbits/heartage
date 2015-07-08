/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
It also contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
function Q65_lifetime(){
	var self = this
	var then = new Date()
	var genders = Array('female','male')
	var a_cvd_obj_0 = new Q65_female_cvd();
	var a_cvd_obj_1 = new Q65_male_cvd();
	var a_death_obj_0 = new Q65_female_death();
	var a_death_obj_1 = new Q65_male_death();
	var compare_period = 10
	var centerings = [{
			bmi: 10*1.605074524879456*1.605074524879456,	
			rati: 3.5, 
			sbp: 120,
			town: -0.301369071006775		
		},{
			bmi: 10*Math.exp(0.967572152614594),
			rati: 3.5,
			sbp: 120,
			town: -0.164980158209801
		}
	]
	this.lookup = new lookupData();
	this.find_biggest_t_below_number_in_array = function(number,array,arrayNumberOfRows) {
		var i;
		var found=0;
		// First check the first number in the table
		// If that's bigger than the number we seek, return -2
		if (array._t[0] >= number) {
			return -2;
		}
		for (i=0; i< arrayNumberOfRows; i++) {
			if (array._t[i] >= number) {
				found=1;
				break;
			}
		}
		if (found) {
			i--;
		}else {
			i=-1;
		}
		return (i);
	}
	this.produceLifetimeRiskTable = function(timeTable,from,to,a_cvd,a_death,sex,followupYear) {
		var resultArray = new Array();
		var annualRiskTable = new Array();
		var annualRiskTable_int = new Array();
		var sage = 30;
		var lage = 95;
		var timeTableIndex = from; 
		var exp_a_cvd = Math.exp(a_cvd);
		var exp_a_death = Math.exp(a_death);
		var t0 = Math.round(timeTable[timeTableIndex][0])
		var lastRow
		var newRow
		var lastRow_int
		var newRow_int
		var nYearRisk = 0;
		var t = t0-1;
		var sum_e_int = 0
		for(var i=0; i <= (timeTable.length - from -2); i++) {
			var baseHazard = {"death":timeTable[timeTableIndex][1]*exp_a_death,"cvd":timeTable[timeTableIndex][2]*exp_a_cvd};
			var baseHazard_int = {"death":timeTable[timeTableIndex][1]*exp_a_death,"cvd":timeTable[timeTableIndex][2]*exp_a_cvd};
			if(i==0) {
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
			}
			else {
				newRow = new LifetimeRiskRow(
					lastRow.S_1*(1 - baseHazard.cvd - baseHazard.death), 
					lastRow.cif_cvd + lastRow.S_1 * baseHazard.cvd, 
					lastRow.cif_death + lastRow.S_1 * baseHazard.death,
					lastRow.S_noDeath*(1 - baseHazard.cvd),
					lastRow.cvd_noDeath + lastRow.S_noDeath*baseHazard.cvd
				);
				newRow_int = new LifetimeRiskRow(
					lastRow_int.S_1*(1 - baseHazard_int.cvd - baseHazard_int.death), 
					lastRow_int.cif_cvd + lastRow_int.S_1 * baseHazard_int.cvd, 
					lastRow_int.cif_death + lastRow_int.S_1 * baseHazard_int.death,
					lastRow_int.S_noDeath*(1 - baseHazard_int.cvd),
					lastRow_int.cvd_noDeath + lastRow_int.S_noDeath*baseHazard_int.cvd
				);	
				
				lastRow = newRow;
				lastRow_int = newRow_int;
				
				
			}
			t1 = Math.floor(timeTable[timeTableIndex][0])
			if(t1 > t) {
				t = t1;
				annualRiskTable.push(lastRow);
				annualRiskTable_int.push(lastRow_int);
			}
				
			if(t >= followupYear-1){
				
				nYearRisk = lastRow.cif_cvd;
			}
			timeTableIndex++;
		}
		annualRiskTable.push(lastRow);
		annualRiskTable_int.push(lastRow_int);
		for(i =0; i < annualRiskTable.length; i++) {
			sum_e_int += 100*annualRiskTable[i].S_1;
		}
		return {"life":(sum_e_int/100),"annualRiskTable_int":annualRiskTable_int,"annualRiskTable":annualRiskTable,"nYearRisk":nYearRisk,"hazard":self.getNoDeathHazardAt(annualRiskTable,0)}
	}
    this.produceLifetimeRiskTable_int = function(timeTable,from,to,a_cvd,a_death,sex,followupYear)
	{
		var timeTableIndex = from;
		var timeTableIndex_int = from;
		var t0 = parseInt(timeTable[timeTableIndex][0]);
		var t0_int = parseInt(timeTable[timeTableIndex][0]);
		var annualRiskTable = new Array();
		var annualRiskTable_int = new Array();
		var lastRow,lastRow_int,newRow,newRow_int;
		var nYearRisk = 0;	
		var exp_a_cvd = Math.exp(a_cvd);
		var exp_a_death = Math.exp(a_death);
		var t = t0-1;
		var f =from
		for(i=f-from; i < (timeTable.length - from -2); f++, i++) {	
			var baseHazard = {"death":timeTable[timeTableIndex][1]*exp_a_death,"cvd":timeTable[timeTableIndex][2]*exp_a_cvd};
			var baseHazard_int = {"death":timeTable[timeTableIndex][1]*exp_a_death,"cvd":timeTable[timeTableIndex][2]*exp_a_cvd};
			if(i==0) {
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
			}
			else {
				newRow = new LifetimeRiskRow(
					lastRow.S_1*(1 - baseHazard.cvd - baseHazard.death), 
					lastRow.cif_cvd + lastRow.S_1 * baseHazard.cvd, 
					lastRow.cif_death + lastRow.S_1 * baseHazard.death,
					lastRow.S_noDeath*(1 - baseHazard.cvd),
					lastRow.cvd_noDeath + lastRow.S_noDeath*baseHazard.cvd
				);
				newRow_int = new LifetimeRiskRow(
					lastRow_int.S_1*(1 - baseHazard_int.cvd - baseHazard_int.death), 
					lastRow_int.cif_cvd + lastRow_int.S_1 * baseHazard_int.cvd, 
					lastRow_int.cif_death + lastRow_int.S_1 * baseHazard_int.death,
					lastRow_int.S_noDeath*(1 - baseHazard_int.cvd),
					lastRow_int.cvd_noDeath + lastRow_int.S_noDeath*baseHazard_int.cvd
				);
									
				lastRow = newRow;
				lastRow_int = newRow_int;
			}
			
			t1 = Math.floor(timeTable[timeTableIndex][0])
			if(t1 > t) {
				t = t1;
				annualRiskTable.push(lastRow);
				annualRiskTable_int.push(lastRow_int);
			}
			if(t >= followupYear-1){
				nYearRisk = lastRow.cif_cvd;
			}
			timeTableIndex++;
		}
		annualRiskTable.push(lastRow);
		annualRiskTable_int.push(lastRow_int);
		
		// set summary result
		return {"annualRiskTable_int":annualRiskTable_int,"annualRiskTable":annualRiskTable,"nYearRisk":nYearRisk,"hazard":self.getNoDeathHazardAt(annualRiskTable,0)}
	}
	this.getNoDeathHazardAt = function(rows,index){
		index = Math.min(index,rows.length-2)
		if(index < 0){
			return 0
		}else{
			return (rows[index+1].cvd_noDeath - rows[index].cvd_noDeath)/rows[index].S_noDeath;
		}
	}
	this.lifetimeRisk = function(cage,sex,noOfFollowupYears,form_data) {
		var startRow,baseArray,finishRow,resultArraySize,lifetimeRisk,followupIndex,nYearRisk,followupRow,a_cvd,a_death,timeTable,arrayNumberOfRows,resultArray,last,base_data,life
		
		function setParams(){
			if (sex==0) {
				a_cvd = a_cvd_obj_0.cvd(form_data)
				a_death = a_death_obj_0.death(form_data)
				timeTableRaw = self.lookup.female;
				arrayNumberOfRows=self.lookup.female._t.length
			}
			else {
				a_cvd = a_cvd_obj_1.cvd(form_data)
				a_death = a_death_obj_1.death(form_data)
				timeTableRaw = self.lookup.male;
				arrayNumberOfRows=self.lookup.male._t.length
			}
			
		}
		setParams();
		var possibly_younger = false
		var sage=30;
		var lage=95;
		var heartage = cage-1
		var baseResult,baseResult_int,userResult,userResult_int
		var timeTable = new Array()
		for(var i=0; i <= timeTableRaw._t.length; i++) {
			timeTable.push([timeTableRaw._t[i],timeTableRaw.basehaz_death_0_30[i],timeTableRaw.basehaz_cvd_0_30[i]])
		}
		startRow = Math.max(0,self.find_biggest_t_below_number_in_array(cage-sage, timeTableRaw, arrayNumberOfRows)+1);
		finishRow=arrayNumberOfRows-1;
		resultArraySize = finishRow-startRow;
		userResult = self.produceLifetimeRiskTable(timeTable, startRow, finishRow, a_cvd, a_death,sex,lage-sage);
		life = (cage+userResult.life)
		userResult_int = self.produceLifetimeRiskTable_int(timeTable, startRow, finishRow, a_cvd, a_death,sex,lage-sage);
		followupIndex = cage-sage+noOfFollowupYears;
		// heart age time!
		// first set baseline stats
		base_data = {}
		base_data.town = centerings[sex].town
		base_data.bmi = centerings[sex].bmi
		base_data.sbp = centerings[sex].sbp
		base_data.rati = centerings[sex].rati
		base_data.ethrisk = form_data.ethrisk
		base_data.b_type1 = false
		base_data.b_type2 = false
		base_data.b_AF = false
		base_data.b_ra = false
		base_data.b_renal = false
		base_data.b_treatedhyp = false
		base_data.fh_cvd = false
		base_data.smoke_cat = 0
		base_data.surv = noOfFollowupYears
		if (sex==0) {
			a_cvd = a_cvd_obj_0.cvd(base_data)	
			a_death= a_death_obj_0.death(base_data)	
		}else {
			a_cvd = a_cvd_obj_1.cvd(base_data)	
			a_death = a_death_obj_1.death(base_data)
		}
		baseResult = self.produceLifetimeRiskTable(timeTable, startRow, finishRow, a_cvd, a_death,sex,lage-sage);
		for(var i in baseResult.annualRiskTable_int){
			if(self.getNoDeathHazardAt(baseResult.annualRiskTable_int,i) > userResult.hazard){
				if(i==0){
					possibly_younger = true;
				}
				break;
			}
		}
		if(possibly_younger) {
			var d_gp = self.getNoDeathHazardAt(baseResult.annualRiskTable_int,1) - self.getNoDeathHazardAt(baseResult.annualRiskTable_int,0);
			var gpHazard = self.getNoDeathHazardAt(baseResult.annualRiskTable_int,0)
			while((i > -5) && (gpHazard -= d_gp) > userResult.hazard) {
				i--;
			}
		}else{
			// interpolate for better accuracy
			var myHazard = userResult_int.hazard;
			var h_i = self.getNoDeathHazardAt(baseResult.annualRiskTable_int,i);
			var h_i_1 = self.getNoDeathHazardAt(baseResult.annualRiskTable_int,i-1);
			if(h_i != h_i_1){
				i -= (h_i - myHazard)/(h_i - h_i_1);
			}
		}
		heartage = Math.min(95,Math.round(parseFloat(cage)+parseFloat(i)))
		var compare_index = Math.min(compare_period,userResult.annualRiskTable_int.length-1)
		return {'life':life ,'heartage':heartage,'risk':userResult.hazard,'10_yr_risk':Math.round((userResult.annualRiskTable_int[compare_index].cvd_noDeath)*1000)/10};
	}
}