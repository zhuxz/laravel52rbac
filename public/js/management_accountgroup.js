function AccountGroupMgr(instance) {
	if (typeof instance == "undefined") instance = "accountgroup";
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

AccountGroupMgr.prototype = new Management();
AccountGroupMgr.prototype.parameters = ["user"];
AccountGroupMgr.prototype.fullRights = {
	asset_manage: { key: "asset_manage"},
	asset_task: { key: "asset_task"},
	asset_accept_submit: { key: "asset_accept_submit"},
	asset_accept_submit_in_branch: { key: "asset_accept_submit_in_branch"},
	asset_receive: { key: "asset_receive"},
	asset_pool_allot_submit: { key: "asset_pool_allot_submit"},
	asset_in: { key: "asset_in"},
	asset_accept: { key: "asset_accept"},
	asset_out: { key: "asset_out"},
	asset_pool_allot: { key: "asset_pool_allot"},
	sys_manage: { key: "sys_manage"},
	account_manage: { key: "account_manage"},
	account_group_manage: { key: "account_group_manage"},
	organization_manage: { key: "organization_manage"},
	asset_type_manage: { key: "asset_type_manage"},
	brand_manage: { key: "brand_manage"},
	unit_manage: { key: "unit_manage"},
	report_manage: { key: "report_manage"},
	contract_manage: { key: "contract_manage"}
};

AccountGroupMgr.prototype.cacheData = function (data) {
	this.data = data.roles;
	this.groupPermissions(data.permissions);
	return true;
};

AccountGroupMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;
	
	var opt = EquipmentGridSetting();
	opt.bProcessing = true;
	
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");
		
		var mgr = thisMgr();
		var accountGroupId;

		$btnDel = $("#" + mgr.tableId + " tbody td button[" + mgr.btnDel + "]");
		if ($btnDel.length > 0) {
			$btnDel.unbind("click");
			$btnDel.click(function () {
				accountGroupId = this.getAttribute("eqid");
				mgr.popModalDel(accountGroupId);
				return true;
			});
		}

		$btnUpd = $("#" + mgr.tableId + " tbody td button[" + mgr.btnUpd + "]");
		if ($btnUpd.length > 0) {
			$btnUpd.unbind("click");
			$btnUpd.click(function () {
				accountGroupId = this.getAttribute("eqid");
				mgr.popModalUpd(accountGroupId);
				return true;
			});
		}

		return true;
	};
	
	opt.aaSorting = [[0, "desc"]];
	opt.bLengthChange = false;
	opt.bFilter = false;

	this._dataTableOptions = opt;
	
	return opt;
};

AccountGroupMgr.prototype.onAllDataArrival = function (data) {
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

	$('#' + this.tableId).DataTable(this.dataTableOptions());
	
	return true;
};

AccountGroupMgr.prototype.getEditorBody = function (_token, act, id) {
	var permissions = this.permissions;
	
	var html = [];
	html.push("<form class='am-form'>");
	//html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value=''>");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text js-ajax-validate' type='text' name='name' placeholder='账号组名称' required />");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text' type='text' name='desc' placeholder='描述' />");
	html.push("</div>");
	html.push("<fieldset style='padding: .1em 0 0;'>");
	html.push("<legend style='text-align: left; margin-bottom: 4px;font-size: 1.6rem'>权限配置</legend>");

	html.push("<table");
	html.push(">");
	html.push("<tr");
	html.push(">");
	html.push("<td style='text-align: left'>设备管理</td>");
	html.push("</tr>");
	html.push("<tr");
	html.push(">");
	html.push("<td>");
	html.push("<div class='am-form-group' style='text-align: left;'>");
	if (this.permission_tree && this.permission_tree.asset_management) {
		$.each(this.permission_tree.asset_management, function (i, permission) {
			html.push("<label class='am-checkbox-inline' title='", permission.description, "'");
			html.push(" style='width:150px;margin-left:10px;'");
			html.push(">");
			html.push("<input type='checkbox' value='", permission.id, "'");
			html.push(" right-name='", permission.name, "'");
			html.push(" style='height:19px;'");
			html.push(permission.checked ? " checked='checked'" : "");
			html.push(permission.disabled ? " disabled='disabled'" : "");
			html.push(" /> ", permission.display_name);
			html.push("</label>");
			return true;
		});
	}
	html.push("</div>");
	html.push("</td>");
	html.push("</tr>");

	html.push("<tr");
	html.push(">");
	html.push("<td style='text-align: left'>系统管理</td>");
	html.push("</tr>");
	html.push("<tr");
	html.push(">");
	html.push("<td>");
	html.push("<div class='am-form-group' style='text-align: left;'>");
	if (this.permission_tree && this.permission_tree.sys_management) {
		$.each(this.permission_tree.sys_management, function (i, permission) {
			html.push("<label class='am-checkbox-inline' title='", permission.description, "'");
			html.push(" style='width:150px;margin-left:10px;'");
			html.push(">");
			html.push("<input type='checkbox' value='", permission.id, "'");
			html.push(" right-name='", permission.name, "'");
			html.push(" style='height:19px;'");
			html.push(permission.checked ? " checked='checked'" : "");
			html.push(permission.disabled ? " disabled='disabled'" : "");
			html.push(" /> ", permission.display_name);
			html.push("</label>");
			return true;
		});
	}
	html.push("</div>");
	html.push("</td>");
	html.push("</tr>");

	html.push("<tr");
	html.push(">");
	html.push("<td style='text-align: left'>查询统计</td>");
	html.push("</tr>");
	html.push("<tr");
	html.push(">");
	html.push("<td>");
	html.push("<div class='am-form-group' style='text-align: left;'>");
	if (this.permission_tree && this.permission_tree.report_management) {
		$.each(this.permission_tree.report_management, function (i, permission) {
			html.push("<label class='am-checkbox-inline' title='", permission.description, "'");
			html.push(" style='width:150px;margin-left:10px;'");
			html.push(">");
			html.push("<input type='checkbox' value='", permission.id, "'");
			html.push(" right-name='", permission.name, "'");
			html.push(" style='height:19px;'");
			html.push(permission.checked ? " checked='checked'" : "");
			html.push(permission.disabled ? " disabled='disabled'" : "");
			html.push(" /> ", permission.display_name);
			html.push("</label>");
			return true;
		});
	}
	html.push("</div>");
	html.push("</td>");
	html.push("</tr>");

	html.push("<tr");
	html.push(">");
	html.push("<td style='text-align: left'>合同导入</td>");
	html.push("</tr>");
	html.push("<tr");
	html.push(">");
	html.push("<td>");
	html.push("<div class='am-form-group' style='text-align: left;'>");
	if (this.permission_tree && this.permission_tree.contract_management) {
		$.each(this.permission_tree.contract_management, function (i, permission) {
			html.push("<label class='am-checkbox-inline' title='", permission.description, "'");
			html.push(" style='width:150px;margin-left:10px;'");
			html.push(">");
			html.push("<input type='checkbox' value='", permission.id, "'");
			html.push(" right-name='", permission.name, "'");
			html.push(" style='height:19px;'");
			html.push(permission.checked ? " checked='checked'" : "");
			html.push(permission.disabled ? " disabled='disabled'" : "");
			html.push(" /> ", permission.display_name);
			html.push("</label>");
			return true;
		});
	}
	html.push("</div>");
	html.push("</td>");
	html.push("</tr>");

	html.push("<table>");

	html.push("</fieldset>");
	html.push("<div class='am-form-group' style='text-align: right;'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
	html.push("</div>");
	html.push("</form>");
	return html.join("");
};

AccountGroupMgr.prototype.modalOptionsForAdd = function () {
	return { closeViaDimmer: false, width: 600, height: 600 };
};

AccountGroupMgr.prototype.modalOptionsForUpd = function () {
	return { closeViaDimmer: false, width: 600, height: 600 };
};

AccountGroupMgr.prototype.onAssetManage_RightChange = function (checked) {
	var rights = this.fullRights;
	var xPath = [];
	xPath = ["input[right-name='" + rights.asset_task.key + "']"];
	xPath.push("input[right-name='" + rights.asset_accept_submit_in_branch.key + "']");
	xPath.push("input[right-name='" + rights.asset_receive.key + "']");
	xPath.push("input[right-name='" + rights.asset_pool_allot_submit.key + "']");
	xPath.push("input[right-name='" + rights.asset_in.key + "']");
	xPath.push("input[right-name='" + rights.asset_accept.key + "']");
	xPath.push("input[right-name='" + rights.asset_out.key + "']");
	if (!checked) {
		xPath.push("input[right-name='" + rights.asset_accept_submit.key + "']");
		xPath.push("input[right-name='" + rights.asset_pool_allot.key + "']");
	}

	if (xPath.length > 0) {
		$(xPath.join(",")).each(function(i, chk){
			chk.checked = checked;
		});
	}
};

AccountGroupMgr.prototype.onAssetTask_RightChange = function (checked) {
	var rights = this.fullRights;
	var xPath = [];
	var isBrotherChecked = false;
	if (checked) {
		$("input[right-name='" + rights.asset_manage.key + "']").attr("checked", true);
	} else {
		xPath = ["input[right-name='" + rights.asset_task.key + "']"];
		xPath.push("input[right-name='" + rights.asset_in.key + "']");
		xPath.push("input[right-name='" + rights.asset_accept.key + "']");
		xPath.push("input[right-name='" + rights.asset_out.key + "']");
		xPath.push("input[right-name='" + rights.asset_pool_allot.key + "']");
		$(xPath.join(",")).each(function(i, chk){
			isBrotherChecked = chk.checked;
			if (isBrotherChecked) return false;
		});
		if (!isBrotherChecked) {
			$("input[right-name='" + rights.asset_manage.key + "']").removeAttr("checked");
		}
	}

	xPath = ["input[right-name='" + rights.asset_accept_submit_in_branch.key + "']"];
	xPath.push("input[right-name='" + rights.asset_receive.key + "']");
	xPath.push("input[right-name='" + rights.asset_pool_allot_submit.key + "']");
	if (!checked) {
		xPath.push("input[right-name='" + rights.asset_accept_submit.key + "']");
		xPath.push("input[right-name='" + rights.asset_pool_allot.key + "']");
	}

	if (xPath.length > 0) {
		$(xPath.join(",")).each(function(i, chk){
			chk.checked = checked;
		});
	}
};

AccountGroupMgr.prototype.onRightChange = function (piSender, piEvent) {
	var rightName = piSender.getAttribute("right-name");
	var checked = piSender.checked;
	var rights = this.fullRights;
	var xPath = [];
	var isBrotherChecked = false;
	switch (rightName) {
		case rights.asset_manage.key:
			this.onAssetManage_RightChange(checked);
			break;
		case rights.asset_task.key:
			this.onAssetTask_RightChange(checked);
			break;
		case rights.asset_accept_submit.key:
		case rights.asset_accept_submit_in_branch.key:
		case rights.asset_receive.key:
		case rights.asset_pool_allot_submit.key:
			if (checked) {
				$("input[right-name='" + rights.asset_task.key + "']").attr("checked", "");
			} else {
				xPath = ["input[right-name='" + rights.asset_accept_submit.key + "']"];
				xPath.push("input[right-name='" + rights.asset_accept_submit_in_branch.key + "']");
				xPath.push("input[right-name='" + rights.asset_receive.key + "']");
				xPath.push("input[right-name='" + rights.asset_pool_allot_submit.key + "']");
				$(xPath.join(",")).each(function(i, chk){
					isBrotherChecked = chk.checked;
					if (isBrotherChecked) return false;
				});
				if (!isBrotherChecked) {
					$("input[right-name='" + rights.asset_task.key + "']").removeAttr("checked");
					this.onAssetTask_RightChange(false);
				}
			}
			break;

		case rights.asset_task:
		case rights.asset_accept_submit:
		case rights.asset_accept_submit_in_branch:
		case rights.asset_receive:
		case rights.asset_pool_allot:
		case rights.asset_in:
		case rights.asset_accept:
		case rights.asset_out:
			break;
		case rights.sys_manage:
		case rights.account_manage:
		case rights.account_group_manage:
		case rights.organization_manage:
		case rights.asset_type_manage:
		case rights.brand_manage:
		case rights.unit_manage:
			break;
		case rights.report_manage:
			break;
		case rights.contract_manage:
			break;
	}

	if (xPath.length > 0) {
		$(xPath.join(",")).each(function(i, chk){
			chk.checked = checked;
		});
	}
};

AccountGroupMgr.prototype.initModalAdd = function () {
	//var piThis = this;
	//var $checkBoxes = $("input[right-name]");
	//if ($checkBoxes.length >0) {
	//	$checkBoxes.unbind("change");
	//	$checkBoxes.change(function(piEvent){
	//		piThis.onRightChange(this, piEvent);
	//	});
	//	$checkBoxes.each(function (i, chk) {
    //
	//	});
	//}
	return true;
};

AccountGroupMgr.prototype.initModalUpd = function (id) {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var permissions = this.permissions;
	
	var o = this.itemData("id", id);
	var piThis = this;
	$.ajax({
		url: 'role/permission/' + id,
		cache: false
    }).then(function(data) {
        piThis.populatePermissions(data);
    }, function() {
        alert("请求失败.");
        $("#" + piThis.mdlAddContainerId + " form fieldset div.am-form-group").html("");
    });
	
	$(containerId + " form input[name='id']").val(id);
	$(containerId + " form input[name='name']").val(o.name);
	$(containerId + " form input[name='desc']").val(o.description);
	return true;
};

AccountGroupMgr.prototype.initModalDel = function (id) {
	var o = this.itemData("id", id);		
	var mdlId = "#" + this.mdlDelContainerId;
	$(mdlId + " input[name='father_id']").val(o.father_id);
	$(mdlId + " input[name='action']").val(enumAction().del);
	$(mdlId + " input[name='id']").val(o.id);
	$(mdlId + " input[name='name']").val(o.name);
	return true;
}

AccountGroupMgr.prototype.sendDataForAdd = function () {
	var formId = "#" + this.mdlAddContainerId + " form";
	var frmData = new FormData($(formId)[0]);
	var rights = [];
	$(formId + " fieldset div.am-form-group input[right-name]").each(function (i, item) {
		if (item.checked) {
			rights.push(item.value);
		}
		return true;
	});
	frmData.append("rights", rights.join(","));

	return frmData;
};

AccountGroupMgr.prototype.sendDataForUpd = function () {
	return this.sendDataForAdd();
};

AccountGroupMgr.prototype.sendDataForDel = function () {
	var rootId = $("#" + this.mdlDelContainerId + " input[name='id']").val();
	var ret = {};
	ret.idList = rootId;
	ret.id = rootId;
	return ret;
};

AccountGroupMgr.prototype.validOptionsForAdd = function () {
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
		log("validate");
		if (validity.valid) {
			var $field = $(validity.field);
			var val = $field.val().trim();
			log("name=" + $field.attr("name"));
			var isRequired = ($field.attr("required") != undefined);
			if ($field.is('.js-ajax-validate')) {
				if (val.length > 0) {
					var $input = this.$element.find("input[name='name']");
					return $.ajax({
						url: 'management/accountgroup/valid?val=' + val + "&fid=0",
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

AccountGroupMgr.prototype.validOptionsForUpd = function () {
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
						url: 'management/accountgroup/valid?val=' + val + "&fid=" + fid,
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

AccountGroupMgr.prototype.modalOptionsForDel = function () {
	var piThis = this;
	return {
		onConfirm: function(options) {
			piThis.submitModalDel.call(piThis);
		},
		closeOnConfirm: false
	};
};

AccountGroupMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "序号"));
	ret.push(new TableHead("", "账号组名称"));
	ret.push(new TableHead("", "备注"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

AccountGroupMgr.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr agid='", item.id, "'>");
		ret.push("<td>", item.id, "</td>");
		ret.push("<td>", item.display_name, "</td>");
		ret.push("<td>", item.description, "</td>");
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

AccountGroupMgr.prototype.populatePermissions = function (selected) {
	if (!selected) selected = [];
	var permissions = this.permissions;
	
	var s = [];
	if (permissions) {
		$.each(permissions, function (i, permission) {
			if ($.inArray(permission.id, selected) < 0) {
				$("input[right-name='" + permission.name + "']").removeAttr("checked");
			} else {
				$("input[right-name='" + permission.name + "']").attr("checked", true);
			}
			return true;
		});
	}
	
	//var mdlId = "#" + this.mdlAddContainerId + " form";
	//$(mdlId + " fieldset div.am-form-group").html(s.join(""));
	
	return true;
};

AccountGroupMgr.prototype.getSearchCriteria = function () {
	return {};
};

AccountGroupMgr.prototype.groupPermissions = function (permissions) {
	var piThis = this;
	var asset_management = [];
	var sys_management = [];
	var report_management = [];
	var contract_management = [];
	$.each(permissions, function(i, permission){
		switch (permission.name) {
			case piThis.fullRights.asset_manage.key:
			case piThis.fullRights.asset_task.key:
				permission.checked = true;
				permission.disabled = true;
				asset_management.push(permission);
				break;
			case piThis.fullRights.asset_accept_submit_in_branch.key:
			case piThis.fullRights.asset_receive.key:
			case piThis.fullRights.asset_pool_allot_submit.key:
			case piThis.fullRights.asset_accept.key:
			case piThis.fullRights.asset_out.key:
				permission.checked = true;
				asset_management.push(permission);
				break;
			case piThis.fullRights.asset_in.key:
			case piThis.fullRights.asset_accept_submit.key:
			case piThis.fullRights.asset_pool_allot.key:
				asset_management.push(permission);
				break;
			case piThis.fullRights.sys_manage.key:
				permission.checked = true;
				permission.disabled = true;
				sys_management.push(permission);
				break;
			case piThis.fullRights.account_manage.key:
			case piThis.fullRights.account_group_manage.key:
			case piThis.fullRights.organization_manage.key:
				sys_management.push(permission);
				break;
			case piThis.fullRights.asset_type_manage.key:
			case piThis.fullRights.brand_manage.key:
			case piThis.fullRights.unit_manage.key:
				permission.checked = true;
				sys_management.push(permission);
				break;
			case piThis.fullRights.report_manage.key:
				permission.checked = true;
				report_management.push(permission);
				break;
			case piThis.fullRights.contract_manage.key:
				permission.checked = true;
				contract_management.push(permission);
				break;
		}
	});

	var permission_tree = {};
	permission_tree.asset_management = asset_management;
	permission_tree.sys_management = sys_management;
	permission_tree.report_management = report_management;
	permission_tree.contract_management = contract_management;

	this.permission_tree = permission_tree;
	this.permissions = permissions;
};

AccountGroupMgr.prototype.initUser = function () {

};

AccountGroupMgr.prototype.initBody = function () {
	var piThis = this;

	$("a[" + piThis.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});
};

AccountGroupMgr.prototype.initData = function () {
	var piThis = this;

	$.get(this.route + "/init", {async: false}, function (data) {
		piThis.cacheData(data);
		piThis.onAllDataArrival();
		return true;
	});
};

var _thisMgr = null;
function thisMgr() {
	if (_thisMgr) return _thisMgr;
	var ret = new AccountGroupMgr("accountgroup");
	ret.mdlUpdContainerId = ret.mdlAddContainerId;	
	_thisMgr = ret;
	return ret;
}