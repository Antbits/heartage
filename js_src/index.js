/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2020 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
It also contains code derived from http://qrisk.org/lifetime/QRISK-lifetime-2011-opensource.v1.0.tgz released by ClinRisk Ltd.
*/
var heartageIndex = function(path,$target,config,nocache){
	var self = this;
	self.page = 0
	self.$target = $target;
	self.config = config;
	self.loaded = 0;
	self.speed = 300;
	self.size = 16
	self.postmessage = false
	self.syn_id = 'nhs'
	self.msg_obj = {"id":"heartage","data":{},"action":"init"}
	self.width = $(window).width();
	self.keynav = false;
	self.framed = false;
	self.path = path;
	self.page_names = ['splash','form','results'];
	self.page_divs = [];
	self.urlvars = getUrlVars();
	self.townsend_api_path = '//preview.antbits.com/townsend/api.php';
	self.edge = window.navigator.userAgent.indexOf("Edge") > -1
	var locked,h,s,poller
	var page_title = $('title').html()
	self.config.tool_name = 'One You Heart Age'
	self.config.tool_category = 'Self assessments'
	self.config.tool_id = 'OneYouHA'
	self.config.tool_title = 'How healthy is your heart'
	self.config.accessibility_titles = {"form":"Please fill in your details","results":"Your heart age result"}
	self.config.adobe_state = 0
	if(document.referrer.indexOf('developer.api.nhs.uk') > -1){
		self.config.adobe_analytics = false;
	}
	if(self.urlvars.hasOwnProperty('syn_id')){
		self.syn_id = self.urlvars.syn_id;
		self.env = 'syndicated'
		self.syndicate = true;
	}else{
		self.syn_id = 'nhs';
		self.syndicate = false;
	}
	if(self.config.adobe_analytics && self.config.framed){
			$('head').append('<script src="'+self.path+'js/datalayer.js"></script>')
			$('head').append('<script src="//assets.adobedtm.com/launch-ENe7f6cdd7cc05409b86547d9153429788.min.js" async></script>')
			$('head').append("<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NQPC6C');</script>");
	}
	$.getJSON(path+'data.json?nocache='+nocache,function(data){
		self.data = data;
		self.data.TextAreas['path'] = path
		if(self.urlvars.framed){
			self.framed = true
			$target.addClass('heartage-framed')
			window.addEventListener("message", NHStoolMessage, false);
			function NHStoolMessage(e) {
				var data = (JSON.parse(event.data));
				if(typeof(data.action) != 'undefined' && data.id == 'heartage'){
					switch(data.action){
						case "init":
							self.postmessage = true
							self.init();
						break;
					}
				}
			}
			window.parent.postMessage(JSON.stringify(self.msg_obj), '*');
			var element = document.getElementById('tool_heart-age');
			$(window).on('resize', function() {
			  if ($(this).width() !== self.width) {
				self.width = $(this).width();
				self.resizeLayout((3.75*self.size),0);
			  }
			});
		}else{
			self.init();
		}
	})
	$('head').append('<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">')
	this.resizeLayout = function(adjust, speed ){
		if(self.postmessage){
			self.msg_obj.action = "resize" 
			self.msg_obj.data = {"height":($target.height()+adjust),"speed":self.speed};
			window.parent.postMessage(JSON.stringify(self.msg_obj), '*');
		}
	}
	this.scrollEvent = function(y){
		if(self.postmessage){
			self.msg_obj.action = "scroll"
			self.msg_obj.data = {"y":y,"speed":self.speed};
			window.parent.postMessage(JSON.stringify(self.msg_obj), '*');
		}else{
			var distance = $("html, body").scrollTop()-y;
			//self.speedAdjust(h,self.speed)
			$("html, body").animate({ scrollTop: y },self.speedAdjust(distance,self.speed));
		}
	
	}
	this.speedAdjust = function(distance,speed){
		var s = speed*(1,Math.sqrt(distance)*0.05)
		s = Math.min(1000,Math.max(300,s))
		return s
		//return 300;
	}
	this.init = function(){
		$target.html('')
		for(var i in self.page_names){
			$page = $('<div id  = "heartage-page-'+self.page_names[i]+'" class="heartage-page"></div>')
			$target.append($page)
			$page.load(path+'/templates/heartage-'+self.page_names[i]+'.html?nocache='+nocache,function(){
				self.processTemplate($(this));
			})
			if(i>0){
				$page.stop().fadeOut(0);
			}
			self.page_divs.push($page);
		}
		
	}
	
	this.nav = function(destination){
		var h1 = $('#tool_heart-age').outerHeight(true);
		var h2 = $('#heartage-page-'+destination).outerHeight(true)
		self.resizeLayout(h2-h1,self.speed);
		$('#tool_heart-age').height(h1)
		//Accessibility, alter page title for screen readers
		$('title').html(page_title+' | '+self.config.accessibility_titles[destination])
		//
		for(var i in self.page_divs){
			self.page_divs[i].addClass('heartage-fixed')
			if(destination == self.page_names[i]){
				self.page_divs[i].stop().delay(self.speed).fadeIn(self.speed,function(){
					self.resizeLayout(self.size*2,0);
				})
				$('#tool_heart-age').height(h1).stop().animate({'height':h2},(self.speed*2),function(){
					$('#tool_heart-age>div').removeClass('heartage-fixed')
					$('#tool_heart-age').css('height','auto')
				})
				self.scrollEvent($('#tool_heart-age').position().top)
				if(self.keynav){
					if(destination == 'results'){
						$('#heartage-masthead>span').focus()
					}else{
						$('#heartage-page-'+destination+' h2:first-of-type').focus()
					}
					
				}
			}else{
				self.page_divs[i].stop().fadeOut(self.speed)
			}
		}
	}
	this.initDetails = function(id){
		var pad = 3.75
		h = 0;
		var findDiv = function(e){
			if(e.target.nodeName == 'SPAN'){
				return  $($(e.target.parentNode.parentNode).find('div')[0])
			}else{
				return  $($(e.target.parentNode).find('div')[0])
			}
		}
		var findDetails = function(e){
			if(e.target.nodeName == 'SPAN'){
				return  $(e.target.parentNode.parentNode)
			}else{
				return  $(e.target.parentNode)
			}
		}
		if(self.edge){
			var $nodes = $("#"+id+" .heartage-edge-summary")
			locked = true;
			$("#"+id+" .heartage-edge-details>div").hide()
			$nodes.click(function(e){
				if($(e.target).parents('.heartage-locked').length==0){
					var $div = findDiv(e)
					var $details = findDetails(e)
					if($details.hasClass('heartage-open')){
						self.resizeLayout(0-$div.height(),self.speed);
						$div.stop().animate({ 
						   height: 0,
						   marginTop: 0
						}, self.speed, function(){
							$details.removeClass('heartage-open')
							$div.removeAttr("style");
							$(this).hide();
						});
					}else{
						var h = $div.outerHeight(true)
						self.resizeLayout(h+(3.75*self.size),self.speed);
						$div.show().addClass('heartage-zero-height')
						$div.stop().animate({ 
						   height: h,
						   marginTop: '1em'
						}, self.speed, function(){
							locked = false;
							$(this).removeClass('heartage-zero-height')
							$details.addClass('heartage-open')
							$(this).css('height','auto')
						});
					}
				}else{
					e.preventDefault();
				}
			})
		}else{
			var $nodes = $("#"+id+" details>summary")
			$nodes.click(function(e){
				if($(e.target).parents('.heartage-locked').length==0 && !locked && !self.form.checkStatus($(e.target),'locked') ){
					if(!self.keynav){
						var $div = findDiv(e)
						var $details = findDetails(e)
						locked = true;
						if($details.attr('open') == 'open' || $details.hasClass('heartage-open')){
							e.preventDefault();
							self.resizeLayout(0-$div.height(),self.speed)
							$div.animate({'height':0,'margin-top':0},self.speed,function(){
								locked = false;
								$details.removeAttr('open').removeClass('heartage-open')
								$(this).removeClass('heartage-zero-height');
								$(this).removeClass('heartage-dormant');
								$div.removeAttr("style")
							})
						}else{
							$div.addClass('heartage-dormant');
							locked = true;
							poller = setInterval(function(){
								if($div.height()>0){
									h = $div.height()
									self.resizeLayout(h+(pad*self.size),self.speed)
									$div.addClass('heartage-zero-height');
									$div.removeClass('heartage-dormant');
									$div.animate({'height':h+'px','margin-top':'1em'},self.speed,function(){
										locked = false;
										$(this).removeClass('heartage-zero-height')
										$details.addClass('heartage-open')
										$(this).css('height','auto')
									})
									clearInterval(poller);
								}
							},100)
						}
					}
				}else{
					e.preventDefault();
				}
			});
		}
	}
	this.processTemplate = function($target){
		var id = $target[0].id
		for(var i in self.data.TextAreas){
			var re = new RegExp("{{"+i+"}}", "g");
			var str = $target.html();
			str = str.replace(re, self.data.TextAreas[i])
			var re = new RegExp("src=\"images/", "g");
			str = str.replace(re, 'src="'+self.path+'images/')
			$target.html(str);
		}
		// if MS EDGE replace details elements
		if(self.edge){
			$('details>summary').replaceWith(function(){
				return $("<a />", {html: $(this).html()}).addClass('heartage-edge-summary');
			});
			$('details').replaceWith(function(){
				return $("<div />", {html: $(this).html()}).addClass('heartage-edge-details');
			});
			$target.find('a').attr('tabindex',0)
		}
		self.loaded++
		if(self.loaded >= 3){
			// All templates loaded, initialise the tool
			self.loaded = 0
			self.splash = new splashObj(this);
			self.form = new formObj(this);
			self.heartage = new heartageObj(self.path+"z_lookupData.js");
			self.splash.setEvents();
			self.form.setEvents();
			self.results = new resultsObj(this);
			self.results.setEvents();
			self.resizeLayout(self.size*3.75,0);
			self.analyticsObj = new analytics(self,{'id':'NHS-oneyou-heartage','title':'Check your heart age','category':'Self assessments'},self.syn_id);	
			self.analyticsObj.antbitsLog(true,0)
			// test stuff
			//self.urlvars['test'] = 'test'
			/*if(self.urlvars.hasOwnProperty('test')){
				self.form.testData();
				self.nav('form')
				setTimeout(function(){
					self.form.validate($('#heartage-page-form .heartage-panel-light'))
				},self.speed*4)
			}*/
		}
	}
	this.getData = function(session_log){
		session_log.v = 0
		session_log.et = 'Not stated'
		session_log.eth = 0
		session_log.smk = 0
		session_log.age = 0
		session_log.bmi = 0
		session_log.pc = 0
		session_log.tn = 0
		session_log.ch = 0
		session_log.sbp = 0
		session_log.p = Math.min(self.page,5)
		return session_log;
	}
	this.isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i) ? true : false;
		},
		Tablet: function() {
			return navigator.userAgent.match(/iPad|(?!.*mobile).*Android*/i) ? true : false;
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) ? true : false;
		},
		any: function() {
			return (self.isMobile.Android() || self.isMobile.iOS() || self.isMobile.Windows() || self.isMobile.Tablet());
		}
	};
	this.arrayUnique = function(a) {
		return a.reduce(function(p, c) {
			if (p.indexOf(c) < 0) p.push(c);
			return p;
		}, []);
	};
	this.replaceAll = function(str,mapObj){
		var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
		return str.replace(re, function(matched){
			return mapObj[matched.toLowerCase()];
		});
	}
	this.linkOut = function(url){
		if(self.postmessage){
			self.msg_obj.action = "redirect" 
			self.msg_obj.data = {"url":url};
			window.parent.postMessage(JSON.stringify(self.msg_obj), '*');
		}else{
			window.open(url);
		}
	}
	function getUrlVars(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
}
