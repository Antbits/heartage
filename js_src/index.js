/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage
*/
function index(){
	var self = this
	self.page = 0
	self.analytics_page = 0
	self.$nav = $('#nav')
	self.$dots = $('#dots')
	self.$header = $('#header')
	self.$mob_header = $('#mob_header')
	self.responsive = false
	self.w = '600px'
	var $next = $('#next')
	var $reset = $('#reset')
	var $back = $('#back')
	var $more_info_content = $('#more_info_content')
	var json_url = 'heartage.js'
	var transition = false
	var redirect_str = '/tools/documents/heartage/index.html';
	self.speed = 600
	self.retina = window.devicePixelRatio > 1;
	self.asset_dir = 'assets/'
	self.text_data = null
	var $main = $('#main')
	var $dialog_outer = $('#dialog_outer')
	var $dialog_inner = $('#dialog_inner')
	var $dialog_content = $('#dialog_content')
	var $result_loader = $('#result_loader')
	var locked = false
	self.device = 'desktop'
	self.layout = 'desktop'
	self.qstr = getUrlVars();
	self.img_str = ''
	var $pages = new Array($('#page_0'),$('#page_1'),$('#page_2'),$('#page_3'),$('#page_4'),$('#page_5'))
	$('#page_loader>div').css('background-color','#e81e26')
	if(self.qstr.hasOwnProperty('syn_id')){
		self.syn_id = self.qstr.syn_id
		self.syndicate = true
		redirect_str = '//https://media.nhschoices.nhs.uk/tools/documents/heartage/index.html';
		$('#splash_main>h1').before('<a href="//www.nhs.uk/Tools/Pages/heartage.aspx" target = "_new" id="syn_header"><img src = "images/choices-logo@2x.png" height="50" width="222" border="0"></a>')
	}else{
		self.syn_id = 'nhs'
		self.syndicate = false
	}
	if(isMobile.any()){
		self.device = 'phone'
	}
	if(self.qstr.layout == 'phone'){
		self.$dots.remove()
		self.layout = 'phone'
		loadjscssfile('css/healthcheck_mob.css','css')
	}
	if(self.qstr.layout == 'phone' || self.device == 'tablet'){
		document.getElementById('h_cm').type = 'number'
		document.getElementById('h_ft').type = 'number'
		document.getElementById('h_in').type = 'number'
		document.getElementById('w_kg').type = 'number'
		document.getElementById('w_st').type = 'number'
		document.getElementById('w_lb').type = 'number'
		document.getElementById('t_cholesterol_a').type = 'number'
		document.getElementById('t_cholesterol_b').type = 'number'
		document.getElementById('hdl_cholesterol_a').type = 'number'
		document.getElementById('hdl_cholesterol_b').type = 'number'
		document.getElementById('sys_bp').type = 'number'
		if(isMobile.iOS()){
			loadjscssfile('css/healthcheck_ios.css','css')
		}
	}
	if(self.retina || self.qstr.layout == 'phone'){
		var $imgs = $('img')
		for(var i=0;i<$imgs.length;i++){
			if($imgs[i].src.indexOf('@2x')==-1){
				$imgs[i].src = $imgs[i].src.replace('.png','@2x.png')
			}
		}
		this.img_str = '@2x'
	}
	loadjscssfile('js/z_lookupData.js','js')
	this.setResponsive = function(){
		self.responsive = true
		self.w = '100%'
		loadjscssfile('css/healthcheck_responsive.css','css');
		var msg = '<div id="more_close"><a href="javascript:;" class="close"><img src="images/close2.png" alt="close" width="17" height="17" /></a></div><p><img src="images/public-health@2x.png" width="150px" height="94"></p>'
		msg+= '<div class="p_hr">'+self.text_data.TextAreas.credit+'</div>'
		msg+='<div class="p_hr">'+self.text_data.PopupText.P1.replace('<br><br>','').replace('<img','<img style="margin-left:-22px" ')+'</div>'
		msg+='<div class="p_hr">'+self.text_data.PopupText.P2+'</div>'
		$more_info_content.html(msg)
		if(self.syndicate){
			$('#splash_main').css('background-image','url(images/syn_logo@2x.png)')
			$('#splash_main').css('background-size','186px 38px')
			$('#splash_main').css('background-position','center 25px')
		}
		window.parent.postMessage('{"antbits_w": "'+self.w+'","antbits_h": "'+$('#page_0').height()+'px"}', '*'); 
		$('#more_close>a').on('click',function(){
			$main.fadeIn(self.speed)
			$more_info_content.fadeOut(self.speed,function(){
				window.parent.postMessage('{"antbits_w": "'+self.w+'","antbits_h": "'+$('#page_0').height()+'px"}', '*'); 
			})
		})
		$('#more_info a').on('click',function(){
			$more_info_content.fadeIn(self.speed)
			$main.fadeOut(self.speed)
			window.parent.postMessage('{"antbits_w": "'+self.w+'","antbits_h": "'+($more_info_content.height()+30)+'px","scrolltop":true}', '*'); 
		});
		
	}
	this.getConfig = function(data){
		$.getJSON(json_url,function(data){
			self.stateObj = new maintain_state(self);
			self.analyticsObj = new analytics(self,{'id':'NHS-HC-heartage','title':'Check your heart age','category':'Self assessments'},self.syn_id);
			self.form = new form(self);
			self.results = new results(self);
			self.populateText(data)
			$('#page_loader').fadeOut(500,function(){$('#page_loader').remove()});
		})
	}
	this.dialog = function(key){
		if(!locked){
			$dialog_content.css('height','auto')
			if(typeof(key) == 'string'){
				var str = self.text_data.PopupText[key]
			}else{
				var str = '';
				for(var i=0;i<key.length;i++){
					if(i == key.length-1){
						str+='<div class="p_hr" style = "border:none;">'
					}else{
						str+='<div class="p_hr">'
					}
					
					str+=self.text_data.PopupText[key[i]]
					
					str+='</div>'
					
				}
			}
			if(str.length < 500){
				$dialog_inner.width('70%').css('margin-left','-38%')
			}else{
				$dialog_inner.width('80%').css('margin-left','-43%')
			}
			str = str.replace('.png',self.img_str+'.png')
			
			self.lockView()
			$dialog_outer.fadeTo(self.speed,0.6)
			$dialog_inner.fadeIn(self.speed)
			$dialog_content.html(str)
			setTimeout(function(){
				var h = $pages[self.page].height()
				if($dialog_content.height()>$(window).height()*0.85){
					$dialog_content.css('overflow-y','scroll').height($(window).height()*0.85).css('margin-top','10px')
				}
				var ih = Math.min($dialog_content.height(),$pages[self.page].height()+60)
				if(self.page == 0){
					ih+=80
				}
				if(self.qstr.layout == 'phone'){
					$dialog_inner.css('top','20px')
				}else{
					$dialog_inner.css('top',Math.max(10,((h-ih)/2))+'px')
				}
				
			},0)
		}
	}
	this.dialogClose = function(key){
			
			self.unlockView()
			$dialog_outer.fadeOut(self.speed/2)
			$dialog_inner.fadeOut(self.speed/2,function(){
				$dialog_content.css('overflow-y','auto').height(null).css('margin-top','0px')
			})
	}
	this.lockView = function(){
		$main.find("a").attr("tabindex", -1);
		$main.find("input").attr("tabindex", -1);
		$main.find("select").attr("tabindex", -1);
	}
	this.unlockView = function(){
		$main.find("a").attr("tabindex", null);
		$main.find("input").attr("tabindex", null);
		$main.find("select").attr("tabindex", null);
	}
	this.populateText = function(data){
		self.text_data = data
		$('#splash_copy').html('<p>'+data.TextAreas.splash+'</p>')
		$('#splash_footer').html('<img src="images/partner_logos'+self.img_str+'.png" width="335px" height="87px"><div>'+data.TextAreas.credit+'<div id = "partner_info"><a href = "javascript:;" id="p_info">More information about partners</a><br>Full <a href = "javascript:;" id="credits" >credits</a> can be read here</div></div>')
		
		$('#bp_data_alt').html(data.PopupText['3C2b'])
		$('#cholesterol_data_alt').html(data.PopupText['3C1b'])
		
		if(self.device == 'desktop' || self.qstr.layout == 'phone'){
			self.init()
		}else{
			window.parent.postMessage('{"antbits_check_responsive": "true"}', '*')
		}
	}
	this.paginate = function(){
		for(var $p = 0;$p < $pages.length; $p++){
			if($p == self.page){
				$pages[$p].show()
			}else{
				$pages[$p].hide()
			}
		}
		$back.on('click',function(e){
			setTimeout(function(){
				e.target.parentNode.blur()
			},100)
			if(!transition){
				self.changePage(self.page-1,false)
			}
		})
		$next.on('click',function(e){
			setTimeout(function(){
				e.target.parentNode.blur()
			},100)
			if(!transition){
				if(self.form.validate(self.page)){
					self.changePage(self.page+1,false)
				}
			}
		})
		$reset.on('click',function(e){
			setTimeout(function(){
				e.target.parentNode.blur()
			},100)
			self.resetAll()
		})
	}
	this.resetAll = function(){
		self.stateObj.clearState()
		$main.fadeOut('spd',function(){
			if(self.qstr.layout != 'phone' && !self.syndicate){
				window.parent.scrollTo(0, 0);
			}
			location.reload();
		})
		
	}
	this.changePage = function(target,snap){
		var spd = self.speed
		var d = self.page-target
		if(snap){
			spd = 0
		}
		$('#page_'+self.page).fadeOut(spd)
		if(self.page == 5 && target == 4){
			self.results.tidyUp()
		}
		transition = true
		self.page = target
		self.analytics_page = Math.max(self.analytics_page,self.page)
		
		if(self.page == 1){
			self.$header.delay(spd).fadeIn(spd)
			if(d<0){
				self.analyticsObj.start()
				setTimeout(function() {
					self.navFadeIn(spd) 
                },spd);
			}else{
				self.$nav.fadeOut(spd,function(e){self.navFadeIn(spd)})
			}
			self.$dots.delay(spd).fadeIn(spd)
			$('#page_'+self.page).delay(spd).fadeIn(spd,function(){transition=false})
		}else if(self.page > 1 && self.page < 5){
			if(d<0){
				self.analyticsObj.advance(self.page,5)
			}
			self.$header.delay(spd).fadeIn(spd);
			self.$nav.fadeOut(spd,function(e){
				self.navFadeIn(spd);
			})
			self.$dots.delay(spd).fadeIn(spd,function(){transition=false});
			$('#page_'+self.page).delay(spd).fadeIn(spd)
		}else if(self.page == 5){
			if(d<0){
				self.analyticsObj.advance(self.page,5)
			}
			self.$header.fadeOut(spd)
			self.$dots.fadeOut(spd)
			self.$nav.fadeOut(spd)
			$('#result_loader>div').css('background-color','#e81e26')
			$result_loader.delay(spd).fadeIn(spd,function(){
				window.scrollTo(0, 0);
				self.form.calc()
			}).delay(spd*5).fadeOut(spd,function(){transition=false})
			setTimeout(function(){
				$('#page_'+self.page).fadeIn(spd)
				self.navFadeIn(spd)
				$next.hide()
				$reset.show()
				
			},spd*7)
		}else{
			self.$nav.fadeOut(spd)
			self.$header.fadeOut(spd)
			$('#page_'+self.page).delay(spd).fadeIn(spd,function(){transition=false})
		}
		if(self.qstr.layout == 'phone' && self.page <= 1){
			$back.fadeOut(spd)
		}else{
			$back.delay(spd).fadeIn(spd);
		}
		if(!snap){
			self.form.storeState()
		}
		if(self.page <= 4){
			setTimeout(function(){
			window.parent.postMessage('{"antbits_w": "'+self.w+'","antbits_h": "700px"}', '*'); 
			},spd)
		}
		if(self.tabbing){
			switch(self.page){
				case 0:
					$('#start').focus();
				break;
				case 1:
					$('#dob_day').focus();
				break;
				case 2:
					$('#smoke').focus();
				break;
				case 3:
					$('#cholesterol_yes').focus();
				break;
				case 4:
					$('#diabetes_yes').focus();
				break;
			}
		}
		self.setPhoneHeight();
	}
	this.setPhoneHeight = function(){
		var target = $('#page_'+self.page)
		$('#shim').height(target.height()+100)
	}
	this.trackHeight = function(){
		var t = 0
		var target = $('#page_'+self.page)
		var duration = (self.speed/2)
		if(self.page == 5){
			duration = (self.speed*2)
		}
		var tracker = setInterval(function(){
			if(self.qstr.layout != 'phone'){
				window.parent.postMessage('{"antbits_w": "'+self.w+'","antbits_h": "'+(target.height()+100)+'px"}', '*'); 
			}else{
				
			}
			t+=(self.speed/50)
			if(t>= duration){
				clearInterval(tracker)
			}
			
			if(self.page == 5){
				if(self.qstr.layout == 'phone'){
					self.$nav.css('top',target.height()+50)
				}else{
					self.$nav.css('top',target.height())
				}
				
			}
		},10)
	}
	this.navFadeIn = function(spd){
		$next.show()
		$reset.hide()
		self.$nav.fadeIn(spd)
		if(self.page<5){
			self.$nav.css('top',($('#page_'+self.page).height()+90))
		}
		for(var i =1;i<5;i++){
			if(i <= self.page){
				$('#d'+i).attr('src','images/d_dn'+self.img_str+'.png')
			}else{
				$('#d'+i).attr('src','images/d_up'+self.img_str+'.png')
			}
		}
		if(self.qstr.layout == 'phone'){
			window.scrollTo(0, 0);
			if(self.page==5){
				self.$mob_header.show()
			}else{
				self.$mob_header.hide()
			}
		}
	}
	this.restoreState = function(obj){
		if(!self.responsive){
			self.form.restoreState(obj)
			if(obj.page == 5){
				self.results.counter_delay = 0
			}
			self.changePage(obj.page,true)
		}
	}
	this.redirect = function(url){
		window.parent.postMessage('{"antbits_redirect": "'+url+'"}', '*');   
	}
	
	$(window).on('message', function(e) {
		var tmp = (eval('(' +e.originalEvent.data+')'));
		if(tmp.hasOwnProperty('antbits_set_responsive')){
			if(tmp.antbits_set_responsive == 'mobile' || tmp.antbits_set_responsive == 'micro' || (self.syn_id == 'bhf' && self.device == 'phone')){
				self.setResponsive();
				$('#syn_header').remove()
			}
			self.init();
		}
	})
	if(self.qstr.layout != 'phone'){
		$(window).mousedown(function(e){
			self.tabbing = false
		})
		$(window).keydown(function(e){
			if(e.keyCode == 9 || e.keyCode == 13){
				self.tabbing = true
			}
		})
	}
	$(window).on('resize',function(e){
		if(self.qstr.layout == 'phone'){
			if(self.page == 5){
				self.$nav.css('top',($('#page_'+self.page).height()+50))
			}else{
				self.$nav.css('top',($('#page_'+self.page).height()+100))
			}
			
		}
		self.results.resizeLayout()
	})
	this.init = function(){
		$main.show()
		
		if(self.responsive){
			self.w = '100%'
			window.parent.postMessage('{"antbits_w": "'+self.w+'","antbits_h": "'+($('#page_0').height()+30)+'px"}', '*'); 
		}else{
			window.parent.postMessage('{"antbits_w": "'+self.w+'","antbits_h": "700px"}', '*');
		}
		
		self.$nav.fadeOut(0)
		$('#start').on('click',function(){
			if(self.device != 'phone'){
				self.changePage(1,false);
			}else{
				self.redirect(redirect_str+'?layout=phone')
			}
		})
		$('#dialog_close >a').on('click',function(){self.dialogClose()})
		$('#p_info').on('click',function(){self.dialog(['P1','P2','P3'])})
		$('#credits').on('click',function(){self.dialog('P4')})
		$dialog_outer.on('click',function(){self.dialogClose()})
		self.paginate()
		if(self.qstr.layout == 'phone'){
			$('#page_5>h2:first').remove()
			document.addEventListener("touchstart", function(){}, true);
			self.changePage(1,true);
			self.stateObj.restoreState();
			$('.form_btn').on('click',function(e){
				e.target.style.backgroundColor = '#136ab9'
				setTimeout(function(){
					e.target.style.backgroundColor = '#1885e7'
				},300)
			})
			$('#back').on('click',function(e){
				e.target.style.backgroundColor = '#8e8e8e'
				setTimeout(function(){
					e.target.style.backgroundColor = '#999999'
				},300)
			})
		}else{
			self.stateObj.restoreState();
		}
		self.setPhoneHeight();
	}
}