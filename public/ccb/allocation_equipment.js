function EquAllocMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

EquAllocMgr.prototype = new EquMgr("equ");

EquAllocMgr.prototype.btnDetail = "btndetail";
EquAllocMgr.prototype.btnDelete = "btndelete";
EquAllocMgr.prototype.mdlDetail = "mdlDetail";
EquAllocMgr.prototype.btnReject = "btnreject";
EquAllocMgr.prototype.btnConfirm = "btnconfirm";
EquAllocMgr.prototype.showWhat = 1; //1: 已生成的调拨记录; 2: 待生成的调拨记录

EquAllocMgr.prototype.cacheData = function (data) {
	this.data = data.poolAllots;
	this.organizations = new Organization(data.organizations);
	this.asset_kinds = new TreeData(data.asset_kinds);
	this.asset_brand = new TreeData(data.asset_brand);
};

EquAllocMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;

	var piThis = this;
	
	var opt = EquipmentGridSetting();
	opt.bProcessing = true;		
	opt.fnDrawCallback = function (oSettings) {
		$table = $(this);
		$table.addClass("am-table-striped am-table-hover");

		$btnDetail = $("#" + piThis.tableId + " tbody td button[" + piThis.btnDetail + "]");
		$btnDetail.unbind("click");
		$btnDetail.click(function (piEvent) {
			var $tr = $(this.parentNode.parentNode.parentNode.parentNode);
			var idx = parseInt($tr.attr("idx"), 10);
			piThis.popModalDetail(this, idx, piEvent);
			return true;
		});

		$btnDel = $("#" + piThis.tableId + " tbody td button[" + piThis.btnDelete + "]");
		$btnDel.unbind("click");
		$btnDel.click(function (piEvent) {
			var tr = this.parentNode.parentNode.parentNode.parentNode;
			var idx = parseInt(tr.getAttribute("idx"));
			piThis.dropAllotFile(this, idx, piEvent);
			piEvent.stopPropagation();
			return true;
		});

		$a = $("#" + piThis.tableId + " tbody tr td a[download-alloc-file]");
		if ($a.length > 0) {
			$a.unbind("click");
			$a.click(function(piEvent){
				var tr = this.parentNode.parentNode;
				var idx = parseInt(tr.getAttribute("idx"));
				piThis.downloadAllotFile(this, idx, piEvent);
				piEvent.stopPropagation();
			});
		}

		$lnkScanFile = $("#" + piThis.tableId + " tbody tr td a[download-upload-file]");
		if ($lnkScanFile.length > 0) {
			$lnkScanFile.unbind("click");
			$lnkScanFile.click(function (piEvent) {
				var tr = this.parentNode.parentNode;
				var idx = parseInt(tr.getAttribute("idx"));
				piThis.downloadAllotScanFile(this, idx, piEvent);
				piEvent.stopPropagation();
			});
		}

		$btnReject = $("#" + piThis.tableId + " tbody td button[" + piThis.btnReject + "]");
		$btnReject.unbind("click");
		$btnReject.click(function (piEvent) {
			var tr = this.parentNode.parentNode.parentNode.parentNode;
			var idx = parseInt(tr.getAttribute("idx"));
			piThis.rejectAllot(this, idx, piEvent);
			piEvent.stopPropagation();
			return true;
		});

		$btnConfirm = $("#" + piThis.tableId + " tbody td button[" + piThis.btnConfirm + "]");
		$btnConfirm.unbind("click");
		$btnConfirm.click(function (piEvent) {
			var tr = this.parentNode.parentNode.parentNode.parentNode;
			var idx = parseInt(tr.getAttribute("idx"));
			piThis.confirmAllot(this, idx, piEvent);
			piEvent.stopPropagation();
			return true;
		});

		$table.find("tbody tr").click(function(piEvent){
			piThis.onRowClick(this, piEvent);
		});

		return true;
	};
	opt.columnDefs = [ {    
	    "targets": [0],
		"visible": false    
	    } 
	];
	//opt.aaSorting = [[0, "desc"]];
	opt.bFilter = false;
	opt.bPageinage = false;
	opt.bPaginate = false;
	opt.bLengthChange = false;
	opt.bInfo = false;

	this._dataTableOptions = opt;
	
	return opt;
};

EquAllocMgr.prototype.getHeads = function () {
	var ret = [];
	ret.push(new TableHead("", "# id"));

	if (this.showWhat == 1) {
		ret.push(new TableHead("", "行名"));
		ret.push(new TableHead("", "调拨表名"));
		ret.push(new TableHead("", "发送时间"));
		ret.push(new TableHead("", "扫描件"));
		ret.push(new TableHead("", "扫描件上传时间"));
		ret.push(new TableHead("", "操作"));
	} else {
		ret.push(new TableHead("", "行名"));
		ret.push(new TableHead("", "表名"));
		ret.push(new TableHead("", "机构编码"));
		ret.push(new TableHead("", "操作"));
	}
	return ret;
};

EquAllocMgr.prototype.buildAllotRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	var branch;
	var root_id;
	var padding;
	for (i = 0; i < len; i++) {
		item = data[i];
		branch = this.organizations.item(item.organization_id);

		if (item.organization_id == this.organizations.root.id) {
			root_id = i;
			padding = 0;
			ret.push("<tr idx='", i, "'>");
		} else {
			padding = 4;
			ret.push("<tr idx='", i, "' parent='", root_id, "' style='display:none'>");
		}

		ret.push("<td>", i, "</td>");
		ret.push("<td", (padding > 0 ? " style='padding-left:10px'" : ""), ">", branch.name, "</td>");
		ret.push("<td>");
		ret.push("<a href='javascript:void(0)' download-alloc-file>");
		ret.push(branch.name, " ");
		ret.push((parseDate(item.begin_date)).Format("yyyy-MM-dd"), "至");
		ret.push((parseDate(item.end_date)).Format("yyyy-MM-dd"));
		ret.push("</a>");
		ret.push("</td>");
		ret.push("<td>", (parseDate(item.report_date)).Format("yyyy-MM-dd"), "</td>");

		if (padding > 0 && item.status >= 10) {
			ret.push("<td>");
			ret.push("<a href='javascript:void(0)' download-upload-file>");
			ret.push("下载审阅");
			ret.push("</a>");
			ret.push("</td>");
			ret.push("<td>", parseDate(item.upload_date).Format("yyyy-MM-dd"), "</td>");
		} else {
			ret.push("<td></td>");
			ret.push("<td></td>");
		}
		ret.push("<td>");
		ret.push("<div class='am-btn-toolbar'>");
		ret.push("<div class='am-btn-group am-btn-group-sm'>");

		if (padding == 0 || item.status == 1) {
			ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' ", this.btnDelete, " title='删除'>");
			ret.push("<span class='am-icon-trash-o'></span>");
			ret.push("</button>");
		} else if (item.status == 10) {
			ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' ", this.btnReject, " title='退回'>");
			ret.push("<span class='am-icon-retweet'></span>");
			ret.push("</button>");
			ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' ", this.btnConfirm, " title='正确'>");
			ret.push("<span class='am-icon-check-square-o'></span>");
			ret.push("</button>");
		} else {
			ret.push("<span style='color: green'>已审</span>");
		}
		ret.push("</div>");
		ret.push("</div>");
		ret.push("</td>");
		ret.push("</tr>");
	}
};

EquAllocMgr.prototype.buildRow = function (data, parentPath, ret, criteria) {
	if (this.showWhat == 1) {
		this.buildAllotRow(data, parentPath, ret);
		return true;
	}

	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr idx='", i, "'>");
		ret.push("<td>", i, "</td>");
		ret.push("<td>", item.name, "</td>");
		ret.push("<td>", item.name, " ", criteria.begin_date, "至", criteria.end_date, "</td>");
		ret.push("<td>", item.code, "</td>");
		ret.push("<td>");
		ret.push("<div class='am-btn-toolbar'>");
		ret.push("<div class='am-btn-group am-btn-group-sm'>");
		ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='查看明细' ", this.btnDetail, ">");
		ret.push("<span class='am-icon-file-text-o'></span> ");
		ret.push("</button>");
		ret.push("</div>");
		ret.push("</div>");
		ret.push("</td>");
		ret.push("</tr>");
	}
	
	return true;
};

EquAllocMgr.prototype.onAllDataArrival = function (data, criteria) {
	if (this.showWhat == 1) {
		$("button[status-switch][key='" + this.statusFilter.generateAllotFile.key + "']").attr("disabled", true);
	} else {
		$("button[status-switch][key='" + this.statusFilter.generateAllotFile.key + "']").attr("disabled", false);
	}

	if (data) this.data = data;

	var html = [];
	html.push("<table id='tblList' width='100%' table-layout='fixed' class='am-table am-table-striped am-text-nowrap zj-table'>");
	html.push("<thead>");
	this.buildHead(html);
	html.push("</thead>");
	html.push("</tbody>");
	this.buildRow(this.data, null, html, criteria);
	html.push("</tbody>");
	html.push("</table>");

	$("#" + this.containerId).html(html.join(""));

	this.applyDataTable();

	return true;
};

EquAllocMgr.prototype.getEquEditBody = function (_token, act, id) {
	var html = [];
	html.push("<form class='am-form am-form-horizontal' onsubmit='return false;'>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", id, "'>");
	html.push("<input type='hidden' name='act' value='", act, "' />");
	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='department' placeholder='调出部门' />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='serials_code' placeholder='调出设备序列号'/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='asset_name' placeholder='调出设备名称'/>");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='model' placeholder='调出设备型号' readonly/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='user_id' placeholder='调出前设备使用人' readonly/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='target_department_id' style='height:39px;'>");
	html.push("<option value='option1'>设备调入部门</option>");
	html.push("<option value='option2'>选项二.....</option>");
	html.push("<option value='option3'>选项三........</option>");
	html.push("</select>");
	html.push("</div>");
	html.push("</div><p></p>");
	html.push("<div class='am-form-group'>  ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='target_user_id' placeholder='设备调入部门使用人' readonly/>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn am-fl'>确定</button>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'></div>");
	html.push("</div>");
	html.push("</form>");

	return html.join("");
};

EquAllocMgr.prototype.getDetailTable = function (arrRowData) {
	var arrRow = [];
	var branch;
	var asset_brand;
	var asset_brand_parent;
	var item;
	var i;
	var len = arrRowData.length;
	for (i = 0; i < len; i++) {
		item = arrRowData[i];
		branch = this.organizations.getBranch(item.organization_id);
		asset_brand = this.asset_brand.item(item.brand_id);
		asset_brand_parent = this.asset_brand.item(asset_brand.father_id);
		arrRow.push("<tr");
		arrRow.push(">");
		arrRow.push("<td>", branch.name, "</td>");
		arrRow.push("<td>", item.organization_name, "</td>");
		arrRow.push("<td>", item.organization_code, "</td>");
		arrRow.push("<td>", item.kind_name, "</td>");
		arrRow.push("<td>1</td>");//数量
		arrRow.push("<td>", parseDate(item.receive_date).Format("yyyy-MM-dd"), "</td>");//领用日期
		arrRow.push("<td>", item.user_name, "</td>");//使用人
		arrRow.push("<td>", item.purposes_name, "</td>");//用途
		arrRow.push("<td>", item.serials_code, "</td>");//序列号
		arrRow.push("<td>", asset_brand_parent.name, "</td>");//品牌
		arrRow.push("<td>", item.brand_name, "</td>");//型号
		arrRow.push("<td>", item.financial_code, "</td>");//资产编码
		arrRow.push("</tr>");
	}

	if (arrRow.length > 0) {
		var ret = ["<table"];
		//ret.push(" cellpadding='1'");
		//ret.push(" cellspacing='1'");
		ret.push(" style='border-collapse:collapse;border-spacing:1px;'");
		ret.push(">");
		ret.push("<thead");
		ret.push(">");
		ret.push("<tr>");
		ret.push("<th><div style='width: 60px'>行名</th>");
		ret.push("<th><div style='width: 60px'>使用网点（部门）名称</div></th>");
		ret.push("<th><div style='width: 60px'>使用网点（部门）机构代码</div></th>");
		ret.push("<th><div style='width: 60px'>设备名称</div></th>");
		ret.push("<th><div style='width: 60px'>数量</div></th>");
		ret.push("<th><div style='width: 60px'>领用日期</div></th>");
		ret.push("<th><div style='width: 60px'>使用人</div></th>");
		ret.push("<th><div style='width: 60px'>用途</div></th>");
		ret.push("<th><div style='width: 60px'>序列号</div></th>");
		ret.push("<th><div style='width: 60px'>品牌</div></th>");
		ret.push("<th><div style='width: 60px'>型号</div></th>");
		ret.push("<th><div style='width: 60px'>资产编码</div></th>");
		ret.push("</tr>");
		ret.push("</thead>");
		ret.push("<tbody>");
		ret.push(arrRow.join(""));
		ret.push("</tbody>");
		ret.push("</table>");
		return ret.join("");
	} else {
		return "";
	}
};

EquAllocMgr.prototype.initModalDetail = function (idx, data) {
	var xPathForm = "#" + this.mdlDetail + " form";
	var criteria = this.getSearchResult();
	var dataItem = this.dataItems(idx);

	$(xPathForm + " input[name='id']").val(idx);
	$(xPathForm + " input[name='begin_date']").val(criteria.begin_date);
	$(xPathForm + " input[name='end_date']").val(criteria.end_date);
	$(xPathForm + " input[name='organization_id']").val(dataItem.id);

	$(xPathForm + " span[root-organization-name]").html(dataItem.name);

	var s = ["向【",dataItem.name ,"】分配调拨EXCEL表单"];
	s.push("（", criteria.begin_date, " 至 ", criteria.end_date, "）");
	$btn = $(xPathForm + " button[generate-allot-file]");
	$btn.html(s.join(""));
	$btn.attr("disabled", false);
	$(xPathForm + " div[equipment-details]").html(this.getDetailTable(data));


	$("#" + this.mdlDetail).modal({closeViaDimmer:false, width: 1000, height:600});

	$("div[equipment-details] table").DataTable(this.dataTableOptions());
	return true;
};

EquAllocMgr.prototype.popModalDetail = function (piSender, idx) {
	var dataItem = this.dataItems(idx);
	var piThis = this;
	var sendData = {};
	sendData.root_organization_id = dataItem.id;

	$.ajax({
		url: this.route + '/detail',
		cache: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.initModalDetail(idx, data);
	}, function() {
		alert("请求失败！");
	});

	var xPathForm = "#" + this.mdlDetail + " form";
	$(xPathForm + " div[equipment-details]").html("加载数据...");
	$(xPathForm + " span[allot-description]").html("");
};

EquAllocMgr.prototype.sendDataForUpd = function () {
	var frmId = "#" + this.mdlUpdContainerId + " form";
	var storages = this.storage;
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
	equ.name = $(frmId + " input[asset_name]").val();
	
	return equ;
};

EquAllocMgr.prototype.getComboboxSecondBranch = function () {
	var arrSecondBranch = this.organizations.secondBranchList();
	var ret = [];
	//ret.push("<select");
	//ret.push(" name='organization_id'");
	//ret.push(">");
	ret.push("<option");
	ret.push(" value=''")
	ret.push(">选择机构</option>");
	for (var i = 0; i < arrSecondBranch.length; i++) {
		ret.push("<option");
		ret.push(" value='", arrSecondBranch[i].id, "'")
		ret.push(">", arrSecondBranch[i].name, "</option>");
	}
	//ret.push("</select>");

	return ret.join("");
};

EquAllocMgr.prototype.defaultSearchCriteria = function () {
	var ret = {};
	//ret._token = $("div.search_block div form input[name='_token']").val().trim();
	ret.qp = this.getQueryParameter();
	ret.userId = this.userInfo.id;
	ret.storage_id = this.userInfo.storage_id;
	ret.local_organization_id = this.userInfo.organization_id;
	ret.begin_date = $("ul.search_block div input[in_time_start]").val().trim();
	ret.end_date = $("ul.search_block div input[in_time_end]").val().trim();
	ret.organization_id = $("ul.search_block div select[name='organization_id']").val();
	return ret;
};

EquAllocMgr.prototype.getSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	return ret;
};

EquAllocMgr.prototype.resetSearchCriteria = function () {
	$comboBox = $("ul.search_block select[name='organization_id']");
	if ($comboBox.length > 0) {
		$comboBox.html(this.getComboboxSecondBranch());
	}
	//$div = $input.parent();
    //
	//var comboBox = this.getComboboxSecondBranch();
	//$input.remove();
	//$div.prepend(comboBox);
};

EquAllocMgr.prototype.setSearchResult = function (data) {
	this.searchResult = data;
};

EquAllocMgr.prototype.getSearchResult = function () {
	return this.searchResult;
};

EquAllocMgr.prototype.onSearchDataArrival = function (data) {
	this.setSearchResult(data);
	this.showWhat = 2;
	this.onAllDataArrival(data.pools, data);
	return true;
};

EquAllocMgr.prototype.submitSearch = function () {
	var piThis = this;
	showLoading();
	$.ajax({
		url: this.route + "/search",
		cache: false,
		type: 'POST',
		data: this.getSearchCriteria()
	}).then(function(data) {
		piThis.onSearchDataArrival(data);
		hideLoading();
	}, function() {
		alert("请求失败.");
		hideLoading();
	});
};

EquAllocMgr.prototype.resetStatus = function (key) {
	this.setActiveStatus(key);
	this.generateMultAllotFile();
};

EquAllocMgr.prototype.onGenerateMultAllotFileOk = function (data) {
	this.showWhat = 1;
	this.onAllDataArrival(data);
	alert("调拨成功！");
};

EquAllocMgr.prototype.generateMultAllotFile = function () {
	var sendData = {};
	var criteria = this.getSearchResult();
	sendData.begin_date = criteria.begin_date;
	sendData.end_date = criteria.end_date;

	var arrOrganizationId = [];
	this.eachData(function (i, item) {
		arrOrganizationId.push(item.id);
	});

	if (arrOrganizationId.length == 0) {
		alert("没有可调拨的设备！");
		return 1;
	} else {
		sendData.id_list = arrOrganizationId.join(",");
	}

	var piThis = this;
	$.ajax({
		url: this.route + '/mult',
		cache: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.onGenerateMultAllotFileOk(data);
	}, function() {
		alert("请求失败！");
	});
};

EquAllocMgr.prototype.onAllotOk = function (data) {
	$("#" + this.tableId + " tbody tr[idx='" + data + "']").hide();
	$("#" + this.mdlDetail).modal("close");
	alert("操作成功！");
};

EquAllocMgr.prototype.generateAllotFile = function () {
	$btn = $("#" + this.mdlDetail + " button[generate-allot-file]");
	$btn.html("正在分配...");
	$btn.attr("disabled", true);
	//$btn.css("color", "silver");

	var piThis = this;
	var frmData = new FormData($("#" + this.mdlDetail + " form")[0]);
	$.ajax({
		url: this.route + '/single',
		type: "POST",
		data: frmData,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			alert("操作失败！");
			$("#" + this.mdlDetail).modal("close");
		},
		success: function(data) {
			piThis.onAllotOk(data);
		}
	});
};

EquAllocMgr.prototype.onDropAllotFileOk = function (data) {
	if (data.is_root == 1) {
		$("#" + this.tableId + " tbody tr[parent='" + data.id + "']").remove();
		$("#" + this.tableId + " tbody tr[idx='" + data.id + "']").remove();
	} else {
		$("#" + this.tableId + " tbody tr[idx='" + data.id + "']").remove();
	}
	alert("删除成功！");
};

EquAllocMgr.prototype.dropAllotFile = function (piSender, idx, piEvent) {
	var dataItem = this.dataItems(idx);
	var sendData = {};
	sendData.begin_date = (new Date(dataItem.begin_date)).Format("yyyy-MM-dd");
	sendData.end_date = (new Date(dataItem.end_date)).Format("yyyy-MM-dd");
	sendData.allot_id = dataItem.id;
	sendData.desc = dataItem.desc;
	sendData.id = idx;
	sendData.organization_id = dataItem.organization_id;
	sendData.is_root = (sendData.organization_id == this.organizations.root.id ? 1 : 0);

	var piThis = this;
	$.ajax({
		url: this.route + '/drop',
		cache: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.onDropAllotFileOk(data);
	}, function() {
		alert("请求失败！");
	});
};

EquAllocMgr.prototype.onRejectAllotOk = function (data) {
	var idx = parseInt(data, 10);
	this.eachData(function(i, item){
		if (i == idx) {
			item.status = 1;
			this.onAllDataArrival();
			return 1;
		}
	});
};

EquAllocMgr.prototype.rejectAllot = function (piSender, idx, piEvent) {
	var dataItem = this.dataItems(idx);
	var sendData = {};
	sendData.id = idx;
	sendData.allot_id = dataItem.id;

	var piThis = this;
	$.ajax({
		url: this.route + '/reject',
		cache: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.onRejectAllotOk(data);
	}, function() {
		alert("请求失败！");
	});
};

EquAllocMgr.prototype.onConfirmAllot = function (data) {
	var idx = parseInt(data, 10);
	this.eachData(function(i, item){
		if (i == idx) {
			item.status = 20;
			this.onAllDataArrival();
			return 1;
		}
	});
};

EquAllocMgr.prototype.confirmAllot = function (piSender, idx, piEvent) {
	var dataItem = this.dataItems(idx);
	var sendData = {};
	sendData.id = idx;
	sendData.allot_id = dataItem.id;

	var piThis = this;
	$.ajax({
		url: this.route + '/confirm',
		cache: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.onConfirmAllot(data);
	}, function() {
		alert("请求失败！");
	});
};

EquAllocMgr.prototype.downloadAllotFile = function (piSender, idx, piEvent) {
	var dataItem = this.dataItems(idx);
	var sendData = {};
	sendData.id = dataItem.id;
	href = [this.route + '/download'];
	href.push("?id=", dataItem.id);
	piSender.setAttribute("href", href.join(""));
};

EquAllocMgr.prototype.downloadAllotScanFile = function (piSender, idx, piEvent) {
	var dataItem = this.dataItems(idx);
	var sendData = {};
	sendData.id = dataItem.id;
	href = [this.route + '/downloadAllocScan'];
	href.push("?id=", dataItem.id);
	piSender.setAttribute("href", href.join(""));
};

EquAllocMgr.prototype.onRowClick = function (piSender, piEvent) {
	var parent = parseInt(piSender.getAttribute("parent"), 10);
	var idx = parseInt(piSender.getAttribute("idx"), 10);
	if (isNaN(parent)) {
		var expand = parseInt(piSender.getAttribute("expand"), 10);
		if (isNaN(expand) || expand == 0) {
			$("#" + this.tableId + " tbody tr[parent='" + idx + "']").show();
			piSender.setAttribute("expand", 1);
		} else {
			$("#" + this.tableId + " tbody tr[parent='" + idx + "']").hide();
			piSender.setAttribute("expand", 0);
		}
	}
};

EquAllocMgr.prototype.buildQuickNav = function () {
	var s = [];
	s.push("<li nav-bar route='equipment-enter' key='equipment-enter'>");
	s.push("<a href='equipment-enter'>设备入库</a>");
	s.push("</li>");
	s.push("<li nav-bar><a href='equipment-accept'>设备验收</a></li>");
	s.push("<li nav-bar route='out-equipment' key='out-equipment'>");
	s.push("<a href='out-equipment'>设备出库</a>");
	s.push("</li>");
	s.push("<li nav-bar route='allocation-equipment' key='allocation-equipment' class='am-active'>");
	s.push("<a href='allocation-equipment'>设备调拨</a>");
	s.push("</li>");
	//s.push("<li nav-bar route='borrow-equipment' key='borrow-equipment'>");
	//s.push("<a href='borrow-equipment'>设备借用</a>");
	//s.push("</li>");
	//s.push("<li nav-bar route='scrap-equipment' key='scrap-equipment'>");
	//s.push("<a href='scrap-equipment'>设备报废</a>");
	//s.push("</li>");

	return s.join("");
};

EquAllocMgr.prototype.initBody = function () {
	this.resetSearchCriteria();

	var piThis = this;

	$("li[nav-bar]").click(function () {
		piThis.resetNav($(this).attr("key"));
		return true;
	});

	$("button[status-switch]").click(function () {
		piThis.resetStatus($(this).attr("key"));
		return true;
	});

	$("button[generate-allot-file]").click(function () {
		piThis.generateAllotFile();
		return true;
	});

	$("div[" + this.quickNav + "] ul").show();

	return true;
};

EquAllocMgr.prototype.initData = function () {
	var piThis = this;
	$.get(this.route, this.getSearchCriteria(), function (data) {
		piThis.cacheData(data);
		piThis.onAllDataArrival();
		//piThis.initPage();
        //
		//hideLoading();

		return true;
	}, "json");
};

var _allocationEquipmentsMgr = null;
function thisMgr() {
	if (_allocationEquipmentsMgr) return _allocationEquipmentsMgr;	
	var ret = new EquAllocMgr("poolAllot");
	_allocationEquipmentsMgr = ret;	
	return _allocationEquipmentsMgr;
}