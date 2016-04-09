function EquMgr(instance) {
	if (typeof instance == "undefined") instance = "equ";
	this.instance = instance;
	this.route = this.route + "/" + instance;
	this.acceptStatus = "unAccepted";
	//this.initialize();
}

EquMgr.prototype = new Management();
EquMgr.prototype.frmSearch = "frmSearch";

EquMgr.prototype.buildQuickNav = function () {
	return "";
};

EquMgr.prototype.renderQuickNav = function () {
	$("div[" + this.quickNav + "] ul").append(this.buildQuickNav());
};

EquMgr.prototype.renderHeader = function () {
	this.renderQuickNav();
	return true;
};

EquMgr.prototype.initQuickNav = function () {
	var user = this.userInfo;
	var $ul = $("ul[" + this.quickNav + "]");

	if (!user.permissionMap["asset_in"]) {
		$ul.find("li[route='equipment-enter']").remove();
	}

	if (!user.permissionMap["asset_accept"]) {
		$ul.find("li[route='equipment-accept']").remove();
	}

	if (!user.permissionMap["asset_out"]) {
		$ul.find("li[route='out-equipment']").remove();
	}

	if (!user.permissionMap["asset_pool_allot"]) {
		$ul.find("li[route='allocation-equipment']").remove();
	}

	$ul.parent().parent().show();
};

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
	statusFilter.unknow = {id: ++i, key: "unknow", desc: ""};
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

Management.prototype.renderPage = function () {
	this.renderLeftNav();
	this.renderSearch();
	this.renderHeader();
	return true;
};

EquMgr.prototype.afterInitialize = function	() {
	this.initNavBar();
	this.initStatusFilter();
	this.initEquipmentStatus();
	return true;
};

EquMgr.prototype.cacheData = function (data) {
	this.data = data.assets;
	this.asset_kinds = new TreeData(data.asset_kinds);
	this.asset_brand = new TreeData(data.asset_brand);
	//this.organizations = new Organization(data.organizations);
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
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "供应商"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "入库总数"));
	ret.push(new TableHead("", "现库存"));
	ret.push(new TableHead("", "单价"));
	ret.push(new TableHead("", "经办人"));
	ret.push(new TableHead("", "资产编号"));
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
		ret.push("<tr equid='", item.in_code, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", item.totalCount, "</td>");
		ret.push("<td>", item.inCount, "</td>");
		ret.push("<td>", item.price, "</td>");
		ret.push("<td>", item.operate_user_id, "</td>");
		ret.push("<td>", item.financial_code, "</td>");
		ret.push("<td>");
		ret.push("<a class='am-btn am-btn-warning' href='#'><i class='am-icon-shopping-cart'></i>结账</a>");
		ret.push("<a class='am-btn am-btn-warning' href='#'><i class='am-icon-shopping-cart'></i>结账</a>");
		ret.push("<a class='am-btn am-btn-warning' href='#'><i class='am-icon-shopping-cart'></i>结账</a>");
		ret.push("<a class='am-btn am-btn-warning' href='#'><i class='am-icon-shopping-cart'></i>结账</a>");
		//ret.push("<div class='am-btn-toolbar'>");
		//ret.push("<div class='am-btn-group am-btn-group-sm'>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' ", this.btnUpd, " eqid='", item.in_code, "'>");
		//ret.push("<span class='am-icon-pencil-square-o'></span> 修改");
		//ret.push("</button>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-danger am-hide-sm-only' ", this.btnDel, " eqid='", item.in_code, "'>");
		//ret.push("<span class='am-icon-trash-o'></span> 删除");
		//ret.push("</button>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' btnAccept eqid='", item.in_code, "'", (EquipmentStatus().isAccept(item.status) ? " disabled" : ""), ">");
		//ret.push("<span class='am-icon-trash-o'></span> 验收");
		//ret.push("</button>");
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
	
	html.push("<div class='am-form-group am-form-group-sm'>");
	//合同编号
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='contract_code' placeholder='合同编号' title='合同编号' required />");
	html.push("</div>");
	//供应商
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='supplier' placeholder='供应商' title='供应商' required />");
	html.push("</div>");
	//购置日期
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='in_time' class='am-form-field' placeholder='购置日期' title='购置日期' data-am-datepicker readonly required />");
	html.push("</div>");
	html.push("</div>");
	
	html.push("<div class='am-form-group am-form-group-sm'>");
	//设备大类
	var ids = (equ ? this.asset_kinds.getFullPath(equ.kind_id) : []);
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='root_kind_id' onchange='on_kind_change(this);' title='设备大类' required>");
	html.push("<option value=''>设备大类</option>");
	html.push(this.asset_kinds.getFirstChildComboBoxList());
	html.push("</select>");
	html.push("</div>");
	//设备名称
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='kind_id' title='设备名称' required>");
	html.push("<option value=''>设备名称</option>");
	html.push(equ ? this.asset_kinds.getComboBoxList(ids[1]) : "");
	html.push("</select>");
	html.push("</div>");
	//设备品牌
	ids = (equ ? this.asset_brand.getFullPath(equ.brand_id) : []);
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='root_brand_id' onchange='on_brand_change(this);' title='设备品牌' required>");
	html.push("<option value=''>设备品牌</option>");
	html.push(this.asset_brand.getFirstChildComboBoxList());
	html.push("</select>");
	html.push("</div>");	
	html.push("</div>");
	
	html.push("<div class='am-form-group am-form-group-sm'>");
	//设备规格型号
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='brand_id' title='设备规格型号' required>");
	html.push("<option value=''>设备规格型号</option>");
	html.push(equ ? this.asset_brand.getComboBoxList(ids[1]) : "");
	html.push("</select>");
	html.push("</div>");
	//设备数量
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='number' name='quantity' class='am-form-field' placeholder='设备数量' title='设备数量' required />");
	html.push("</div>");	
	//设备单价
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='number' name='price' class='am-form-field' placeholder='设备单价' title='设备单价' required />");
	html.push("</div>");	
	html.push("</div>");
	
	html.push("<div class='am-form-group am-form-group-sm'>");
	//设备计量单位
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='unit_id' required>");
	html.push("<option value=''>设备计量单位</option>");
	html.push(this.asset_unit.getComboBoxList());
	html.push("</select>");
	html.push("</div>");
	//保修截止日期
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='maintain_stop' placeholder='保修截止日期' title='保修截止日期' data-am-datepicker readonly />");
	html.push("</div>");
	//经办人
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='operator_name' class='am-form-field' placeholder='经办人' title='经办人' value='", this.userInfo.real_name, "' readonly/>");
	html.push("</div>");
	html.push("</div>");
	
	html.push("<div class='am-form-group am-form-group-sm'>");
	//上传资产编号
	html.push("<div class='am-u-sm-4'>");
	html.push("<div class='am-form-group am-form-file am-fl'>");
	html.push("<button type='button' class='am-btn am-btn-default am-btn-sm'>");
	html.push("<i class='am-icon-cloud-upload'></i> 上传资产编号</button>");
	html.push("<input type='file' name='financial_code'>");
	html.push("</div>");
	html.push("</div>");
	//确定
	html.push("<div class='am-u-sm-4'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
	html.push("</div>");
	html.push("</div>");
	
	html.push("</form>");
	
	return html.join("");
};

EquMgr.prototype.initModalAdd = function () {
	var frmId = "#" + this.mdlAddContainerId + " form";
	
	$(frmId + " input[name='contract_code']").val("IT" + getRandomNum(1, 100000));
	
	$(frmId + " input[name='maintain_stop']").val((new Date).DateAdd("y", 3).Format("yyyy-MM-dd"));
	$(frmId + " input[name='maintain_stop']").datepicker({format: 'yyyy-mm-dd'});
	
	$(frmId + " input[name='supplier']").val("供应商" + getRandomNum(1, 10));
	//$(frmId + " select[name='root_kind_id'] option:eq(" + getRandomNum(1, $(frmId + " select[name='root_kind_id'] option").length - 1) + ")").attr("selected", "");
	//$(frmId + " select[name='root_brand_id'] option:eq(" + getRandomNum(1, $(frmId + " select[name='root_brand_id'] option").length - 1) + ")").attr("selected", "");

	$(frmId + " input[name='in_time']").val((new Date).DateAdd("d", -1 * getRandomNum(1, 14)).Format("yyyy-MM-dd"));
	$(frmId + " input[name='in_time']").datepicker({format: 'yyyy-mm-dd'});
	
	$(frmId + " input[name='quantity']").val(getRandomNum(1, 20));
	$(frmId + " input[name='price']").val(getRandomNum(2000, 1000000) / 100);
	$(frmId + " select[name='unit_id'] option:eq(" + getRandomNum(1, $(frmId + " select[name='unit_id'] option").length - 1) + ")").attr("selected", "");
	
	return true;
};

EquMgr.prototype.initModalUpd = function (id) {
	var equ = this.dataItems(id);
	var frmId = "#" + this.mdlUpdContainerId + " form";
	
	$(frmId + " input[name='contract_code']").val(equ.contract_code);
	$(frmId + " input[name='maintain_stop']").val((new Date(equ.maintain_stop)).Format("yyyy-MM-dd"));
	$(frmId + " input[name='maintain_stop']").datepicker({format: 'yyyy-mm-dd'});
	
	$(frmId + " input[name='supplier']").val(equ.supplier);
	
	var item = this.asset_kinds.item(equ.kind_id);
	$(frmId + " select[name='root_kind_id']").val(item.father_id);
	$(frmId + " select[name='kind_id']").val(item.id);
	
	item = this.asset_brand.item(equ.brand_id);
	$(frmId + " select[name='root_brand_id']").val(item.father_id);
	$(frmId + " select[name='brand_id']").val(item.id);
	
	$(frmId + " input[name='in_time']").val((new Date(equ.in_time)).Format("yyyy-MM-dd"));
	$(frmId + " input[name='in_time']").datepicker({format: 'yyyy-mm-dd'});
	
	$(frmId + " input[name='quantity']").val(equ.quantity);
	$(frmId + " input[name='quantity']").attr("disabled", true);
	$(frmId + " input[name='price']").val(equ.price);
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
	};
	return opt;
};

EquMgr.prototype.onAddOk = function (data) {
	$.merge(data, this.data);
	this.data = data;
	
	if( this.data == 1 ){
		alert("上传的资产编号含有重复值！");
	}else if( this.data == 2 ){
		alert("入库数量与资产编号数不一致，请重新上传！");
	}else{
		$("#" + this.mdlAddContainerId).modal("close");	
	}

	this.onAllDataArrival(data);
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
	ret.qp = this.getQueryParameter();
	ret.contract_code = "";
	ret.in_time_start = "";
	ret.in_time_end = "";
	//ret.status = this.getActiveStatus().key;
	ret.storageStatus = "";
	ret.userId = this.userInfo.id;
	ret.storage_id = this.userInfo.storage_id;
	ret.organization_id = this.userInfo.organization_id;
	ret.local_organization_id = this.userInfo.organization_id;
	ret.contract_code = $("div.search_block div input[contract_code]").val().trim();
	ret.in_time_start = $("div.search_block div input[in_time_start]").val().trim();
	ret.in_time_end = $("div.search_block div input[in_time_end]").val().trim();
	return ret;
};

EquMgr.prototype.getSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	//ret.status = this.getActiveStatus().key;
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
};

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
};

var _EquPurposes = null;
function getEquPurposes() {
	if (_EquPurposes) return _EquPurposes;
	var ret = new EquPurposes;
	_EquPurposes = ret;
	return ret;
}