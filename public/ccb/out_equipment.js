var _orgTree = null;
function orgTree() {
	if (_orgTree) return _orgTree;
	var ret = new OrganizationMenueTree("divOrgTree", "orgTree", "organization");
	_orgTree = ret;
	return ret;
}

function EquOutMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}
EquOutMgr.prototype = new EquMgr("equ");

EquOutMgr.prototype.filter = 0;
EquOutMgr.prototype.btnOut = "btnout";
EquOutMgr.prototype.mdlOut = "mdlOut";
EquOutMgr.prototype.objIds = {
	organization_for_upd: "organization_for_upd"
};

EquOutMgr.prototype.cacheData = function (data) {
	this.data = data.assets;
	this.asset_kinds = new TreeData(data.asset_kinds);
	this.asset_brand = new TreeData(data.asset_brand);
	this.organizations = new TreeData(data.organizations);
	this.asset_unit = new ComboData(data.asset_unit);
	this.purposes = new ComboData(data.purposes);
	this.storage = new ComboData(data.storage);
	return true;
};

EquOutMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;

	var piThis = this;
	
	var opt = EquipmentGridSetting();
	opt.bProcessing = true;		
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");

		$btn = $("#" + piThis.tableId + " tbody td button[" + piThis.btnOut + "]");
		$btn.unbind("click");
		$btn.click(function () {
			var rid = this.getAttribute("rid");
			piThis.popModalOut(rid);
			return true;
		});

		$btn = $("#" + piThis.tableId + " tbody td button[" + piThis.btnUpd + "]");
		$btn.unbind("click");
		$btn.click(function () {
			var rid = this.getAttribute("rid");
			piThis.popModalUpd(rid);
			return true;
		});

		$btn = $("#" + piThis.tableId + " tbody td button[" + piThis.btnDel + "]");
		$btn.unbind("click");
		$btn.click(function () {
			var rid = this.getAttribute("rid");
			piThis.popModalDel(rid);
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

EquOutMgr.prototype.filterEqu = function (equ) {
	if (this.filter == EquFilter().inStorage) {
		return equ.inCount > 0;
	} else if (this.filter == EquFilter().outStorage) {
		return equ.inCount <= 0;
	} else {
		return true;
	}	
}

EquOutMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "# id"));
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "仓库"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "质保期限"));
	ret.push(new TableHead("", "数量"));
	ret.push(new TableHead("", "经办人"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

EquOutMgr.prototype.buildOutRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		var inCount = item.cnt - item.outCount;
		//if (!this.filterEqu(item)) continue;
		ret.push("<tr equid='", i, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		//ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.storage_name, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", parseDate(item.maintain_stop).Format("yyyy-MM-dd"), "</td>");
		ret.push("<td>", 1, "</td>");
		ret.push("<td>", item.operator_name, "</td>");
		ret.push("<td>");
		if (item.submitAcceptedCount == 0) {
			ret.push("<span style='color:red;'>设备未验收</span>");
		} else {
			ret.push("<div class='am-btn-toolbar'>");
			ret.push("<div class='am-btn-group am-btn-group-sm'>");
			ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' ", this.btnUpd, " rid='", i, "'", (item.inCount == 0 ? " disabled" : ""), " title='修改'>");
			ret.push("<span class='am-icon-pencil-square-o'></span>");
			ret.push("</button>");
			ret.push("<button");
			ret.push(" class='am-btn am-btn-default am-btn-sm am-text-secondary'");
			ret.push(" ", this.btnDel);
			ret.push(" rid='", i, "'");
			ret.push((item.inCount == 0 ? " disabled" : ""));
			ret.push(" title='撤销'");
			ret.push(">");
			ret.push("<span class='am-icon-trash-o'></span>");
			ret.push("</button>");
			ret.push("</div>");
			ret.push("</div>");
		}
		ret.push("</td>");
		ret.push("</tr>");
	}

	return true;
};

EquOutMgr.prototype.buildRow = function (data, parentPath, ret) {
	var activeStatusFilterId = this.getActiveStatus().id;
	var statusFilter = this.statusFilter;

	if (activeStatusFilterId == statusFilter.out.id) {
		this.buildOutRow(data, parentPath, ret);
		return 1;
	}

	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		var inCount = item.cnt - item.outCount;
		//if (!this.filterEqu(item)) continue;
		ret.push("<tr equid='", i, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		//ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.storage_name, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", parseDate(item.maintain_stop).Format("yyyy-MM-dd"), "</td>");
		ret.push("<td>", item.inCount, "</td>");
		ret.push("<td>", item.operator_name, "</td>");
		ret.push("<td>");
		if (item.submitAcceptedCount == 0) {
			ret.push("<span style='color:red;'>设备未验收</span>");
		} else {
			ret.push("<div class='am-btn-toolbar'>");
			ret.push("<div class='am-btn-group am-btn-group-sm'>");
			ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='出库' ", this.btnOut, " rid='", i, "'", (item.inCount == 0 ? " disabled" : ""), ">");
			ret.push("<span class='am-icon-mail-forward'></span> ");
			ret.push("</button>");
			ret.push("</div>");
			ret.push("</div>");	
		}
		ret.push("</td>");
		ret.push("</tr>");
	}
	
	return true;
};

EquOutMgr.prototype.loadAssetDetails = function (idx, withSelf) {
	var equ = this.dataItems(idx);
	var piThis = this;
	var sendData = {in_code_id: equ.in_code_id, storage_id: equ.storage_id};
	if (withSelf) sendData.asset_id = equ.id;
	$.ajax({
		url: this.route + "/equipments",
		cache: false,
		async: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.equDetail = data;
	}, function() {
		alert("获取序列号失败！")
	});
};

EquOutMgr.prototype.getEquEditBody = function (_token, act, id) {
	var html = [];
	html.push("<form class='am-form am-form-horizontal' onsubmit='return false;'>");
	html.push("<input type='hidden' name='_token' value='" + _token + "'>");
	html.push("<input type='hidden' name='id' value='" + id + "'>");
	html.push("<input type='hidden' name='act' value='" + act + "' />");
	html.push("<div class='am-form-group'>");
	html.push("<input type='hidden' in_code />");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='storage_id' class='' placeholder='仓库' title='仓库' required readonly />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='kind_id' class='' placeholder='设备名称' title='设备名称' readonly />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='brand_id' class='' placeholder='设备规格型号' title='设备规格型号' readonly />");
	html.push("</div>");
	//使用部门
	
	//办理日期
	//html.push("<div class='am-u-sm-4'>");
	//html.push("<input class='modal-text' type='text' class='am-form-field' name='out_date' placeholder='办理日期' title='办理日期' data-am-datepicker readonly />");
	//html.push("</div>");
	//html.push("<div class='am-u-sm-4'>");
	//html.push("<input class='modal-text' type='text' name=='kind_id' class='' placeholder='设备使用人' title='设备使用人' />");
	//html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	//使用部门
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='user_department' id='organization' onclick='orgTree().show();' class='am-form-field' placeholder='使用部门' title='使用部门' releasevalue='' readonly required />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='' class='' placeholder='设备使用人' title='设备使用人' />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='asset_name' class='' placeholder='设备领用人' title='设备领用人' />");
	html.push("</div>");
	html.push("</div>");
	
	html.push("<div class='am-form-group'>");
	//序列号
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='serials_code' title='序列号' required>");
	html.push("<option value=''>序列号</option>");
	html.push("</select>");
	//html.push("<input class='modal-text' type='text' name='serials_code' class='' placeholder='序列号' title='序列号' required />");
	html.push("</div>");
	//资产编号
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='financial_code' title='资产编号' required>");
	html.push("<option value=''>资产编号</option>");
	html.push("</select>");
	html.push("</div>");
	//主要用途
	var oPurpose = getEquPurposes();
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='purpose' title='主要用途' required>");
	html.push(oPurpose.toHTML());
	html.push("</select>");
	html.push("</div>");
	html.push("</div>");
	
	html.push("<div class='am-form-group am-form-success am-form-icon am-form-feedback'>  ");
	//办理日期
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='out_date' placeholder='办理日期' title='办理日期' data-am-datepicker readonly />");
	html.push("</div>");
	///设备数量
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='out_count' class='' placeholder='设备数量' title='设备数量' readonly/>");
	html.push("</div>");
	//可出库数量
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='max_out' class='' placeholder='可出库数量' title='可出库数量' readonly />");
	html.push("</div>");
	html.push("</div>");

	html.push("<div class='am-form-group'>");
	//出库经办人
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='operate_user_id' placeholder='出库经办人' title='出库经办人' required readonly />");
	html.push("</div>");
	//保存
	html.push("<div class='am-u-sm-4'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn am-fl'>保存</button>");
	html.push("</div>");	
	html.push("</div>");
	
	html.push("</form>");

	return html.join("");
};

//EquOutMgr.prototype.initModalUpd = function (id) {
//	var frmId = "#" + this.mdlUpdContainerId + " form";
//	var equ = this.itemData("in_code", id);
//	var list = [];
//	if (equ) {
//		var piThis = this;
//		$.ajax({
//			url: this.route + '/list',
//			cache: false,
//			async: false,
//			data: {storage_id:equ.storage_id, in_code: equ.in_code},
//			dataType: 'json'
//	    }).then(function(data) {
//		    list = data;
//	    }, function() {
//			alert("请求失败！")
//	    });
//
//		$(frmId + " input[name='storage_id']").val(equ.storage_name);
//		$(frmId + " input[name='asset_name']").val(equ.name);
//
//		var $serialsCodeList = $(frmId + " select[name='serials_code']");
//		var $financialCodeCodeList = $(frmId + " select[name='financial_code']");
//		for (var i = 0; i < list.length; i++) {
//			$serialsCodeList.append("<option value='" + list[i].serials_code + "'>" + list[i].serials_code + "</option>");
//			$financialCodeCodeList.append("<option value='" + list[i].financial_code + "'>" + list[i].financial_code + "</option>");
//		}
//
//		//var zt = orgTree();
//		//var item = this.organizations.item(this.userInfo.organization_id);
//		//zt.init(item);
//
//		$(frmId + " input[name='out_date']").val((new Date).Format("yyyy-MM-dd"));
//		$(frmId + " input[name='out_date']").datepicker({format: 'yyyy-mm-dd'});
//
//		$(frmId + " input[name='kind_id']").val(equ.kind_name);
//		$(frmId + " input[name='brand_id']").val(equ.brand_name);
//		$(frmId + " input[name='model']").val(equ.model);
//
//		if (list.length > 0) {
//			$(frmId + " input[name='out_count']").attr("min", "1");
//			$(frmId + " input[name='out_count']").attr("max", list.length);
//			$(frmId + " input[name='out_count']").val(1);
//		} else {
//			$(frmId + " input[name='out_count']").attr("min", "0");
//			$(frmId + " input[name='out_count']").attr("max", "0");
//			$(frmId + " input[name='out_count']").val(0);
//		}
//		$(frmId + " input[name='user_id']").val(equ.user_id);
//		$(frmId + " input[name='purpose']").val(equ.purpose);
//		$(frmId + " input[name='out_code']").val("CKBH-" + generateMixed(3));
//		$(frmId + " input[name='operate_user_id']").val(this.userInfo.real_name);
//		$(frmId + " input[name='max_out']").val(list.length);
//	}
//
//	return true;
//};

EquOutMgr.prototype.onOutOk = function (data) {
	var count = parseInt(data.affectCount);
	if (count > 0) {
		alert("出库成功！");
		var equ = this.dataItems(data.id);
		if (equ) {
			equ.inCount = parseInt(equ.inCount, 10) - 1;
			$("#" + this.tableId + " tr[equid='" + data.id + "'] td:eq(5)").html(equ.inCount);
		}
		$("#" + this.mdlOut).modal("close");
	} else {
		alert("请求失败！");
	}
};

EquOutMgr.prototype.onOutErr = function (request) {
	alert("出库失败！");
	$("#" + this.mdlOut).modal("close");
};

EquOutMgr.prototype.submitOut = function () {
	var organization_id = $("#organization").attr("releasevalue");
	var frmData = new FormData($("#" + this.mdlOut + " form")[0]);
	frmData.append("qp", this.getQueryParameter());
	frmData.append("organization_id", organization_id);

	var piThis = this;
	$.ajax({
		url: this.route + "/submit",
		type: "POST",
		data: frmData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			piThis.onOutErr(request);
		},
		success: function(data) {
			piThis.onOutOk(data);
		}
	});
	return true;
};

EquOutMgr.prototype.initModalOut = function (idx) {
	var containerId = "#" + this.mdlOut + " div.am-modal-dialog div.am-modal-bd";
	var frmId = "#" + this.mdlOut + " form";
	var $out_date = $(frmId + " input[name='out_date']");
	$out_date.val((new Date).Format("yyyy-MM-dd"));
	$out_date.datepicker({format: 'yyyy-mm-dd'});

	var equ = this.dataItems(idx);
	$(containerId + " select[name='storage_id']").val(equ.storage_id);

	if (!this.validOptionsOut) {
		var opt = baseFormValidationOption();
		var piThis = this;
		opt.submit = function () {
			if (this.isFormValid()) {
				piThis.submitOut();
			}
			return false;
		};
		this.validOptionsOut = opt;
	}

	$(containerId + " form").validator(this.validOptionsOut);

	//var org = this.organizations.item(this.userInfo.organization_id);
	//orgTree().init(org);
};

EquOutMgr.prototype.popModalOut = function (idx) {
	this.loadAssetDetails(idx);

	var equ = this.dataItems(idx);
	var piThis = this;

	var containerId = "#" + this.mdlOut + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();

	var html = [];
	html.push("<form class='am-form am-form-horizontal' onsubmit='return false;'>");
	html.push("<input type='hidden' name='_token' value='" + _token + "'>");
	html.push("<input type='hidden' name='id' value='" + idx + "'>");
	html.push("<input type='hidden' name='in_code_id' value='" + equ.in_code_id + "' />");
	html.push("<input type='hidden' name='from_storage_id' value='" + equ.storage_id + "' />");
	html.push("<input type='hidden' name='operate_user_id' value='" + this.userInfo.id + "' />");

	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='storage_id' title='仓库' required disabled>");
	html.push("<option value=''>仓库</option>");
	html.push(this.storage.getComboBoxList());
	html.push("</select>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='kind_id' class='' placeholder='设备名称' title='设备名称' value='", equ.kind_name, "' readonly />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='brand_id' class='' placeholder='设备规格型号' title='设备规格型号' value='", equ.brand_name, "' readonly />");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	//使用部门
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='user_department' id='organization' onclick='orgTree().show();' class='am-form-field' placeholder='使用部门' title='使用部门' releasevalue='' readonly required />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='equipment_user' class='' placeholder='设备使用人' title='设备使用人' />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='receive_user' class='' placeholder='设备领用人' title='设备领用人' />");
	html.push("</div>");
	html.push("</div>");

	html.push("<div class='am-form-group'>");
	//序列号
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='serials_code' title='序列号'");
	html.push(" onchange='thisMgr().onSerialsCodeChange(this, event);'");
	html.push(" required>");
	html.push("<option value=''>序列号</option>");
	html.push(this.getSerialCodeOptions());
	html.push("</select>");
	html.push("</div>");
	//资产编号
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='financial_code' title='资产编号'");
	html.push(" onchange='thisMgr().onFinancialCodeChange(this, event);'");
	html.push(" disabled");
	html.push(">");
	html.push("<option value=''>资产编号</option>");
	html.push(this.getFinancialCodeOptions());
	html.push("</select>");
	html.push("</div>");
	//主要用途
	var oPurpose = getEquPurposes();
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='purpose' title='主要用途' required>");
	html.push("<option value=''>主要用途</option>");
	html.push(this.purposes.getComboBoxList());
	html.push("</select>");
	html.push("</div>");
	html.push("</div>");

	html.push("<div class='am-form-group am-form-success am-form-icon am-form-feedback'>  ");
	//办理日期
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='out_date' placeholder='办理日期' title='办理日期' data-am-datepicker readonly />");
	html.push("</div>");
	///设备数量
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='out_count' value='", (piThis.equDetail.length > 0 ? 1 : 0), "' placeholder='设备数量' title='设备数量' readonly/>");
	html.push("</div>");
	//可出库数量
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='max_out' value='", piThis.equDetail.length, "' placeholder='可出库数量' title='可出库数量' readonly />");
	html.push("</div>");
	html.push("</div>");

	html.push("<div class='am-form-group'>");
	//出库经办人
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='operator_name' value='", this.userInfo.real_name,"' placeholder='出库经办人' title='出库经办人' required readonly />");
	html.push("</div>");
	//保存
	html.push("<div class='am-u-sm-4'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn am-fl'>保存</button>");
	html.push("</div>");
	html.push("</div>");

	html.push("</form>");

	$(containerId).html(html.join(""));
	$("#" + this.mdlOut).modal(this.modalOptionsForUpd());

	this.initModalOut(idx);

	orgTree().targetId = 'organization';

	return true;
};

EquOutMgr.prototype.onUpdErr = function (data) {
	$("#" + this.mdlUpdContainerId).modal("close");
	alert("操作失败！");
};

EquOutMgr.prototype.onUpdOk = function (data) {
	$("#" + this.mdlUpdContainerId).modal("close");
	if (data.id < 0) {
		alert("操作失败！");
	} else {
		var equ = this.dataItems(data.id);
		$.extend(equ, data.affects[0]);
		alert("修改成功！");
	}
};

EquOutMgr.prototype.submitUpd = function () {
	var organization_id = $("#" + this.objIds.organization_for_upd).attr("releasevalue");
	var frmData = new FormData($("#" + this.mdlUpdContainerId + " form")[0]);
	frmData.append("qp", this.getQueryParameter());
	frmData.append("organization_id", organization_id);

	var piThis = this;
	$.ajax({
		url: this.route + "/upd/" + this.getActiveUpdItemIdx(),
		type: "POST",
		data: frmData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			piThis.onUpdErr(request);
		},
		success: function(data) {
			piThis.onUpdOk(data);
		}
	});
	return true;
};

EquOutMgr.prototype.onDelOk = function (data) {
	var idx = parseInt(data, 10);
	if (idx < 0) {
		$("#" + this.mdlDelContainerId).modal("close");
		alert("撤销失败！");
	} else {
		this.data.splice(idx, 1);
		this.onAllDataArrival();
		$("#" + this.mdlDelContainerId).modal("close");
		alert("撤销成功！");
	}
	return true;
};

EquOutMgr.prototype.sendDataForDel = function () {
	var ret = {};
	ret.idx = $("#" + this.mdlDelContainerId + " input[name='id']").val();
	ret.id = $("#" + this.mdlDelContainerId + " input[name='asset_id']").val();
	return ret;
};

EquOutMgr.prototype.initModalDel = function (idx) {
	var equ = this.dataItems(idx);
	$("#" + this.mdlDelContainerId + " input[name='id']").val(idx);
	$("#" + this.mdlDelContainerId + " input[name='asset_id']").val(equ.id);
	return true;
};

EquOutMgr.prototype.validOptionsForUpd = function () {
	if (!this._validOptionsUpd) {
		var opt = baseFormValidationOption();
		var piThis = this;
		opt.submit = function () {
			if (this.isFormValid()) {
				piThis.submitUpd();
			}
			return false;
		};
		this._validOptionsUpd = opt;
	}
	return this._validOptionsUpd;
};

EquOutMgr.prototype.initModalUpd = function (idx) {
	var equ = this.dataItems(idx);
	$("#" + this.mdlUpdContainerId + " select[name='storage_id']").val(equ.storage_id);
	$("#" + this.mdlUpdContainerId + " select[name='serials_code']").val(equ.serials_code);
	$("#" + this.mdlUpdContainerId + " select[name='financial_code']").val(equ.financial_code);
	$("#" + this.mdlUpdContainerId + " select[name='purpose']").val(equ.purpose);
	var org = this.organizations.item(this.userInfo.organization_id);
	$organization = $("#" + this.objIds.organization_for_upd);
	$organization.val(equ.organization_name);
	$organization.attr("releasevalue", equ.organization_id);
	orgTree().targetId = this.objIds.organization_for_upd;
	orgTree().init(org);
	orgTree().setDefault(equ.organization_id);
};

EquOutMgr.prototype.drawModalUpd = function (idx) {
	this.loadAssetDetails(idx, true);

	var equ = this.dataItems(idx);

	var html = [];
	html.push("<form class='am-form am-form-horizontal' onsubmit='return false;'>");
	html.push("<input type='hidden' name='id' value='" + idx + "'>");
	html.push("<input type='hidden' name='in_code_id' value='" + equ.in_code_id + "' />");
	html.push("<input type='hidden' name='from_storage_id' value='" + equ.storage_id + "' />");
	html.push("<input type='hidden' name='allot_id' value='" + equ.allot + "' />");
	html.push("<input type='hidden' name='asset_id' value='" + equ.id + "' />");

	html.push("<div class='am-form-group'>");
	html.push(this.getHTMLSnippet("comboStorage", this.comboStorage));
	html.push(this.getHTMLSnippet("textAssetKind", this.textAssetKind, {value: equ.kind_name}));
	html.push(this.getHTMLSnippet("textBrand", this.textBrand, {value: equ.brand_name}));
	html.push("</div>");

	html.push("<div class='am-form-group'>");
	html.push(this.getHTMLSnippet("textDepartment", this.textDepartment, {id: this.objIds.organization_for_upd}));
	html.push(this.getHTMLSnippet("textEquipmentUser", this.textEquipmentUser, {value: equ.user_name}));
	html.push(this.getHTMLSnippet("textReceiveUser", this.textReceiveUser, {value: equ.receive_user}));
	html.push("</div>");

	html.push("<div class='am-form-group'>");
	html.push(this.getHTMLSnippet("comboSerialCode", this.comboSerialCode, {}));
	html.push(this.getHTMLSnippet("cboFinancialCode", this.cboFinancialCode, {}));
	html.push(this.getHTMLSnippet("cboPurpose", this.cboPurpose));
	html.push("</div>");

	html.push("<div class='am-form-group am-form-success am-form-icon am-form-feedback'>");
	html.push(this.getHTMLSnippet("textOperateDate", this.textOperateDate, {value: parseDate(equ.allot_date).Format("YYYY-MM-DD")}));
	html.push(this.getHTMLSnippet("textOutCount", this.textOutCount, {value: this.equDetail.length > 0 ? 1 : 0}));
	html.push(this.getHTMLSnippet("textMaxOutCount", this.textMaxOutCount, {value: this.equDetail.length}));
	html.push("</div>");

	html.push("<div class='am-form-group'>");
	html.push(this.getHTMLSnippet("textOutOperator", this.textOutOperator, {value: this.userInfo.real_name}));
	html.push(this.getHTMLSnippet("buttonSave", this.buttonSave));
	html.push("</div>");

	html.push("</form>");

	var containerId = "#" + this.mdlUpdContainerId + " div.am-modal-dialog div.am-modal-bd";
	$(containerId).html(html.join(""));
	return true;
};

EquOutMgr.prototype.textAssetKind = function (properties) {
	properties.readonly = "readonly";
	return this.buildHTMLSnippet("input", properties);
};

EquOutMgr.prototype.textBrand = function (properties) {
	properties.readonly = "readonly";
	return this.buildHTMLSnippet("input", properties);
};

EquOutMgr.prototype.textDepartment = function (properties) {
	properties.onclick = "orgTree().show();";
	return this.buildHTMLSnippet("input", properties);
};

EquOutMgr.prototype.textOutCount = function (properties) {
	properties.readonly = "readonly";
	return this.buildHTMLSnippet("input", properties);
};

EquOutMgr.prototype.textMaxOutCount = function (properties) {
	properties.readonly = "readonly";
	return this.buildHTMLSnippet("input", properties);
};

EquOutMgr.prototype.textOutOperator = function (properties) {
	properties.readonly = "readonly";
	properties.required = "required";
	return this.buildHTMLSnippet("input", properties);
};

EquOutMgr.prototype.sendDataForUpd = function () {
	var frmId = "#" + this.mdlUpdContainerId + " form";
	var storages = this.storage;
	var equ = {};
	equ._token = $(frmId + " input[name='_token']").val();
	equ.id = $(frmId + " input[name='id']").val();
	equ.act = $(frmId + " input[name='act']").val();
	equ.storage_id = $(frmId + " input[name='storage_id']").val();
	equ.organization_id = $(frmId + " select[name='organization_id']").val();
	equ.user_department = $(frmId + " input[name='user_department']").attr("releasevalue");
	equ.kind_id = $(frmId + " input[name='kind_id']").val();
	equ.name = $(frmId + " input[name='asset_name']").val();
	equ.model = $(frmId + " input[name='model']").val();
	equ.out_count = $(frmId + " input[name='out_count']").val();
	equ.user_id = $(frmId + " input[name='user_id']").val();
	equ.purpose = $(frmId + " input[name='purpose']").val();
	equ.out_code = $(frmId + " input[name='out_code']").val();
	equ.operate_user_id = $(frmId + " input[name='operate_user_id']").val();
	equ.out_count_range = $(frmId + " input[name='out_count_range']").val();
	return equ;
};

EquOutMgr.prototype.getStorageStatus = function () {
	return this.storageStatus;
};

EquOutMgr.prototype.setStorageStatus = function (value) {
	this.storageStatus = value;
	return true;
};

EquOutMgr.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["withUser"] = 0;

	var activeStatusFilterId = this.getActiveStatus().id;
	var statusFilter = this.statusFilter;

	switch (activeStatusFilterId) {
		case statusFilter.in.id:
			qp["withInCount"] = 1;
			qp["groupByInCode"] = 1;
			qp["groupByStorage"] = 1;
			break;
		case statusFilter.out.id:
			qp["withInCount"] = 0;
			qp["groupByInCode"] = 0;
			qp["groupByStorage"] = 0;
			qp["withAllot"] = 1;
			qp["withUser"] = 1;
			qp["withAllot"] = 1;
			break;
	}

	return qp;
};

EquOutMgr.prototype.defaultSearchCriteria = function () {
	var ret = {};
	//ret._token = $("div.search_block div form input[name='_token']").val().trim();
	ret.contract_code = $("ul.search_block div input[contract_code]").val().trim();
	ret.in_time_start = $("ul.search_block div input[in_time_start]").val().trim();
	ret.in_time_end = $("ul.search_block div input[in_time_end]").val().trim();
	ret.status = this.getActiveStatus().key;
	ret.storageStatus = "";
	ret.groupByStorage = "1";
	ret.userId = this.userInfo.id;
	ret.organization_id = this.userInfo.organization_id;
	ret.qp = this.getQueryParameter();
	return ret;
};

EquOutMgr.prototype.getSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	ret.storageStatus = this.getStorageStatus();
	return ret;
};

EquOutMgr.prototype.getQuickSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	ret.storageStatus = this.getStorageStatus();
	return ret;
};

EquOutMgr.prototype.defaultStatus = function () {
	return this.statusFilter.in;
};

EquOutMgr.prototype.getSerialCodeOptions = function () {
	var detail = this.equDetail;
	var arr = [];
	for (var i = 0; i < detail.length; i++) {
		arr.push("<option idx='", i + 1, "' value='", detail[i].serials_code, "'>", detail[i].serials_code, "</option>");
	}
	return arr.join("");
};

EquOutMgr.prototype.getFinancialCodeOptions = function () {
	var detail = this.equDetail;
	var arr = [];
	for (var i = 0; i < detail.length; i++) {
		arr.push("<option idx='", i + 1, "' value='", detail[i].financial_code, "'>", detail[i].financial_code, "</option>");
	}
	return arr.join("");
};

EquOutMgr.prototype.onSerialsCodeChange = function (piSender, piEvent) {
	if (!this.equDetail) return "";
	var xPath = "#" + this.mdlOut + " form select[name='financial_code']";
	var idx = parseInt($(piSender.options[piSender.selectedIndex]).attr("idx"), 10);
	$(xPath).get(0).selectedIndex = idx;
};

EquOutMgr.prototype.onFinancialCodeChange = function (piSender, piEvent) {
	if (!this.equDetail) return "";
	var xPath = "#" + this.mdlOut + " form select[name='serials_code']";
	var idx = parseInt($(piSender.options[piSender.selectedIndex]).attr("idx"), 10);
	$(xPath).get(0).selectedIndex = idx;
};

EquOutMgr.prototype.getHTMLSnippetProperties = function() {
	var ret = this.HTMLSnippetProperties;

	ret.comboSerialCode.disabled = "disabled";
	delete ret.cboPurpose.disabled;

	return ret;
};

EquOutMgr.prototype.resetStatus = function (key) {
	this.setActiveStatus(key);

	var flag = true;

	$("button[status-switch]").each(function (i, btn) {
		var $btn = $(btn);

		if ($btn.attr("key") == key) {
			if ($btn.is(".am-btn-primary")) {
				flag = false;
			} else {
				$btn.addClass("am-btn-primary");
			}
		} else {
			if ($btn.is(".am-btn-primary")) $btn.removeClass("am-btn-primary");
		}
		return true;
	});

	if (flag || true) {
		this.submitSearch();
	}
};

EquOutMgr.prototype.initBody = function () {
	var piThis = this;

	$("button[status-switch]").click(function () {
		piThis.resetStatus($(this).attr("key"));
		return true;
	});

	$("div[" + this.quickNav + "] ul").show();

	return true;
};

EquOutMgr.prototype.initData = function () {
	var piThis = this;
	$.ajax({
		url: this.route,
		cache: false,
		async: false,
		data: this.getSearchCriteria(),
		dataType: 'json'
	}).then(function(data) {
		piThis.cacheData(data);
		piThis.onAllDataArrival();
		return true;
	}, function() {
		alert("请求失败！")
	});

	var org = this.organizations.item(this.userInfo.organization_id);
	orgTree().init(org);
};

var _outEquipmentsMgr = null;
function thisMgr() {
	if (_outEquipmentsMgr) return _outEquipmentsMgr;
	_outEquipmentsMgr = new EquOutMgr("out");
	return _outEquipmentsMgr;
}

function on_orgaziation_change(pSender) {
	var zt = orgTree();
	zt.init(thisMgr().organizations.item(pSender.value));
	zt.export();
	return true;
}

function showIns(pSender) {
	$("button[name]").removeClass("am-btn-primary");
	$(pSender).addClass("am-btn-primary");
	var mgr = thisMgr();
	mgr.setActiveStatus("in");
	mgr.submitQuickSearch();
	return true;
}

function showOuts(pSender) {
	$("button[name]").removeClass("am-btn-primary");
	$(pSender).addClass("am-btn-primary");
	var mgr = thisMgr();
	mgr.setActiveStatus("out");
	mgr.submitQuickSearch();
	return true;
}