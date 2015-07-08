/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage
*/
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
	Tablet: function() {
        return navigator.userAgent.match(/iPad|(?!.*mobile).*Android*/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
		//return true;
    }
};
var loadjscssfile = function(filename, filetype){
	if (filetype=="js"){
		var fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){
		var fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined"){
		document.getElementsByTagName("head")[0].appendChild(fileref)
	}
}
function keyEvtNumeric(e){
	if((e.keyCode >=48 && e.keyCode <=57)||(e.keyCode >=96 && e.keyCode <=105)||e.keyCode== 46 || e.keyCode== 8){
		return true;
	}else{
		return false;
	}
}
function inObj(o,l,r){
	if(r != null && typeof r != 'undefined'){
		o[l] = r;
	}
}
function replaceAll(str,mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
}
var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};
function getUrlVars()
{
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