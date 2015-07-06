function form(r){
	var root = r
	var self = this;
	var pos
	var $postcode = $('#postcode');
	var $ch_error = $('#ch_error')
	var $ch_error_inner = $('#ch_error_inner')
	var $ch_block = $('#ch_block')
	var P1Alert = false;
	var P4Alert = false;
	var dob = new Date();
	var now = new Date();
	var $dob_day = $('#dob_day')
	var $dob_month = $('#dob_month')
	var $dob_year = $('#dob_year')
	var $h_imperial = $('#h_imperial')
	var $w_imperial = $('#w_imperial')
	var $t_cholesterol_wrap_a = $('#t_cholesterol_wrap_a')
	var $t_cholesterol_wrap_b = $('#t_cholesterol_wrap_b')
	var $hdl_cholesterol_wrap_a = $('#hdl_cholesterol_wrap_a')
	var $hdl_cholesterol_wrap_b = $('#hdl_cholesterol_wrap_b')
	var $h_metric = $('#h_metric')
	var $w_metric = $('#w_metric')
	var scrollH = 1000
	var $t_cholesterol_a = $('#t_cholesterol_a')
	var $hdl_cholesterol_a = $('#hdl_cholesterol_a')
	var $t_cholesterol_b = $('#t_cholesterol_b')
	var $hdl_cholesterol_b = $('#hdl_cholesterol_b')
	var $sys_bp = $('#sys_bp')
	var $h_cm = $('#h_cm')
	var $h_ft = $('#h_ft')
	var $h_in = $('#h_in')
	var $w_kg = $('#w_kg')
	var $w_st = $('#w_st')
	var $w_lb = $('#w_lb')
	var $smoke = $('#smoke')
	var $ethnicity = $('#ethnicity')
	var units = {"w":"imperial","h":"imperial","ch":"mmol/L"}
	var townsend_api_path = 'https://change4life.antbits.com/townsend/api.php';
	var tn_queue = false
	var panel_heights = {'cholesterol':$('#cholesterol_data').height(),'bp':$('#bp_data').height()};
	this.__h = null
	this.__w = null
	this.__t_ch = null
	this.__hdl_ch = null
	this.defaults = {'age':40,'b_AF':false,'b_ra':false,'b_renal':false,'b_treatedhyp':false,'b_type2':false,'bmi':22.49,'ethrisk':1,'fh_cvd':false,'rati':4.583333333333334,'sbp':130,'smoke_cat':0,'town':-0.810}
	this.radio_arr = Array({'id':'gender','vals':Array(1,0),'val':null},{'id':'cardio','vals':Array('yes','no'),'val':null},{'id':'cholesterol','vals':Array('yes','no'),'val':null},{'id':'bp','vals':Array('yes','no'),'val':null},{'id':'bpt','vals':Array('yes','no'),'val':null},{'id':'diabetes','vals':Array('yes','no'),'val':null},{'id':'arthritis','vals':Array('yes','no'),'val':null},{'id':'kidney','vals':Array('yes','no'),'val':null},{'id':'af','vals':Array('yes','no'),'val':null},{'id':'rcvd','vals':Array('yes','no'),'val':null});
	var gender
	var townsend_score = self.defaults.town
	var region = null
	$postcode.on('keyup',function(){
		self.tnQ()
	})
	$postcode.on('blur',function(){
		self.tnQ()
	})
	$postcode.width($('#ethnicity').width()-5)
	$postcode.on('focus',function(){
		if($postcode.val() == 'e.g CB10 2PS'){
			$postcode.css('color','#585858').val('')
		}
	})
	$h_metric.hide()
	$w_metric.hide()
	$t_cholesterol_wrap_b.hide()
	$hdl_cholesterol_wrap_b.hide()
	$('#h_imperial>div>a').on('click',function(){self.unitSwap('h','imperial','metric')})
	$('#h_metric>div>a').on('click',function(){self.unitSwap('h','metric','imperial')})
	$('#w_imperial>div>a').on('click',function(){self.unitSwap('w','imperial','metric')})
	$('#w_metric>div>a').on('click',function(){self.unitSwap('w','metric','imperial')})
	$('#hdl_cholesterol_wrap_a>div>a').on('click',function(){
		self.unitSwap('t_cholesterol_wrap','a','b')
		self.unitSwap('hdl_cholesterol_wrap','a','b')
	})
	$('#hdl_cholesterol_wrap_b>div>a').on('click',function(){
		self.unitSwap('t_cholesterol_wrap','b','a')
		self.unitSwap('hdl_cholesterol_wrap','b','a')
	})
	
	$w_kg.on('keyup',function(){self.checkWeight('kg')})
	$w_st.on('keyup',function(){self.checkWeight('st')})
	$w_lb.on('keyup',function(){self.checkWeight('lb')})
	$h_cm.on('keyup',function(){self.checkHeight('cm')})
	$h_ft.on('keyup',function(){self.checkHeight('ft')})
	$h_in.on('keyup',function(){self.checkHeight('in')})
	
	$t_cholesterol_wrap_a.on('keyup',function(e){if(keyEvtNumeric(e)){self.checkCholesterol('mmol/L')}})
	$hdl_cholesterol_wrap_a.on('keyup',function(e){if(keyEvtNumeric(e)){self.checkCholesterol('mmol/L')}})
	$t_cholesterol_wrap_b.on('keyup',function(e){if(keyEvtNumeric(e)){self.checkCholesterol('mg/dl')}})
	$hdl_cholesterol_wrap_b.on('keyup',function(e){if(keyEvtNumeric(e)){self.checkCholesterol('mg/dl')}})
	
	$t_cholesterol_a.on('keyup',function(){self.storeState()})
	$hdl_cholesterol_a.on('keyup',function(){self.storeState()})
	$t_cholesterol_b.on('keyup',function(){self.storeState()})
	$hdl_cholesterol_b.on('keyup',function(){self.storeState()})
	$sys_bp.on('keyup',function(){
		if(!isNaN($sys_bp.val())){
			$sys_bp.val(Math.max(Math.min($sys_bp.val(),210),0))
		}
		self.storeState()
	})
	
	$('#postcode_info').on('click',function(){root.dialog('1C4')})
	$('#ethnicity_info').on('click',function(){root.dialog('1C6')})
	$('#cv_info').on('click',function(){root.dialog('1C5')})
	$('#cholesterol_info').on('click',function(){root.dialog('3C1')})
	$('#bp_info').on('click',function(){root.dialog('3C2')})
	$('#bpt_info').on('click',function(){root.dialog('3C3')})
	$('#cvd_info').on('click',function(){root.dialog('4C5')})
	
	$ethnicity.on('change',function(){
		self.storeState()
	})
	$smoke.on('change',function(){
		self.storeState()
	})
	this.tnQ = function(){
		if(!tn_queue){
			tn_queue = true
			setTimeout(function(){
				self.checkTownsend()
				tn_queue = false;
			},2000)
		}
	}
	this.checkCholesterol = function(val){
		if(val == 'mmol/L'){
			pos = $hdl_cholesterol_a.offset()
			if(isNaN(parseFloat($t_cholesterol_a.val()))){
				$t_cholesterol_a.val('')
				$t_cholesterol_b.val('')
				self.__t_ch = 0
			}else{
				self.__t_ch = Math.max(Math.min(parseFloat($t_cholesterol_a.val()),20),0);
				if($t_cholesterol_a.val().slice(-1) != '.'){
					$t_cholesterol_a.val(self.__t_ch)
				}
				$t_cholesterol_b.val((self.__t_ch*38.66976).toFixed(0))
			}
			if(isNaN(parseFloat($hdl_cholesterol_a.val()))){
				$hdl_cholesterol_a.val('')
				$hdl_cholesterol_b.val('')
				self.__hdl_ch = 0
			}else{
				self.__hdl_ch = Math.max(Math.min(parseFloat($hdl_cholesterol_a.val()),12),0);
				if($hdl_cholesterol_a.val().slice(-1) != '.'){
					$hdl_cholesterol_a.val(self.__hdl_ch)
				}
				$hdl_cholesterol_b.val((self.__hdl_ch*38.66976).toFixed(0))
			}
		}else{
			pos = $hdl_cholesterol_b.offset()
			if(isNaN(parseFloat($t_cholesterol_b.val()))){
				$t_cholesterol_a.val('')
				$t_cholesterol_b.val('')
				self.__t_ch = 0
			}else{
				self.__t_ch = Math.max(Math.min(parseFloat($t_cholesterol_b.val()),774),0);
				if($t_cholesterol_b.val().slice(-1) != '.'){
					$t_cholesterol_b.val(self.__t_ch)
				}
				$t_cholesterol_a.val((self.__t_ch*0.02586).toFixed(1))
			}
			if(isNaN(parseFloat($hdl_cholesterol_b.val()))){
				$hdl_cholesterol_a.val('')
				$hdl_cholesterol_b.val('')
				self.__hdl_ch = 0
			}else{
				self.__hdl_ch = Math.max(Math.min(parseFloat($hdl_cholesterol_b.val()),464),0);
				if($hdl_cholesterol_b.val().slice(-1) != '.'){
					$hdl_cholesterol_b.val(self.__hdl_ch)
				}
				$hdl_cholesterol_a.val((self.__hdl_ch*0.02586).toFixed(1))
			}
		}
		if(self.__hdl_ch > self.__t_ch && $hdl_cholesterol_a.val() != '' && $t_cholesterol_a.val() != ''){
			self.chError(0,pos)
		}else if(self.__t_ch/self.__hdl_ch>12.5 && $hdl_cholesterol_a.val() != '' && $t_cholesterol_a.val() != ''){
			self.chError(1,pos)
		}else{
			self.chError(2,pos)
		}
		self.storeState()
	}
	this.chError = function(opt,pos){
		if(pos.left == 0 || pos.right == 0){
			opt = 2
		}else{
			if( root.qstr.layout == 'phone'){
				$ch_error.css('left',pos.left).css('top',pos.top-58)
			}else{
				$ch_error.css('left',pos.left).css('top',pos.top-70)
			}
		}
		switch(opt){
			case 0:
				$ch_error.fadeIn(root.speed)
				$ch_error_inner.html('Cholesterol ratio too small please check')
				$hdl_cholesterol_a.css('border','2px solid #ef6167').css('background-color','#fad2d4').css('margin','0px')
				$hdl_cholesterol_b.css('border','2px solid #ef6167').css('background-color','#fad2d4').css('margin','0px')
			break;
			case 1:
				$ch_error.fadeIn(root.speed)
				$ch_error_inner.html('Cholesterol ratio too big please check')
				$hdl_cholesterol_a.css('border','2px solid #ef6167').css('background-color','#fad2d4').css('margin','0px')
				$hdl_cholesterol_b.css('border','2px solid #ef6167').css('background-color','#fad2d4').css('margin','0px')
			break;
			case 2:
				$ch_error.fadeOut(root.speed)
				$hdl_cholesterol_a.css('border','1px solid #a9a9a9').css('background-color','#fff').css('margin','1px')
				$hdl_cholesterol_b.css('border','1px solid #a9a9a9').css('background-color','#fff').css('margin','1px')
				self.highlightBlock('t_cholesterol_a','off')
			break;
		}
	}
	this.checkWeight = function(val){
		if(val == 'kg'){
			if(isNaN(parseFloat($w_kg.val()))){
				$w_kg.val('')
				$w_st.val('')
				$w_lb.val('')
				self.__w = 0
			}else{
				self.__w = parseFloat($w_kg.val());
				var stone = Math.floor(self.__w*0.157473)
				var lbs = Math.round(self.__w*2.204622)-(stone*14)
				if(lbs == 14){
					lbs = 0
					stone++
				}
				$w_st.val(stone)
				$w_lb.val(lbs)
				
			}
		}else{
			var w = 0
			var pounds = parseInt($w_lb.val(),10)
			var stone = parseInt($w_st.val(),10)
			if(isNaN(stone)){
				$w_st.val('')
				$w_kg.val('')	
				self.__w = 0
			}else{
				w+= (parseInt($w_st.val(),10)/0.157473);
			}
			if(isNaN(pounds)){
				$w_lb.val('')
			}else{
				$w_lb.val(Math.max(0,Math.min(14,pounds)))
				w+= (parseInt($w_lb.val(),10)/2.204622)
			}
			if(w>0){
				self.__w = w
				$w_kg.val(Math.round(w*10)/10)
			}
		}
		self.storeState()
	}
	this.checkHeight = function(val){
		if(val == 'cm'){
			if(isNaN(parseInt($h_cm.val(),10))){
				$h_cm.val('')
				$h_ft.val('')
				$h_in.val('')
				self.__h = 0
			}else{
				self.__h = parseFloat($h_cm.val(),10);
				var feet = Math.floor(self.__h/30.48)
				var inches = Math.round(self.__h/2.54)-(feet*12)
				if(inches == 12){
					inches = 0
					feet++
				}
				$h_ft.val(feet)
				$h_in.val(inches)
			}
		}else{
			var h = 0
			var inches = parseInt($h_in.val(),10)
			var feet = parseInt($h_ft.val(),10)
			if(isNaN(feet)){
				$h_ft.val('')	
				$h_cm.val('')
				self.__h = 0;
			}else{
				h+= parseInt($h_ft.val(),10)*30.48;
			}
			if(isNaN(inches)){
				$h_in.val('')
			}else{
				$h_in.val(Math.max(0,Math.min(11,inches)))
				h+= parseInt($h_in.val(),10)*2.54
			}
			if(h>0){
				self.__h = h
				$h_cm.val(Math.round(h*10)/10)
			}
		}
		self.storeState()
	}
	this.checkDob = function(){
		
		if(parseInt($dob_day.val())>0 && parseInt($dob_day.val())<=32 && parseInt($dob_month.val())>0 && parseInt($dob_month.val())<=12 && parseInt($dob_year.val())> 1890 && parseInt($dob_year.val())<= now.getFullYear()){
			
			dob = new Date($dob_year.val(),($dob_month.val()-1),$dob_day.val())
			self.storeState('dob')
			return true
		}else{
			return false
		}
		
	}
	this.unitSwap = function(id,hide,show){
		$('#'+id+'_'+show).fadeIn(root.speed)
		$('#'+id+'_'+hide).fadeOut(root.speed)
	}
	this.initRadio = function(){
		function radio_over(e){
			var id = e.target.id
			if(e.target.nodeName != 'A'){
				id = e.target.parentNode.id
			}
			var img = $('#'+id+'>img')
			if(img.attr('src').indexOf('_on')==-1){
				img.attr('src',img.attr('src').replace('_off','_over'))
			}
		}
		function radio_out(e){
			var id = e.target.id
			if(e.target.nodeName != 'A'){
				id = e.target.parentNode.id
			}
			var img = $('#'+id+'>img')
			if(img.attr('src').indexOf('_on')==-1){
				img.attr('src',img.attr('src').replace('_over','_off'))
			}
		}
		for(var i in this.radio_arr){
			for(var j in this.radio_arr[i].vals){
				var $tmp = $('#'+this.radio_arr[i].id+'_'+this.radio_arr[i].vals[j]);
				$tmp.on('click',function(e){self.toggleRadio(e)});
				$tmp.on('mouseover',function(e){
					radio_over(e)
				});
				$tmp.on('focus',function(e){
					radio_over(e)
				});
				$tmp.on('mouseout',function(e){
					radio_out(e)
				});
				$tmp.on('blur',function(e){
					radio_out(e)
				});

			}
		}
	}
	this.checkTownsend = function(){
		var regPostcode = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/gi;
		var postcode = $postcode.val();
		if(regPostcode.test(postcode)){
			$postcode.val(postcode.toUpperCase().replace(' ',''))
			$.getJSON(townsend_api_path+'?p='+postcode, function(data) {
				if(!isNaN(parseFloat(data.townsend_score))){
					townsend_score = parseFloat(data.townsend_score);
					region = data.region
					self.storeState()
				}
			});
		}else{
			townsend_score = self.defaults.town
		}
	}
	this.storeState = function(){
		var obj = {"bmi":self.bmi(),"radio_arr":this.radio_arr,"townsend_score":townsend_score,"region":region,"page":root.page,"units":units,"dob":dob,"t_cholesterol":$t_cholesterol_a.val(),"hdl_cholesterol":$hdl_cholesterol_a.val(),"sys_bp":$sys_bp.val(),"postcode":$postcode.val(),"w":self.__w,"h":self.__h,"smoke":$smoke.val(),"ethnicity":$ethnicity.val()}
		
		root.stateObj.storeState(obj)
	}
	this.dobComboSet = function(init,e){
		if(init){
			var output = ''
			var y = dob.getFullYear()-30;
			var m = dob.getMonth()+1;
			var d = dob.getDate();
			
			for(var i = 0;i>-57;i--){
				output+='<option value = "'+(y+i)+'">'+(y+i)+'</option>'
			}
			$dob_year.html(output);
			y-=10
			$dob_year.val(y)
			$dob_month.val(m)
			$dob_year.on('change',function(){
				self.checkDob()
				self.updateDays($dob_day.val(),$dob_month.val(),$dob_year.val())
			})
			$dob_month.on('change',function(){
				self.checkDob()
				self.updateDays($dob_day.val(),$dob_month.val(),$dob_year.val())
			})
			$dob_day.on('change',function(){
				self.checkDob()
			})
			self.updateDays(d,$dob_month.val(),$dob_year.val())
		}
	}
	this.zeroFill = function( number, width ){
		width -= number.toString().length;
		if ( width > 0 ){
			return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
		}
		return number + "";
	}
	this.updateDays = function(d,m,y){
		var days = new Date(y,m,0).getDate();
		var output = ''
		for(var i = 1;i<=days;i++){
			output+='<option value = "'+i+'">'+self.zeroFill(i,2)+'</option>'
		}
		$dob_day.html(output);
		$dob_day.val(Math.min(d,days))
	}
	this.toggleRadio = function(e){
		if(e.target.tagName == 'A'){
			var tmp = e.target.id.split('_');
		}else{
			var tmp = e.target.parentNode.id.split('_');
		}
		for(var i in this.radio_arr){
			if(this.radio_arr[i].id == tmp[0]){
				if(this.radio_arr[i].val == null){
					this.radio_arr[i].val = tmp[1];
				}else{
					if(this.radio_arr[i].val == this.radio_arr[i].vals[1]){
						this.radio_arr[i].val = this.radio_arr[i].vals[0];
					}else{
						this.radio_arr[i].val = this.radio_arr[i].vals[1];
					}
				}
				for(var j in this.radio_arr[i].vals){
					var tmp = $('#'+this.radio_arr[i].id+'_'+this.radio_arr[i].vals[j]+'>img')
					if(this.radio_arr[i].vals[j] == this.radio_arr[i].val){
						tmp.attr('src','images/radio_on'+root.img_str+'.png')
					}else{
						tmp.attr('src','images/radio_off'+root.img_str+'.png')
					}
					self.highlightBlock(this.radio_arr[i].id+'_'+this.radio_arr[i].vals[0],'off')
					self.checkHiddenPanels(this.radio_arr[i].id,this.radio_arr[i].val,false)	
					self.checkP1Alert(this.radio_arr[i].id,this.radio_arr[i].val)	
					self.checkP4Alert(this.radio_arr[i].id,this.radio_arr[i].val)	
					self.checkP41Alert(this.radio_arr[i].id,this.radio_arr[i].val)	
				}
			}
		}
		self.storeState()
	}
	this.checkP4Alert = function(id,state){
		var str = "_diabetes_arthritis_kidney_af_"
		if(str.indexOf(id) > 0 && state == 'yes' && P4Alert == false){
			P4Alert = true;
			root.dialog('4C1-4')
		}
	}
	this.checkP41Alert = function(id,state){
		if(id == 'rcvd' && state == 'yes'){
			root.dialog('4C1-5')
		}
	}
	this.checkP1Alert = function(id,state){
		if(id == 'cardio' && state == 'yes' && P1Alert == false){
			P1Alert = true;
			root.dialog('1C3')
		}
	}
	this.checkHiddenPanels = function(id,state,snap){
		if((id == "cholesterol" || id == "bp" )&& state != null){
			var $p1 = $('#'+id+'_data')
			var $p2 = $('#'+id+'_data_alt')
			var spd = r.speed/2
			if(snap){
				spd = 0
			}
			var delay = spd*2.2
			if($p1.css('display') == 'none' && $p2.css('display') == 'none'){
				delay = 0	
			}
			
			if(state == 'yes'){
				$p2.slideUp(spd)
				$p1.delay(delay).slideDown(spd)
			}else if(state == 'no'){
				$p2.delay(delay).slideDown(spd)
				$p1.slideUp(spd)
				
			}
			var t= 0
			var tracker = setInterval(function(){
				r.$nav.css('top',$('#page_'+r.page).height()+90)
				t+=(r.speed/100)
				if(t>=(r.speed/2)+delay){
					clearInterval(tracker)
				}
			},10)		
		}
		if(id == "cholesterol"){
			if(state == 'no'){
				self.chError(2,pos)
			}else{
				setTimeout(function(){
					self.checkCholesterol('mmol/L')
				},1000)
			}
		}
	}
	this.bmi = function(){
		this.__h = parseFloat($('#h_cm').val())
		this.__w = parseFloat($('#w_kg').val())
		if(!isNaN(this.__h)&&!isNaN(this.__w)){
			return this.__w/(Math.pow((this.__h/100),2))
		}else{
			return self.defaults.bmi
		}
	}
	this.restoreState = function(obj){
		this.radio_arr = obj.radio_arr
		townsend_score = obj.townsend_score
		region = obj.region
		units = obj.units
		dob = new Date(obj.dob)
		if(now.getFullYear()-dob.getFullYear()>=30){
			$dob_day.val(dob.getDate())
			$dob_month.val(dob.getMonth()+1)
			$dob_year.val(dob.getFullYear())
			self.updateDays(dob.getDate(),dob.getMonth()+1,dob.getFullYear())
		}else{
			dob = new Date();
		}
		
		if(obj.postcode != 'e.g CB10 2PS'){
			$postcode.css('color','#585858').val(obj.postcode)
		}
		self.__w = obj.w
		self.__h = obj.h
		$h_cm.val(obj.h)
		$w_kg.val(obj.w)
		$smoke.val(obj.smoke);
		$ethnicity.val(obj.ethnicity)
		$t_cholesterol_a.val(obj.t_cholesterol)
		$hdl_cholesterol_a.val(obj.hdl_cholesterol)
		$sys_bp.val(obj.sys_bp)
		for(var i in self.radio_arr){
			if(self.radio_arr[i].val != null){
				$('#'+self.radio_arr[i].id+'_'+self.radio_arr[i].val+'>img').attr('src','images/radio_on'+root.img_str+'.png')
			}
			self.checkHiddenPanels(self.radio_arr[i].id,self.radio_arr[i].val,true)
		}
		setTimeout(function(){
			self.checkHeight('cm')
			self.checkWeight('kg')
			self.checkCholesterol('mmol/L')
			root.stateObj.clearState()
		},1000);
		
	}
	this.calc = function(){
		if(self.checkDob()){
			var obj = {}
			obj.age = Math.floor((now.getTime() - dob.getTime())/31557600000);
			obj.surv = 95-obj.age
			obj.town = townsend_score
			obj.smoke_cat = parseInt($('#smoke').val());
			var smoke_str = $('#smoke option:selected').text();
			var skipped = ''
			var ch_str = ''
			obj.ethrisk = parseInt($('#ethnicity').val());
			obj.bmi = self.bmi()
			obj.bmi_rounded = Math.round(self.bmi()*10)/10;
			for(var i in self.radio_arr){
				switch (self.radio_arr[i].id){
					case "cholesterol":
						var tc = Math.max(0.1,parseFloat($('#t_cholesterol_a').val()))
						var th = Math.max(0.1,parseFloat($('#hdl_cholesterol_a').val()))
						var mult = 1/th
						ch_str = Math.round(((tc*mult)*100)/100)+':'+(th*mult)
						if(!isNaN(tc) && !isNaN(th) && self.radio_arr[i].val == 'yes'){
							obj.rati = tc/th
							obj.tc = tc
						}else{
							obj.rati = self.defaults.rati
							obj.tc = 0
							skipped+='c'
						}	
					break;
					case "bp":
						var sbp = parseInt($('#sys_bp').val())
						if(!isNaN(sbp) && self.radio_arr[i].val == 'yes'){
							obj.sbp = sbp
						}else{
							obj.sbp = self.defaults.sbp;
							skipped+='bp'
						}	
					break;
					case "bpt":
						if(self.radio_arr[i].val == 'yes'){
							obj.b_treatedhyp = true;
						}else{
							obj.b_treatedhyp = self.defaults.b_treatedhyp;
						}	
					break;
					case "diabetes":
						if(self.radio_arr[i].val == 'yes'){
							if($('#diabetes_type').val() == '1'){
								obj.b_type1 = true;
								obj.b_type2 = false;
							}else{
								obj.b_type1 = false;
								obj.b_type2 = true;
							}
						}else{
							obj.b_type1 = self.defaults.b_type1;
							obj.b_type2 = self.defaults.b_type2;
						}	
					break;
					case "arthritis":
						if(self.radio_arr[i].val == 'yes'){
							obj.b_ra = true;
						}else{
							obj.b_ra = self.defaults.b_ra;
						}	
					break;
					case "kidney":
						if(self.radio_arr[i].val == 'yes'){
							obj.b_renal = true;
						}else{
							obj.b_renal = self.defaults.b_renal;
						}	
					break;
					case "af":
						if(self.radio_arr[i].val == 'yes'){
							obj.b_AF = true;
						}else{
							obj.b_AF = self.defaults.b_AF;
						}	
					break;
					case "rcvd":
						if(self.radio_arr[i].val == 'yes'){
							obj.fh_cvd = true;
						}else{
							obj.fh_cvd = self.defaults.fh_cvd;
						}	
					break;
					case "gender":
						gender = self.radio_arr[i].val;
					break;
				}
			}
			root.results.calc(obj,gender,skipped,smoke_str,ch_str)
		};
	}
	this.validate = function(page){
		scrollH = 1000
		var output = true
		switch(page){
			case 1:
				for(var i=0;i<2;i++){
					if(this.radio_arr[i].val == null){
						self.highlightBlock(this.radio_arr[i].id+'_'+this.radio_arr[i].vals[0],'on')
						output = false
					}
				}
				if(this.radio_arr[1].val == 'yes'){
					root.dialog('1C3')
					output = false
				}
				
			break;
			case 2:
				if(self.__h >= 5 && self.__h <= 241){
					self.highlightBlock('h_cm','off')
				}else{
					output = false
					self.highlightBlock('h_cm','on')
				}
				if(self.__w >= 2 && self.__w <= 318){
					self.highlightBlock('w_kg','off')
				}else{
					output = false
					self.highlightBlock('w_kg','on')
				}
				
				
			break;
			case 3:
				for(var i=2;i<5;i++){
					if(this.radio_arr[i].val == null){
						self.highlightBlock(this.radio_arr[i].id+'_'+this.radio_arr[i].vals[0],'on')
						output = false
					}
					
				}
				var rati = self.__t_ch/self.__hdl_ch
				if(this.radio_arr[2].val == 'yes' &&  (self.__t_ch<=0 || self.__hdl_ch<=0 || rati > 12.5 || rati < 1 )){
					self.highlightBlock('t_cholesterol_a','on')
					output = false
				}else{
					self.highlightBlock('t_cholesterol_a','off')
					
				
				}
				if(this.radio_arr[3].val == 'yes' &&  isNaN(parseFloat($sys_bp.val()))){
					self.highlightBlock('sys_bp','on')
					output = false
					
				}else{
					self.highlightBlock('sys_bp','off')
					
				}
				
			break;
			case 4:
				for(var i=5;i<10;i++){
					if(this.radio_arr[i].val == null){
						self.highlightBlock(this.radio_arr[i].id+'_'+this.radio_arr[i].vals[0],'on')
						output = false
					}
				}
				
			break;
		}
		if(!output && root.qstr.layout == 'phone'){
			window.scroll(0,scrollH)
		}
		return output
	}
	this.getData = function(obj){
		if(!isNaN( this.__h)){
			obj.hcm = this.__h
		}
		if(!isNaN( this.__w)){
			obj.wkg = this.__w
		}
		if(this.__hdl_ch>0){
			obj.chs = $hdl_cholesterol_a.val()
		}
		if(this.__t_ch>0){
			obj.cht = $t_cholesterol_a.val()
		}
		return obj
	}
	this.highlightBlock = function(id,val){
		var $tmp = $('#'+id).parent().parent().parent()
		if(val == 'on'){
			scrollH = Math.min($tmp.position().top,scrollH)
			$tmp.css('background-color','#fad2d4')
		}else{
			$tmp.css('background-color','#ededed')
		}
	}
	this.clear = function(){
	}
	this.initRadio();
	this.dobComboSet(true,null)
	this.checkHeight('cm')
	this.checkWeight('kg')
	this.checkCholesterol('mmol/L')
}