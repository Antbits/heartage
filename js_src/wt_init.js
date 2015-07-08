/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage
*/
window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        dcsid: "dcss9yzisf9xjyg74mgbihg8p_8d2u",
        domain:"statse.webtrendslive.com",
        timezone:0,
        i18n:true,
        adimpressions:true,
        adsparam:"WT.ac",
        offsite:true,
        download:true,
        downloadtypes:"xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip",
        onsitedoms: "nhs.uk",
        fpcdom: ".www.nhs.uk",
        plugins:{
            hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="js/webtrends.min.js";    
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());
