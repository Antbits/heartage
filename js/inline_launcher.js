(function(){
		var self = this;
		var nocache = Math.random();
		var jquery = false;
		var inline = false;
		var id = 'heart-age'
		var scripts, currentScript, tmp,obj,id,saObj,filelist,queue,path,iframe
		if(typeof window.tools == 'undefined'){
			window.tools = {};
		}
		var script = document.getElementById('tool-script_'+id)
		var path = script.src.replace('js/inline_launcher.js','')
		var isMobile = {
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
				return (isMobile.Android() || isMobile.iOS() || isMobile.Windows() || isMobile.Tablet());
			}
		};
		this.loadAssets = function(){
			for(var key in filelist){
				include(path+filelist[key]);
			}
			self.initQueue();
		}
		function getScript(url, success) {
			var script = document.createElement('script');
			url+='?nocache='+nocache
			script.src = url;
			var head = document.getElementsByTagName('head')[0];
			done = false;
			script.onload = script.onreadystatechange = function() {
				if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
				done = true;
					success();
					script.onload = script.onreadystatechange = null;
					head.removeChild(script);
				};
			};
			head.appendChild(script);
		};
		this.checkJquery = function(){
			if (typeof jQuery == 'undefined' || typeof $ == 'undefined') {
				getScript(path+'vendor/jquery-3.4.1.min.js', function() {
					this.configure();
				});
			}else{
				this.configure();
			};
		};
		this.checkAdobeAnalytics = function(){
			if(typeof _satellite == 'undefined' && config.adobe_analytics){
				include('//assets.adobedtm.com/launch-ENe7f6cdd7cc05409b86547d9153429788.min.js');
			}
			self.loadAssets();
		}
		this.initQueue = function(){
			var timer = setInterval(function(){
				if(typeof heartageIndex != 'undefined' && $ != 'undefined'){
					self.init();
					clearInterval(timer)
				}
			},300)
		}
		this.init = function(){
			window.tools[id] = new heartageIndex(path,$('#tool_'+id),config,nocache);
		}
		self.configure = function(){
			$.getJSON(path+'config.json?nocache='+nocache,function(data){
				config = data;
				for(var i in config.inline_locations){
					if(window.location.href.indexOf(config.inline_locations[i])>-1){
						inline = true;
					}
				}
				var framed = window.self !== window.top
				if(window.location.href.indexOf('iframed')>-1){
					inline = false;
				}
				config.framed = framed
				if(!inline && !framed){
					$('#tool_'+id).html('<iframe id = "'+id+'-frame" frameborder = "0" scrolling="no" style = "width:100%;" src = "'+path+'index.html?framed=true"></iframe>')
					iframe = document.getElementById(''+id+'-frame')
					window.addEventListener("message", NHStoolMessage, false);
					function NHStoolMessage(e) {
						var msg_obj = (JSON.parse(e.data));
						if(typeof(msg_obj.action) != 'undefined' && msg_obj.id == 'heartage'){
							switch(msg_obj.action){
								case "init":
									iframe.contentWindow.postMessage(e.data, '*');
								break;
								case "redirect":
									window.location.href = msg_obj.data.url;
								break;
								case "resize":
									if(msg_obj.data.speed == 0){
										iframe.style.height = msg_obj.data.height+'px'
									}else{
										$(iframe).stop().animate({"height":msg_obj.data.height},msg_obj.data.speed)
									}
								break;
								case "scroll":
									var y = msg_obj.data.y
									var offset = $('#tool_'+id).offset().top
									var distance = $("html, body").scrollTop()-y;
									$("html, body").animate({scrollTop: y+offset },msg_obj.data.speed*Math.max(1,Math.sqrt(distance)*0.05));
								break;
							}
						}
					}
				}else{
					var cross_origin = false;
					var nhs = document.location.href.indexOf('nhs.uk') > -1
					if(framed){
						var referrer = '';
						if(document.referrer != ''){
							var referrer = new URL(document.referrer).hostname
						}
						cross_origin = referrer !== new URL(document.location.href).hostname
						nhs = document.referrer.indexOf('nhs.uk') > -1
						if(document.referrer.indexOf('developer.api.nhs.uk') > -1){
							config.adobe_analytics = false;
						}
					}	
					if(typeof NHSCookieConsent != 'undefined' && config.adobe_analytics && !framed && nhs){
						config.adobe_analytics = NHSCookieConsent.getStatistics();
					}
					switch(config.environment){
						case 'production':
							filelist = ['js/app.main.min.js','css/heartage.css','vendor/hammer.min.js'];
						break;
						case 'localhost':
							filelist = ['utilities/package.php','css/heartage.css','vendor/hammer.min.js'];
						break;
					}
					if(isMobile.any()){
						filelist.push('css/heartage-mobile.css')
					}
					queue = filelist.length;
					self.checkAdobeAnalytics();
				}
			})
		}
		function include(file, callback) {
			var head = document.getElementsByTagName('head')[0];
			var obj
			var filetype = file.split('.').pop();
			file+= '?nocache='+nocache
			switch(filetype){
				case 'css':
					obj = document.createElement('link');
					obj.type = 'text/css';
					obj.rel = 'stylesheet';
					obj.href = file;
				break;
				default:
					obj = document.createElement('script');
					obj.type = 'text/javascript';
					obj.src = file;
				break;
			}
			obj.onload = obj.onreadystatechange = function() {
				if (callback) {
					callback();
					obj.onload = null;
				}
			};
			head.appendChild(obj);
		}
		self.checkJquery()
	
})();