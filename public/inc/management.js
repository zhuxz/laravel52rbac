function TableHead(name, desc) {
	this.name = name;
	this.desc = desc;
}

function Management(instance, containerId, tableId) {
	if (typeof instance != "undefined") this.instance = instance;
	if (typeof tableId != "undefined") this.tableId = tableId;
	if (typeof containerId != "undefined") this.containerId = containerId;
}

Management.prototype = {
	constructor: Management,
	cacheHTMLSnippets: {},

	data: {map: {}, list: [], root: {}},
	parameters: ["user",
		"organizations"],
	
	tableId: "tblList",
	containerId: "divContainer",

	instance: "management",
	route: "",

	act: -1,

	mdlAddContainerId: "mdlAdd",
	btnAdd: "btnadd",

	mdlUpdContainerId: "mdlUpd",
	btnUpd: "btnupd",

	mdlDelContainerId: "mdlDel",
	btnDel: "btndel",

	btnSearch: "btnSearch",

	uniq: "id",

	leftNavAssetManagement: "nav-assetmgr",
	leftNavSystemManagement: "left-nav-system-management",
	quickNav: "quick-nav",

	tags: {
		navContainer: "admin-offcanvas",
		navRoot: "nav-root",
		navAssetMgr: "nav-assetmgr",
		navSystemMgr: "nav-sysmgr",
		searchBlock: "search_block"
	}
};

Management.prototype.buildLeftNavAssetManagement = function () {
	var s = ["<li><a href='equ-task'>新业务操作</a></li>"];
	s.push("<li><a href='equipment-enter'>设备入库</a></li>");
	s.push("<li><a href='equipment-accept'>设备验收</a></li>");
	s.push("<li><a href='out-equipment'>设备出库</a></li>");
	s.push("<li><a href='allocation-equipment'>设备调拨</a></li>");
	//s.push("<li><a href='scrap-equipment'>设备报废</a></li>");
	return s.join("");
};

Management.prototype.renderLeftNavAssetManagement = function () {
	//$("ul[" + this.leftNavAssetManagement + "]").append(this.buildLeftNavAssetManagement());
};

Management.prototype.renderLeftNav = function () {
	this.renderLeftNavAssetManagement();
	return true;
};

Management.prototype.renderSearch = function () {
	return true;
};

Management.prototype.renderPage = function () {
	this.renderLeftNav();
	this.renderSearch();
	return true;
};

Management.prototype.setUser = function (data) {
	this.userInfo = new User(data);
	return true;
};

Management.prototype.initUser = function () {
	var piThis = this;
	$.ajax({
		url: '/userinfo',
		cache: false,
		async: false,
		data: {},
		dataType: 'json'
	}).then(function(data) {
		piThis.setUser(data);
		piThis.initPage();
		//piThis.initData();
	}, function() {
		alert("初始化用户失败！")
	});
	return true;
};

Management.prototype.initSearch = function () {
	var piThis = this;
	var $btnSearch = $(".search_block button.search_btn");
	if ($btnSearch.length > 0) {
		$btnSearch.unbind("click");
		$btnSearch.click(function () {
			piThis.submitSearch();
			return true;
		});
	}
};

Management.prototype.initBody = function () {
};

Management.prototype.initQuickNav = function () {
};

Management.prototype.initLeftNav = function () {
	//var user = this.userInfo;
	//var $ul = $("#" + this.tags.navAssetMgr);
    //
	//if (!user.permissionMap["asset_in"]) {
	//	$ul.find("li a[href='equipment-enter']").parent().remove();
	//}
    //
	//if (!user.permissionMap["asset_accept"]) {
	//	$ul.find("li a[href='equipment-accept']").parent().remove();
	//}
    //
	//if (!user.permissionMap["asset_out"]) {
	//	$ul.find("li a[href='out-equipment']").parent().remove();
	//}
    //
	//if (!user.permissionMap["asset_pool_allot"]) {
	//	$ul.find("li a[href='allocation-equipment']").parent().remove();
	//}
    //
	//$ul = $("#" + this.tags.navSystemMgr);
    //
	//if (!user.permissionMap["account_manage"]) {
	//	$ul.find("li a[href='account']").parent().remove();
	//}
    //
	//if (!user.permissionMap["account_group_manage"]) {
	//	$ul.find("li a[href='account-group']").parent().remove();
	//}
    //
	//if (!user.permissionMap["organization_manage"]) {
	//	$ul.find("li a[href='management-organization']").parent().remove();
	//}
    //
	//if (!user.permissionMap["asset_type_manage"]) {
	//	$ul.find("li a[href='management-equipment']").parent().remove();
	//}
    //
	//if (!user.permissionMap["brand_manage"]) {
	//	$ul.find("li a[href='brand']").parent().remove();
	//}
    //
	//if (!user.permissionMap["unit_manage"]) {
	//	$ul.find("li a[href='management-unit']").parent().remove();
	//}

	//var href = window.location.href.replace(window.location.origin + "/", "");
	//$("#" + this.tags.navRoot + " li a[href='" + href + "']").addClass("am-active");

	//var piThis = this;
    //
	//$("#" + this.tags.navRoot + " li").each(function() {
	//	$(this).click(function (piEvent) {
	//		piThis.onNavMenuClick(this);
	//		piEvent.stopPropagation();
	//	});
	//});
};

Management.prototype.onNavMenuClick = function (li) {
	$li = $(li);
	$ul = $li.find("ul");

	if ($ul.length == 0) {
		if ($li.is("am-active")) {
			//to do
		} else {
			$("#" + this.tags.navRoot + " li.am-active").removeClass("am-active");
			$li.addClass("am-active");
		}
	}

	this.getSelectedItem();

	return true;
};

Management.prototype.selectNavMenu = function () {
	//to do
};

Management.prototype.initStatusFilter = function () {
};

Management.prototype.beforeInitPage = function () {
	return true;
};

Management.prototype.initData = function () {
	//this.initPage();
};

Management.prototype.afterInitPage = function () {
	return true;
};

Management.prototype.initPage = function () {
	this.beforeInitPage();
	this.initLeftNav();
	this.initSearch();
	this.initQuickNav();
	this.initStatusFilter();
	this.initBody();
	this.initData();
	this.afterInitPage();
};

Management.prototype.getParameters = function () {
	var ret = {};
	this.parameters.forEach(function(parameter){
		ret[parameter] = 1;
	});
	return ret;
};

Management.prototype.beforeInitialize = function () {
	showLoading();
	return true;
};

Management.prototype.afterInitialize = function () {
	//to do
	return true;
};

Management.prototype.finishInitialize = function () {
	$("body header").show();
	$("body").children(".admin-main").show();
	$("body footer").show();
	hideLoading();
	return true;
};

Management.prototype.initialize = function () {
	var ret = true;

	this.beforeInitialize();

	var piThis = this;
	$.ajax({
		url: "userinfo",
		cache: false,
		//async: false,
		data: this.getParameters(),
		dataType: 'json'
	}).then(function(data) {
		if (data.user) piThis.userInfo = new User(data.user);
		if (data.organizations) piThis.organizations = new Organization(data.organizations);
		if (data.asset_kinds) piThis.asset_kinds = new TreeData(data.asset_kinds);
		if (data.asset_brands) piThis.asset_brand = new TreeData(data.asset_brands);
		if (data.asset_unit) piThis.asset_unit = new ComboData(data.asset_unit);
		if (data.storage) piThis.storage = new ComboData(data.storage);
		if (data.permissions) piThis.permissions = data.permissions;
		if (data.roles) piThis.roles = data.roles;

		piThis.initPage();
		piThis.finishInitialize();

		ret =  true;
	}, function() {
		alert("初始化页面失败！");
		piThis.finishInitialize();
		ret =  false;
	});

	this.afterInitialize();

	return ret;
};

Management.prototype.treeTableOptions = function () {	
	return { expandable: true };
};

Management.prototype.getActiveUpdItemIdx = function () {
	return $("#" + this.mdlUpdContainerId + " form [name=id]").val();
};

Management.prototype.getActiveDelItemIdx = function () {
	return $("#" + this.mdlDelContainerId + " form [name=id]").val();
};

Management.prototype.modalOptionsForAdd = function () {		
	return { closeViaDimmer: false, width: 400, height: 400 };
};

Management.prototype.modalOptionsForUpd = function () {		
	return { closeViaDimmer: false, width: 400, height: 400 };
};

Management.prototype.modalOptionsForDel = function () {
	var piThis = this;
	return {
		onConfirm: function(options) {
			piThis.submitModalDel.call(piThis);
		},
		closeOnConfirm: false
	};
};

Management.prototype.validOptionsForAdd = function () {
	return {};
};

Management.prototype.validOptionsForUpd = function () {
	return {};
};

Management.prototype.itemData = function (key, value) {
	var i = 0;
	var data = this.data;
	var len = data.length;
	for (i = 0; i < len; i++) {
		if (data[i][key] == value) {
			return data[i];
		}
	}
	return null;
};

Management.prototype.dataItems = function (idx) {
	return this.data[parseInt(idx, 10)];
};

Management.prototype.getSelectedItem = function () {
	return $("#" + this.tableId + " tbody tr.selected");
};

Management.prototype.dataTableOptions = function () {
	return {};
};

Management.prototype.getPopModalId = function () {
	var action = enumAction();
	switch (this.act) {
		case action.add:
			return this.mdlAddContainerId;
		case action.upd:
			return this.mdlUpdContainerId;
		case action.del:
			return this.mdlDelContainerId;
	}
	return "";
};

Management.prototype.beforePopModalAdd = function () {
	this.act = enumAction().add;
	return true;
};

Management.prototype.beforePopModalUpd = function (id) {
	this.act = enumAction().upd;
	return true;
};

Management.prototype.beforePopModalDel = function (id) {
	this.act = enumAction().del;
	return true;
};

Management.prototype.getEditorBody = function (_token, act, id) {
	return true;
};

Management.prototype.drawModalAdd = function () {	
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	$(containerId).html(this.getEditorBody(_token, this.act, ""));
	return true;
};

Management.prototype.drawModalUpd = function (id) {
	var containerId = "#" + this.mdlUpdContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	$(containerId).html(this.getEditorBody(_token, this.act, id));
	return true;
};

Management.prototype.drawModalDel = function (option) {
	return true;
};

Management.prototype.popModalAdd = function (option) {
	var flag = this.beforePopModalAdd();
	flag = flag && this.drawModalAdd();
	flag = flag && this.initModalAdd();
	if (flag) {
		$("#" + this.mdlAddContainerId).modal(this.modalOptionsForAdd());
		$("#" + this.mdlAddContainerId + " form").validator(this.validOptionsForAdd());
	}
	return true;
};

Management.prototype.popModalUpd = function (option) {
	this.beforePopModalUpd(option);
	this.drawModalUpd(option);
	this.initModalUpd(option);
	$("#" + this.mdlUpdContainerId).modal(this.modalOptionsForUpd());
	$("#" + this.mdlUpdContainerId + " form").validator(this.validOptionsForUpd());		
	return true;
};

Management.prototype.popModalDel = function (option) {
	this.beforePopModalDel(option);
	this.drawModalDel(option);
	this.initModalDel(option);
	$("#" + this.mdlDelContainerId).modal(this.modalOptionsForDel());
	return true;
};

Management.prototype.initModalAdd = function (option) {
	$("#" + this.mdlAddContainerId + " input[name='id']").val(option);
	return true;
};

Management.prototype.initModalUpd = function (option) {
	$("#" + this.mdlUpdContainerId + " input[name='id']").val(option);
	return true;
};

Management.prototype.initModalDel = function (option) {
	$("#" + this.mdlDelContainerId + " input[name='id']").val(option);
	return true;
};

Management.prototype.sendDataForAdd = function () {
	return new FormData($("#" + this.mdlAddContainerId + " form")[0]);
};

Management.prototype.sendDataForUpd = function () {
	return new FormData($("#" + this.mdlUpdContainerId + " form")[0]);
};

Management.prototype.sendDataForDel = function () {
	var frmId = "#" + this.mdlDelContainerId;
	var idx = $(frmId + " input[name='id']").val();
	var asset = this.dataItems(idx);

	var equ = {};
	equ.idx = this.dataItems().in_code_id;
};

Management.prototype.submitModalAdd = function () {
	var piThis = this;
	var sendData = this.sendDataForAdd();
	$.ajax({
		url: this.route + '/add',
		type: "POST",
		data: sendData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			$("#" + piThis.mdlAddContainerId).modal("close");
			alert("请求失败！");
		},
		success: function(data) {
			piThis.onAddOk(data);
		}
	});
};

Management.prototype.submitModalUpd = function () {
	var piThis = this;
	var sendData = this.sendDataForUpd();
	$.ajax({
		url: this.route + '/upd/' + sendData.id,
		type: "POST",
		data: sendData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			$("#" + piThis.mdlUpdContainerId).modal("close");
			alert("请求失败！");
		},
		success: function(data) {
			piThis.onUpdOk(data);
		}
	});
	return true;
};

Management.prototype.submitModalDel = function () {
	var piThis = this;
	var sendData = this.sendDataForDel();
	$.ajax({
		url: this.route + '/del/' + sendData.id,
		cache: false,
		data: sendData
    }).then(function(data) {
        piThis.onDelOk(data);
    }, function() {
        $("#" + piThis.mdlDelContainerId).modal("close");
      	alert("请求失败.");
    });
	return true;
};

Management.prototype.onAddOk = function (data) {
	this.onAllDataArrival(data);
    $("#" + this.mdlAddContainerId).modal("close");
	alert("添加成功！");
	return true;
};

Management.prototype.onUpdOk = function (data) {
	this.onAllDataArrival(data);
    $("#" + this.mdlUpdContainerId).modal("close");
	alert("修改成功！");
	return true;
};

Management.prototype.onDelOk = function (data) {
	this.onAllDataArrival(data);
    $("#" + this.mdlDelContainerId).modal("close");
	alert("删除成功！");
	return true;
};

Management.prototype.defaultSearchCriteria = function () {
	return {};
};

Management.prototype.getSearchCriteria = function () {
	return {};
};

Management.prototype.submitSearch = function () {
	var piThis = this;
	showLoading();
	$.ajax({
		url: this.route + "/search",
		cache: false,
		type: this.queryMethod || 'POST',
		data: this.getSearchCriteria()
    }).then(function(data) {
        piThis.onSearchDataArrival(data);
        hideLoading();
    }, function() {
      	alert("请求失败.");
      	hideLoading();
    });
};

Management.prototype.submitQuickSearch = function (sendData) {
	var piThis = this;	
	showLoading();
	$.ajax({
		url: this.route + "/quicksearch",
		cache: false,
		data: sendData
    }).then(function(data) {
        piThis.onSearchDataArrival(data);
        hideLoading();
    }, function() {
      	alert("请求失败.");
      	hideLoading();
    });
	return true;
};

Management.prototype.onSearchDataArrival = function (data) {
	this.onAllDataArrival(data);
	return true;
};

Management.prototype.getHeads = function () {
	return [];
};

Management.prototype.buildHead = function (ret) {
	var heads = this.getHeads();
	if (heads.length > 0) {
		ret.push("<tr>");
		var i;
		for (i = 0; i < heads.length; i++) {
			ret.push("<th>", heads[i].desc, "</th>");
		}
		ret.push("</tr>");
	}	
	return true;
};

Management.prototype.buildRow = function (data, parentPath, ret) {
	return true;
};

Management.prototype.applyDataTable = function () {	
	$('#' + this.tableId).DataTable(this.dataTableOptions());
	return true;
};

Management.prototype.onAllDataArrival = function (data) {
	if (data) this.data = data;
	
	var html = [];
	html.push("<table id='tblList' width='100%' table-layout='fixed' class='am-table am-table-striped am-text-nowrap zj-table'>");
	html.push("<thead>");
	this.buildHead(html);
	html.push("</thead>");
	html.push("</tbody>");
	this.buildRow(this.data, null, html);
	html.push("</tbody>");
	html.push("</table>");
	
	$("#" + this.containerId).html(html.join(""));

	this.applyDataTable();
	
	return true;
};

Management.prototype.cacheData = function (data) {
	this.data = data;
	return true;
};

Management.prototype.clearData = function () {
	this.data.map = {};
	this.data.list = [];
	this.data.root = {};
	return true;
};

Management.prototype.eachData = function (func) {
	var data = this.data;
	var len = data.length;
	var i;
	for (i = 0; i < len; i++) {
		func.call(this, i, data[i]);
	}
};

///////////////////////////////////////////////////////////////////////////////////////////
//HTML 文本片段相关函数
///////////////////////////////////////////////////////////////////////////////////////////
Management.prototype.HTMLSnippetProperties = {
	comboStorage: {
		name: "storage_id",
		title: "仓库",
		placeholder: "仓库",
		required: false,
		disabled: false
	},
	textBox: {
		name: "text",
		title: "text",
		placeholder: "text",
		required: false,
		disabled: false
	},
	textEquipmentUser: {
		name: 'equipment_user',
		title: '设备使用人',
		placeholder: '设备使用人',
		type: 'text',
		class: 'modal-text'
	},
	textReceiveUser: {
		name: 'receive_user',
		title: '设备领用人',
		placeholder: '设备领用人',
		type: 'text',
		class: 'modal-text'
	},
	textOutCount: {
		name: 'out_count',
		title: '设备数量',
		placeholder: '设备数量',
		type: 'text',
		class: 'modal-text'
	},
	textMaxOutCount: {
		name: 'max_out',
		title: '可出库数量',
		placeholder: '可出库数量',
		type: 'text',
		class: 'modal-text'
	},
	textOutOperator: {
		name: 'operator_name',
		title: '出库经办人',
		placeholder: '出库经办人',
		type: 'text',
		class: 'modal-text'
	},
	textOperateDate: {
		name: 'out_date',
		title: '办理日期',
		placeholder: '办理日期',
		type: 'text',
		class: 'am-form-field',
		"data-am-datepicker": "",
		readonly: "readonly"
	},
	textBrand: {
		name: 'brand_id',
		title: '设备规格型号',
		placeholder: '设备规格型号',
		type: 'text',
		class: 'modal-text'
	},
	comboSerialCode: {
		name: 'serials_code',
		title: '序列号',
		required: "required"
	},
	cboFinancialCode: {
		name: 'financial_code',
		title: '资产编号',
		disabled: "disabled"
	},
	cboPurpose: {
		name: 'purpose',
		title: '主要用途',
		disabled: "disabled"
	},
	buttonSave: {
		class: 'am-btn am-btn-default btnsave am-fl',
		type: 'submit'
	},
	textDepartment: {
		name: 'department',
		id: 'organization',
		title: "使用部门",
		placeholder: '使用部门',
		type: 'text',
		class: 'am-form-field',
		releasevalue: "",
		readonly: "readonly",
		required: "required"
	},
	textAssetKind: {
		name: 'asset_kind',
		title: '设备名称',
		placeholder: '设备名称',
		type: 'text',
		class: 'modal-text'
	},
	btnUpdDom: {
		title: '修改',
		class: 'am-btn',
		href: "javascript:void(0);",
		btnupd: ""
	},
	btnDelDom: {
		title: '删除',
		class: 'am-btn',
		href: "javascript:void(0);",
		btndel: "btndel"
	}
};

Management.prototype.getHTMLSnippetProperties = function () {
	return this.HTMLSnippetProperties;
};

Management.prototype.buildHTMLSnippet = function (tag, properties, context) {
	var property;
	var value;
	var s = [];

	s.push("<");
	s.push(tag);
	if (properties) {
		for (property in properties) {
			s.push(" ", property, "=\"", properties[property], "\"");
		}
	}
	s.push(">");

	if (context) {
		s.push(context);
	}

	s.push("</", tag, ">");

	return s.join("");
};

Management.prototype.textAssetKind = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.textBrand = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.textDepartment = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.buttonSave = function (properties) {
	return this.buildHTMLSnippet("button", properties, "保存");
};

Management.prototype.cboPurpose = function (properties) {
	var content = ["<option value=\"\">主要用途</option>"];
	content.push(this.purposes.getComboBoxList());
	properties.required = "required";
	return this.buildHTMLSnippet("select", properties, content.join(""));
};

Management.prototype.cboFinancialCode = function (properties) {
	var content = ["<option value=\"\">资产编号</option>"];
	content.push(this.getFinancialCodeOptions());
	properties.onchange = "outStorageMgr().onFinancialCodeChange(this, event);";
	return this.buildHTMLSnippet("select", properties, content.join(""));
};

Management.prototype.comboSerialCode = function (properties) {
	var content = ["<option value=\"\">序列号</option>"];
	content.push(this.getSerialCodeOptions());
	properties.onchange = "outStorageMgr().onSerialsCodeChange(this, event);";
	return this.buildHTMLSnippet("select", properties, content.join(""));
};

Management.prototype.comboStorage = function (properties) {
	var content = ["<option value=\"\">仓库</option>"];
	content.push(this.storage.getComboBoxList());
	return this.buildHTMLSnippet("select", properties, content.join(""));
};

Management.prototype.textEquipmentUser = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.textReceiveUser = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.textOutCount = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.textMaxOutCount = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.textOutOperator = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.textOperateDate = function (properties) {
	return this.buildHTMLSnippet("input", properties);
};

Management.prototype.btnUpdDom = function (properties) {
	return this.buildHTMLSnippet("a", properties, "<i class='am-icon-pencil-square-o'></i>");
};

Management.prototype.btnDelDom = function (properties) {
	return this.buildHTMLSnippet("a", properties, "<i class='am-icon-trash-o'></i>");
};

Management.prototype.wrapSnippet = function (HTMLSnippet) {
	var s = ["<div class='am-u-sm-4'>"];
	s.push(HTMLSnippet);
	s.push("</div>");
	return s.join("");
};

Management.prototype.getHTMLSnippet = function (key, execFunc, properties, wrapFunc) {
	if (!key) return "";

	//使用缓存的HTML片段
	if (!properties && this.cacheHTMLSnippets[key]) return this.cacheHTMLSnippets[key];

	var defaultProperties = this.getHTMLSnippetProperties()[key];
	var mergeProperties = {};

	if (defaultProperties) {
		$.extend(mergeProperties, defaultProperties);
	}

	if (properties) {
		$.extend(mergeProperties, properties);
	}

	var ret = "";
	var snippet = execFunc.call(this, mergeProperties);

	if (typeof wrapFunc === "function") {
		ret = wrapFunc.call(this, snippet);
	} else if (typeof wrapFunc === "undefined"){
		ret = this.wrapSnippet(snippet);
	} else {
		ret = snippet;
	}

	this.cacheHTMLSnippets[key] = ret;

	return ret;
};
///////////////////////////////////////////////////////////////////////////////////////////
//HTML 文本片段相关函数 结束
///////////////////////////////////////////////////////////////////////////////////////////

Management.prototype.defaultQueryParameter = function () {
	var defaultQP = [];
	defaultQP["deep"] = 1;
	defaultQP["exceptDelete"] = 1;
	defaultQP["groupByInCode"] = 1;
	defaultQP["groupByStorage"] = 1;
	defaultQP["orderByUpdateAt"] = 0;
	defaultQP["withOrganization"] = 1;
	defaultQP["withStorage"] = 1;
	defaultQP["withOperator"] = 1;
	defaultQP["withUser"] = 0;
	defaultQP["withUnit"] = 1;
	defaultQP["withKind"] = 1;
	defaultQP["withBrand"] = 1;
	defaultQP["withCategory"] = 0;
	defaultQP["withSource"] = 0;
	defaultQP["withPurpose"] = 0;
	defaultQP["withTotalInCount"] = 0;
	defaultQP["withAcceptedCount"] = 0;
	defaultQP["withOutCount"] = 0;
	defaultQP["withFinancialCodeCount"] = 0;
	defaultQP["withLocalInCount"] = 0;
	defaultQP["withSubmitAcceptedCount"] = 0;
	defaultQP["groupByOperation"] = 0;
	defaultQP["withAcceptHistory"] = 0;
	defaultQP["orderByOperate"] = 0;
	defaultQP["groupByOperator"] = 0;
	defaultQP["withAccept"] = 0;
	defaultQP["groupByAccept"] = 0;
	defaultQP["withCount"] = 0;
	defaultQP["orderByBranch"] = 0;
	defaultQP["groupByBranch"] = 0;
	defaultQP["withSubmitAccept"] = 0;
	defaultQP["groupBySubmitAccept"] = 0;
	defaultQP["withInCount"] = 0;
	defaultQP["withReceive"] = 0;
	defaultQP["withAllot"] = 0;
	return defaultQP;
};

Management.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["groupByStorage"] = 0;
	qp["withLocalInCount"] = 1;
	return qp;
};

Management.prototype.getQueryParameter = function () {
	var qpContainer = EquQueryParameter();
	var qp = this.setQueryParameter();
	var arr = [];
	for (var key in qp) {
		if (qp[key] === 1) {
			arr.push(qpContainer[key]);
		}
	}
	return arr.join(",");
};

var _EquQueryParameter = null;
function EquQueryParameter() {
	if (_EquQueryParameter) return _EquQueryParameter;
	var ret = {};
	ret["deep"] = 1;
	ret["exceptDelete"] = 2;
	ret["groupByInCode"] = 3;
	ret["groupByStorage"] = 4;
	ret["orderByUpdateAt"] = 5;
	ret["withOrganization"] = 6;
	ret["withStorage"] = 7;
	ret["withOperator"] = 8;
	ret["withUser"] = 9;
	ret["withUnit"] = 10;
	ret["withKind"] = 11;
	ret["withBrand"] = 12;
	ret["withCategory"] = 13;
	ret["withSource"] = 14;
	ret["withPurpose"] = 15;
	ret["withTotalInCount"] = 16;
	ret["withAcceptedCount"] = 17;
	ret["withOutCount"] = 18;
	ret["withFinancialCodeCount"] = 19;
	ret["withLocalInCount"] = 20;
	ret["withSubmitAcceptedCount"] = 21;
	ret["groupByOperation"] = 22;
	ret["withAcceptHistory"] = 23;
	ret["orderByOperate"] = 24;
	ret["groupByOperator"] = 25;
	ret["withAccept"] = 26;
	ret["groupByAccept"] = 27;
	ret["withCount"] = 28;
	ret["orderByBranch"] = 29;
	ret["groupByBranch"] = 30;
	ret["withSubmitAccept"] = 31;
	ret["groupBySubmitAccept"] = 32;
	ret["withInCount"] = 33;
	ret["withReceive"] = 34;
	ret["withAllot"] = 35;
	_EquQueryParameter = ret;
	return ret;
}

function OrganizationMenueTree(containerId, treeId, targetId, dest) {
	if (typeof targetId != "undefined") this.targetId = targetId;
	if (typeof containerId != "undefined") this.containerId = containerId;
	if (typeof treeId != "undefined") this.treeId = treeId;
	if (typeof dest != "undefined") this.dest = dest;
	
	var piThis = this;
	this.setting = PopMenuTreeOptions();
	this.setting.callback = {
		onCheck: function (e, treeId, treeNode) {
			piThis.export(e, treeId, treeNode);
			return true;
		}
	};
	
	return this;
}

OrganizationMenueTree.prototype = new PopMenuTree();
OrganizationMenueTree.prototype.containerId = "divOrgTree";
OrganizationMenueTree.prototype.treeId = "orgTree";
OrganizationMenueTree.prototype.targetId = "organization";
//OrganizationMenueTree.prototype.dest = "organization_id";

OrganizationMenueTree.prototype.beforeShow = function () {
	if (this.zNodes.length == 0) {
		alert("请先选择支行");
		return false;
	}
	return true;
};

OrganizationMenueTree.prototype.init = function (data) {
	if (data) {
		try {
			this.zNodes = [];
			this.zNodes.push({ id:data.id, pId:data.father_id, name:data.name, open:true});
			treeData2zNodes(data, this.zNodes, 0);
		} catch (e) {
			this.zNodes = [];
		}
	} else {
		this.zNodes = [];
	}
	
	this.zTree = $.fn.zTree.init($("#" + this.treeId), this.setting, this.zNodes);
	
	return true;
};

function TreeData(data) {
	var tData = constructTreeData(data);
	this.list = tData.list;
	this.map = tData.map;
	this.root = tData.root;
}

TreeData.prototype.item = function (id) {
	return this.map[id];
};

TreeData.prototype.parent = function (id) {
	var item = this.item(id);
	return this.map[item.father_id];
};

TreeData.prototype.getFullPath = function (id) {
	var map = this.map;
	var ret = [];
	var item;
	
	do {
		item = map[id];
		ret.push(id);
		id = item.father_id;
	} while (item.father_id != 0)
	
	return ret;
};

TreeData.prototype.getComboBoxList = function (id, defaultItem) {
	var item = (id == undefined ? this.root : this.map[id]);
	if (!item) return defaultItem || "";
	var children = item.children;
	var len = children.length;
	var i;
	var ret = [];
	if (defaultItem) ret.push(defaultItem);
	for (i = 0; i < len; i++) {
		ret.push("<option value='", children[i].id, "'>", children[i].name, "</option>");
	}
	return ret.join("");
};

TreeData.prototype.getFirstChildComboBoxList = function () {
	var item = this.root;
	var children = item.children;
	var len = children.length;
	var i;
	var ret = [];
	for (i = 0; i < len; i++) {
		ret.push("<option value='", children[i].id, "'>", children[i].name, "</option>");
	}
	return ret.join("");
};

function ComboData(data) {
	this.data = data;
}

ComboData.prototype.item = function (id) {
	for (var i = 0; i < this.data.length; i++) {
		if (this.data[i].id == id) return this.data[i];
	}
	return null;
};

ComboData.prototype.getComboBoxList = function (id) {
	var ret = [];
	var data = this.data;
	var len = data.length;
	var i;
	for (i = 0; i < len; i++) {
		ret.push("<option value='", data[i].id, "'>", data[i].name, "</option>");
	}
	return ret.join("");
};

function Organization(data) {
	var tData = constructTreeData(data);
	this.list = tData.list;
	this.map = tData.map;
	this.root = tData.root;
}

Organization.prototype = new TreeData([]);

Organization.prototype.getBranch = function (id) {
	var org = this.item(id);
	if (!org) return null;

	if (org.lev > 1) {
		var parentOrg = this.item(org.father_id);
		if (parentOrg) {
			if (parentOrg.lev == 1 && parentOrg.code == "340490100") {
				return org;
			} else {
				return this.getBranch(org.father_id);
			}
		} else {
			return org;
		}
	} else {
		return org;
	}
};

Organization.prototype.secondBranchList = function () {
	if (!this.root) return [];

	var children = this.root.children;
	var len = children.length;
	var i;
	var organization;
	var ret = [];

	for (i = 0; i < len; i++) {
		organization = children[i];
		if (organization.code == "340000001") {
			//省分行总部
		} else if (organization.code == "340490100") {
			//省分行营业部
			ret.push(organization);
		} else {
			ret.push(organization);
		}
	}

	return ret;
};

function User(userInfo) {
	this.name = userInfo.name;
	this.organization_id = userInfo.organization_id;
	this.real_name = userInfo.real_name;
	this.storage_id = userInfo.storage_id;
	this.permissions = userInfo.permissions;
	this.initPermissionMap(userInfo.permissions);
}

User.prototype.name = "";
User.prototype.organization_id = 0;
User.prototype.real_name = "";
User.prototype.storage_id = 0;
User.prototype.permissions = [];
User.prototype.permissionMap = {};

User.prototype.initPermissionMap = function (arrPermission) {
	var map = {};
	arrPermission.forEach(function(permission){
		map[permission.name] = permission;
	});
	this.permissionMap = map;
};