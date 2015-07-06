function results(r){
	var root = r
	var self = this;
	var rs = null
	var ch_rs_low = {'heartage':95}
	var ch_rs_high = {'heartage':0}
	var bp_rs_low = {'heartage':95}
	var bp_rs_high = {'heartage':0}
	var eth_alt = [2,3,4,5,8]
	var heart_age_low = 100
	var heart_age_high = 0
	var brackets = {'cholesterol':[1,8],'bp':[90,140]}
	this.qriskLT = new Q65_lifetime();
	this.counter_delay = root.speed*5.5
	self.data = {'more':0,'exit':0,'links':[]}
	var risk = 'low'
	var $r1_content = $('#r1_content')
	var $r1_title = $('#r1_title')
	var $r1_heart_age = $('#r1_heart_age')
	var $r2_content = $('#r2_content')
	//var $social = $('#social')
	var shared = {"fb":0,"tw":0,"gp":0,"em":0}
	var advice_obj = [
		{'title':'Smoking','result_key':'Smoking','advice_status':'[qval]','text':'','key':null,'qval':'smoke_str','val':'obj.smoke_cat','info':false},
		{'title':'Blood pressure','result_key':'BloodPressure','advice_status':'[qval]<div>[risk]</div>','text':'','key':'bp','qval':'obj.sbp','val':'obj.sbp','info':false},
		{'title':'Cholesterol','result_key':'Cholesterol','advice_status':'Ratio [qval]<div>[risk]</div>','text':'','key':'c','qval':'ch_str','val':'obj.rati','info':false},
		{'title':'Weight','result_key':'Weight','advice_status':'BMI [qval]<div>[risk]</div>','risk':0,'text':'','key':null,'qval':'obj.bmi_rounded','val':'obj.bmi','info':false}
	]
	var $advice_wrap = $('#advice_wrap')
	this.logLink = function(evt){
		var t = ''
		if(evt.target.nodeName == 'IMG'){
			t = evt.target.parentNode.href
		}else{
			t = evt.target.href
		}
		var mapObj = {'https://':'','http://':'','www.':'','nhs.uk':''};
		self.data.links.push(replaceAll(t,mapObj))
		self.data.links = arrayUnique(self.data.links)
		self.data.exit = 1
	}
	this.resizeLayout = function(){
		if(root.page == 5){
			var side_scroll = 'scroll'
			if(root.qstr.layout == 'phone'){
				var pad = 2;
				var i_w = 177
				var p_w = $('#page_5').width()-40
				if(p_w >= (i_w*3)){
					pad = (p_w -(i_w*3))/2
					side_scroll = 'hidden'
				}else{
					side_scroll = 'scroll'
					if((i_w*2) < p_w+20 && (i_w*2) > p_w-20){
						pad = i_w/3
					}
				}
				for(var i = 0 ;i < advice_obj.length;i++){
					$('#infoDD_'+i).css('overflow-x',side_scroll)
					$('#infoDD_'+i+'>:first-child').css('margin','0px '+pad+'px 0px 0px')
					$('#infoDD_'+i+'>:last-child').css('margin','0px 0px 0px '+pad+'px')
				}
			}else{
				$('#page_5 .info_item').css('margin','0px 1px 0px 1px')
			}
		}
	
	}
	this.calc = function(obj,gender,skipped,smoke_str,ch_str){
		$r1_heart_age.html(0)
		ch_rs_low = {'heartage':95}
		ch_rs_high = {'heartage':0}
		bp_rs_low = {'heartage':95}
		bp_rs_high = {'heartage':0}
		delete this.qriskLT
		this.qriskLT = new Q65_lifetime();
		rs = self.qriskLT.lifetimeRisk(obj.age,gender,10,obj);
		$r1_title.html('Your heart age is about')
		$r1_content.html(root.text_data.TextAreas.r1_content)
		var msg = '<p>'+root.text_data.TextAreas.life+'</p>'
		msg+= '<div id = "life_bar"><div id = "life_bar_fill"><img src= "images/e81e26.png" alt="'+Math.floor(rs['life'])+' years life average expectancy"></div><div id = "life_bar_scale"><div id = "lf_40">40</div><div id = "lf_50">50</div><div id = "lf_60">60</div><div id = "lf_70">70</div><div id = "lf_80">80</div><div id = "lf_90">90</div><div id = "lf_100">100</div></div></div>'
		msg+= root.text_data.TextAreas.r2_content
		msg = msg.replace('[10_yr_risk]','<span class="emphasis">'+rs['10_yr_risk']+'%</span>').replace('[life]','<span class="emphasis">'+Math.floor(rs['life'])+'</span>')
		if(rs['10_yr_risk'] < 10){
			risk = 'low'
		}else if(rs['10_yr_risk'] < 20){
			risk = 'moderate'
		}else{
			risk = 'high'
		}
		
		msg = msg.replace('[risk]',risk)
		$r2_content.html(msg)
		if(root.qstr.layout == 'phone'){
			msg = '<div><img src = "images/heart.mob@2x.png" width = "40" alt="heart icon" height  = "53"></div>'
		}else{
			msg = '<div><img src = "images/heart@2x.png" width = "76" alt="heart icon" height  = "68"></div>'
		}
		if(skipped != ''){
			var ch_init = obj.rati
			if(skipped.indexOf('c')>-1){
				obj.rati = brackets.cholesterol[0]
				ch_rs_low = self.qriskLT.lifetimeRisk(obj.age,gender,10,obj);
				obj.rati = brackets.cholesterol[1]
				ch_rs_high = self.qriskLT.lifetimeRisk(obj.age,gender,10,obj);
				obj.rati = ch_init
			}
			var bp_init = obj.sbp
			if(skipped.indexOf('bp')>-1){
				obj.sbp = brackets.bp[0]
				bp_rs_low = self.qriskLT.lifetimeRisk(obj.age,gender,10,obj);
				obj.sbp = brackets.bp[1]
				bp_rs_high = self.qriskLT.lifetimeRisk(obj.age,gender,10,obj);
				obj.sbp = bp_init
			}
			heart_age_low = Math.min(bp_rs_low.heartage,ch_rs_low.heartage,rs.heartage)
			heart_age_high = Math.max(bp_rs_high.heartage,ch_rs_high.heartage,rs.heartage)
			msg+='<p>'+root.text_data.Results[skipped].text.replace('[heart_age_low]','<span class="emphasis">'+heart_age_low+'</span>').replace('[heart_age_high]','<span class="emphasis">'+heart_age_high+'</span>')+'</p>'
			msg+='<strong>'+root.text_data.TextAreas.result_summary+'</strong>'
		}else{
			msg+= '<p>'
			if(obj.age>rs.heartage){
				msg+= root.text_data.Results.younger.text
			}else if(Math.floor(obj.age)==rs.heartage){
				msg+= root.text_data.Results.same.text
			}else{
				msg+= root.text_data.Results.older.text
			}
			msg+='</p><p><strong>'+root.text_data.TextAreas.result_summary+'</strong></p>'
		}
		
		$('#r3').html(msg)
		if(obj.age<40){
			$('#r4').html('<h3>'+root.text_data.TextAreas.footer_title+'</h3>'+root.text_data.TextAreas.footer_under_40)
		}else{
			$('#r4').html('<h3>'+root.text_data.TextAreas.footer_title+'</h3>'+root.text_data.TextAreas.footer_over_40)
			if(root.qstr.layout == 'phone'){
				var tmp = $('#footer_img').detach()
				$('#r4').prepend(tmp)
			}
		}
		$advice_wrap.html('')
		
		for(var i in advice_obj){
			if(!(advice_obj[i].title == 'Smoking' && obj.smoke_cat == 0)){
				var result_obj = root.text_data[advice_obj[i].result_key]
				var val = eval(advice_obj[i].val)
				if(skipped.indexOf(advice_obj[i].key)>-1){
					val = 10000;
				}
				var result_set = null
				var rso = result_obj
				// if BMI check ethnicity and select correct params
				if(advice_obj[i].title == 'Weight'){
					if($.inArray(obj.ethrisk,eth_alt)>=0){
						rso = result_obj.slice(5,9)
					}else{
						rso = result_obj.slice(0,4)
					}
				}
				//
				if(advice_obj[i].title == 'Cholesterol'){
					var tc = obj.tc;
				}
				for(var j in rso){
					result_set = rso[j]
					if(eval(val+' '+rso[j].bracket)){
						break
					}
				}
				var msg = result_set.text
				if(val == 10000 && advice_obj[i].title == 'Cholesterol'){
					msg = result_set.text.replace('[ch_low]','<strong>'+ch_rs_low.heartage+'</strong>')
					msg = msg.replace('[ch_high]','<strong>'+ch_rs_high.heartage+'</strong>')
				}
				if(val == 10000 && advice_obj[i].title == 'Blood pressure'){
					msg = result_set.text.replace('[bp_low]','<strong>'+bp_rs_low.heartage+'</strong>')
					msg = msg.replace('[bp_high]','<strong>'+bp_rs_high.heartage+'</strong>')
				}
				if(advice_obj[i].title == 'Blood pressure'){
					msg = msg.replace('[bp]',obj.sbp)
				}
				var output = '<div class = "advice_row">'
				output += '<img src = "images/'+advice_obj[i].title.replace(' ','')+root.img_str+'.png" alt = "'+advice_obj[i].title+' icon" width="52"  height ="52">'
				output += '<h3>'+advice_obj[i].title+'</h3>'
				if(skipped.indexOf(advice_obj[i].key)>-1){
					output += '<div class="advice_status" style = "color:#e81e26;">Not known - GET TESTED</div>'
				}else{
					var status_str = advice_obj[i].advice_status
					status_str = status_str.replace('[qval]',eval(advice_obj[i].qval)).replace('[risk]',result_set.type)
					output += '<div class="advice_status">'+status_str+'</div>'
				}
				output+='<p>'+msg+'</p>'
				output += '</div>'
				
				output += '<a href = "javascript:;" id = "infoDB_'+i+'"><div class="advice_action_bar"><img src = "images/whiteArrow@2x.png" width = "12" height = "12"><h2>'+result_set.contenttitle+'</h2></div></a>'
				output += '<div id = "infoDD_'+i+'" class = "info_drop_down">'
				var items = result_set.resource.split(',')
				for(var j in items){
					var rObj = root.text_data.Resources[items[j]]
					output+= '<div class = "info_item">'
					if(rObj.image != ''){
						output+= '<a href = "'+rObj.url+'" tabindex = "-1" target="_blank"><img border = "0" alt="'+rObj.imagealt+'" src = "'+root.asset_dir+'/'+rObj.image+'"></a>'
					}else{
						output+= '<a href = "javascript:;" tabindex = "-1" ><img border = "0" src = "resources/placeholder.png"></a>'
					}
					output+= '<p>'+rObj.description+'</p></div>'
				}
				output += '</div>'
				$advice_wrap.append(output)
				$('#infoDB_'+i).on('click',function(e){
					self.toggleInfo(e)
				})
				$('#infoDB_'+i).on('mouseover',function(e){
					self.infoTint(e,1)
				})
				$('#infoDB_'+i).on('mouseout',function(e){
					self.infoTint(e,0)
				})
				$('#infoDB_'+i).on('focusin',function(e){
					self.infoTint(e,1)
				})
				$('#infoDB_'+i).on('focusout',function(e){
					self.infoTint(e,0)
				})
				
			}
		}
		$('.info_drop_down a').on('click',function(e){
			self.logLink(e)
		})
		$('#r4 a').on('click',function(e){
			self.logLink(e)
		})
		root.trackHeight()
		setTimeout(function(){
			self.counter(0,rs.heartage)
			var life = (1.66666*(Math.max(Math.min(Math.floor(rs['life'])-40,60),0)))
			$('#life_bar_fill').animate({'width':life+'%'},1500,'easeOutQuad')
		},self.counter_delay)
		self.resizeLayout()
		delete rs,ch_rs_low,ch_rs_high,bp_rs_low,bp_rs_high
	}
	this.infoTint = function(e,opt){
		var id= e.target.parentNode.id.split('_')[1]
		if(e.target.tagName != 'DIV' ){
			id= e.target.parentNode.parentNode.id.split('_')[1]
		}
		if(e.target.tagName == 'A' ){
			id= e.target.id.split('_')[1]
		}
		if(opt == 1){
			$('#infoDB_'+id+' div').css('background-color','#146bba')
		}else{
			$('#infoDB_'+id+' div').css('background-color','#1885e7')
		}
	}
	this.counter = function(start,num){
		self.counter_delay = root.speed*5.5
		var inc = 20
		var count = start
		var t= 0
		function stepNext(){
			setTimeout(function(){
			if(count <= num){
				$r1_heart_age.html(count)
				count++
				if(count > num - 15){
					inc*=1.08
				}
				
				stepNext()
			}
			},inc)
		}
		stepNext()
	}
	this.tidyUp = function(){
		for(var i in advice_obj){
			$('#infoDB_'+i).off('click')
		}
	}
	this.getData = function(obj){
		if(rs != null){
			obj.lf = rs.life.toFixed(2)
			obj.h = rs.heartage
			obj.links = self.data.links.join('|')
			obj.more = self.data.more
			obj.exit = self.data.exit
		}
		return obj
	}
	this.toggleInfo = function(e){
		self.data.more=1
		var id= e.target.parentNode.id.split('_')[1]
		
		if(e.target.tagName != 'DIV' ){
			id= e.target.parentNode.parentNode.id.split('_')[1]
		}
		if(e.target.tagName == 'A' ){
			id= e.target.id.split('_')[1]
		}
		var pad = 22
		if(root.qstr.layout == 'phone'){
			pad = 32
			$('#infoDB_'+id+' div').css('background-color','#146bba')
		}
		if(advice_obj[id].info){
			$('#infoDD_'+id).animate({opacity:0,height:0},root.spd,function(){
				$('#infoDD_'+id+' a').attr('tabindex',-1)
				$('#infoDD_'+id).css('display','none')
				
			})
			setTimeout(function(){
				$('#infoDB_'+id+' div').css('background-color','#1885e7')
			},100)
			$('#infoDB_'+id+' img').attr('src','images/whiteArrow@2x.png')
			advice_obj[id].info = false
		}else{
			
			$('#infoDD_'+id+' a').attr('tabindex',null)
			$('#infoDD_'+id).show().animate({opacity:1,height:($('#infoDD_'+id+'>div').height()+pad)},root.spd,function(){
				self.resizeLayout()
			})
			setTimeout(function(){
				$('#infoDB_'+id+' div').css('background-color','#1885e7')
			},100)
			$('#infoDB_'+id+' img').attr('src','images/whiteArrowDn@2x.png')
			advice_obj[id].info = true
		}
		root.trackHeight()
	}
}