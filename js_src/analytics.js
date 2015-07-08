/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage
*/
function analytics(vc,d,o){
	var self = this
	var data = d
	var usr_str = Array('error','New user','Returning user')
	var syn_id = vc.syn_id
	var vals
	var session_log = {'origin':syn_id}
	self.vc = vc
	this.start = function(){
		if(syn_id == 'nhs'){
			dcsMultiTrack('DCSext.tool_name',data.title,'DCSext.tool_cat',data.category,'DCSext.tool_start','1','DCSext.tool_complete','0','WT.dl','100','DCSext.tool_user_status',usr_str[Math.min(self.vc.stateObj.visits,2)],'DCSext.tool_usage',self.vc.stateObj.visits,'DCSext.visit_tool_usage','','WT.si_n',data.title,'WT.si_x','1');	
		}
	}
	this.advance = function(q_num,total){
		if(syn_id == 'nhs'){
			if (q_num==total){	
				dcsMultiTrack('DCSext.tool_name',data.title,'DCSext.tool_cat',data.category,'DCSext.tool_start','','DCSext.tool_complete','1','WT.si_n',data.title,'WT.si_x',q_num,'WT.dl','100','DCSext.tool_user_status','','DCSext.tool_usage','','DCSext.visit_tool_usage','');
			}else{	
				dcsMultiTrack('DCSext.tool_name',data.title,'DCSext.tool_cat',data.category,'DCSext.tool_start','','WT.si_n',data.title,'WT.si_x',q_num,'WT.dl','100','DCSext.tool_user_status','','DCSext.tool_usage','','DCSext.visit_tool_usage','');
			}
		}
	}
	this.antbitsLog = function(){
		session_log = self.vc.form.getData(session_log)
		session_log = self.vc.stateObj.getData(session_log)
		session_log = self.vc.results.getData(session_log)
		session_log.origin = syn_id
		session_log.id = data.id
		session_log.d = self.vc.device
		var output = "//change4life.antbits.com/tracking/tracker.gif?"
		for(var key in session_log){
			output+=key+'='+session_log[key]+'&'
		}
		output = output.slice(0,-1)
		$.ajax({
		  url: output,
		  dataType: 'json',
		  async: false
		});
	}
	window.onbeforeunload = function(){
	  	self.antbitsLog()
	}
}
