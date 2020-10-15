/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2020 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
It also contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
var splashObj = function(parent){
	var self = this;
	self.parent = parent;
	this.setEvents = function(){
		self.parent.initDetails('heartage-page-splash');
		$('#heartage-start-btn').on('click',function(e){
			e.preventDefault();
			self.parent.nav('form')
			self.parent.page+=1
			if(typeof _satellite != 'undefined' && self.parent.config.adobe_analytics && self.parent.config.adobe_state <1){
				self.parent.config.adobe_state = 1
				_satellite.track("tool_start", {
					toolName: self.parent.config.tool_name,
					toolCategory: self.parent.config.tool_cat
				})
			}
			self.parent.analyticsObj.antbitsLog(true,0);
		})
	}
}