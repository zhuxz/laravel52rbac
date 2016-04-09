function SelectMgr(instance) {
	if (typeof instance == "undefined") instance = "select";
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

SelectMgr.prototype = new EquMgr();
SelectMgr.prototype.parameters = ["user", "organizations", "asset_kinds", "asset_brands"];

SelectMgr.prototype.cacheData = function (data) {
	this.data = data;
	return true;
};

SelectMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;
	
	var opt = EquipmentGridSetting();
	opt.bProcessing = true;
	
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");
		
		var mgr = accountMgr();
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

SelectMgr.prototype.getOrganizationMenuTree = function (id) {
	return new organizationMenueTree();
};

SelectMgr.prototype.modalOptionsForAdd = function () {		
	return {closeViaDimmer:false, width: 900, height:600};
};

SelectMgr.prototype.modalOptionsForUpd = function () {		
	return {closeViaDimmer:false, width: 900, height:600};
};


SelectMgr.prototype.getEquEditBody = function (_token, act, id) {
	var equ = this.dataItems(id);

	var html = [];
	html.push("<form id='searchForm' class='am-form am-form-horizontal' action=''>");
		html.push("<input type='hidden' class='rol' >");
		html.push("<input type='hidden' class='org' >");
		html.push("<input type='hidden' name='_token' value='", _token, "'>");
		html.push("<input type='hidden' name='id' value='", (equ ? equ.in_code_id : "0"), "'>");
		html.push("<input type='hidden' name='act' value='", act, "' />");
		
		html.push("<div class='am-form-group'>");
            //机构/部门名称
			html.push("<div class='am-u-sm-4'>");
			html.push("<input class='modal-text' type='text' name='organization' placeholder='机构/部门名称' title='机构/部门名称'  />");
			html.push("</div>");

			//用户组
			html.push("<div class='am-u-sm-4'>");
			html.push("<input class='modal-text' type='text' name='role' placeholder='用户组' title='用户组'  />");
			html.push("</div>");
		html.push("</div>");
				
		html.push("<div class='am-form-group'>");
		//确定
		html.push("<div class='am-u-sm-4'>");
		html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
		html.push("</div>");
		html.push("</div>");
	
	html.push("</form>");

	return html.join("");
};


SelectMgr.prototype.drawModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	$(containerId).html(this.getEquEditBody(_token, this.act, ""));	
	return true;
};

SelectMgr.prototype.validOptionsForAdd = function () {
	var opt = baseFormValidationOption();
	opt.submit = function () {
		var formValidity = this.isFormValid();
		if (typeof formValidity === "boolean") {
			if (formValidity) {
				var mgr = accountMgr();
		    	mgr.submitSearch();
			}
		} else {
			$.when(formValidity).then(function() {
		    	var mgr = accountMgr();
			    mgr.submitSearch();
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
						url: 'management/contract/valid?val=' + val + "&fid=0",
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

SelectMgr.prototype.getOrganization = function (id) {
	if (this.data && this.data.organizations) {
		return this.data.organizations.map[id];
	}
	return null;
};

SelectMgr.prototype.getRole = function (id) {
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



SelectMgr.prototype.getHeads = function () {
	var ret = [];
	ret.push(new TableHead("", "序号"));
	ret.push(new TableHead("", "账号名称"));
	ret.push(new TableHead("", "真实名称"));
	ret.push(new TableHead("", "联系方式"));
	ret.push(new TableHead("", "机构/部门名称"));
	ret.push(new TableHead("", "用户组"));
	this._heads = ret;	
	return ret;
};

SelectMgr.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	var org;

	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr agid='", item.id, "'>");
		ret.push("<td>", item.id, "</td>");
		ret.push("<td>", item.name, "</td>");
		ret.push("<td>", item.real_name, "</td>");
		ret.push("<td>", item.mobile, "</td>");
		ret.push("<td>", item.organizationName, "</td>");
		ret.push("<td>", item.roleName, "</td>");
		ret.push("</tr>");
	}
	
	return true;
};

SelectMgr.prototype.getSearchCriteria = function () {
	return {};
};

SelectMgr.prototype.sendDataForAdd = function () {
	var frmData = new FormData($("#" + this.mdlAddContainerId + " form")[0]);
	frmData.append("qp", this.getQueryParameter());
	return frmData;
};

SelectMgr.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["deep"] = 0;
	qp["withLocalInCount"] = 1;
	qp["withOrganization"] = 0;
	qp["withOperator"] = 0;
	qp["withUnit"] = 0;
	return qp;
};


SelectMgr.prototype.initBody = function () {
	var piThis = this;

	$("a[" + piThis.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});

	$("a[excel_export]").click(function() {
		var arr="";
		var organization=$('.org').val();
		var role=$('.rol').val();
		arr ="&organization="+organization+"&role="+role ;
		if(organization != undefined || role != undefined){
			$("a[excel_export]").attr("href", "select/operator/export?"+arr);
		}else{
			$("a[excel_export]").attr("href", "select/operator/export");
		}
		
	});
};

SelectMgr.prototype.initData = function () {
	var piThis = this;

	$.get("select/operator/all", {async: false}, function (data) {
		piThis.cacheData(data);
		piThis.onAllDataArrival.call(piThis);
		//piThis.initPage();
		return true;
	});
};

SelectMgr.prototype.submitSearch = function () {
	var piThis = this;
	var sendData = this.sendDataForAdd();
    $(".org").attr("value", $("input[name='organization']").val() );
    $(".rol").attr("value", $("input[name='role']").val() );
	$.ajax({
		url: 'select/operator/search',
		type: "POST",
		data: sendData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			alert("请求失败！");
		},
		success: function(data) {
			piThis.cacheData(data);
			piThis.onAllDataArrival.call(piThis);
			$("#" + piThis.mdlAddContainerId).modal("close");
		}
	});
};

var _accountMgr = null;
function accountMgr() {
	if (_accountMgr) return _accountMgr;
	var ret = new SelectMgr("select");
	ret.mdlUpdContainerId = ret.mdlAddContainerId;
	_accountMgr = ret;

	return ret;
}

function onPageLoad() {
	var mgr = accountMgr();
	mgr.initialize()
	return true;
}

var _organizationMenueTree = null;
function organizationMenueTree() {
	if (_organizationMenueTree) return _organizationMenueTree;
	var ret = new OrganizationMenueTree("menuContent", "menuTree", "menuTarget");
	var mgr = accountMgr();
	ret.init(mgr.organizations.root);

	_organizationMenueTree = ret;
	
	return ret;
}