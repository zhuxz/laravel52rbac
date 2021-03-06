var _organizationMenueTree = null;
function organizationMenueTree() {
	if (_organizationMenueTree) return _organizationMenueTree;
	var ret = new OrganizationMenueTree("menuContent", "menuTree", "menuTarget");
	_organizationMenueTree = ret;
	return ret;
}

function EquEnterMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

EquEnterMgr.prototype = new EquMgr("equ");

EquEnterMgr.prototype.mdlEnterBranch = "mdlEnterBranch";
EquEnterMgr.prototype.btnEnterBranch = "btnenterbranch";

EquEnterMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;
	
	var opt = EquipmentGridSetting();
	var piThis = this;
	
	opt.bProcessing = true;	
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");

		var $btnDel = $("#" + piThis.tableId + " tbody td a[" + piThis.btnDel + "]");
		$btnDel.unbind("click");
		$btnDel.click(function () {
			var equId = this.parentNode.parentNode.getAttribute("equid");
			piThis.popModalDel(equId);
			return true;
		});

		var $btnUpd = $("#" + piThis.tableId + " tbody td a[" + piThis.btnUpd + "]");
		$btnUpd.unbind("click");
		$btnUpd.click(function () {
			var equId  = this.parentNode.parentNode.getAttribute("equid");
			piThis.popModalUpd(equId);
			return true;
		});

		var $btnEnterBranch = $("#" + piThis.tableId + " tbody td a[btnenterbranch]");
		$btnEnterBranch.unbind("click");
		$btnEnterBranch.click(function () {
			var equId  = this.parentNode.parentNode.getAttribute("equid");
			piThis.popModalEnterBranch(equId);
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

EquEnterMgr.prototype.getOrganizationMenuTree = function (id) {
	return organizationMenueTree();
};

EquEnterMgr.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length; 
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr equid='", i, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", item.quantity, "</td>");
		ret.push("<td>", item.localInCount, "</td>");
		ret.push("<td>", item.price, "</td>");
		ret.push("<td>", item.operator_name, "</td>");
		ret.push("<td>", (item.financial_code == "" ? "未录入" : "已录入"), "</td>");
		ret.push("<td>");
		ret.push(this.getHTMLSnippet("btnUpdDom", this.btnUpdDom, null, null));
		if (item.quantity == item.localInCount) {
			ret.push(this.getHTMLSnippet("btnDelDom", this.btnDelDom, {}, null));
		} else {
			ret.push(this.getHTMLSnippet("btnDelDom", this.btnDelDom, {disabled: ""}, null));
		}
		if (item.localInCount == 0) {
			ret.push(this.getHTMLSnippet("btnToBranchDom", this.btnToBranchDom, {disabled: ""}, null));
		} else {
			ret.push(this.getHTMLSnippet("btnToBranchDom", this.btnToBranchDom, {}, null));
		}

		//ret.push("<a class='am-btn' href='#' title='修改' ", this.btnUpd, "><i class='am-icon-pencil-square-o'></i></a>");
		//ret.push("<a class='am-btn am-disabled' href='#' title='删除' ", this.btnDel, "><i class='am-icon-trash-o'></i></a>");
		//ret.push("<a class='am-btn' href='#' title='入分库' btnenterbranch><i class='am-icon-ils'></i></a>");
		//ret.push("<div class='am-btn-toolbar'>");
		//ret.push("<div class='am-btn-group am-btn-group-sm'>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='修改' ", this.btnUpd, " eqid='", i, "'>");
		//ret.push("<span class='am-icon-pencil-square-o'></span> ");
		//ret.push("</button>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-danger am-hide-sm-only' title='删除' ", this.btnDel, " eqid='", i, "'", (item.quantity == item.localInCount ? "" : " disabled"), ">");
		//ret.push("<span class='am-icon-trash-o'></span> ");
		//ret.push("</button>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='入分库' btnenterbranch eqid='", i, "'", (item.localInCount == 0 ? " disabled" : ""), ">");
		//ret.push("<span class='am-icon-ils'></span> ");
		//ret.push("</button>");
		//ret.push("</div>");
		//ret.push("</div>");
		ret.push("</td>");
		ret.push("</tr>");
	}
	
	return true;
};

//EquEnterMgr.prototype.defaultQueryParameter = function () {
//	var qp = EquQueryParameter();
//	var defaultQP = [];
//	//defaultQP.push(qp["deep"]);
//	defaultQP.push(qp["exceptDelete"]);
//	defaultQP.push(qp["groupByInCode"]);
//	defaultQP.push(qp["groupByStorage"]);
//	defaultQP.push(qp["orderByUpdateAt"]);
//	defaultQP.push(qp["withOrganization"]);
//	defaultQP.push(qp["withStorage"]);
//	defaultQP.push(qp["withOperator"]);
//	defaultQP.push(qp["withUser"]);
//	defaultQP.push(qp["withUnit"]);
//	defaultQP.push(qp["withKind"]);
//	defaultQP.push(qp["withBrand"]);
//	//defaultQP.push(qp["withCategory"]);
//	//defaultQP.push(qp["withSource"]);
//	//defaultQP.push(qp["withPurpose"]);
//	return defaultQP;
//};

EquEnterMgr.prototype.popModalEnterBranch = function (id) {
	var containerId = "#mdlEnterBranch div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	var equ = this.dataItems(id);

	var piThis = this;

	$.ajax({
		url: '/management/equ/enterBranchCount',
		cache: false,
		async: false,
		data: {in_code_id: equ.in_code_id, organization_id: this.userInfo.organization_id},
		dataType: 'json'
	}).then(function(data) {
		piThis.curMaxEnterBranchCount = parseInt(data, 10);
	}, function() {
		alert("获取可出库数量失败！")
	});

	var html = [];
	html.push("<form class='am-form am-form-horizontal' action=''>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", id, "'>");
	html.push("<input type='hidden' name='in_code_id' value='", equ.in_code_id, "'>");
    html.push("<input type='hidden' name='operate_user_id' value='", this.userInfo.id, "'>");
	
	html.push("<div class='am-form-group'>");
	//分库
	html.push("<div class='am-u-sm-4'>");
	html.push("<select name='storage_id' title='选择分库' required>");
	html.push("<option value=''>选择分库</option>");
	if (this.storage) {
		$.each(this.storage, function (i, item) {
			if (item.id != piThis.userInfo.organization_id) {
				html.push("<option value='", item.id, "'>", item.name, "</option>");
			}
			return true;
		});
	}
	html.push("</select>");
	html.push("</div>");
	//分配数量
	var min = Math.min(1, this.curMaxEnterBranchCount);
	var max = this.curMaxEnterBranchCount;
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='number' class='am-form-field' name='quantity' placeholder='1 - ", max, "' title='分配数量' min='", min, "' max='", max, "' value='1' required />");
	html.push("</div>");
	//可分配数量
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='max_quantity' class='am-form-field' placeholder='可分配数量' title='可分配数量' value='", max, "' readonly />");
	html.push("</div>");
	html.push("</div>");	
	//经办人
	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='operator_name' class='am-form-field' placeholder='经办人' title='经办人' value='", this.userInfo.real_name, "' readonly/>");
	html.push("</div>");
		
	html.push("<div class='am-u-sm-4' style='text-align:right;'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
	html.push("</div>");
	html.push("</div>");
	
	html.push("</form>");

	$(containerId).html(html.join(""));

	$("#mdlEnterBranch").modal(this.modalOptionsForUpd());

	if (!this.validOptionsEnterBranch) { 
		var opt = baseFormValidationOption();
		opt.submit = function () {
			if (this.isFormValid()) {
				piThis.submitEnterBranch();
			}
		    return false;
		};
		opt.validate = function (validity) {
			if (validity.valid) {
				var $field = $(validity.field);
				var $field_name = $field.attr("name");
				if ($field_name == "quantity") {
					var quantity = parseInt($field.val(), 10);
					if (isNaN(quantity) || quantity < 1) {
						validity.valid = false;
					}
				}
			}
		};
		this.validOptionsEnterBranch = opt;
	}
	
	$(containerId + " form").validator(this.validOptionsEnterBranch);
};

EquEnterMgr.prototype.submitEnterBranch = function () {
    var frmData = new FormData($("#" + this.mdlEnterBranch + " form")[0]);
    frmData.append("qp", this.getQueryParameter());
	
    var piThis = this;
    $.ajax({
        url: this.route + '/enterbranch',
        type: "POST",
        data: frmData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        error: function(request) {
            alert("入分库失败！");
        },
        success: function(data) {
            piThis.onEnterBranchOk(data);
        }
    });
	return true;
};

EquEnterMgr.prototype.onEnterBranchOk = function (data) {
	var equ = this.dataItems(data.id);

    if (equ) {
        equ.localInCount -= data.count;

		$tr = $("#" + this.tableId + " tr[equid='" + data.id + "']");

		$tr.find("td:eq(5)").html(equ.localInCount);

		if (data.count > 0) {
			$tr.find("button[" + this.btnDel + "]").attr("disabled", true);
		}

		if (equ.localInCount <= 0) {
			$tr.find("button[" + this.btnEnterBranch + "]").attr("disabled", true);
		}
    }

	$("#" + this.mdlEnterBranch).modal("close");

    alert("成功入分库 " + data.count + " 个设备");
	
	return true;
};

EquEnterMgr.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["groupByStorage"] = 0;
	qp["withLocalInCount"] = 1;
	qp["deep"] = 0;
	return qp;
};

EquEnterMgr.prototype.resetStatus = function (key) {
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

EquMgr.prototype.buildQuickNav = function () {
	var s = [];
	s.push("<li nav-bar route='equipment-enter' key='equipment-enter' class='am-active'>");
	s.push("<a href='equipment-enter'>设备入库</a>");
	s.push("</li>");
	s.push("<li nav-bar><a href='equipment-accept'>设备验收</a></li>");
	s.push("<li nav-bar route='out-equipment' key='out-equipment'>");
	s.push("<a href='out-equipment'>设备出库</a>");
	s.push("</li>");
	s.push("<li nav-bar route='allocation-equipment' key='allocation-equipment'>");
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

EquEnterMgr.prototype.buildQuickNav = function () {
	var s = [];
	s.push("<li nav-bar route='equipment-enter' key='equipment-enter' class='am-active'>");
	s.push("<a href='equipment-enter'>设备入库</a>");
	s.push("</li>");
	s.push("<li nav-bar><a href='equipment-accept'>设备验收</a></li>");
	s.push("<li nav-bar route='out-equipment' key='out-equipment'>");
	s.push("<a href='out-equipment'>设备出库</a>");
	s.push("</li>");
	s.push("<li nav-bar route='allocation-equipment' key='allocation-equipment'>");
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

EquEnterMgr.prototype.defaultSearchCriteria = function () {
	var ret = {};
	ret.qp = this.getQueryParameter();
	ret.storageStatus = "";
	ret.userId = this.userInfo.id;
	ret.storage_id = this.userInfo.storage_id;
	ret.organization_id = this.userInfo.organization_id;
	ret.local_organization_id = this.userInfo.organization_id;
	ret.contract_code = $("ul.search_block div input[contract_code]").val().trim();
	ret.in_time_start = $("ul.search_block div input[in_time_start]").val().trim();
	ret.in_time_end = $("ul.search_block div input[in_time_end]").val().trim();
	return ret;
};

EquEnterMgr.prototype.getSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	ret.organization_id = "";
	return ret;
};

EquEnterMgr.prototype.initBody = function () {
	var piThis = this;

	$("div[" + this.quickNav + "] ul").show();

	$("a[" + this.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});
};

EquEnterMgr.prototype.initData = function () {
	var piThis = this;
	$.ajax({
		url: "/equipment/all",
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

	//$.get("/equipment/all", this.getSearchCriteria(), function (data) {
	//	piThis.cacheData(data);
	//	piThis.onAllDataArrival();
	//	//piThis.initPage();
	//	hideLoading();
	//	return true;
	//}, "json");
};

EquEnterMgr.prototype.getHTMLSnippetProperties = function() {
	var ret = this.HTMLSnippetProperties;

	ret.btnToBranchDom = {
		title: '入分库',
		class: 'am-btn',
		href: "javascript:void(0);",
		btnenterbranch: "btnenterbranch"
	};

	return ret;
};

EquEnterMgr.prototype.btnToBranchDom = function (properties) {
	return this.buildHTMLSnippet("a", properties, "<i class='am-icon-ils'></i>");
};

var _enterEquipmentsMgr = null;
function thisMgr() {
	if (_enterEquipmentsMgr) return _enterEquipmentsMgr;
	
	var ret = new EquEnterMgr("enter");
	ret.mdlUpdContainerId = ret.mdlAddContainerId;

	_enterEquipmentsMgr = ret;
	return ret;
}

function on_kind_change(pSender) {
	var mgr = thisMgr();
	var frmId = "#" + mgr.getPopModalId();
	var intVar = new safeParse(pSender.value, -1);
	$(frmId + " select[name='kind_id'] option").not($(frmId + " select[name='kind_id'] option")[0]).remove();
	if (intVar.i() == -1) {
		//
	} else {
		var list = mgr.asset_kinds.list;
		var father_id = intVar.i();
		for (var i = 0; i < list.length; i++) {
			if (list[i].father_id == father_id) {
				$(frmId + " select[name='kind_id']").append("<option value='" + list[i].id + "'>" + list[i].name + "</option>");
			}
		}
	}

	$(frmId + " select[name='kind_id']").trigger("blur");
	return true;
}

function on_brand_change(pSender) {
	var mgr = thisMgr();
	var frmId = "#" + mgr.getPopModalId();	
	var intVar = new safeParse(pSender.value, -1);
	$(frmId + " select[name='brand_id'] option").not($(frmId + " select[name='brand_id'] option")[0]).remove();
	if (intVar.i() == -1) {
		//
	} else {
		var list = mgr.asset_brand.list;
		var father_id = intVar.i();
		for (var i = 0; i < list.length; i++) {
			if (list[i].father_id == father_id) {
				$(frmId + " select[name='brand_id']").append("<option value='" + list[i].id + "'>" + list[i].name + "</option>");
			}
		}
	}

	$(frmId + " select[name='brand_id']").trigger("blur");
	return true;
}

function on_orgaziation_change(pSender) {
	var zt = organizationMenueTree();
	var mgr = thisMgr();
	var data = mgr.organizations.item(pSender.value);
	zt.init(data);
	zt.export();
	return true;
}

var __AcceptStatus = "unAccepted";
function getAcceptStatus() {
	return __AcceptStatus;
}

function setAcceptStatus(value) {
	__AcceptStatus = value;
	return true;
}

function showUnAccepted(pSender) {
	$("button[name]").removeClass("am-btn-primary");
	$(pSender).addClass("am-btn-primary");
	var mgr = thisMgr();
	mgr.setActiveStatus("unAccepted");
	mgr.submitSearch();
	return true;
}

function showAccepted(pSender) {
	$("button[name]").removeClass("am-btn-primary");
	$(pSender).addClass("am-btn-primary");
	var mgr = thisMgr();
	mgr.setActiveStatus("accepted");
	mgr.submitSearch();
	return true;
}

function showAll(pSender) {
	$("button[name]").removeClass("am-btn-primary");
	$(pSender).addClass("am-btn-primary");
	var mgr = thisMgr();
	mgr.setActiveStatus("acceptedAll");
	mgr.submitSearch();
	return true;
}