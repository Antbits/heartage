/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2020 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
It also contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
var formObj = function(parent){
	var self = this;
	var now = new Date()
	self.parent = parent
	self.unit_constraints = {"inches":[0,11],"feet":[0,999],"cm":[0,999],"pounds":[0,13],"stone":[0,999],"kg":[0,999],"mmol":[0,20],"mgdl":[0,774],"mmhg":[0,210]}
	self.form_data = {}
	var $feet_input = $('#heartage-height-feet')
	var $inches_input = $('#heartage-height-inches')
	var $cm_input = $('#heartage-height-cm')
	var $kg_input = $('#heartage-weight-kg')
	var $stone_input = $('#heartage-weight-stone')
	var $pounds_input = $('#heartage-weight-pounds')
	var $day_input = $('#heartage-dob-day')
	var $month_input = $('#heartage-dob-month')
	var $year_input = $('#heartage-dob-year')
	var $total_cholesterol = $('#heartage-total_cholesterol-mmol')
	var $hdl_cholesterol = $('#heartage-hdl_cholesterol-mmol')
	var $postcode = $('#heartage-postcode')
	var pc = 0;
	var cholesterol_ratio = ''
	var postcode = ''
	var tn_queue = false;
	var locked = false;
	var conditions_warning = {};
	this.setEvents = function(){
		$('#heartage-page-form input').on('click keyup',function(e){
			setTimeout(function(){self.checkErrorState(e)},50)
		})
		$('#heartage-page-form #heartage-calculate-btn').on('click',function(e){
			e.preventDefault();
			if(!self.checkStatus($('#heartage-calculate-btn'),'locked')){
				if(self.validate($('#heartage-page-form .heartage-panel-light'))){
				}else{
					var pos = $('#heartage-page-form .heartage-panel-light.heartage-error').first().position();
					self.parent.scrollEvent(pos.top)
					self.parent.resizeLayout(self.parent.size * 3.75 , self.parent.speed)
					setTimeout(function(){
						$('#heartage-page-form .heartage-panel-light.heartage-error').first().find('input').first().focus()
					},self.parent.speed)
					
				}
			}
		})
		$('#heartage-page-form input[type=radio][name=heartage-smoke]').change(function() {
			self.form_data.smoke_str = $($('#heartage-formpanel-smoke .nhsuk-radios>div>label')[this.value]).html()
			
		});
		$('#heartage-page-form input[type=radio][name=heartage-cvd]').change(function() {
			if (this.value == 'true') {
				self.togglePanel($('#heartage-cvd-warning'),true)
				self.lockFormItemsAfter('heartage-formpanel-cvd')
			}else{
				self.togglePanel($('#heartage-cvd-warning'),false)
				self.unlockFormItems()
			}
		});
		$('#heartage-page-form input[type=radio][name=heartage-diabetes], #heartage-page-form input[type=radio][name=heartage-arthritis] , #heartage-page-form input[type=radio][name=heartage-ckd] , #heartage-page-form input[type=radio][name=heartage-atrfib]').change(function(e) {
			var id = e.target.id.split('-')[1]
			//console.log(conditions_warning)
			if (this.value == 'true') {
				show_warning = true;
				for(var i in conditions_warning){
					//console.log($('#heartage-'+i+'-warning').css('display'))
					if(conditions_warning[i] && $('#heartage-'+i+'-warning').css('display') != 'none' ){
						show_warning = false;
					}
				}
				if(show_warning){
					self.togglePanel($('#heartage-'+id+'-warning'),true)
					
				}
				conditions_warning[id] = true;
			}else{
				self.togglePanel($('#heartage-'+id+'-warning'),false)
				conditions_warning[id] = false;
			}
		});
		$('#heartage-page-form input[type=radio][name=heartage-cvdfam]').change(function() {
			if (this.value == 'true') {
				self.togglePanel($('#heartage-cvdfam-warning'),true)
			}else{
				self.togglePanel($('#heartage-cvdfam-warning'),false)
			}
		});
		$('#heartage-page-form input[type=radio][name=heartage-cholesterol]').change(function() {
			if (this.value == 'true') {
				self.togglePanel($('#heartage-cholesterol-input-panel'),true)
			}else{
				self.togglePanel($('#heartage-cholesterol-input-panel'),false)
			}
		});
		$('#heartage-page-form input[type=radio][name=heartage-bp]').change(function() {
			if (this.value == 'true') {
				self.togglePanel($('#heartage-bp-input-panel'),true)
			}else{
				self.togglePanel($('#heartage-bp-input-panel'),false)
			}
		});
		$('#heartage-weight input, #heartage-height input , #heartage-cholesterol-input-panel input , #heartage-bp-input-panel input').on('keyup change',function(e){
			// check event does not originate from hidden input
			if(!locked){
				// auto correct inputs
				var tmp = e.target.id.split('-')
				var val = Math.abs(e.target.value)
				if(tmp[2] == 'cm' || tmp[2] == 'kg'  || tmp[2] == 'mmol'){
					val=val.toFixed(1)
				}else if(tmp[2] == 'feet' || tmp[2] == 'inches' || tmp[2] == 'stone' || tmp[2] == 'pounds' || tmp[2] == 'mmhg'){
					val=Math.round(val)
				}
				if(isNaN(val)){
					e.target.value = ''
				}
				if(val > 0){
					var m = 1
					if(tmp[1].indexOf('cholesterol')){
						self.checkCholesterolRatio();
					}
					if(tmp[1] == 'hdl_cholesterol'){
						m = 0.6
					}
					var preval = val
					val = Math.min(val,Math.floor(self.unit_constraints[tmp[2]][1]*m))
					val = Math.max(val,Math.floor(self.unit_constraints[tmp[2]][0]*m))
					if(val - preval != 0){
						e.target.value = val
					}
					
				}
				self.convertUnits(tmp[1],tmp[2])
			}
		})
		$('#heartage-dob-day').on('keyup',function(e){
			var val = $(this).val()
			$(this).val(Math.min(val,31))
		})
		$('#heartage-dob-month').on('keyup',function(e){
			var val = $(this).val()
			$(this).val(Math.min(val,12))
		})
		self.setUnitToggle('height','imperial','metric')
		self.setUnitToggle('weight','imperial','metric')
		self.setUnitToggle('cholesterol','mmol','mgdl')
		self.parent.initDetails('heartage-page-form');
		self.initPanels('heartage-page-form');
		$('#heartage-cholesterol-advice').show();
		$('#heartage-bp-advice').show();
		$postcode.on('keyup',function(){
			self.tnQ();
		})
		$postcode.on('blur',function(){
			self.tnQ();
		})
		$(window).mousedown(function(e){
			self.parent.keynav = false;
			$('#tool_heart-age').removeClass('keynav');
		});
		$(window).keydown(function(e){
			if(e.keyCode == 9 || e.keyCode == 13){
				self.parent.keynav = true;
				$('#tool_heart-age').addClass('keynav');
			}
		})
	}
	this.clear = function(){
		self.form_data.townsend = null;
		$('#tool_heart-age input[type = text]').val('')
		$('#tool_heart-age input[type = number]').val('')
		$('#tool_heart-age input[type = radio]').prop('checked', false);
		self.togglePanel($('#heartage-cvd-warning'),false)
		self.togglePanel($('#heartage-diabetes-warning'),false)
		self.togglePanel($('#heartage-arthritis-warning'),false)
		self.togglePanel($('#heartage-ckd-warning'),false)
		self.togglePanel($('#heartage-atrfib-warning'),false)
		self.togglePanel($('#heartage-cvdfam-warning'),false)
		self.togglePanel($('#heartage-cholesterol-input-panel'),false)
		self.togglePanel($('#heartage-bp-input-panel'),false)
		$('#tool_heart-age details').removeAttr("style").removeAttr('open').removeClass('heartage-open').removeClass('heartage-dormant');	
		
	}
	this.testData = function(){
		$cm_input.val(177.8)
		$kg_input.val(82.1)
		$day_input.val(1)
		$month_input.val(1)
		$year_input.val(1970)
		self.form_data.smoke_str = 'I smoke 20+ a day'
		//$total_cholesterol.val(4.8)
		//$hdl_cholesterol.val(1.2)
		$postcode.val('GL14 3EX')
		self.convertUnits('height','cm')
		self.convertUnits('weight','kg')
		self.checkTownsend()
		$('input[type=radio]').attr('checked','checked')
	}
	this.checkCholesterolRatio = function(){
		cholesterol_ratio = ''
		var tc = $total_cholesterol.val()
		var hc = $hdl_cholesterol.val()
		if(hc > tc && hc != '' && tc != ''){
			cholesterol_ratio = 'low'
		}else if(tc / hc > 12.5 && hc != '' && tc != ''){
			cholesterol_ratio = 'high'
		}
	}
	this.checkErrorState = function(e){
		if(self.checkStatus($(e.target),'error')){
			self.validate($(e.target).closest('.heartage-panel-light'))
		}
	
	}
	this.convertUnits = function(data_type,unit_type){
		locked = true
		var val = 0
		if(unit_type == 'feet' || unit_type == 'inches'){
			val = ($feet_input.val()*30.48)+($inches_input.val()*2.54)
			if($feet_input.val() == '' && $inches_input.val() == ''){
				$cm_input.val('')
			}else{
				$cm_input.val(val.toFixed(1))
			}
			
		}
		if(unit_type == 'cm'){
			val = $cm_input.val()
			var feet = Math.floor(val/30.48);
			var inches = Math.round(val/2.54)-(feet*12);
			$feet_input.val(feet)
			$inches_input.val(inches)
		}
		if(unit_type == 'stone' || unit_type == 'pounds'){
			val = ($stone_input.val()/0.157473)+($pounds_input.val()/2.204622)
			if($stone_input.val() == '' && $pounds_input.val() == ''){
				$kg_input.val('')
			}else{
				$kg_input.val(val.toFixed(1))
			}
		}
		if(unit_type == 'kg'){
			val = $kg_input.val()
			var stone = Math.floor(val*0.157473);
			var pounds = Math.round(val*2.204622)-(stone*14);
			$stone_input.val(stone)
			$pounds_input.val(pounds)
		}
		if(unit_type == 'mmol'){
			val = parseFloat($('#heartage-'+data_type+'-mmol').val());
			$('#heartage-'+data_type+'-mgdl').val((val*38.66976).toFixed(0));
		}
		if(unit_type == 'mgdl'){
			val = parseFloat($('#heartage-'+data_type+'-mgdl').val());
			$('#heartage-'+data_type+'-mmol').val((val*0.02586).toFixed(1));
		}
		locked = false;
	}
	
	this.initPanels = function(id){
		$("#"+id+" .heartage-warning").hide(0);
		$("#"+id+" .heartage-input-panel").hide(0);
	}
	this.validate = function($target){
		var submit_form = false;
		if($target.length > 1){
			submit_form = true;
		}
		var valid = true;
		$target.each(function(index, element) {
			var error = '';
			var radio_checked = false
			var text_inputted = false
            var id = $(element).attr('id').replace('heartage-formpanel-','');
			$(element).find('input[type="text"], input[type="number"]').each(function(index, element) {
				if($(element).val()==''){
					error = self.parent.data.TextAreas.error_incomplete_text
				}
            });
			if(error == ''){
				text_inputted = true
				self.form_data[id] = $(element).val();
			}
			if($(element).find('input[type="radio"]').length>0){
				if($(element).find('input[type="radio"]:checked').length == 0){
					error = self.parent.data.TextAreas.error_incomplete_radio
				}else{
					radio_checked = true
					self.form_data[id] = $('input[name=heartage-'+id+']:checked').val()
				}
			}
			
			switch(id){
				case 'dob':
					if(error == '' && $year_input.val().length >= 4){
						var oldest = new Date(now.getFullYear()-95,now.getMonth(),now.getDate());
						var youngest = new Date(now.getFullYear()-30,now.getMonth(),now.getDate());
						var dob = new Date($year_input.val(),$month_input.val()-1,$day_input.val());
						if(dob > youngest){
							error = self.parent.data.TextAreas.error_too_young
						}
						if(dob < oldest){
							error = self.parent.data.TextAreas.error_too_old
						}
						if(dob > now){
							error = self.parent.data.TextAreas.error_future_date
						}
						if($year_input.val() != dob.getFullYear() || $month_input.val() != dob.getMonth()+1 || $day_input.val() != dob.getDate()){
							error = self.parent.data.TextAreas.error_incorrect_date
						}
						self.form_data['dob'] = dob
					
					}
					if($year_input.val().length < 4 || $month_input.val().length < 1 || $day_input.val().length < 1){
						error = self.parent.data.TextAreas.error_date_incomplete
						
					}
					
				break;
				case 'postcode':
					error = '';
				break;
				case 'sex':
					if(self.form_data['sex'] == ''){
						error = self.parent.data.TextAreas.error_sex
					}
					
				break;
				case 'eth':
					error = '';
				break;
				case 'height':
					error = ''
					if($cm_input.val() > 50 && $cm_input.val() < 241){
						self.form_data['height'] = parseFloat($cm_input.val())
					}else if($cm_input.val() == ''){
						error = self.parent.data.TextAreas.error_height_incomplete
					}else if($cm_input.val() <= 50){
						error = self.parent.data.TextAreas.error_too_small.replace('[unit]','Height')
					}else if($cm_input.val() >= 241){
						error = self.parent.data.TextAreas.error_too_large.replace('[unit]','Height')
					}else{
						error = self.parent.data.TextAreas.error_height_incomplete
					}
				break;
				case 'weight':
					error = ''
					if($kg_input.val() > 12 && $kg_input.val() < 318){
						self.form_data['weight'] = parseFloat($kg_input.val())
					}else if($kg_input.val() == ''){
						error = self.parent.data.TextAreas.error_weight_incomplete
					}else if($kg_input.val() <= 12){
						error = self.parent.data.TextAreas.error_too_small.replace('[unit]','Weight')
					}else if($kg_input.val() >= 318){
						error = self.parent.data.TextAreas.error_too_large.replace('[unit]','Weight')
					}else{
						error = self.parent.data.TextAreas.error_weight_incomplete
					}
					
				break;
				case 'cholesterol':
					if(radio_checked){
						if($("input[name='heartage-cholesterol']:checked").val() == 'true'){
							self.checkCholesterolRatio()
							if(text_inputted && cholesterol_ratio == ''){
								error = ''
							}else if(cholesterol_ratio != ''){
								error = self.parent.data.TextAreas['error_cholesterol_ratio_'+cholesterol_ratio]
							}else{
								error = self.parent.data.TextAreas.error_incomplete_text
							}
							self.form_data['ch_skipped'] = false;
							self.form_data['cholesterol'] = {'total':$('#heartage-total_cholesterol-mmol').val(),'hdl':$('#heartage-hdl_cholesterol-mmol').val()}
						}else{
							error = ''
							self.form_data['ch_skipped'] = true;
							self.form_data['cholesterol'] = {'total':0,'hdl':0}
							
 						}
					}
				break;
				case 'bp':
					self.form_data['bp'] = self.parent.results.baseline.sbp
					if(radio_checked){
						if($("input[name='heartage-bp']:checked").val() == 'true'){
							if(text_inputted){
								self.form_data['bp'] = $('#heartage-bp-mmhg').val()
								error = ''
							}else{
								error = self.parent.data.TextAreas.error_incomplete_text
							}
							self.form_data['bp_skipped'] = false;
						}else{
							error = ''
							self.form_data['bp_skipped'] = true;
						}
					}
				break;
				default:
				break;
			}
			
			var $old_errors = $(element).find('.heartage-error-msg')
			if($old_errors.length>0 && error == ''){
				$(element).removeClass('heartage-error')
				$old_errors.stop().slideUp(self.parent.speed,function(){
					$(this).remove();
					//self.parent.resizeLayout(self.parent.size*3.75,self.parent.speed);
				})	
			}
			if(error != ''){
				if($old_errors.length>0){
					$(element).find('.heartage-error-msg').html(error)
				}else{
					$(element).find('h3').after('<div class = "heartage-error-msg">'+error+'</div>')
				}
				$(element).addClass('heartage-error');
				valid = false;
			}
			
        });
		if(valid && submit_form){
			var age = Math.floor((now.getTime() - self.form_data['dob'].getTime())/31557600000);
			var bmi = self.form_data.weight / Math.pow(self.form_data.height/100,2);
			if(self.form_data.ch_skipped){
				var rati = self.parent.results.baseline.rati
			}else{
				var rati = parseFloat(self.form_data.cholesterol.total)/parseFloat(self.form_data.cholesterol.hdl)
			}
			if(self.form_data.bp_skipped){
				var sbp = self.parent.results.baseline.sbp
			}else{
				var sbp = parseInt(self.form_data.bp)
			}
			self.form_data.heartage_input = {
				"age":age,
				"b_AF": eval(self.form_data.atrfib),
				"b_ra": eval(self.form_data.arthritis),
				"b_renal": eval(self.form_data.ckd),
				"b_treatedhyp": eval(self.form_data.bpt),
				"b_type2": eval(self.form_data.diabetes),
				"bmi":bmi,
				"surv": 95-age,
				"tc":0,
				"bmi_rounded":parseFloat(bmi.toFixed(1)),
				"fh_cvd": eval(self.form_data.cvdfam),
				"gender": parseInt(self.form_data.sex),
				"rati": rati,
				"sbp": sbp,
				"smoke_cat": parseInt(self.form_data.smoke)
			}
			if(!isNaN(self.form_data.eth) && self.form_data.eth != ''){
				self.form_data.heartage_input.ethrisk = parseInt(self.form_data.eth);
			}else{
				self.form_data.heartage_input.ethrisk = 0;
			}
			if(!isNaN(self.form_data.cholesterol.total) && self.form_data.cholesterol.total != ''){
				self.form_data.heartage_input.tc = self.form_data.cholesterol.total
			}else{
				self.form_data.heartage_input.tc = 0;
			}
			if(self.form_data.townsend == null){
				self.form_data.heartage_input.town = self.parent.results.baseline.town
			}else{
				if(typeof self.form_data.townsend.townsend_score == 'undefined' || self.form_data.townsend.townsend_score == null ){
					self.form_data.heartage_input.town = self.parent.results.baseline.town
				}else{
					self.form_data.heartage_input.town = parseFloat(self.form_data.townsend.townsend_score)
				}
			}
			//console.log(self.form_data.heartage_input)
			self.parent.results.preload(self.form_data)
		}
		return valid
	}
	this.tnQ = function(){
		if(!tn_queue){
			tn_queue = true;
			setTimeout(function(){
				self.checkTownsend();
				tn_queue = false;
			},2000);
		}
	}
	this.checkTownsend = function(){
		var regPostcode = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/gi;
		if(postcode != $postcode.val().replace(' ','')){
			$postcode.val(addSpace($postcode.val()).toUpperCase());
			postcode = $postcode.val().replace(' ','');
			if(regPostcode.test(postcode)){
				pc = 1;
				$.getJSON(self.parent.townsend_api_path+'?p='+postcode, function(data) {
					if(data.success){
						self.form_data['townsend'] = data;	
					}else{
						self.form_data['townsend'] = null;	
					}
				});
			}else{
				postcode = '';
				self.form_data['townsend'] = null	
			}
		}
		function addSpace(str){
			str = str.replace(' ','');
			switch(str.length){
				case 7:
					return str.slice(0,4)+' '+str.slice(4,7)
				break
				case 6:
					return str.slice(0,3)+' '+str.slice(3,6)
				break
				default:
					return str;
				break;
			}
		}
	}
	this.togglePanel = function($target,openstate){
		if(openstate){
			$target.addClass('heartage-activated')
			$target.css('display','block')
			$target.addClass('heartage-dormant')
			setTimeout(function(){
				var h = $target.outerHeight(true)-self.parent.size
				self.parent.resizeLayout(h+(3.75*self.parent.size),self.parent.speed);
				$target.addClass('heartage-zero-height');
				$target.css('margin-top',0)
				$target.removeClass('heartage-dormant').stop().animate({'height':h,'padding-top':'1em','padding-bottom':'1em','margin-top':'1em'},self.parent.speed,function(){
					$(this).removeClass('heartage-zero-height')
					$(this).attr('style','')
					$(this).css('height','auto')
				})
			},50)
			
		}else{
			if($target.hasClass('heartage-activated')){
				self.parent.resizeLayout(0-$target.height(),self.parent.speed);
				$target.stop().animate({'height':0,'padding-top':0,'padding-bottom':0,'margin-top':0},self.parent.speed,function(){
					$target.removeAttr("style");
					$target.hide();
				})
			}
		}
	}
	this.lockFormItemsAfter = function(target){
		var locked = false;
		$('#heartage-page-form .heartage-panel-light').each(function(index, element) {
			if(locked){
				$(element).addClass('heartage-locked')
				$(element).stop().fadeTo(self.parent.speed,0.3)
				$(element).find('input').attr('disabled','true')
				$(element).find('nhsuk-radios__input').attr('disabled','true')
			}
			if($(element).attr('id') == target){
				locked = true;
			}
        });
		$('#heartage-calculate-btn').addClass('heartage-locked').stop().fadeTo(self.parent.speed,0.3)
	}
	this.unlockFormItems = function(){
		$('#heartage-page-form .heartage-panel-light').each(function(index, element) {
			$(element).removeClass('heartage-locked')
			$(element).stop().fadeTo(self.parent.speed,1)
			$(element).find('input').attr('disabled',null)
			$(element).find('nhsuk-radios__input').attr('disabled',null)
        });
		$('#heartage-calculate-btn').stop().removeClass('heartage-locked').fadeTo(self.parent.speed,1)
	}
	this.checkStatus = function($target,state){
		if ($target.parents('.heartage-'+state).length || $target.hasClass('heartage-'+state)) {
			return true;
		}else{
			return false;
		}
	}
	this.setUnitToggle = function(id,first,last){
		$('#heartage-formpanel-'+id+' .heartage-'+last).stop().fadeOut(0)
		$('#heartage-formpanel-'+id+' .heartage-unit-toggle a:last-of-type').stop().fadeOut(0).click({target: id,units: first,first:first,last:last},function(event){
			self.toggleUnits(event.data.units,event.data.target,event.data.first,event.data.last)
		})
		$('#heartage-formpanel-'+id+' .heartage-unit-toggle a:first-of-type').click({target: id,units: last,first:first,last:last},function(event){
			self.toggleUnits(event.data.units,event.data.target,event.data.first,event.data.last)
		})
	}
	this.toggleUnits = function(unit_type,target,first,last){
		if(!locked){
			locked = true
			var next = first
			var $wrap = $('#heartage-'+target)
			if(!self.checkStatus($('#heartage-formpanel-'+target),'locked')){
				$wrap.height($wrap.height())
				if(unit_type == first){
					$('#heartage-formpanel-'+target+' .heartage-unit-toggle a:last-of-type').stop().fadeOut(self.parent.speed)
					$('#heartage-formpanel-'+target+' .heartage-unit-toggle a:first-of-type').stop().delay(self.parent.speed).fadeIn(self.parent.speed)
					$('#heartage-formpanel-'+target+' .heartage-'+last).stop().fadeOut(self.parent.speed)
					$('#heartage-formpanel-'+target+' .heartage-'+first).stop().delay(self.parent.speed).fadeIn(self.parent.speed,function(){
						locked = false
						$wrap.css('height',null)
					})
				}else{
					$('#heartage-formpanel-'+target+' .heartage-unit-toggle a:first-of-type').stop().fadeOut(self.parent.speed)
					$('#heartage-formpanel-'+target+' .heartage-unit-toggle a:last-of-type').stop().delay(self.parent.speed).fadeIn(self.parent.speed)
					$('#heartage-formpanel-'+target+' .heartage-'+first).stop().fadeOut(self.parent.speed)
					$('#heartage-formpanel-'+target+' .heartage-'+last).stop().delay(self.parent.speed).fadeIn(self.parent.speed,function(){
						locked = false
						$wrap.css('height',null)
					})
					next = last
				}
			}
			if(self.parent.keynav){
				setTimeout(function(){
					$($('#heartage-formpanel-'+target+' .heartage-'+next+' input')[0]).focus()
				},self.parent.speed);
			}
		}
	}
	this.getData = function(obj){
		if(!isNaN(self.form_data.height)){
			obj.hcm = self.form_data.height;
		}
		if(!isNaN(self.form_data.weight)){
			obj.wkg = self.form_data.weight;
		}
		if(!self.form_data.bp_skipped){
			obj.sbp = parseInt(self.form_data.bp)
		}else{
			obj.sbp = 0;
		}
		if(!isNaN(self.form_data.smoke)){
			obj.smk = self.form_data.smoke;
		}
		if(self.form_data.cholesterol != null){
			if(!isNaN(self.form_data.cholesterol.hdl)){
				obj.chs = parseFloat(self.form_data.cholesterol.hdl);
			}
			if(!isNaN(self.form_data.cholesterol.total)){
				obj.cht = parseFloat(self.form_data.cholesterol.total);
			}
			if(obj.cht > 0 && obj.chs > 0 && !self.form_data.ch_skipped){
				obj.ch = obj.cht / obj.chs
			}else{
				obj.ch = 0;
			}
		}
		if(self.form_data.townsend != null){
			obj.lsoa11 = self.form_data.townsend.lsoa11;
			obj.upper_tier_LA = self.form_data.townsend.upper_tier_LA;
			obj.region = self.form_data.townsend.region;
			obj.r = self.form_data.townsend.region;
			obj.area_name = self.form_data.townsend.area_name;
			obj.tn = self.form_data.townsend.townsend_score	
		}
		obj.pc = pc;
		if(!isNaN(self.form_data.ethrisk)){
			obj.et = $('input[name=heartage-eth]:checked').siblings('label').html()
			obj.eth = parseInt(self.form_data.eth);
		}else{
			obj.et = 'Not known'
			obj.eth = 0;
		}
		return obj
	}
	function countDecimals(value) {
		if (Math.floor(value) !== value)
			return value.toString().split(".")[1].length || 0;
		return 0;
	}
}