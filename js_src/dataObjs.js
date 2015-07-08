/*
This file forms part of the NHS Choices Heart Age Tool.
It is ©2014 NHS Choices.
It is released under version 3 of the GNU General Public License
Source code, including a copy of the license is available at https://github.com/Antbits/heartage

It contains code derived from https://github.com/BritCardSoc/JBS3Risk released by University of Cambridge.
*/
function LifetimeRiskRow(S_1,cif_cvd,cif_death,S_noDeath,cvd_noDeath){
	this.S_1 = S_1
	this.cif_cvd = cif_cvd
	this.cif_death = cif_death
	this.S_noDeath = S_noDeath
	this.cvd_noDeath = cvd_noDeath
}