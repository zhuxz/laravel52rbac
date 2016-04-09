var _organizationMenueTree = null;
function organizationMenueTree() {
	if (_organizationMenueTree) return _organizationMenueTree;
	var ret = new OrganizationMenueTree("menuContent", "menuTree", "criteria_organization");
	_organizationMenueTree = ret;
	return ret;
}

function EquAcceptMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}
EquAcceptMgr.prototype = new EquMgr("equ");

EquAcceptMgr.prototype.btnAccept = "btnaccept";
EquAcceptMgr.prototype.btnAcceptForm = "btnacceptform";
EquAcceptMgr.prototype.btnGenerateAcceptForm = "btngenerateacceptform";
EquAcceptMgr.prototype.mdlAccept = "mdlAccept";

EquAcceptMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;
	
	var opt = EquipmentGridSetting();
	var piThis = this;
	
	opt.bProcessing = true;	
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");

		$btn = $("#" + piThis.tableId + " tbody td a[" + piThis.btnAccept + "]");
		$btn_form = $("#" + piThis.tableId + " tbody td button[" + piThis.btnAcceptForm + "]");

		$btn.unbind("click");
		$btn_form.unbind("click");
		
		$btn_form.click(function () {
			var equId = this.getAttribute("eqid");
			piThis.acceptForm(equId);
			return true;
		});

		$btn.click(function () {
			var equId  = this.parentNode.parentNode.getAttribute("equid");
			piThis.popModalAccept(equId);
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
	//opt.sScrollX = "500px";
	//opt.sScrollXInner = "110%";
	//opt.bScrollCollapse = true;
	opt.bLengthChange = false;
	opt.bFilter = false;
	//opt.bJQueryUI = true;
	this._dataTableOptions = opt;
	
	return opt;
};

EquAcceptMgr.prototype.getOrganizationMenuTree = function (id) {
	return organizationMenueTree();
};

EquAcceptMgr.prototype.getHTMLSnippetProperties = function() {
	var ret = this.HTMLSnippetProperties;

	ret.btnAcceptDom = {
		title: '验收',
		class: 'am-btn',
		href: "javascript:void(0);",
		btnaccept: ""
	};

	ret.btnGenerateAcceptForm = {
		title: '生成验收表单',
		class: 'am-btn',
		href: "javascript:void(0);",
		btnaccept: "btngenerateacceptform"
	};

	return ret;
};

EquAcceptMgr.prototype.btnAcceptDom = function (properties) {
	return this.buildHTMLSnippet("a", properties, "<i class='am-icon-check'></i>");
};

EquAcceptMgr.prototype.btnGenerateAcceptFormDom = function (properties) {
	return this.buildHTMLSnippet("a", properties, "<i class='am-icon-file-text'></i>");
};

EquAcceptMgr.prototype.getUnAcceptedHeads = function () {
	if (this._unAcceptHeads) return this._unAcceptHeads;
	var ret = [];
	ret.push(new TableHead("", "# id"));
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "仓库"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "质保期限"));
	ret.push(new TableHead("", "供应商"));
	ret.push(new TableHead("", "待验收数"));
	ret.push(new TableHead("", "入库经办人"));
	ret.push(new TableHead("", "操作"));
	this._unAcceptHeads = ret;
	return ret;
};

EquAcceptMgr.prototype.getAcceptedHeads = function () {
	if (this._acceptHeads) return this._acceptHeads;
	var ret = [];
	ret.push(new TableHead("", "# id"));
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "仓库"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "质保期限"));
	ret.push(new TableHead("", "供应商"));
	ret.push(new TableHead("", "验收数"));
	ret.push(new TableHead("", "验收经办人"));
	ret.push(new TableHead("", "操作"));
	this._acceptHeads = ret;
	return ret;
};

EquAcceptMgr.prototype.getHeads = function () {
	if (this.getActiveStatus().id == this.statusFilter.unAccepted.id) {
		return this.getUnAcceptedHeads();
	} else if (this.getActiveStatus().id == this.statusFilter.accepted.id) {
		return this.getAcceptedHeads();
	}

	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "# id"));
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "仓库"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "质保期限"));
	ret.push(new TableHead("", "供应商"));
	ret.push(new TableHead("", "(待)验收数"));
	ret.push(new TableHead("", "验收经办人"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

EquAcceptMgr.prototype.buildUnAcceptRow = function (data, parentPath, ret) {
	var piThis = this;
	var len = data.length;
	var i = 0;
	var item;
	var properties = {};
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr class='equb' equid='", i, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.storage_name, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", parseDate(item.maintain_stop).Format("yyyy-MM-dd"), "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.cnt, "</td>");
		ret.push("<td>", item.operator_name, "</td>");
		ret.push("<td>");

		ret.push(this.getHTMLSnippet("btnAcceptDom", this.btnAcceptDom, null, null));
		properties.href = this.route + '/acceptForm?eqid=' + item.id;
		ret.push(this.getHTMLSnippet("btnUpdDom", this.btnGenerateAcceptFormDom, properties, null));

		//if (isAccepted) {
		//	ret.push(this.getHTMLSnippet("btnUpdDom", this.btnUpdDom, {}, null));
		//} else {
		//	ret.push(this.getHTMLSnippet("btnUpdDom", this.btnUpdDom, {disabled: ""}, null));
		//}
        //
		//ret.push("<div class='am-btn-toolbar'>");
		//ret.push("<div class='am-btn-group am-btn-group-sm'>");
        //
		//ret.push("<button");
		//ret.push(" class='am-btn am-btn-default am-btn-sm am-text-secondary' title='验收' ");
		//ret.push(" btnAccept");
		//ret.push(" eqid='", i, "'");
		//ret.push(">");
		//ret.push("<span class='am-icon-check'></span> ");
		//ret.push("</button>");

		/*ret.push("<button");
		ret.push(" class='am-btn am-btn-default am-btn-sm am-text-secondary'");
		ret.push(" btnAcceptForm");
		ret.push(" eqid='", item.id, "'");
		ret.push(">");
		ret.push("<span class='am-icon-trash-o'></span> 验收表单生成");
		ret.push("</button>");*/

		//ret.push("<button");
		//ret.push(" class='am-btn am-btn-default am-btn-sm am-text-secondary'");
		//ret.push(" " + this.btnGenerateAcceptForm);
		//ret.push(" title='验收表单生成'");
		//ret.push(">");
		//ret.push("<a target=_blank ");
		//ret.push("href='",this.route + '/acceptForm?eqid=',item.id,"'");
		//ret.push(">");
		//ret.push("<span class='am-icon-file-text'>");
		//ret.push("</span>");
		//ret.push("</a>");
		//ret.push("</button>");

		//ret.push("</div>");
		//ret.push("</div>");
		ret.push("</td>");
		ret.push("</tr>");
	}

	return true;
};

EquAcceptMgr.prototype.buildAcceptRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr class='equb' equid='", i, "'>");
		ret.push("<td>", item.aos_updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.storage_name, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", parseDate(item.maintain_stop).Format("yyyy-MM-dd"), "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.cnt, "</td>");
		ret.push("<td>", item.accept_operators_name, "</td>");
		ret.push("<td>");
		ret.push(this.getHTMLSnippet("btnAcceptDom", this.btnAcceptDom, null, null));
		//ret.push("<div class='am-btn-toolbar'>");
		//ret.push("<div class='am-btn-group am-btn-group-sm'>");
		//ret.push("<button");
		//ret.push(" class='am-btn am-btn-default am-btn-sm am-text-secondary' title='修改' ");
		//ret.push(" btnAccept");
		//ret.push(" eqid='", i, "'");
		//ret.push(">");
		//ret.push("<span class='am-icon-pencil-square-o'></span> ");
		//ret.push("</button>");
		//ret.push("</div>");
		//ret.push("</div>");
		ret.push("</td>");
		ret.push("</tr>");
	}

	return true;
};

EquAcceptMgr.prototype.buildRow = function (data, parentPath, ret) {
	if (this.getActiveStatus().id == this.statusFilter.unAccepted.id) {
		this.buildUnAcceptRow(data, parentPath, ret);
		return true;
	} else if (this.getActiveStatus().id == this.statusFilter.accepted.id) {
		this.buildAcceptRow(data, parentPath, ret);
		return true;
	}

	var len = data.length;
	var i = 0;
	var item;
	var properties = {};
	for (i = 0; i < len; i++) {
		item = data[i];

        var isAccepted = (parseInt(item.accept, 10) > 0);

		ret.push("<tr class='equb' equid='", i, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.storage_name, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", parseDate(item.maintain_stop).Format("yyyy-MM-dd"), "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.cnt, "</td>");
		ret.push("<td>", item.accept_operators_name, "</td>");
		ret.push("<td>");
		if (isAccepted) {
			ret.push(this.getHTMLSnippet("btnAcceptDom", this.btnAcceptDom, {disabled: ""}, null));
		} else {
			ret.push(this.getHTMLSnippet("btnAcceptDom", this.btnAcceptDom, {}, null));
		}
		properties.href = this.route + '/acceptForm?eqid=' + item.id;
		ret.push(this.getHTMLSnippet("btnUpdDom", this.btnGenerateAcceptFormDom, properties, null));

		//ret.push("<div class='am-btn-toolbar'>");
		//ret.push("<div class='am-btn-group am-btn-group-sm'>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='验收' btnAccept eqid='", i, "'", (isAccepted ? " disabled" : ""), ">");
		//ret.push("<span class='am-icon-check'></span> ");
		//ret.push("</button>");
		//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='生成验收表单' ", this.btnUpd, " eqid='", i, "'", (isAccepted ? "" : " disabled"), ">");
		//ret.push("<span class='am-icon-file-text'></span> ");
		//ret.push("</button>");
		//ret.push("</div>");
		//ret.push("</div>");
		ret.push("</td>");
		ret.push("</tr>");
	}
	
	return true;
};

EquAcceptMgr.prototype.popModalAccept = function (idx) {
	var containerId = "#mdlAccept div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();

	var equ = this.dataItems(idx);
	var html = [];
	html.push("<form class='am-form am-form-horizontal' action=''>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", idx, "'>");
	html.push("<input type='hidden' name='operate_user_id' value='", this.userInfo.id, "' />");
	html.push("<input type='hidden' name='storage_id' value='", equ.storage_id, "' />");
	html.push("<input type='hidden' name='in_code_id' value='", equ.in_code_id, "' />");
    html.push("<input type='hidden' name='accept_id' value='", equ.accept, "' />");
	html.push("<input type='hidden' name='branch_id' value='", equ.branch, "' />");

	html.push("<div class='am-form-group'>");
	//上传设备序列号
	html.push("<div class='am-u-sm-4'>");
		html.push("<div class='am-form-group am-form-file am-fl'>");
			html.push("<button type='button' class='am-btn am-btn-default am-btn-sm'>");
			html.push("<i class='am-icon-cloud-upload'></i> 上传设备序列号</button>");
			html.push("<input id='doc-form-file' type='file' name='serials_code'>");
		html.push("</div>");
	html.push("</div>");

	//上传验收扫描件
	html.push("<div class='am-u-sm-4'>");
		html.push("<div class='am-form-group am-form-file am-fl'>");
			html.push("<button type='button' class='am-btn am-btn-default am-btn-sm'>");
			html.push("<i class='am-icon-cloud-upload'></i> 上传验收扫描件 </button>");
			html.push("<input type='file' name='accept_scan'>");
		html.push("</div>");
	html.push("</div>");
	

	//上传设备编号
	// html.push("<div class='am-u-sm-4'>");
	// html.push("<div class='am-form-group am-form-file am-fl'>");
	// html.push("<button type='button' class='am-btn am-btn-default am-btn-sm'>");
	// html.push("<i class='am-icon-cloud-upload'></i> 上传设备编号</button>");
	// html.push("<input type='file' id='doc-ipt-file-2'>");
	// html.push("</div>");
	// html.push("</div>");
	//经办人
	html.push("<div class='am-u-sm-4'>");
	html.push("<input class='modal-text' type='text' name='operate_user_name' class='am-form-field' placeholder='经办人' title='经办人' value='", this.userInfo.real_name, "' readonly/>");
	html.push("</div>");
	html.push("</div>");

	html.push("<div class='am-form-group'>");
	html.push("<div class='am-u-sm-4' style='text-align:left;'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
	html.push("</div>");
	html.push("</div>");

	html.push("</form>");

	$(containerId).html(html.join(""));

	$("#mdlAccept").modal(this.modalOptionsForUpd());
	
	if (!this.validOptionsAccept) {
		var opt = baseFormValidationOption();
		var piThis = this;
		opt.submit = function () {
			if (this.isFormValid()) {
				piThis.submitAccept();
			}
			return false;
		};
		this.validOptionsAccept = opt;
	}

	$(containerId + " form").validator(this.validOptionsAccept);
};

EquAcceptMgr.prototype.submitAccept = function () {
	var formData = new FormData($("#" + this.mdlAccept + " form")[0]);
	formData.append("qp", this.getQueryParameter());

	var piThis = this;
	$.ajax({
		url: this.route + '/accept',
		type: "POST",
		data: formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			alert("验收失败！");
		},
		success: function(data) {
			$("#mdlAccept").modal("close");
			piThis.onAcceptOk(data);
			alert("成功验收 " + data.acceptedCount + " 个设备！");
		}
	});

	return true;
};

EquAcceptMgr.prototype.acceptForm = function (data) {
	
	$.ajax({
		url: this.route + '/acceptForm',
		type: "GET",
		data: {'eqid': data},
		async: false,
		cache: false,
		error: function(request) {
			alert("验收表单生成失败！");
		},
		success: function(data) {
			alert("验收表单生成成功！");
		}
	});
	
	return true;
};

EquAcceptMgr.prototype.onAcceptOk = function (data) {
	var $tr = $("#" + this.tableId + " tr[equid='" + data.id + "']");

	var equ = this.dataItems(data.id);
	if (equ) {
		equ.acceptedCount = data.acceptedCount;
	}

	var $td = $tr.find("td:eq(6)").html(0);

	$tr.find("button[" + this.btnAccept + "]").attr("disabled", true);

	return true;
};

EquAcceptMgr.prototype.acceptEquipmentSubmit = function (equId) {
	var opt = {};
	var frmId = "#mdlAccept form"
	opt.id = equId;
	opt.operate_user_id = this.userInfo.id;
	var equ = this.itemData("in_code", equId);
	opt.from_storage_id = equ.storage_id;
	
	var piThis = this;
	$.ajax({
		url: this.route + '/submit/' + equId,
		cache: false,
		data: opt
    }).then(function(data) {
	    piThis.onAcceptOk(data);
    }, function() {
      	alert("请求失败.");
    });
    
	return true;
};

EquAcceptMgr.prototype.defaultSearchCriteria = function () {
	var ret = {};
	//ret._token = $("div.search_block div form input[name='_token']").val().trim();
	ret.contract_code = $("ul.search_block div input[contract_code]").val().trim();
	ret.in_time_start = $("ul.search_block div input[in_time_start]").val().trim();
	ret.in_time_end = $("ul.search_block div input[in_time_end]").val().trim();
	ret.acceptStatus = "";
	ret.storageStatus = "";
	ret.groupByStorage = "1";
	ret.userId = this.userInfo.id;
	ret.organization_id = this.userInfo.organization_id;
	ret.qp = this.getQueryParameter();
	return ret;
};

EquAcceptMgr.prototype.getSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	ret.status = this.getActiveStatus().key;
	return ret;
};

EquAcceptMgr.prototype.resetStatus = function (key) {
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

	if (flag) {
		this.submitSearch();
	}
};

EquAcceptMgr.prototype.defaultNav = function () {
	return this.navBar.equAcceptMgr;
};

EquAcceptMgr.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["withFinancialCodeCount"] = 0;
	qp["withAcceptedCount"] = 0;
	qp["withSubmitAcceptedCount"] = 0;
	qp["withTotalInCount"] = 0;
	qp["groupByOperation"] = 0;
	qp["withAccept"] = 1;
	qp["groupByStorage"] = 1;
	qp["withLocalInCount"] = 0;
	qp["orderByUpdateAt"] = 0;
	qp["orderByOperate"] = 0;
	qp["withCount"] = 1;

	var activeStatusFilterId = this.getActiveStatus().id;
	var statusFilter = this.statusFilter;

	switch (activeStatusFilterId) {
		case statusFilter.accepted.id:
			qp["groupByAccept"] = 1;
			break;
		case statusFilter.unAccepted.id:
			qp["groupByBranch"] = 1;
			break;
		case statusFilter.acceptedAll.id:
			qp["groupByBranch"] = 1;
			qp["groupByAccept"] = 1;
			break;
	}

	return qp;
};

EquAcceptMgr.prototype.buildQuickNav = function () {
	var s = [];
	s.push("<li nav-bar route='equipment-enter' key='equipment-enter'>");
	s.push("<a href='equipment-enter'>设备入库</a>");
	s.push("</li>");
	s.push("<li nav-bar class='am-active'><a href='equipment-accept'>设备验收</a></li>");
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

EquAcceptMgr.prototype.initBody = function () {
	var piThis = this;

	$("button[status-switch]").click(function () {
		piThis.resetStatus($(this).attr("key"));
		return true;
	});

	$("a[" + this.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});

	$("#" + this.btnSearch).click(function () {
		piThis.submitSearch();
		return true;
	});

	$("div[" + this.quickNav + "] ul").show();

	return true;
};

EquAcceptMgr.prototype.initData = function () {
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

	//showLoading();

	//$.get("/equipment/all", this.getSearchCriteria(), function (data) {
	//	piThis.cacheData(data);
	//	piThis.onAllDataArrival();
	//	//mgr.initPage();
	//	hideLoading();
	//	return true;
	//}, "json");

	return true;
};

var _acceptEquipmentsMgr = null;
function thisMgr() {
	if (_acceptEquipmentsMgr) return _acceptEquipmentsMgr;
	
	var ret = new EquAcceptMgr("accept");	
	ret.mdlUpdContainerId = ret.mdlAddContainerId;
	//ret.initUser();
	_acceptEquipmentsMgr = ret;	
	return ret;
}

function on_category_change(pSender) {
	var mgr = thisMgr();
	var frmId = "#" + mgr.getPopModalId();	
	var intVar = new safeParse(pSender.value, -1);
	$(frmId + " select[name='equ_name'] option").not($(frmId + " select[name='equ_name'] option")[0]).remove();
	if (intVar.i() == -1) {
		//
	} else {
		var list = mgr.asset_kinds.list;
		var father_id = intVar.i();
		for (var i = 0; i < list.length; i++) {
			if (list[i].father_id == father_id) {
				$(frmId + " select[name='equ_name']").append("<option value='" + list[i].id + "'>" + list[i].name + "</option>");
			}
		}
	}

	$(frmId + " select[name='equ_name']").trigger("blur");
	return true;
}

function on_brand_change(pSender) {
	var mgr = thisMgr();
	var frmId = "#" + mgr.getPopModalId();	
	var intVar = new safeParse(pSender.value, -1);
	$(frmId + " select[name='kind_id'] option").not($(frmId + " select[name='kind_id'] option")[0]).remove();
	if (intVar.i() == -1) {
		//
	} else {
		var list = mgr.asset_brand.list;
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

function on_orgaziation_change(pSender) {
	var zt = organizationMenueTree();
	var mgr = thisMgr();
	var data = mgr.organizations.item(pSender.value);
	zt.init(data);
	zt.export();
	return true;
}