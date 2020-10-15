/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2020 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
It also contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
var resultsObj = function(parent){
	var self = this;
	var calc_delay = 14 // sets result preload delay
	var bmi_intervention // sets bmi intervention threshold, varies due to ethnicity
	var brackets = {'cholesterol':[1,8],'bp':[90,140]};
	var eth_alt = [2,3,4,5,8]; // ethnicities that have a lower bmi threshold
	var ch_rs_low,ch_rs_high,bp_rs_low,bp_rs_high
	var more = 0;
	var ex = 0;
	var text_bracket = 'text_over_40'
	var skipped //tracks if user skipped entering cholesterol or blood pressure
	var advice_obj = [
		{'title':'Smoking','result_key':'Smoking','advice_status':'[qval]','text':'','key':null,'qval':'self.form_data.smoke_str','val':'self.form_data.heartage_input.smoke_cat','info':false},
		{'title':'Weight','result_key':'Weight','advice_status':'Your BMI is [qval] [risk] ','risk':0,'text':'','key':null,'qval':'self.form_data.heartage_input.bmi_rounded','val':'self.form_data.heartage_input.bmi','info':false},
		{'title':'Your cholesterol','result_key':'Cholesterol','advice_status':'Ratio [qval] [risk] ','text':'','key':'c','qval':'self.form_data.ch_str','val':'self.form_data.heartage_input.rati','info':false},
		{'title':'Your blood pressure','result_key':'BloodPressure','advice_status':'[qval] [risk] ','text':'','key':'bp','qval':'self.form_data.heartage_input.sbp','val':'self.form_data.heartage_input.sbp','info':false}
	];
	var $advice = $('#heartage-results-advice');
	var links = [];
	self.interventions = {};
	self.parent = parent;
	self.form_data = null;
	self.ha = 0;
	self.baseline = {
		"age": 40,
		"b_AF": false,
		"b_ra": false,
		"b_renal": false,
		"b_treatedhyp": false,
		"b_type2": false,
		"bmi": 22.49,
		"ethrisk": 1,
		"fh_cvd": false,
		"rati": 4.583333333333334,
		"sbp": 130,
		"smoke_cat": 0,
		"town": -0.81
	}
	this.setEvents = function(){
		$('#heartage-back-btn').on('click',function(e){
			e.preventDefault();
			self.parent.nav('form')
		})
		$('#heartage-restart-btn').on('click',function(e){
			e.preventDefault();
			self.parent.form.clear()
			self.parent.nav('splash')
		})
		$('#heartage-results-footer img').attr('src',self.parent.path+'assets/bp-im2.jpg')
		self.parent.initDetails('heartage-page-results')
		$('#heartage-results-footer a').click(function(e){
			e.preventDefault();
			self.logLink(e.target.href)
			self.parent.linkOut(e.target.href)
		});
	}
	this.generateResults = function(form_data){
		self.parent.page = 5
		self.form_data = form_data;
		self.user_result = self.cloneObj(self.parent.heartage.getHeartage(self.form_data.heartage_input))
		if(typeof _satellite != 'undefined' && self.parent.config.adobe_analytics && self.parent.config.adobe_state<2){
			self.parent.config.adobe_state = 2
			_satellite.track("tool_complete", {
				toolName: self.parent.tool_name,
				toolCategory: self.parent.tool_cat,
				toolResult: 'heart age: '+self.user_result.result.heartage
			})
		}
		self.parent.analyticsObj.antbitsLog(true,0)
	}
	this.renderResults = function(rs){
		// create interventions
		self.interventions = {};
		if($.inArray(self.form_data.heartage_input.ethrisk,eth_alt)>=0){
			bmi_intervention = 23.5;
		}else{
			bmi_intervention = 25;
		};
		$('#heartage-interventions>div').html('');
		if(self.form_data.heartage_input.smoke_cat > 1){
			self.createIntervention('smoke_cat','Quit smoking',1);
		}
		if(self.form_data.heartage_input.bmi > bmi_intervention){
			self.createIntervention('bmi','Lose weight', bmi_intervention);
		}
		if(self.form_data.heartage_input.rati > 3.214){
			self.createIntervention('rati','Lower cholesterol',3.214);
		}
		if(self.form_data.heartage_input.sbp > 119){
			self.createIntervention('sbp','Reduce blood pressure',119);
		}
		if(Object.keys(self.interventions).length == 0){
			$('#heartage-interventions').hide()
		}else{
			$('#heartage-interventions').show()
		}
		self.applyIntervention();	
		self.renderAdvice();
	}
	this.renderAdvice = function(){
		var preload_arr = [];
		if(self.user_result.result.age<40){
			text_bracket = 'text_under_40'
			$('#heartage-results-footer>h3').html(self.parent.data.TextAreas.footer_title);
			$('#heartage-results-footer>p').html(self.parent.data.TextAreas.footer_under_40);
		}else{
			text_bracket = 'text_over_40'
			$('#heartage-results-footer>h3').html(self.parent.data.TextAreas.footer_title);
			$('#heartage-results-footer>p').html(self.parent.data.TextAreas.footer_over_40);
		}
		$advice.html('');
		for(var i in advice_obj){
			if(!(advice_obj[i].result_key == 'Smoking' && self.form_data.heartage_input.smoke_cat == 0)){// non smokers get no smoking advice
				var result_obj = self.parent.data[advice_obj[i].result_key];
				var val = eval(advice_obj[i].val);
				var result_obj = self.parent.data[advice_obj[i].result_key];
				var tc
				if(skipped.indexOf(advice_obj[i].key)>-1){
					val = 10000;
				}
				var result_set = null;
				var rso = result_obj;
				// if BMI check ethnicity and select correct params
				if(advice_obj[i].result_key == 'Weight'){
					if($.inArray(self.form_data.heartage_input.ethrisk,eth_alt)>=0){
						rso = result_obj.slice(4,8);
					}else{
						rso = result_obj.slice(0,4);
					}
				}
				if(advice_obj[i].result_key == 'Cholesterol'){
					tc = self.form_data.heartage_input.tc;
				};
				for(var j in rso){
					result_set = rso[j];
					if(eval(val+' '+rso[j].bracket)){
						break;
					};
				};
				var msg = result_set[text_bracket]
				if(val == 10000 && advice_obj[i].result_key == 'Cholesterol'){
					msg = result_set[text_bracket].replace('[ch_low]','<strong>'+ch_rs_low.result.heartage+'</strong>');
					msg = msg.replace('[ch_high]','<strong>'+ch_rs_high.result.heartage+'</strong>');
				}
				if(val == 10000 && advice_obj[i].result_key == 'BloodPressure'){
					msg = result_set[text_bracket].replace('[bp_low]','<strong>'+bp_rs_low.result.heartage+'</strong>');
					msg = msg.replace('[bp_high]','<strong>'+bp_rs_high.result.heartage+'</strong>');
				}
				if(advice_obj[i].result_key == 'BloodPressure'){
					msg = msg.replace('[bp]',self.form_data.heartage_input.sbp);
				}
				var output = '<div class = "heartage-panel-light heartage-advice-row">';
				output += '<h3>'+advice_obj[i].title+'</h3>';
				if(skipped.indexOf(advice_obj[i].key)>-1){
					if(self.form_data.heartage_input.age<40){
						output += '<div class="heartage-advice-status-unknown">'+self.parent.data.TextAreas.not_known_under_40+'</div>';
					}else{
						output += '<div class="heartage-advice-status-unknown">'+self.parent.data.TextAreas.not_known+'</div>';
					}
					
				}else{
					var status_str = advice_obj[i].advice_status;
					status_str = status_str.replace('[qval]',eval(advice_obj[i].qval)).replace('[risk]',result_set.type);
					if(advice_obj[i].result_key == 'Smoking'){
						status_str = 'You '+status_str.slice(1);
					}
					if(advice_obj[i].result_key == 'Cholesterol'){
						if(j != 1 || tc >=5){	
							status_str = 'Total: '+tc+' '+result_set.type;	
						}
					}
					output += '<div class="heartage-advice-status">'+status_str+'</div>';
				}
				output+='<p>'+msg+'</p><div class = "heartage-info-panel"><h3>'+result_set.contenttitle+'</h3>';
				var items = result_set.resource.split(',')
				for(var j in items){
					var rObj = self.parent.data.Resources[items[j]];
					output+= '<div class = "heartage-info-item">';
					output+= '<div class = "heartage-col-left"><img border = "0" aria-hidden="true" alt="'+rObj.image_alt+'" src = "'+self.parent.path+'assets/'+rObj.image+'"/></div>';
					//output+= '<div class = "heartage-col-right"><a href = "'+rObj.url+'" target="_blank">'+rObj.description+'</a></div></div>'
					output+= '<div class = "heartage-col-right">'+rObj.description.replace('<a','<a href = "'+rObj.url+'" target="_blank"')+'</div></div>'
					
				}
				output += '</div></div></div></div>';
				$advice.append(output);
				$('#infoDB_'+i).css('background-image','none');
			}
		}
		$('#heartage-results-advice a').click(function(e){
			e.preventDefault();
			self.logLink(e.target.href)
			self.parent.linkOut(e.target.href)
		});
	}
	this.toggleIntervention = function(key){
		
		if(key.length >0){
			if(self.interventions[key].state){
				self.interventions[key].state = false
			}else{
				self.interventions[key].state = true
			}
		}
		self.applyIntervention();
		self.parent.scrollEvent($('#tool_heart-age').position().top)
	}
	this.applyIntervention = function(){
		var msg = ''
		ch_rs_low = {'result':{'heartage':95}};
		ch_rs_high = {'result':{'heartage':0}};
		bp_rs_low = {'result':{'heartage':95}};
		bp_rs_high = {'result':{'heartage':0}};
		$('#heartage-masthead>span>h2').html('Your heart age is <span role="text">about</span>');
		var prefix = 'is';
		var input = self.cloneObj(self.form_data.heartage_input);
		for(var i in self.interventions){
			if(self.interventions[i].state == true){
				input[i] = self.interventions[i].val;
				prefix = 'could be';
				$('#heartage-masthead>span>h2').html('Your heart age could be <span role="text">about</span>');
			}
		};
		var rs = self.cloneObj(self.parent.heartage.getHeartage(input));
		msg+= self.parent.data.Results.risk[text_bracket].replace('[10_yr_risk]',rs.result['10_yr_risk']).replace('[prefix]',prefix);
		skipped = ''
		var bracket_input = self.cloneObj(input)
		if(!self.form_data.ch_skipped && !self.form_data.bp_skipped){
			msg+= '<p>';
			if(self.form_data.heartage_input.age>rs.result.heartage){
				msg+= self.parent.data.Results.younger[text_bracket];
			}else if(Math.floor(self.form_data.heartage_input.age)==rs.result.heartage){
				msg+= self.parent.data.Results.same[text_bracket];
			}else{
				msg+= self.parent.data.Results.older[text_bracket];
			};
			msg+='</p>';
		}else{
			if(self.form_data.ch_skipped){
				skipped+='c'
				input.rati = brackets.cholesterol[0];
				ch_rs_low = self.cloneObj(self.parent.heartage.getHeartage(input));
				input.rati = brackets.cholesterol[1];
				ch_rs_high =  self.cloneObj(self.parent.heartage.getHeartage(input));
				input.rati = self.baseline.rati;
			}
			if(self.form_data.bp_skipped){
				skipped+='bp'
				input.sbp = brackets.bp[0];
				bp_rs_low = self.cloneObj(self.parent.heartage.getHeartage(input));
				input.sbp = brackets.bp[1];
				bp_rs_high = self.cloneObj(self.parent.heartage.getHeartage(input));
				input.sbp = self.baseline.sbp;
			}
		}
		if(skipped != ''){
			var str = self.parent.data.Results[skipped][text_bracket];
			switch(skipped){
				case "cbp":
					str = str.replace('[heart_age_low]',Math.min(bp_rs_low.result.heartage,ch_rs_low.result.heartage));
					str = str.replace('[heart_age_high]',Math.max(bp_rs_high.result.heartage,ch_rs_high.result.heartage));
				break;
				case "bp":
					str = str.replace('[heart_age_low]',bp_rs_low.result.heartage);
					str = str.replace('[heart_age_high]',bp_rs_high.result.heartage);
				break;
				case "c":
					str = str.replace('[heart_age_low]',ch_rs_low.result.heartage);
					str = str.replace('[heart_age_high]',ch_rs_high.result.heartage);
				break;
			}
			msg+= str;
		}
		$('#heartage-life-expectancy').html(Math.floor(rs.result.life))
		$('#heartage-about-your-calculation').html(msg)
		self.counter(0,rs.result.heartage,$('#heartage-number'),$('#heartage-animated-number'))
	}
	this.createIntervention = function(key,title,val){
		self.interventions[key] = {'val':val,'title':title,'state':false};
		var info = self.parent.data.TextAreas['intervention_'+key]
		if(key == 'bmi'){
			info = info.replace('[OVERWEIGHT]', bmi_intervention-0.1)
		}
		var $node = $('<div class = "heartage-intervention"><label class="heartage-slider"><input  aria-label = "See how your heart age changes if you '+title+'" id="heartage-intervention-'+key+'" type = "checkbox"><span class="heartage-slider_toggle"></span><div><h3>'+title+'</h3><p>'+info+'</p></div></label></div>')
		$('#heartage-interventions>div').append($node)
		$node.find('input').on('click',function(e){
			var $target = $(e.target)
			self.toggleIntervention($target[0].id.split('-').pop())
		})
		function swipe(e,direction){
			var $target = $(e.target)
			var key = $target[0].id.split('-').pop()
			if(key.length > 0){
				if(direction == 'left' && self.interventions[key].state){
					self.toggleIntervention(key)
				}
				if(direction == 'right' && !self.interventions[key].state){
					self.toggleIntervention(key)
				}
			}
		}
		if(self.parent.isMobile.any()){
			var slider = new Hammer(document.getElementById('heartage-intervention-'+key));
			slider.on('swipeleft', function(e) {
				swipe(e,'left')
			});
			slider.on('swiperight', function(e) {
				swipe(e,'right')
			});
		}
	}
	this.preload = function(form_data){
		self.generateResults(form_data);
		self.parent.scrollEvent($('#tool_heart-age').position().top)
		var $preloader = $('<div id="heartage-preloader"><div></div><h2>Generating results</h2></div>')
		self.parent.$target.append($preloader)
		$preloader.fadeOut(0).fadeIn(self.parent.speed).delay(self.parent.speed*calc_delay).fadeOut(self.parent.speed);
		setTimeout(function(){
			self.renderResults();
			self.parent.nav('results')
		},self.parent.speed*calc_delay)
	}
	this.cloneObj = function(obj){
		return jQuery.parseJSON(JSON.stringify(obj));
	}
	this.counter = function(start,num,$target,$animated_target){
		$target.html(num);
		$animated_target.html(num);
		self.counter_delay = self.parent.speed*5.5;
		var inc = 20;
		var count = start;
		var t= 0;
		function stepNext(){
			setTimeout(function(){
			if(count <= num){
				$animated_target.html(count);
				count++;
				if(count > num - 15){
					inc*=1.08;
				}
				stepNext();
			}
			},inc);
		}
		stepNext();
	}
	this.logLink = function(t){
		// logs visited links for analytics
		var mapObj = {'https://':'','http://':'','www.':'','nhs.uk':''};
		links.push(self.parent.replaceAll(t,mapObj));
		links = self.parent.arrayUnique(links);
		ex = 1;
		more = 1
	}
	this.getData = function(obj){
		if(typeof self.user_result != 'undefined'){
			obj.bmi = self.user_result.user_data.bmi.toFixed(1);
			obj.age = self.user_result.user_data.age;
			obj.gen = self.user_result.user_data.gender;
			obj.af = self.user_result.user_data.b_AF ? 1 : 0;
			obj.art = self.user_result.user_data.b_ra ? 1 : 0;
			obj.kid = self.user_result.user_data.b_renal ? 1 : 0;
			obj.btp = self.user_result.user_data.b_treatedhyp ? 1 : 0;
			obj.dia = self.user_result.user_data.b_type2 ? 1 : 0;
			obj.lf = self.user_result.result.life.toFixed(1)
			obj.h = self.user_result.result.heartage
			obj.links = links.join('|');
			obj.more = more;
			obj.ex = ex;
		}
		return obj;
	}
}