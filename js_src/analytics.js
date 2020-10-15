/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2020 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
It also contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
function analytics(p,d,o){
	var self = this
	var unloaded = false
	var data = d
	var usr_str = Array('error','New user','Returning user')
	var syn_id = p.syn_id
	var vals
	var makeID = function(l){
		var output = "";
		var chars = "123456789ABCDEFG";
		for( var i=0; i < l; i++ )
			output += chars.charAt(Math.floor(Math.random() * chars.length));
	
		return output;
	}
	var session_log = {'origin':syn_id,'journey_id': makeID(16)}
	var parent = p
	this.getLog = function(){
		return session_log;
	}
	this.antbitsLog = function(send,state){
		session_log.state = state;
		session_log = parent.getData(session_log)
		session_log = parent.form.getData(session_log)
		session_log = parent.results.getData(session_log)
		session_log.origin = syn_id
		session_log.id = data.id
		session_log.d = 'desktop'
		if(parent.isMobile.any()){
			session_log.d = 'phone'
		}
		if(send){
			var output = "//preview.antbits.com/tracking/tracker.gif?"
			for(var key in session_log){
				output+=key+'='+session_log[key]+'&'
			}
			output = output.slice(0,-1)
			if(unloaded){
				navigator.sendBeacon("https://preview.antbits.com/tracking/tracker.gif", JSON.stringify(session_log));
			}else{
				$.ajax({
				type: 'GET',
				url: output,
				dataType: 'json',
				async: false
			});
			
			}
		}
	}
	window.unload = function(){
		if(!unloaded){
			unloaded = true
			session_log['unloaded'] = true
	  		self.antbitsLog(true,1)	
		}
		
	}
	window.onbeforeunload = function(){
	  	if(!unloaded){
			unloaded = true
			session_log['unloaded'] = true
			self.antbitsLog(true,1)
		}
		
	}
	$(window).blur(function(e){
		self.antbitsLog(false,0)
	})
}