//(function(){
//	console.log("ok");
	
//var id="__div_page_loading__";
//function __showLoading__() {try{document.write("<div id='"+id+"' style='position:absolute;left:0;top:0;'><p><br /><span style='background-color:#ffffff;font-weight:bold;font-size:20px'>Loading, please wait...</span></p></div>");}catch(e){}}
//function __hideLoading__() {try{var o=$(id);o.parentNode.removeChild(o);delete o;}catch(e){}finally{removeEvent(window, "load", __hideLoading__);}}
//__showLoading__();addEvent(window, "load", __hideLoading__);
//})();

function initQuickMenus(href) {
	var s = [];
	if (href == "equ-task") {
		
	} else {
		s.push("<thead>");
		s.push("<tr>");
		if (href == "equipment-enter") {
			s.push("<th style='border: 0px;padding-left:0px'><a style='border-style: none none outset;' href='equipment-enter'>设备入库</a></th>");
			s.push("<th style='border: 0px'><a href='equipment-accept'>设备验收</a></th>");
			s.push("<th style='border: 0px'><a href='out-equipment'>设备出库</a></th>");
			s.push("<th style='border: 0px'><a href='allocation-equipment'>设备调拨</a></th>");
			s.push("<th style='border: 0px'><a href='borrow-equipment'>设备借用</a></th>");
			s.push("<th style='border: 0px'><a href='scrap-equipment'>设备报废</a></th>");
			s.push("<th style='border: 0px' width='20%'>&nbsp;</th>");
			s.push("<th style='border: 0px;text-align:right;padding-right:0px;'><button onclick='showUnAccepted(this);' name='unAccepted' class='am-btn am-btn-default am-btn-warning' type='button'>未被验收</button></th>");
			s.push("<th style='border: 0px;text-align:right;padding-right:0px;'><button onclick='showAccepted(this);' name='accepted' class='am-btn am-btn-default' type='button'>已被验收</button></th>");
			s.push("<th style='border: 0px;text-align:right;padding-right:0px;'><button onclick='showAll(this);' name='all' class='am-btn am-btn-default' type='button'>全部</button></th>");
		} else if (href == "equipment-accept") {
			s.push("<th style='border: 0px;padding-left:0px;'><a href='equipment-enter'>设备入库</a></th>");
			s.push("<th style='border: 0px'><a style='border-style: none none outset;' href='equipment-accept'>设备验收</a></th>");
			s.push("<th style='border: 0px'><a href='out-equipment'>设备出库</a></th>");
			s.push("<th style='border: 0px'><a href='allocation-equipment'>设备调拨</a></th>");
			s.push("<th style='border: 0px'><a href='borrow-equipment'>设备借用</a></th>");
			s.push("<th style='border: 0px'><a href='scrap-equipment'>设备报废</a></th>");
			s.push("<th style='border: 0px' width='20%'>&nbsp;</th>");
			s.push("<th style='border: 0px'><button name='unAccepted' class='am-btn am-btn-default am-btn-warning' type='button' key='unAccepted' status-switch>未被验收</button></th>");
			s.push("<th style='border: 0px'><button name='accepted' class='am-btn am-btn-default' type='button' key='accepted' status-switch>已被验收</button></th>");
			s.push("<th style='border: 0px;text-align:right;padding-right:0px;'><button name='all' class='am-btn am-btn-default' type='button' key='acceptedAll'  status-switch>全部</button></th>");
		} else if (href == "out-equipment") {
			s.push("<th style='border: 0px;padding-left:0px;'><a href='equipment-enter'>设备入库</a></th>");
			s.push("<th style='border: 0px'><a href='equipment-accept'>设备验收</a></th>");
			s.push("<th style='border: 0px'><a style='border-style: none none outset;' href='out-equipment'>设备出库</a></th>");
			s.push("<th style='border: 0px'><a href='allocation-equipment'>设备调拨</a></th>");
			s.push("<th style='border: 0px'><a href='borrow-equipment'>设备借用</a></th>");
			s.push("<th style='border: 0px'><a href='scrap-equipment'>设备报废</a></th>");
			s.push("<th style='border: 0px' width='20%'>&nbsp;</th>");
			s.push("<th style='border: 0px'><button name='inStorage' class='am-btn am-btn-default am-btn-warning' type='button' key='in' status-switch>未出库设备</button></th>");
			s.push("<th style='border: 0px;text-align:right;padding-right:0px;'><button name='outStorage' class='am-btn am-btn-default' type='button' key='out' status-switch>已出库设备</button></th>");
		} else if (href == "allocation-equipment") {
			s.push("<th style='border: 0px;padding-left:0px;'><a href='equipment-enter'>设备入库</a></th>");
			s.push("<th style='border: 0px'><a href='equipment-accept'>设备验收</a></th>");
			s.push("<th style='border: 0px'><a href='out-equipment'>设备出库</a></th>");
			s.push("<th style='border: 0px'><a style='border-style: none none outset;' href='allocation-equipment'>设备调拨</a></th>");
			s.push("<th style='border: 0px'></th>");
			s.push("<th style='border: 0px'></th>");
			s.push("<th style='border: 0px' width='20%'>&nbsp;</th>");
			s.push("<th style='border: 0px'></th>");
			s.push("<th style='border: 0px;text-align:right;padding-right:0px;'><button status-switch name='generateAllotFile' class='am-btn am-btn-default' type='button' key='generateAllotFile' status-switch>调拨EXCEL表生成</button></th>");
		}
		s.push("</tr>");
		s.push("</thead>");
		
		$("#table").html(s.join(""));
	}
	
	return true;
}