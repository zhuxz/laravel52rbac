function EquBorrowMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

EquBorrowMgr.prototype = new EquMgr("equ");

EquBorrowMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;

	var piThis = this;
	
	var opt = EquipmentGridSetting();
	opt.bProcessing = true;		
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");
		
		$("#" + piThis.tableId + " tbody td a[" + piThis.btnUpd + "]").unbind("click");
		$("#" + piThis.tableId + " tbody td a[" + piThis.btnUpd + "]").click(function () {
			var equId = this.getAttribute("eqid");
			piThis.popModalUpd(equId);
			return true;
		});
		
		$("#" + piThis.tableId + " tbody td a[" + piThis.btnDel + "]").unbind("click");
		$("#" + piThis.tableId + " tbody td a[" + piThis.btnDel + "]").click(function () {
			var equId = this.getAttribute("eqid");
			//piThis.popModalDel(equId);
			$("#mdlAllocationRecord").modal(piThis.modalOptionsForAdd());
			return true;
		});
		
		return true;
	};
	opt.columnDefs = [ {    
	    "targets": [0],
		"visible": false    
	    } 
	];
	opt.aaSorting = [[0, "desc"]];

	this._dataTableOptions = opt;
	
	return opt;
};

EquBorrowMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "# id"));
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "供应商"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "入库总数"));
	ret.push(new TableHead("", "现库存"));
	ret.push(new TableHead("", "单价"));
	ret.push(new TableHead("", "经办人"));
	ret.push(new TableHead("", "部门"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

EquBorrowMgr.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr eqid='", item.in_code, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.name, "</td>");
		ret.push("<td>", item.model, "</td>");
		ret.push("<td>", item.totalCount, "</td>");
		ret.push("<td>", item.inCount, "</td>");
		ret.push("<td>", item.price, "</td>");
		ret.push("<td>", item.operate_user_id, "</td>");
		ret.push("<td>", item.organization_name, "</td>");
		ret.push("<td>");
		ret.push("<a href='javascript:void(0)' ", this.btnUpd, " eqid='", item.in_code, "'>设备借用</a>");
		ret.push("<a href='javascript:void(0)' ", this.btnDel, " eqid='", item.in_code, "' class='am-text-success'>&nbsp;&nbsp;借用记录</a>");
		ret.push("</td>");
		ret.push("</tr>");
	}
	
	return true;
};

EquBorrowMgr.prototype.getEquEditBody = function (_token, act, id) {
	var html = [];
	html.push("<form class='am-form am-form-horizontal' onsubmit='return false;'>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", id, "'>");
	html.push("<input type='hidden' name='act' value='", act, "' />");
	html.push("<div class='am-form-group'>  ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='department' placeholder='借出部门' readonly />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='serials_code' placeholder='借出设备序列号' readonly />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='asset_name' placeholder='借出设备名称' readonly />");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='model' placeholder='借出设备型号' readonly/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='user_id' placeholder='借出前设备使用人' readonly/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='target_department_id'>");
	html.push("<option value='option1'>设备借用部门</option>");
	html.push("<option value='option2'>选项二.....</option>");
	html.push("<option value='option3'>选项三........</option>");
	html.push("</select>");
	html.push("</div>");
	html.push("</div><p></p>");
	html.push("<div class='am-form-group'>  ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='target_user_id' placeholder='借用人' readonly/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='borrow_date' placeholder='借用日期' data-am-datepicker readonly/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='target_user_contact' placeholder='借用人联系方式' />");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn am-fl'>确定</button>");
	html.push("</div>");
	html.push("</div>");
	html.push("</form>");


	return html.join("");
};

EquBorrowMgr.prototype.initModalUpd = function (id) {
	var frmId = "#" + this.mdlUpdContainerId + " form";
	var equipment = this.itemData("in_code", id);
	if (equipment) {
		$(frmId + " input[name='department']").val(equipment.organization_name);
		$(frmId + " input[name='serials_code']").val(equipment.serials_code);
		$(frmId + " input[name='asset_name']").val(equipment.name);
		$(frmId + " input[name='user_id']").val(equipment.user_id);
		$(frmId + " input[name='model']").val(equipment.model);
		$(frmId + " input[name='target_user_id']").val(1);
		$(frmId + " input[name='borrow_date']").val((new Date()).Format("yyyy-MM-dd"));
		$(frmId + " input[name='borrow_date']").datepicker({format: 'yyyy-mm-dd'});
	}
	return true;
};

EquBorrowMgr.prototype.sendDataForUpd = function () {
	var frmId = "#" + this.mdlUpdContainerId + " form";
	var equ = {};
	equ._token = $(frmId + " input[name='_token']").val();
	equ.id = $(frmId + " input[name='id']").val();
	equ.act = $(frmId + " input[name='act']").val();
	equ.model = $(frmId + " input[name='model']").val();
	equ.department = $(frmId + " input[name='department']").val();
	equ.serials_code = $(frmId + " input[name='serials_code']").val();
	equ.user_id = $(frmId + " input[name='user_id']").val();
	equ.target_user_id = $(frmId + " input[name='target_user_id']").val();
	equ.target_department_id = $(frmId + " select[name='target_department_id']").val();
	equ.name = $(frmId + " input[name='asset_name']").val();
	equ.borrow_date = $(frmId + " input[name='borrow_date']").val();
	return equ;
};

var _borrowEquipmentsMgr = null;
function borrowEquipmentsMgr() {
	if (_borrowEquipmentsMgr) return _borrowEquipmentsMgr;	
	var ret = new EquBorrowMgr("borrow");
	_borrowEquipmentsMgr = ret;	
	return _borrowEquipmentsMgr;
}

function on_borrow_equipment_load() {
	var mgr = borrowEquipmentsMgr();
	
	showLoading();
	$.get("/equipment/all", {}, function (data) {
		mgr.cacheData(data);
		mgr.onAllDataArrival();
		hideLoading();
		return true;
	}, "json");

	$("#" + mgr.btnSearch).click(function () {
		mgr.submitSearch();
		return true;
	});
	
	return true;
}


//var _borrowEquipmentsMgr = null;
//function borrowEquipmentsMgr() {
//	if (_borrowEquipmentsMgr) return _borrowEquipmentsMgr;
	
//	var ret = new EquipmentsMgr();

//	ret.BuildEquipmentHead = function () {
//		var s = [];
//		s.push("<tr>");
//		s.push("<th></th>");
//		s.push("<th><a href='equipment-enter'>设备入库</a></th>");
//		s.push("<th><a href='out-equipment'>设备出库</a></th>");
//		s.push("<th><a href='allocation-equipment'>设备调拨</a></th>");
//		s.push("<th><a style='border-style: none none outset;' href='borrow-equipment'>设备借用</a></th>");
//		s.push("<th><a href='scrap-equipment'>设备报废</a></th>");
//		s.push("<th></th>");
//		s.push("<th></th>");
//		s.push("<th></th>");
//		s.push("<th></th>");
//		s.push("<th></th>");
//		s.push("</tr>");
//		s.push("<tr class='am-warning'>");
//		s.push("<th># id</th>");
//		s.push("<th>合同编号</th>");
//		s.push("<th>供应商</th>");
//		s.push("<th>设备名称</th>");
//		s.push("<th>设备型号</th>");
//		s.push("<th>入库总数</th>");
//		s.push("<th>现库存</th>");
//		s.push("<th>单价</th>");
//		s.push("<th>经办人</th>");
//		s.push("<th>部门</th>");
//		s.push("<th>操作</th>");
//		s.push("</tr>");

//		return s.join("");
//	}
	
//	ret.BuildEquipmentRow = function (data) {
//		var s = [];
//		s.push("<tr eqid='", data.id, "'>");
//		s.push("<td>", data.updated_at, "</td>");
//		s.push("<td>", data.contract_code, "</td>");
//		s.push("<td>", data.supplier, "</td>");
//		s.push("<td>", data.name, "</td>");
//		s.push("<td>", data.model, "</td>");
//		s.push("<td>", data.totalCount, "</td>");
//		s.push("<td>", data.inCount, "</td>");
//		s.push("<td>", data.price, "</td>");
//		s.push("<td>", data.operate_user_id, "</td>");
//		s.push("<td></td>");
//		s.push("<td>");
//		s.push("<a href='javascript:void(0)' btnBorrow eqid='", data.in_code, "'>设备借用</a>");
//		s.push("<a href='javascript:void(0)' btnBorrowRecord eqid='", data.in_code, "' class='am-text-success'>&nbsp;&nbsp;借用记录</a>");
//		s.push("</td>");
//		s.push("</tr>");

//		return s.join("");
//	};

//	ret.tableOptions = borrowTableOptions();
//	ret.mdlBorrowEquipmentId = "mdlBorrowEquipment";
//	ret.mdlBorrowEquipmentRecordId = "mdlBorrowEquipmentRecord";
	
//	ret.init();

//	_borrowEquipmentsMgr = ret;
	
//	return _borrowEquipmentsMgr;
//}

var _borrowTableOptions = null;
function borrowTableOptions() {
	if (_borrowTableOptions) return _borrowTableOptions;
	
	var ret = EquipmentGridSetting();
	ret.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");
		$("a[btnBorrow]").unbind("click");
		$("a[btnBorrow]").click(onBorrowClick);
		$("a[btnBorrowRecord]").unbind("click");
		$("a[btnBorrowRecord]").click(onBorrowRecordClick);
		return true;
	}
	ret.columnDefs = [ {    
	    "targets": [0],
		"visible": false
	    } 
	];
	ret.aaSorting = [[0, "desc"]];
	
	_borrowTableOptions = ret
	
	return ret;
}

var _borrowModalOption = null;
function borrowModalOption() {
	if (_borrowModalOption) return _borrowModalOption;
	var ret = {closeViaDimmer:false, width: 900, height:600};
	_borrowModalOption = ret;
	return ret;
}

var _borrowValidationOption = null;
function borrowValidationOption () {
	if (_borrowValidationOption) return _borrowValidationOption;
	
	var ret = baseFormValidationOption();
	
	ret.submit = function () {
		if (this.isFormValid()) {
			doBorrow();
		}		
		return false;
	};
	
	ret.validate = function(validity) {
		var val = $(validity.field).val().trim();
		var valid = false;
		if ($(validity.field).attr("department") != undefined) {
			valid = (val.length > 0);
		} else {
			valid = true;
		}
		validity.valid = valid;
	};

	_borrowValidationOption = ret;
	
	return _borrowValidationOption;
}

function initBorrowEquipmentsPage(data) {
	
	return true;
}

function initBorrowEquipmentModal(equipment) {
	var mgr = borrowEquipmentsMgr();
	var frmId = "#" + mgr.mdlBorrowEquipmentId + " form";
	if (equipment) {
		$(frmId + " input[department]").val("BM-" + generateMixed(3));
		$(frmId + " input[serials_code]").val(equipment.serials_code);
		$(frmId + " input[asset_name]").val(equipment.name);
		$(frmId + " input[user_id]").val(equipment.user_id);
		$(frmId + " input[model]").val(equipment.model);
		$(frmId + " input[target_user_id]").val(1);
		$(frmId + " input[borrow_date]").val(new Date());
	}
	
	return true;
}

function getBorrowInfoInModal(frmId) {
	var allocInfo = {};
	frmId = borrowEquipmentsMgr().mdlBorrowEquipmentId + " form";
	
	allocInfo.model = $("#" + frmId + " input[model]").val();
	allocInfo.department = $("#" + frmId + " input[department]").val();
	allocInfo.serials_code = $("#" + frmId + " input[serials_code]").val();
	allocInfo.user_id = $("input[user_id]").val();
	allocInfo.target_user_id = $("input[target_user_id]").val();
	allocInfo.target_department_id = $("select[target_department_id]").val();
	allocInfo.name = $("input[asset_name]").val();	
	return allocInfo;
}

function doBorrow() {
	var mgr = borrowEquipmentsMgr();
	var eqIdOnBorrow = getData("eqIdOnBorrow");
	var equ = getBorrowInfoInModal();
	$.get("/equipment/borrow/" + eqIdOnBorrow, equ, cbBorrow, "json");
	$('#' + mgr.mdlBorrowEquipmentId).modal("close");
	showLoading();
	return true;
}

function cbBorrow(data) {
	var mgr = borrowEquipmentsMgr();
	mgr.onSearchDataArrival(data);
	hideLoading();
	return true;
}

//function on_borrow_equipment_load() {
//	var mgr = borrowEquipmentsMgr();

//	$("#" + mgr.mdlBorrowEquipmentId).validator(borrowValidationOption());
	
//	showLoading();
//	$.get("/equipment/all", {}, function (data) {
//		initBorrowEquipmentsPage(data);
//		mgr.data.all = data;
//		mgr.refreshTable(data["assets"]);
//		hideLoading();
//		return true;
//	}, "json");
	
//	return true;
//}

function onBorrowClick() {	
	var eqId = this.getAttribute("eqid");
	var mgr = borrowEquipmentsMgr();
	var curEquipment = mgr.getEquipmentByInCode(eqId);
	if (!curEquipment) return false;
	
	initBorrowEquipmentModal(curEquipment);
	$("#" + mgr.mdlBorrowEquipmentId).modal(borrowModalOption());

	cacheData("eqIdOnBorrow", eqId);
	
	return true;
}

function onBorrowRecordClick() {	
	var eqId = this.getAttribute("eqid");
	var mgr = borrowEquipmentsMgr();
	var curEquipment = mgr.getEquipmentByInCode(eqId);
	if (!curEquipment) return false;
	
	//initBorrowEquipmentModal(curEquipment);
	$("#" + mgr.mdlBorrowEquipmentRecordId).modal(borrowModalOption());

	return true;
}