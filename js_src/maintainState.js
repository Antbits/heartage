/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage
*/
function maintain_state(r){
	var self = this
	var init = false
	var root = r
	self.visits = 0
	self.data = {}
	this.storeState = function(obj){
		self.data = obj
		if(init){
			obj.visits = self.visits
			$.cookie("nhs_heartage",JSON.stringify(obj));
		}
	}
	this.clearState = function (){
		$.removeCookie("nhs_heartage");
		var obj = {'visits':self.visits}
		$.cookie("nhs_heartage",JSON.stringify(obj));
		init = true
	}
	this.restoreState = function(){
		if($.cookie("nhs_heartage") != null){
			self.data = jQuery.parseJSON($.cookie("nhs_heartage"));
			if(!isNaN(parseInt(self.data.visits))){
				self.visits = parseInt(self.data.visits)+1
			}
			if(parseInt(self.data.page) >0){
				root.restoreState(self.data)
			}
		}
		self.clearState();
	}
	this.getData = function(obj){
		var bool_obj = {'yes':1,'no':0}
		obj.v = self.visits
		obj.p = root.analytics_page
		inObj(obj,'smk',self.data.smoke)
		inObj(obj,'eth',self.data.ethnicity)
		if(typeof self.data.dob != 'undefined'){
			obj.age = Math.floor((new Date()-new Date(self.data.dob))/31557600000)
		}
		inObj(obj,'bmi',self.data.bmi)
		if(!isNaN(obj.bmi)){
			obj.bmi = obj.bmi.toFixed(2)
		}
		if(self.data.postcode == "e.g CB10 2PS" || self.data.postcode == ""){
			obj.pc = 0
		}else{
			obj.pc = 1
		}
		inObj(obj,'tn',self.data.townsend_score)
		inObj(obj,'r',self.data.region)
		for(var key in self.data.radio_arr){
			switch(self.data.radio_arr[key].id){
				case 'cholesterol':
					if(self.data.radio_arr[key].val == 'no' || isNaN(parseFloat(self.data.t_cholesterol)) || isNaN(parseFloat(self.data.hdl_cholesterol))){
						obj.ch = 0
					}else{
						obj.ch = (parseFloat(self.data.t_cholesterol)/parseFloat(self.data.hdl_cholesterol)).toFixed(2)
					}
				break;
				case 'bp':
					if(self.data.radio_arr[key].val == 'no' || isNaN(parseInt(self.data.sys_bp))){
						obj.sbp = 0
					}else{
						obj.sbp = parseInt(self.data.sys_bp)
					}
				break;
				case 'gender':
					if(self.data.radio_arr[key].val != null){
						obj[self.data.radio_arr[key].id.slice(0,3)] = self.data.radio_arr[key].val
					}
				break;
				default:
					if(self.data.radio_arr[key].val != null){
						obj[self.data.radio_arr[key].id.slice(0,3)] = bool_obj[self.data.radio_arr[key].val]
					}
				break;
			}
		}
		return obj
	}
}