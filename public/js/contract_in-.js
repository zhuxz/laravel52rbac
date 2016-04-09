function EquMgr(instance) {
	if (typeof instance == "undefined") instance = "contract";
	this.instance = instance;
	this.route = this.route + "/" + instance;
	this.acceptStatus = "unAccepted";
	//this.initialize();
}

EquMgr.prototype.frmSearch = "frmSearch";

EquMgr.prototype = new Management();

EquMgr.prototype.initNavBar = function () {
	var i = 0;
	var navBar = {};
	navBar.equAccept = {id: ++i, key: "equAccept", route: "equ-accept", desc: "设备入库确认验收"};
	navBar.equAcceptInBranch = {id: ++i, key: "equAcceptInBranch", route: "equ-accept-in-branch", desc: "设备入分库确认验收"};
	navBar.equSubmitAccept = {id: ++i, key: "equSubmitAccept", route: "equ-accept", desc: "设备入库确认验收"};
	navBar.equSubmitAcceptBranch = {id: ++i, key: "equSubmitAcceptBranch", route: "equ-accept-in-branch", desc: "设备入分库确认验收"};
	navBar.equReceive = {id: ++i, key: "equReceive", route: "equ-receive", desc: "设备领用确认"};
	navBar.equAllot = {id: ++i, key: "equAllot", route: "equ-allot", desc: "设备调拨确认"};
	navBar.equAcceptMgr = {id: ++i, key: "equAcceptMgr", route: "equ-accept", desc: "设备验收"};
	this.navBar = navBar;
};

EquMgr.prototype.initStatusFilter = function () {
	var i = 0;
	var statusFilter = {};
	statusFilter.unAccepted = {id: ++i, key: "unAccepted", desc: "未被验收"};
	statusFilter.accepted = {id: ++i, key: "accepted", desc: "已被验收"};
	statusFilter.acceptedAll = {id: ++i, key: "acceptedAll", desc: "全部"};
	statusFilter.unSubmitAccepted = {id: ++i, key: "unSubmitAccepted", desc: "未确认验收"};
	statusFilter.submitAccepted = {id: ++i, key: "submitAccepted", desc: "已确认验收"};
	statusFilter.submitAcceptedAll = {id: ++i, key: "submitAcceptedAll", desc: "全部"};
	statusFilter.in = {id: ++i, key: "in", desc: "未出库设备"};
	statusFilter.out = {id: ++i, key: "out", desc: "已出库设备"};
	statusFilter.received = {id: ++i, key: "received", desc: "已领用"};
	statusFilter.unReceived = {id: ++i, key: "unReceived", desc: "待领用"};
	statusFilter.multReceive = {id: ++i, key: "multReceive", desc: "一键领用"};
	statusFilter.generateAllotFile = {id: ++i, key: "generateAllotFile", desc: "调拨EXCEL表生成"};
	this.statusFilter = statusFilter;
};

EquMgr.prototype.initEquipmentStatus = function () {
	var equStatus = {};
	equStatus.del = -1;
	equStatus.in = 1;
	equStatus.accept = 200;
	equStatus.acceptSubmit = 210;
	equStatus.out = 300;
	equStatus.receive = 310;
	equStatus.allocation = 400;
	equStatus.borrow = 500;
	equStatus.scrap = 600;
	this.equStatus = equStatus;
};

EquMgr.prototype.initData = function () {
	return true;
};

EquMgr.prototype.initialize = function () {
	this.initUser();
	this.initNavBar();
	this.initStatusFilter();
	this.initEquipmentStatus();
	this.initData();
};

EquMgr.prototype.cacheData = function (data) {
	this.data = data.assets;
	this.asset_kinds = new TreeData(data.asset_kinds);
	this.asset_brand = new TreeData(data.asset_brand);
	this.organizations = new TreeData(data.organizations);
	this.asset_unit = new ComboData(data.asset_unit);
	this.storage = data.storage;
	return true;
};

EquMgr.prototype.dataTableOptions = function () {
	return {};
};

EquMgr.prototype.getOrganizationMenuTree = function (id) {
	return new OrganizationMenueTree();
};

EquMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "# id"));
	ret.push(new TableHead("", "合同名称"));
	ret.push(new TableHead("", "合同编码"));
	ret.push(new TableHead("", "合同标志"));
	ret.push(new TableHead("", "合同状态"));
	ret.push(new TableHead("", "合同说明"));
	ret.push(new TableHead("", "创建时间"));
	ret.push(new TableHead("", "更新时间"));
	ret.push(new TableHead("", "电子档"));
	ret.push(new TableHead("", "操作"));

	this._heads = ret;	
	return ret;
};

EquMgr.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr equid='", item.id, "'>");
		ret.push("<td>", item.id, "</td>");
		ret.push("<td>", item.name, "</td>");
		ret.push("<td>", item.code, "</td>");
		ret.push("<td>", item.sign_up, "</td>");
		ret.push("<td>", item.status, "</td>");
		ret.push("<td>", item.desc, "</td>");
		ret.push("<td>", item.created_at, "</td>");
		ret.push("<td>", item.updated_at, "</td>");
//		ret.push("<td>", item.updated_at, "</td>");
//		ret.push("<td><a href='"+item.file_link+">'","查看电子档</a></td>");
//  	ret.push("<td><a href='javascript:void(0)' ", this.btnUpd, " id='", item.id, "'>查看电子档</a></td>");
		ret.push("<td>");
		ret.push("<div class='am-btn-toolbar'>");
		ret.push("<div class='am-btn-group am-btn-group-sm'>");
		ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' ", this.btnUpd, " eqid='", item.id, "'>");
		ret.push("<span class='am-icon-pencil-square-o'></span> 修改");
		ret.push("</button>");
		ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-danger am-hide-sm-only' ", this.btnDel, " eqid='", item.id, "'>");
		ret.push("<span class='am-icon-trash-o'></span> 删除");
		ret.push("</button>");
		ret.push("</div>");
		ret.push("</div>");
		ret.push("</td>");
		ret.push("</tr>");
	}
	
	return true;
};

EquMgr.prototype.applyDataTable = function () {	
	$('#' + this.tableId).DataTable(this.dataTableOptions());
	return true;
};

EquMgr.prototype.modalOptionsForAdd = function () {
	return {closeViaDimmer:false, width: 900, height:600};
};

EquMgr.prototype.modalOptionsForUpd = function () {		
	return {closeViaDimmer:false, width: 900, height:600};
};

EquMgr.prototype.getEditorBody = function (_token, act, id) {
	var equ = this.dataItems(id);
	var html = [];
	html.push("<form class='am-form am-form-horizontal' action=''>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", (equ ? equ.in_code_id : "0"), "'>");
	html.push("<input type='hidden' name='act' value='", act, "' />");
	
	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text js-ajax-validate' type='text' name='name' placeholder='合同名称' title='合同名称' required>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='code' class='am-form-field' placeholder='合同编码' title='合同编码' required />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='sign_up' placeholder='合同标志' title='合同标志' required />");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'> ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='status' placeholder='合同状态' title='合同状态' required />");
	html.push("</div> ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='created_at' placeholder='创建时间' title='创建时间' data-am-datepicker readonly  />");
	html.push("</div> ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='updated_at' placeholder='更新时间' title='更新时间' data-am-datepicker readonly  />");
	html.push("</div> ");
	html.push("</div> ");
	html.push("<div class='am-form-group'> ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<textarea class='modal-text' type='text' class='am-form-field' name='desc' placeholder='合同说明' title='合同说明' required >");
	html.push("</textarea></div> ");
	//合同导入
	html.push("<div class='am-u-sm-4'>");
	html.push("<div class='am-form-group am-form-file am-fl'>");
	html.push("<button type='button' class='am-btn am-btn-default am-btn-sm'>");
	html.push("<i class='am-icon-cloud-upload'></i> 合同导入</button>");
	html.push("<input type='file' name='financial_code'>");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn am-fl'>保存</button>");

	html.push("</div>");
	html.push("</div>");
	
	html.push("</form>");
	
	return html.join("");
};

EquMgr.prototype.initModalAdd = function () {
	var frmId = "#" + this.mdlAddContainerId + " form";
	
	$(frmId + " input[name='name']").val();
	$(frmId + " input[name='code']").val("IT" + getRandomNum(1, 100000));
	$(frmId + " input[name='sign_up']").val();
	$(frmId + " input[name='status']").val();
	$(frmId + " textarea[name='desc']").val();
	
	$(frmId + " input[name='created_at']").val((new Date).DateAdd("y", 3).Format("yyyy-MM-dd"));
	$(frmId + " input[name='created_at']").datepicker({format: 'yyyy-mm-dd'});
	
	$(frmId + " input[name='updated_at']").val((new Date).DateAdd("d", -1 * getRandomNum(1, 14)).Format("yyyy-MM-dd"));
	$(frmId + " input[name='updated_at']").datepicker({format: 'yyyy-mm-dd'});
		
	return true;
};

EquMgr.prototype.initModalUpd = function (id) {
	var equ = this.dataItems(id);
	var frmId = "#" + this.mdlUpdContainerId + " form";
	
	$(frmId + " input[name='name']").val();
	$(frmId + " input[name='code']").val("IT" + getRandomNum(1, 100000));
	$(frmId + " input[name='sign_up']").val();
	$(frmId + " input[name='status']").val();
	$(frmId + " textarea[name='desc']").val();

	$(frmId + " input[name='created_at']").val((new Date(equ.maintain_stop)).Format("yyyy-MM-dd"));
	$(frmId + " input[name='created_at']").datepicker({format: 'yyyy-mm-dd'});
		
	
	$(frmId + " input[name='updated_at']").val((new Date(equ.in_time)).Format("yyyy-MM-dd"));
	$(frmId + " input[name='updated_at']").datepicker({format: 'yyyy-mm-dd'});
	
	$(frmId + " select[name='unit_id']").val(equ.unit_id);
	$(frmId + " input[name='operate_user_id']").val(equ.user_name);
	
	return true;
};

EquMgr.prototype.initModalDel = function (id) {
	$("#" + this.mdlDelContainerId + " input[name='id']").val(id);
	return true;
};

EquMgr.prototype.sendDataForAdd = function () {
	var frmData = new FormData($("#" + this.mdlAddContainerId + " form")[0]);
	frmData.append("in_code", (new Date()).Format("yyyyMMddhhmmss"));
	frmData.append("qp", this.getQueryParameter());
	return frmData;
};

EquMgr.prototype.sendDataForUpd = function () {
	var frmData = new FormData($("#" + this.mdlUpdContainerId + " form")[0]);
	frmData.append("qp", this.getQueryParameter());
	return frmData;
};

EquMgr.prototype.sendDataForDel = function () {
	var frmId = "#" + this.mdlDelContainerId;
	var equ = {};
	equ.id = this.dataItems($(frmId + " input[name='id']").val()).in_code_id;
	return equ;
};

EquMgr.prototype.submitModalUpd = function () {
	var piThis = this;
	var sendData = this.sendDataForUpd();
	$.ajax({
		url: this.route + '/upd',
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

EquMgr.prototype.validOptionsForAdd = function () {
	var piThis = this;
	var opt = baseFormValidationOption();
	opt.submit = function () {
		var formValidity = this.isFormValid();
		if (typeof formValidity === "boolean") {
			if (formValidity) {
		    	piThis.submitModalAdd();
			}
		} else {
			$.when(formValidity).then(function() {
			    piThis.submitModalAdd();
		    }, function() {
		    	//to do
		    });
		}
		
	    return false;
	};
	
	opt.validate = function (validity) {
		if (validity.valid) {
			var $field = $(validity.field);
			var val = $field.val().trim();
			var isRequired = ($field.attr("required") != undefined);
			if ($field.is('.js-ajax-validate')) {
				var data = {};
				data.act = this.$element.find("input[name='act']").val().trim();
				data.id = this.$element.find("input[name='id']").val().trim();
				data.contract_code = this.$element.find("input[name='contract_code']").val().trim();
				data.asset_code = this.$element.find("input[name='asset_code']").val().trim();
				data.financial_code = this.$element.find("input[name='financial_code']").val().trim();
				var thisOpt = this;
				return $.ajax({
					url: piThis.route + '/valid',
					cache: false,
					data: data,
					dataType: 'json'
		        }).then(function(data) {
			        validity.valid = (parseInt(data, 10) == 0);
			        if (validity.valid) {
				        var fieldName = $field.attr("name");
				        if (fieldName != "contract_code" && thisOpt.$element.find("input[name='contract_code']").is(".am-field-error")) thisOpt.$element.find("input[name='contract_code']").trigger("blur");
				        if (fieldName != "asset_code" && thisOpt.$element.find("input[name='asset_code']").is(".am-field-error")) thisOpt.$element.find("input[name='asset_code']").trigger("blur");
				        if (fieldName != "financial_code" && thisOpt.$element.find("input[name='financial_code']").is(".am-field-error")) thisOpt.$element.find("input[name='financial_code']").trigger("blur");
			        }				        
		          	return validity;
		        }, function() {
			        validity.valid = false;
		          	return validity;
		        });
			} else {
				if (isRequired) validity.valid = (val.length > 0);
			}
		}
	};
	return opt;
};

EquMgr.prototype.validOptionsForUpd = function () {
	var piThis = this;
	var opt = baseFormValidationOption();
	
	opt.submit = function () {
		var formValidity = this.isFormValid();
		if (typeof formValidity === "boolean") {
			if (formValidity) {
		    	piThis.submitModalUpd();
			}
		} else {
			$.when(formValidity).then(function() {
			    piThis.submitModalUpd();
		    }, function() {
		    	//to do
		    });
		}
	    return false;
	};
	
	opt.validate = function (validity) {
		if (validity.valid) {
			var $field = $(validity.field);
			var val = $field.val().trim();
			var isRequired = ($field.attr("required") != undefined);
			if ($field.is('.js-ajax-validate')) {
				if (val.length > 0) {
					var sendData = {};
					sendData.act = this.$element.find("input[name='act']").val().trim();
					sendData.id = this.$element.find("input[name='id']").val().trim();
					sendData.contract_code = this.$element.find("input[name='contract_code']").val().trim();
					sendData.asset_code = this.$element.find("input[name='asset_code']").val().trim();
					sendData.financial_code = this.$element.find("input[name='financial_code']").val().trim();
					var thisOpt = this;
					return $.ajax({
						url: piThis.route + '/valid',
						cache: false,
						data: sendData,
						dataType: 'json'
			        }).then(function(data) {
				        validity.valid = (parseInt(data, 10) == 0);
				        if (validity.valid) {
					        var fieldName = $field.attr("name");
					        if (fieldName != "contract_code" && thisOpt.$element.find("input[name='contract_code']").is(".am-field-error")) thisOpt.$element.find("input[name='contract_code']").trigger("blur");
					        if (fieldName != "asset_code" && thisOpt.$element.find("input[name='asset_code']").is(".am-field-error")) thisOpt.$element.find("input[name='asset_code']").trigger("blur");
					        if (fieldName != "financial_code" && thisOpt.$element.find("input[name='financial_code']").is(".am-field-error")) thisOpt.$element.find("input[name='financial_code']").trigger("blur");
				        }
			          	return validity;
			        }, function() {
				        validity.valid = false;
			          	return validity;
			        });
				} else {
					validity.valid = false;
				}
			} else {
				if (isRequired) validity.valid = (val.length > 0);
			}
		}
	}
	return opt;
};

EquMgr.prototype.onAddOk = function (data) {
	$.merge(data, this.data);
	this.data = data;
	this.onAllDataArrival(data);
    $("#" + this.mdlAddContainerId).modal("close");
	return true;
};

EquMgr.prototype.onUpdOk = function (data) {
	var equ = data[0];
	for (var i = 0; i < this.data.length; i++) {
		if (this.data[i].in_code == equ.in_code) {
			jQuery.extend(this.data[i], equ);
			break;
		}
	}
	this.onAllDataArrival();
    $("#" + this.mdlUpdContainerId).modal("close");
	return true;
};

EquMgr.prototype.onDelOk = function (data) {
	for (var i = 0; i < this.data.length; i++) {
		if (this.data[i].in_code_id == data) {
			this.data.splice(i, 1);
			break;
		}
	}
	this.onAllDataArrival();
    $("#" + this.mdlDelContainerId).modal("close");
	return true;
};

EquMgr.prototype.defaultSearchCriteria = function () {
	var ret = {};
	ret._token = $("div.search_block div form input[name='_token']").val().trim();
	ret.qp = this.getQueryParameter();
	ret.contract_code = "";
	ret.in_time_start = "";
	ret.in_time_end = "";
	ret.status = this.getActiveStatus().key;
	ret.storageStatus = "";
	ret.userId = this.userInfo.id;
	ret.storage_id = this.userInfo.storage_id;
	ret.organization_id = this.userInfo.organization_id;
	ret.local_organization_id = this.userInfo.organization_id;
	return ret;
};

EquMgr.prototype.getSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	ret.contract_code = $("div.search_block div form input[contract_code]").val().trim();
	ret.in_time_start = $("div.search_block div form input[in_time_start]").val().trim();
	ret.in_time_end = $("div.search_block div form input[in_time_end]").val().trim();
	ret.status = this.getActiveStatus().key;
	ret.organization_id = "";
	return ret;
};

EquMgr.prototype.getQuickSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	ret.organization_id = "";
	ret.status = this.getActiveStatus().key;
	return ret;
};

EquMgr.prototype.submitQuickSearch = function () {
	var sendData = this.getQuickSearchCriteria();
	var piThis = this;	
	showLoading();
	$.ajax({
		url: this.route + "/search",
		cache: false,
		type: 'POST',
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

EquMgr.prototype.replaceItem = function (itemData) {
	for (var i = 0; i < this.data.length; i++) {
		if (this.data[i].in_code == itemData.in_code) {
			jQuery.extend(this.data[i], itemData);
			break;
		}
	}
	return true;
};

EquMgr.prototype.getAcceptStatus = function () {
	return this.acceptStatus;
};

EquMgr.prototype.setAcceptStatus = function (value) {
	this.acceptStatus = value;
	return true;
};

EquMgr.prototype.defaultNav = function () {
	return this.navBar.equAccept;
};

EquMgr.prototype.getActiveNav = function () {
	if (this.activeNav) return this.activeNav;
	return this.defaultNav();
};

EquMgr.prototype.setActiveNav = function (key) {
	this.activeNav = this.navBar[key];
	return true;
};

EquMgr.prototype.resetNav = function (key) {
	// to do
}

EquMgr.prototype.defaultStatus = function () {
	return this.statusFilter.unAccepted;
};

EquMgr.prototype.getActiveStatus = function () {
	if (this.activeStatus) return this.activeStatus;
	return this.defaultStatus();
};

EquMgr.prototype.setActiveStatus = function (key) {
	this.activeStatus = this.statusFilter[key];
	return true;
};

EquMgr.prototype.resetStatus = function (key) {
	// to do
};

EquMgr.prototype.acceptEquipment = function (equId) {
	var piThis = this;
	$.ajax({
		url: this.route + '/accept/' + equId,
		cache: false
    }).then(function(data) {
        $("#" + piThis.tableId + " tr[equid='" + equId + "'] td button[btnAccept]").attr("disabled", true);
    }, function() {
      	alert("请求失败.");
    });
    
	return true;
};

EquMgr.prototype.defaultQueryParameter = function () {
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
	return defaultQP;
};

EquMgr.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["groupByStorage"] = 0;
	qp["withLocalInCount"] = 1;
	return qp;
};

EquMgr.prototype.getQueryParameter = function () {
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

var _EquFilter = null;
function EquFilter() {
	if (_EquFilter) return _EquFilter;
	_EquFilter = {
		accept: 10,
		unAccept: 20,
		inStorage: 30,
		outStorage: 40
	};
	return _EquFilter;
}

function EquPurposes() {
	var list = [];
	var i = 0;
	list.push({id: ++i, name: "", desc: "办公"});
	list.push({id: ++i, name: "", desc: "营业"});
	list.push({id: ++i, name: "", desc: "运行"});
	list.push({id: ++i, name: "", desc: "开发"});	
	this.list = list;
}

EquPurposes.prototype.toHTML = function () {
	var list = this.list;
	var s = [];
	s.push("<option value=''>主要用途</option>");
	for (var i = 0; i < list.length; i++) {
		s.push("<option value='", list[i].id, "'>", list[i].desc, "</option>");
	}
	return s.join("");
}

var _EquPurposes = null;
function getEquPurposes() {
	if (_EquPurposes) return _EquPurposes;
	var ret = new EquPurposes;
	_EquPurposes = ret;
	return ret;
}

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
	_EquQueryParameter = ret;
	return ret;
}