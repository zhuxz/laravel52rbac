function AccountMgr(instance) {
	if (typeof instance == "undefined") instance = "organization";
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

AccountMgr.prototype = new Management();
AccountMgr.prototype.parameters = ["user", "organizations", "permissions", "roles"];
	
AccountMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;
	
	var opt = EquipmentGridSetting();
	opt.bProcessing = true;
	
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");
		
		var mgr = thisMgr();
		var accountId;

		$btnDel = $("#" + mgr.tableId + " tbody td button[" + mgr.btnDel + "]");
		$btnDel.unbind("click");
		$btnDel.click(function () {
			accountId = this.getAttribute("eqid");
			mgr.popModalDel(accountId);
			return true;
		});

		$btnUpd = $("#" + mgr.tableId + " tbody td button[" + mgr.btnUpd + "]");
		$btnUpd.unbind("click");
		$btnUpd.click(function () {
			accountId = this.getAttribute("eqid");
			mgr.popModalUpd(accountId);
			return true;
		});
		return true;
	};
	
	opt.aaSorting = [[0, "desc"]];
	opt.bLengthChange = false;
	opt.bFilter = false;

	this._dataTableOptions = opt;
	
	return opt;
};

AccountMgr.prototype.getOrganizationMenuTree = function (id) {
	return new organizationMenueTree();
};

AccountMgr.prototype.modalOptionsForAdd = function () {		
	return {closeViaDimmer:false, width: 900, height:600};
};

AccountMgr.prototype.modalOptionsForUpd = function () {		
	return {closeViaDimmer:false, width: 900, height:600};
};

AccountMgr.prototype.onAllDataArrival = function (data) {
	if (data) this.data = data;
	
	var html = [];
	var ids = [];

	html.push("<table id='tblList' width='100%' table-layout='fixed' class='am-table am-table-striped am-table-compact am-text-nowrap zj-table'>");
	html.push("<thead>");
	this.buildHead(html);
	html.push("</thead>");
	html.push("</tbody>");
	this.buildRow(this.data, ids, html);
	html.push("</tbody>");
	html.push("</table>");
	
	$("#" + this.containerId).html(html.join(""));

	this.applyDataTable();
	
	return true;
};

AccountMgr.prototype.getEquEditBody = function (_token, act, id) {
	var html = [];
	html.push("<form class='am-form am-form-horizontal'>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='act' value='", act, "'>");
	html.push("<input type='hidden' name='id' value='", id, "'>");
	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text js-ajax-validate' type='text' name='name' placeholder='账号名称' required>");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='password' name='pwd' class='am-form-field' placeholder='密码' required />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='realName' placeholder='真实名称' required />");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'> ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field' name='contact' placeholder='联系方式' required />");
	html.push("</div> ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' class='am-form-field'");
	html.push(" name='organization' placeholder='机构选择'");
	html.push(" id='menuTarget' onclick='organizationMenueTree().show();'");
	html.push(" style='background-color: white;'");
	html.push(" releasevalue='' value=''");
	html.push(" readonly required />");
	html.push("</div>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='role' required>");
	html.push("<option value=''>账号组</option>");
	if (this.roles) {
		var roles = this.roles;
		var iRole;
		var nRole = roles.length;
		for (iRole = 0; iRole < nRole; iRole++) {
			html.push("<option value='", roles[iRole].id, "'>", roles[iRole].display_name, "</option>");
		}
	}
	html.push("</select>");
	html.push("</div>");
	html.push("</div>");
	html.push("<div class='am-form-group'>  ");
	html.push("<div class='am-u-sm-4'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn am-fl'>保存</button>");
	html.push("</div>");
	html.push("</div>");
	html.push("</form>");
	return html.join("");
};

AccountMgr.prototype.drawModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	$(containerId).html(this.getEquEditBody(_token, this.act, ""));	
	return true;
};

AccountMgr.prototype.drawModalUpd = function (id) {
	var containerId = "#" + this.mdlUpdContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	$(containerId).html(this.getEquEditBody(_token, this.act, id));	
	return true;
};

AccountMgr.prototype.initModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var names = ["超级管理员", "合同查阅员", "仓库管理员", "设备管理员"];
	var name = names[getRandomNum(1, 4) - 1];
	$(containerId + " form input[name='name']").val(name);
	$(containerId + " form input[name='pwd']").val(1);
	names = ["张三", "张四", "王五", "Steven"];
	$(containerId + " form input[name='realName']").val(names[getRandomNum(1, 4) - 1]);
	return true;
};

AccountMgr.prototype.initModalUpd = function (id) {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	var account = this.itemData("id", id);
	$(containerId + " form input[name='name']").val(account.name);
	$(containerId + " form input[name='pwd']").val(account.password);
	$(containerId + " form input[name='contact']").val(account.mobile);
	$(containerId + " form input[name='id']").val(id);
	
	var zt = this.getOrganizationMenuTree();
	item = this.organizations.item(account.organization_id);
	zt.setDefault(account.organization_id);
	$(containerId + " form input[name='organization']").val(item.name);
	$(containerId + " form input[name='organization']").attr("releasevalue", account.organization_id);
	
	$(containerId + " form input[name='realName']").val(account.real_name);
	$(containerId + " form select[name='role']").val(account.roleId);
	return true;
};

AccountMgr.prototype.initModalDel = function (id) {
	var o = this.itemData("id", id);		
	var mdlId = "#" + this.mdlDelContainerId;
	$(mdlId + " input[name='father_id']").val(o.father_id);
	$(mdlId + " input[name='action']").val(enumAction().del);
	$(mdlId + " input[name='id']").val(o.id);
	$(mdlId + " input[name='name']").val(o.name);
	return true;
};

AccountMgr.prototype.sendDataForAdd = function () {
	var formId = "#" + this.mdlAddContainerId + " form";
	var frmData = new FormData($(formId)[0]);
	var organization = $(formId + " input[name='organization']").attr("releasevalue");
	frmData.append("organization", organization);
	return frmData;
};

AccountMgr.prototype.sendDataForUpd = function () {
	return this.sendDataForAdd();
};

AccountMgr.prototype.sendDataForDel = function () {
	var rootId = $("#" + this.mdlDelContainerId + " input[name='id']").val();
	var ret = {};
	ret.idList = rootId;
	ret.id = rootId;
	return ret;
};

AccountMgr.prototype.validOptionsForAdd = function () {
	var opt = baseFormValidationOption();
	opt.submit = function () {
		var formValidity = this.isFormValid();
		if (typeof formValidity === "boolean") {
			if (formValidity) {
				var mgr = thisMgr();
		    	mgr.submitModalAdd();
			}
		} else {
			$.when(formValidity).then(function() {
		    	var mgr = thisMgr();
			    mgr.submitModalAdd();
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
					var $input = this.$element.find("input[name='name']");
					return $.ajax({
						url: 'management/account/valid?val=' + val + "&fid=0",
						cache: false, //实际使用中请禁用缓存
						dataType: 'json'
			        }).then(function(data) {
				        validity.valid = (parseInt(data, 10) == 0);
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

AccountMgr.prototype.validOptionsForUpd = function () {
	var opt = baseFormValidationOption();
	opt.submit = function () {
		var formValidity = this.isFormValid();
	    $.when(formValidity).then(function() {
		    var mgr = thisMgr();
		    mgr.submitModalUpd();
	    }, function() {
	    	//to do
	    });
	    
	    return false;
	};
	
	opt.validate = function (validity) {
		log("validate");
		if (validity.valid) {
			var $field = $(validity.field);
			var val = $field.val().trim();
			var isRequired = ($field.attr("required") != undefined);
			if ($field.is('.js-ajax-validate')) {
				if (val.length > 0) {
					var $input = this.$element.find("input[name='id']");
					var fid = ($input.length > 0 ? $input.val() : 0);
					return $.ajax({
						url: 'management/account/valid?val=' + val + "&fid=" + fid,
						cache: false, //实际使用中请禁用缓存
						dataType: 'json'
			        }).then(function(data) {
				        validity.valid = (parseInt(data, 10) == 0);
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

AccountMgr.prototype.modalOptionsForDel = function () {
	var piThis = this;
	return {
		onConfirm: function(options) {
			piThis.submitModalDel.call(piThis);
		},
		closeOnConfirm: false
	};
};

AccountMgr.prototype.getOrganization = function (id) {
	if (this.data && this.data.organizations) {
		return this.data.organizations.map[id];
	}
	return null;
};

AccountMgr.prototype.getRole = function (id) {
	if (this.data && this.data.roles) {
		var ret = -1;
		$.each(this.data.roles, function (i, role) {
			if (role.id == id) {
				ret = i;
				return false;
			}
			return true;
		});
		return ret == -1 ? null : this.data.roles[ret];
	}
	return null;
};

AccountMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "序号"));
	ret.push(new TableHead("", "机构/部门名称"));
	ret.push(new TableHead("", "账号名称"));
	ret.push(new TableHead("", "真实名称"));
	ret.push(new TableHead("", "联系方式"));
	ret.push(new TableHead("", "用户组"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

AccountMgr.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	var org;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr agid='", item.id, "'>");
		ret.push("<td>", item.id, "</td>");
		ret.push("<td>", item.organizationName, "</td>");
		ret.push("<td>", item.name, "</td>");
		ret.push("<td>", item.real_name, "</td>");
		ret.push("<td>", item.mobile, "</td>");
		ret.push("<td>", item.roleName, "</td>");
		ret.push("<td>");
		ret.push("<div class='am-btn-toolbar'>");
		ret.push("<div class='am-btn-group am-btn-group-sm'>");
		ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='修改' ", this.btnUpd, " eqid='", item.id, "'>");
		ret.push("<span class='am-icon-pencil-square-o'></span> ");
		ret.push("</button>");
		ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-danger am-hide-sm-only' title='删除' ", this.btnDel, " eqid='", item.id, "'>");
		ret.push("<span class='am-icon-trash-o'></span> ");
		ret.push("</button>");
		ret.push("</div>");
		ret.push("</div>");
		ret.push("</td>");		
		ret.push("</tr>");
	}
	
	return true;
};

AccountMgr.prototype.getSearchCriteria = function () {
	return {};
};

AccountMgr.prototype.initUser = function () {

};

AccountMgr.prototype.initBody = function () {
	var piThis = this;

	$("a[" + piThis.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});
};

AccountMgr.prototype.initData = function () {
	var piThis = this;
	//$.get("role/all", {async: false}, function (data) {
	//	piThis.roles = data;
	//	return true;
	//});
    //
	//$.get("management-organization/all", {async: false}, function (data) {
	//	piThis.organizations = new TreeData(data);
	//	return true;
	//});

	$.get("user/index", {async: false}, function (data) {
		piThis.cacheData(data);
		//piThis.onAllDataArrival.call(piThis);
		hideLoading();
		return true;
	});
};

AccountMgr.prototype.initialize = function () {
	var ret = true;

	this.beforeInitialize();
	this.finishInitialize();

	this.afterInitialize();

	return ret;
};

var _accountMgr = null;
function thisMgr() {
	if (_accountMgr) return _accountMgr;
	var ret = new AccountMgr("account");
	ret.mdlUpdContainerId = ret.mdlAddContainerId;
	_accountMgr = ret;
	
	return ret;
}

var _organizationMenueTree = null;
function organizationMenueTree() {
	if (_organizationMenueTree) return _organizationMenueTree;
	var ret = new OrganizationMenueTree("menuContent", "menuTree", "menuTarget");
	var mgr = thisMgr();
	ret.init(mgr.organizations.root);

	_organizationMenueTree = ret;
	
	return ret;
}