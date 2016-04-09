var _organizationMenueTree = null;
function organizationMenueTree() {
	if (_organizationMenueTree) return _organizationMenueTree;
	var ret = new OrganizationMenueTree("menuContent", "menuTree", "criteria_organization");
	_organizationMenueTree = ret;
	return ret;
}

function EquTaskMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

EquTaskMgr.prototype = new EquMgr("equ");

EquTaskMgr.prototype.btnReceive = "btnreceive";
EquTaskMgr.prototype.btnUpdReceive = "btnupdreceive";
EquTaskMgr.prototype.parameters = ["user", "organizations", "asset_kinds", "purposes"];

EquTaskMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;
	
	var opt = EquipmentGridSetting();
	var piThis = this;
	
	opt.bProcessing = true;	
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");
		$btnAccept = $("#" + piThis.tableId + " tbody td button[btnAccept]");
		if ($btnAccept.length > 0) {
			$btnAccept.unbind("click");
			$btnAccept.click(function () {
				var equId  = this.getAttribute("eqid");
				piThis.popModalAccept(equId);
				return true;
			});
		}

		$btnAcceptSubmit = $("#" + piThis.tableId + " tbody td button[btnAcceptSubmit]");
		if ($btnAcceptSubmit.length > 0) {
			$btnAcceptSubmit.unbind("click");
			$btnAcceptSubmit.click(function () {
				var equId = this.getAttribute("eqid");
				piThis.acceptEquipmentSubmit(equId);
				return true;
			});
		}

		$btnReceive = $("#" + piThis.tableId + " tbody td button[" + piThis.btnReceive + "]");
		if ($btnReceive.length > 0) {
			$btnReceive.unbind("click");
			$btnReceive.click(function () {
				var equId = this.getAttribute("eqid");
				piThis.receive(equId);
				return true;
			});
		}

		$txtUploadPath = $("#" + piThis.tableId + " input[upload-scanned-file]");
		if ($txtUploadPath.length >0){
			$txtUploadPath.unbind("click");
			$txtUploadPath.click(function(){
				$(this).prev().trigger("click");
			});
		}

		$file = $("#" + piThis.tableId + " input[name='scan_file']");
		if ($file.length > 0) {
			$file.unbind("change");
			$file.change(function () {
				$(this).next().val(this.value);
			});
		}

		$btnSubmitUpload = $("#" + piThis.tableId + " button[upload-scanned-file-submit]");
		if ($btnSubmitUpload.length > 0) {
			$btnSubmitUpload.unbind("click");
			$btnSubmitUpload.click(function (piEvent) {
				var tr = this.parentNode.parentNode.parentNode.parentNode;
				var idx = parseInt(tr.getAttribute("idx"), 10);
				piThis.submitUpload(this, idx, piEvent);
			});
		}

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

EquTaskMgr.prototype.getOrganizationMenuTree = function (id) {
	return organizationMenueTree();
};

EquTaskMgr.prototype.getHTMLSnippetProperties = function() {
	var ret = this.HTMLSnippetProperties;

	ret.btnAcceptSubmitDom = {
		title: '入分库',
		class: 'am-btn',
		href: "javascript:void(0);",
		btnacceptsubmit: ""
	};

	return ret;
};

EquTaskMgr.prototype.btnAcceptSubmitDom = function (properties) {
	return this.buildHTMLSnippet("a", properties, "<i class='am-icon-check-square-o'></i>");
};

EquTaskMgr.prototype.getHeads = function () {
	//if (this._heads) return this._heads;
	var ret = [];

	var activeNav = this.getActiveNav();
	var navBar = this.navBar;
	var statusFilter = this.statusFilter;
	var activeStatusFilterId = this.getActiveStatus().id;

	switch (activeNav.id) {
		case navBar.equSubmitAccept.id:
		case navBar.equSubmitAcceptBranch.id:
			ret.push(new TableHead("", "# id"));
			ret.push(new TableHead("", "合同编号"));
			ret.push(new TableHead("", "仓库"));
			ret.push(new TableHead("", "设备名称"));
			ret.push(new TableHead("", "设备型号"));
			//ret.push(new TableHead("", "入库总数"));
			ret.push(new TableHead("", "验收数量"));
			ret.push(new TableHead("", "单价"));
			ret.push(new TableHead("", "经办人"));
			ret.push(new TableHead("", "资产编号"));
			ret.push(new TableHead("", "操作"));
			break;
		case navBar.equReceive.id:
			switch (activeStatusFilterId) {
				case statusFilter.unReceived.id:
					ret.push(new TableHead("", "# id"));
					ret.push(new TableHead("", "合同编号"));
					ret.push(new TableHead("", "行名"));
					ret.push(new TableHead("", "使用网点"));
					ret.push(new TableHead("", "设备大类"));
					ret.push(new TableHead("", "领用日期"));
					ret.push(new TableHead("", "设备使用人"));
					ret.push(new TableHead("", "领用经办人"));
					ret.push(new TableHead("", "用途"));
					ret.push(new TableHead("", "状态"));
					break;
				case statusFilter.received.id:
					ret.push(new TableHead("", "# id"));
					ret.push(new TableHead("", "合同编号"));
					ret.push(new TableHead("", "行名"));
					ret.push(new TableHead("", "使用网点"));
					ret.push(new TableHead("", "设备大类"));
					ret.push(new TableHead("", "数量"));
					ret.push(new TableHead("", "领用日期"));
					ret.push(new TableHead("", "设备使用人"));
					ret.push(new TableHead("", "领用经办人"));
					ret.push(new TableHead("", "用途"));
					ret.push(new TableHead("", "序列号"));
					ret.push(new TableHead("", "状态 / 操作"));
					break;
			}

			break;
		case navBar.equAllot.id:
			ret.push(new TableHead("", "# id"));
			ret.push(new TableHead("", "行名"));
			ret.push(new TableHead("", "调拨表名"));
			ret.push(new TableHead("", "发送时间"));
			ret.push(new TableHead("", "上传扫描件"));
			ret.push(new TableHead("", "状态"));
			break;
	}


	//this._heads = ret;
	return ret;
};

EquTaskMgr.prototype.buildAllotSubmitRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	var branch;

	for (i = 0; i < len; i++) {
		item = data[i];
		branch = this.organizations.item(item.organization_id);
		ret.push("<tr class='equb' idx='", i, "'>");
		ret.push("<td>", item.id, "</td>");
		ret.push("<td>", branch.name, "</td>");

		ret.push("<td>");
		ret.push("<a href='javascript:void(0)' download-alloc-file>");
		ret.push(parseDate(item.begin_date).Format("yyyy-MM-dd"), " 至 ");
		ret.push(parseDate(item.end_date).Format("yyyy-MM-dd"));
		ret.push("</a>");
		ret.push("</td>");

		ret.push("<td>", parseDate(item.report_date).Format("yyyy-MM-dd"), "</td>");

		ret.push("<td>");
		ret.push("<div>");
		ret.push("<form onsubmit='return false'>");
		ret.push("<input type='file' name='scan_file' style='display: none' />");
		ret.push("<input upload-scanned-file type='text' title='点击上传' readonly");
		if (item.status == 20) ret.push(" disabled");
		ret.push("/>");
		ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary'");
		ret.push(" upload-scanned-file-submit");
		ret.push(" style='margin-left:4px;width:80px;'");
		if (item.status == 20) ret.push(" disabled");
		ret.push("><span></span> 提交</button>");
		ret.push("</form>");
		ret.push("</div>");
		ret.push("</td>");

		ret.push("<td>");
		if (item.status == 1) {
			ret.push("<div style='color:red'>");
			ret.push("请上传扫描件");
			ret.push("</div>");
		} else {
			ret.push("<div style='color:green'>");
			ret.push("扫描件已上传");
			ret.push("</div>");
		}
		ret.push("</td>");
		ret.push("</tr>");
	}
};

EquTaskMgr.prototype.buildSubmitAcceptRow = function (data, parentPath, ret) {
	var activeStatus = this.getActiveStatus();
	var statusFilter = this.statusFilter;
	var len = data.length;
	var i = 0;
	var item;
	var hasSubmitAccept = false;

	switch (activeStatus.id) {
		case statusFilter.unSubmitAccepted.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.accept, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", item.storage_name, "</td>");
				ret.push("<td>", item.kind_name, "</td>");
				ret.push("<td>", item.brand_name, "</td>");
				ret.push("<td>", item.cnt, "</td>");
				ret.push("<td>", item.price, "</td>");
				ret.push("<td>", item.accept_operators_name, "</td>");
				ret.push("<td>", (item.financial_code == "" ? "未录入" : "已录入"), "</td>");
				ret.push("<td>");
				ret.push(this.getHTMLSnippet("btnAcceptSubmitDom", this.btnAcceptSubmitDom, null, null));
				//ret.push("<div class='am-btn-toolbar'>");
				//ret.push("<div class='am-btn-group am-btn-group-sm'>");
				//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='确认验收' ");
				//ret.push(" style='width:50px;'");
				//ret.push(" btnAcceptSubmit eqid='", i, "'");
				////if (item.accept < 1) ret.push(" disabled");
				//ret.push("><span class='am-icon-check-square-o''></span> </button>");
				//ret.push("</div>");
				//ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
		case statusFilter.submitAccepted.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.accept_submit, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", item.storage_name, "</td>");
				ret.push("<td>", item.kind_name, "</td>");
				ret.push("<td>", item.brand_name, "</td>");
				ret.push("<td>", item.cnt, "</td>");
				ret.push("<td>", item.price, "</td>");
				ret.push("<td>", item.sau_name, "</td>");
				ret.push("<td>", (item.financial_code == "" ? "未录入" : "已录入"), "</td>");
				ret.push("<td>");
				ret.push(this.getHTMLSnippet("btnAcceptSubmitDom", this.btnAcceptSubmitDom, {disabled: ""}, null));
				//ret.push("<div class='am-btn-toolbar'>");
				//ret.push("<div class='am-btn-group am-btn-group-sm'>");
				//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='确认验收'");
				//ret.push(" style='width:50px;'");
				//ret.push(" btnAcceptSubmit eqid='", i, "'");
				//ret.push(" disabled");
				//ret.push("><span class='am-icon-check-square-o'></span> </button>");
				//ret.push("</div>");
				//ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
		case statusFilter.submitAcceptedAll.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				hasSubmitAccept = !(item.accept_submit == 0);

				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.accept, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", item.storage_name, "</td>");
				ret.push("<td>", item.kind_name, "</td>");
				ret.push("<td>", item.brand_name, "</td>");
				ret.push("<td>", item.cnt, "</td>");
				ret.push("<td>", item.price, "</td>");
				if (hasSubmitAccept) {
					ret.push("<td>", item.sau_name, "</td>");
				} else {
					ret.push("<td>", item.accept_operators_name, "</td>");
				}
				ret.push("<td>", (item.financial_code == "" ? "未录入" : "已录入"), "</td>");
				ret.push("<td>");
				//ret.push("<div class='am-btn-toolbar'>");
				//ret.push("<div class='am-btn-group am-btn-group-sm'>");
				//ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='确认验收' ");
				//ret.push(" style='width:50px;'");
				//ret.push(" btnAcceptSubmit eqid='", i, "'");
				if (hasSubmitAccept) {
					ret.push(this.getHTMLSnippet("btnAcceptSubmitDom", this.btnAcceptSubmitDom, {disabled: ""}, null));
				} else {
					ret.push(this.getHTMLSnippet("btnAcceptSubmitDom", this.btnAcceptSubmitDom, {}, null));
				}
				//ret.push("><span class='am-icon-check-square-o'></span></button>");
				//ret.push("</div>");
				//ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
	}
};

EquTaskMgr.prototype.buildSubmitAcceptInBranchRow = function (data, parentPath, ret) {
	var activeStatus = this.getActiveStatus();
	var statusFilter = this.statusFilter;
	var len = data.length;
	var i = 0;
	var item;
	var hasSubmitAccept = false;

	switch (activeStatus.id) {
		case statusFilter.unSubmitAccepted.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.accept, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", item.storage_name, "</td>");
				ret.push("<td>", item.kind_name, "</td>");
				ret.push("<td>", item.brand_name, "</td>");
				ret.push("<td>", item.cnt, "</td>");
				ret.push("<td>", item.price, "</td>");
				ret.push("<td>", item.accept_operators_name, "</td>");
				ret.push("<td>", (item.financial_code == "" ? "未录入" : "已录入"), "</td>");
				ret.push("<td>");
				ret.push("<div class='am-btn-toolbar'>");
				ret.push("<div class='am-btn-group am-btn-group-sm'>");
				ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='确认验收' ");
				ret.push(" style='width:50px;'");
				ret.push(" btnAcceptSubmit eqid='", i, "'");
				ret.push("><span class='am-icon-check-square-o'></span></button>");
				ret.push("</div>");
				ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
		case statusFilter.submitAccepted.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.accept_submit, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", item.storage_name, "</td>");
				ret.push("<td>", item.kind_name, "</td>");
				ret.push("<td>", item.brand_name, "</td>");
				ret.push("<td>", item.cnt, "</td>");
				ret.push("<td>", item.price, "</td>");
				ret.push("<td>", item.sau_name, "</td>");
				ret.push("<td>", (item.financial_code == "" ? "未录入" : "已录入"), "</td>");
				ret.push("<td>");
				ret.push("<div class='am-btn-toolbar'>");
				ret.push("<div class='am-btn-group am-btn-group-sm'>");
				ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='确认验收' ");
				ret.push(" style='width:50px;'");
				ret.push(" btnAcceptSubmit eqid='", i, "'");
				ret.push(" disabled");
				ret.push("><span class='am-icon-check-square-o'></span> </button>");
				ret.push("</div>");
				ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
		case statusFilter.submitAcceptedAll.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				hasSubmitAccept = !(item.accept_submit == 0);

				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.accept, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", item.storage_name, "</td>");
				ret.push("<td>", item.kind_name, "</td>");
				ret.push("<td>", item.brand_name, "</td>");
				ret.push("<td>", item.cnt, "</td>");
				ret.push("<td>", item.price, "</td>");
				if (hasSubmitAccept) {
					ret.push("<td>", item.sau_name, "</td>");
				} else {
					ret.push("<td>", item.accept_operators_name, "</td>");
				}
				ret.push("<td>", (item.financial_code == "" ? "未录入" : "已录入"), "</td>");
				ret.push("<td>");
				ret.push("<div class='am-btn-toolbar'>");
				ret.push("<div class='am-btn-group am-btn-group-sm'>");
				ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title=='确认验收' ");
				ret.push(" style='width:50px;'");
				ret.push(" btnAcceptSubmit eqid='", i, "'");
				if (hasSubmitAccept) {
					ret.push(" disabled");
				}
				ret.push("><span class='am-icon-check-square-o'></span> </button>");
				ret.push("</div>");
				ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
	}
};

EquTaskMgr.prototype.buildReceiveRow = function (data, parentPath, ret) {
	var activeStatus = this.getActiveStatus();
	var statusFilter = this.statusFilter;
	var len = data.length;
	var i = 0;
	var item;
	var hasSubmitAccept = false;

	switch (activeStatus.id) {
		case statusFilter.unReceived.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.allot, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", this.organizations.getBranch(item.organization_id).name, "</td>");
				ret.push("<td>", item.organization_name, "</td>");
				ret.push("<td>", this.asset_kinds.parent(item.kind_id).name, "</td>");
				ret.push("<td>", (parseDate(item.allot_date)).Format("yyyy-MM-dd hh:mm:ss"), "</td>");
				ret.push("<td>", item.user_name, "</td>");
				ret.push("<td>", item.allot_opu_name, "</td>");
				ret.push("<td>", item.purposes_name, "</td>");
				ret.push("<td>");
				ret.push("<div class='am-btn-toolbar'>");
				ret.push("<div class='am-btn-group am-btn-group-sm'>");
				ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='确认领用' ");
				ret.push(" style='width:50px;'");
				ret.push(" ", this.btnReceive, " eqid='", i, "'");
				ret.push(item.receive > 0 ? " disabled" : "");
				ret.push("><span class='am-icon-check-square'></span> </button>");
				ret.push("</div>");
				ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
		case statusFilter.received.id:
			for (i = 0; i < len; i++) {
				item = data[i];
				ret.push("<tr class='equb' equid='", i, "' storage_id='", item.storage_id, "'>");
				ret.push("<td>", item.receive, "</td>");
				ret.push("<td>", item.contract_code, "</td>");
				ret.push("<td>", this.organizations.getBranch(item.organization_id).name, "</td>");
				ret.push("<td>", item.organization_name, "</td>");
				ret.push("<td>", this.asset_kinds.parent(item.kind_id).name, "</td>");
				ret.push("<td>1</td>");
				ret.push("<td>", (parseDate(item.receive_date)).Format("yyyy-MM-dd hh:mm:ss"), "</td>");
				ret.push("<td>", item.user_name, "</td>");
				ret.push("<td>", item.receive_opu_name, "</td>");
				ret.push("<td>", item.purposes_name, "</td>");
				ret.push("<td>", item.serials_code, "</td>");
				ret.push("<td>");
				ret.push("<div class='am-btn-toolbar'>");
				ret.push("<div class='am-btn-group am-btn-group-sm'>");
				ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary'");
				ret.push(" style='width:80px;border:none'");
				ret.push("><span style='color:green'>已领用</span> </button>");
				ret.push("<button class='am-btn am-btn-default am-btn-sm am-text-secondary' title='修改' ");
				ret.push(" style='width:50px;'");
				ret.push(" ", this.btnUpdReceive, " eqid='", i, "'");
				//ret.push(" disabled");
				ret.push("><span class='am-icon-pencil-square-o'></span> </button>");
				ret.push("</div>");
				ret.push("</div>");
				ret.push("</td>");
				ret.push("</tr>");
			}
			break;
	}
};

EquTaskMgr.prototype.buildRow = function (data, parentPath, ret) {
	var activeNav = this.getActiveNav();
	var navBar = this.navBar;

	switch (activeNav.id) {
		case navBar.equSubmitAccept.id:
			this.buildSubmitAcceptRow(data, parentPath, ret);
			break;
		case navBar.equSubmitAcceptBranch.id:
			this.buildSubmitAcceptInBranchRow(data, parentPath, ret);
			break;
		case navBar.equReceive.id:
			this.buildReceiveRow(data, parentPath, ret);
			break;
		case navBar.equAllot.id:
			this.buildAllotSubmitRow(data, parentPath, ret);
			break;
	}

	return true;
};

EquTaskMgr.prototype.buildHead = function (ret) {
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

EquTaskMgr.prototype.onAllDataArrival = function (data) {
	if (data) this.data = data;
	
	var html = [];
	html.push("<table id='tblList' table-layout='fixed' class='am-table am-table-striped am-table-compact am-text-nowrap zj-table'>");
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

EquTaskMgr.prototype.popModalAccept = function (idx) {
	var containerId = "#mdlAccept div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	
	var equ = this.dataItems(idx);
	var html = [];
	html.push("<form class='am-form am-form-horizontal' action=''>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", idx, "'>");
	html.push("<input type='hidden' name='act' value='", enumAction().upd, "' />");
	html.push("<input type='hidden' name='operate_user_id' value='", this.userInfo.id, "' />");
	html.push("<input type='hidden' name='in_code_id' value='", equ.in_code_id, "' />");
	html.push("<input type='hidden' name='accept_id' value='", equ.accept, "' />");
	
	html.push("<div class='am-form-group'>");
	//上传设备序列号
	html.push("<div class='am-u-sm-4'>");
	html.push("<div class='am-form-group am-form-file am-fl'>");
	html.push("<button type='button' class='am-btn am-btn-default am-btn-sm'>");
	html.push("<i class='am-icon-cloud-upload'></i> 上传设备序列号</button>");
	html.push("<input type='file' name='serials_code'>");
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

EquTaskMgr.prototype.submitAccept = function () {
	var formData = new FormData($("#mdlAccept form")[0]);
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

EquTaskMgr.prototype.acceptEquipmentSubmit = function (idx) {
	var opt = {};
	//var searchCriteria = this.getSearchCriteria();
	opt.id = idx;
	var equ = this.dataItems(idx);
	opt.in_code_id = equ.in_code_id;
	opt.accept_id = equ.accept;
	opt.operate_user_id = this.userInfo.id;
	//opt.in_branch = searchCriteria.in_branch;

	var piThis = this;
	$.ajax({
		url: this.route + '/submitAccept',
		cache: false,
		data: opt
	}).then(function(data) {
		piThis.onSubmitAcceptOk(data);
	}, function() {
		alert("请求失败.");
	});

	return true;
};

EquTaskMgr.prototype.onAcceptOk = function (data) {
	var $tr = $("#" + this.tableId + " tr[equid='" + data.id + "']");

	var equ = this.dataItems(data.id);
	if (equ) {
		equ.acceptedCount = data.acceptedCount;
	}

	var $td = $tr.find("td[name='unAcceptedCount']");
	//if ($td.length > 0) {
	//	$td.html(0);
	//}

	$tr.find("button[btnAccept]").attr("disabled", true);

	$("#mdlAccept").modal("close");
	return true;
};

EquTaskMgr.prototype.onSubmitAcceptOk = function (data) {
	var $tr = $("#" + this.tableId + " tr[equid='" + data.id + "']");
	//$tr.find("td[name='unSubmitAcceptedCount']").html(0);
	$tr.find("button[btnAcceptSubmit]").attr("disabled", true);
	alert("成功确认验收 " + data.acceptedCount + " 个设备！");
	return true;
};

EquTaskMgr.prototype.defaultNav = function () {
	var user = this.userInfo;
	if (user.permissionMap["asset_accept_submit"]) {
		return this.navBar.equSubmitAccept;
	}

	if (user.permissionMap["asset_accept_submit_in_branch"]) {
		return this.navBar.equSubmitAcceptBranch;
	}

	if (user.permissionMap["asset_receive"]) {
		return this.navBar.equReceive;
	}

	if (user.permissionMap["asset_pool_allot_submit"]) {
		return this.navBar.equAllot;
	}
};

EquTaskMgr.prototype.defaultStatus = function () {
	var user = this.userInfo;

	if (user.permissionMap["asset_accept_submit"]) {
		return this.statusFilter.unSubmitAccepted;
	}

	if (user.permissionMap["asset_accept_submit_in_branch"]) {
		return this.statusFilter.unSubmitAccepted;
	}

	if (user.permissionMap["asset_receive"]) {
		return this.statusFilter.unReceived;
	}

	if (user.permissionMap["asset_pool_allot_submit"]) {
		return this.statusFilter.unknow;
	}
};

EquTaskMgr.prototype.defaultSearchCriteria = function () {
	var $div = $(".search_block div");
	var ret = {};
	ret.contract_code = $div.find("input[name='contract_code']").val().trim();
	ret.storageStatus = "";
	ret.groupByStorage = "1";
	ret.storage_id = this.userInfo.storage_id;
	ret.userId = this.userInfo.id;
	ret.organization_id = $div.find("input[name='organization_id']").attr("releasevalue");
	ret.qp = this.getQueryParameter();
	return ret;
};

EquTaskMgr.prototype.getSearchCriteria = function () {
	var ret = this.defaultSearchCriteria();
	ret.status = this.getActiveStatus().key;
	ret.nav = this.getActiveNav().key;

	var activeNavId = this.getActiveNav().id;
	var activeStatusFilterId = this.getActiveStatus().id;
	var navBar = this.navBar;
	var statusFilter = this.statusFilter;

	switch (activeNavId) {
		case navBar.equSubmitAccept.id:
			ret.in_branch = 0;
			ret.use_organization = 0;
			break;
		case navBar.equSubmitAcceptBranch.id:
			ret.use_organization = 1;
			ret.in_branch = 1;
			break;
		case navBar.equReceive.id:
			ret.use_organization = 1;
			ret.in_branch = "";
			break;
		case navBar.equAllot.id:
			ret.organization_id = this.userInfo.organization_id;
			ret.in_branch = "";
			break;
		default :
			ret.in_branch = 1;
			break;
	}

	return ret;
};

EquTaskMgr.prototype.resetSearchCriteria = function () {
	var org = this.organizations.item(this.userInfo.organization_id);
	$input = $("div.search_block input[name='organization_id']");
	$input.val(org.name);
	$input.attr("releasevalue", org.id);

	var orgTree = organizationMenueTree();
	orgTree.init(org);
};

EquTaskMgr.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	//qp["withFinancialCodeCount"] = 0;
	//qp["withAcceptedCount"] = 0;
	//qp["withSubmitAcceptedCount"] = 0;
	//qp["withTotalInCount"] = 0;
	qp["withCount"] = 1;

	var activeNavId = this.getActiveNav().id;
	var activeStatusFilterId = this.getActiveStatus().id;
	var navBar = this.navBar;
	var statusFilter = this.statusFilter;

	switch (activeNavId) {
		case navBar.equSubmitAccept.id:
			qp["deep"] = 0;
			qp["groupByStorage"] = 0;
			switch (activeStatusFilterId) {
				case statusFilter.unSubmitAccepted.id:
					qp["withAccept"] = 1;
					qp["groupByAccept"] = 1;
					break;
				case statusFilter.submitAccepted.id:
					qp["withSubmitAccept"] = 1;
					qp["groupBySubmitAccept"] = 1;
					break;
				case statusFilter.submitAcceptedAll.id:
					qp["withAccept"] = 1;
					qp["groupByAccept"] = 1;
					qp["withSubmitAccept"] = 1;
					qp["groupBySubmitAccept"] = 1;
					break;
			}
			break;
		case navBar.equSubmitAcceptBranch.id:
			qp["deep"] = 1;
			qp["groupByStorage"] = 0;
			switch (activeStatusFilterId) {
				case statusFilter.unSubmitAccepted.id:
					qp["withAccept"] = 1;
					qp["groupByAccept"] = 1;
					break;
				case statusFilter.submitAccepted.id:
					qp["withSubmitAccept"] = 1;
					qp["groupBySubmitAccept"] = 1;
					break;
				case statusFilter.submitAcceptedAll.id:
					qp["withAccept"] = 1;
					qp["groupByAccept"] = 1;
					qp["withSubmitAccept"] = 1;
					qp["groupBySubmitAccept"] = 1;
					break;
			}
			break;
		case navBar.equReceive.id:
			qp["deep"] = 1;
			qp["groupByStorage"] = 0;
			qp["groupByInCode"] = 0;
			qp["withCount"] = 0;
			qp["withUser"] = 1;
			qp["withPurpose"] = 1;
			switch (activeStatusFilterId) {
				case statusFilter.unReceived.id:
					qp["withAllot"] = 1;
					break;
				case statusFilter.received.id:
					qp["withReceive"] = 1;
					break;
				case statusFilter.submitAcceptedAll.id:
					qp["withAccept"] = 1;
					qp["groupByAccept"] = 1;
					qp["withSubmitAccept"] = 1;
					qp["groupBySubmitAccept"] = 1;
					break;
			}
			break;
	}

	return qp;
};

EquTaskMgr.prototype.resetNav = function (key) {
	this.setActiveNav(key);

	var flag = true;
	var navBar = this.navBar;
	var statusFilter = this.statusFilter;

	var piThis = this;
	
	$("li[nav-bar]").each(function (i, li) {
		var $li = $(li);
		
		if ($li.attr("key") == key) {
			if ($li.is(".am-active")) {
				flag = false;
			} else {
				$li.addClass("am-active");
				//$("div[breadcrumb]").children("span").html("设备管理>我的待办>" + $li.text().trim());

				var $buttons = $("button[status-switch]");
				switch (key) {
					case navBar.equSubmitAccept.key:
						$buttons.each(function (i, btn) {
							var statusKey = btn.getAttribute("key");
							switch (statusKey) {
								case statusFilter.unSubmitAccepted.key:
								case statusFilter.submitAccepted.key:
								case statusFilter.submitAcceptedAll.key:
									$(btn).parent().show();
									break;
								default:
									$(btn).parent().hide();
									break;
							}
						});
						piThis.enableSearch(true);
						piThis.resetStatus(statusFilter.unSubmitAccepted.key);
						break;
					case navBar.equSubmitAcceptBranch.key:
						$buttons.each(function (i, btn) {
							var statusKey = btn.getAttribute("key");
							switch (statusKey) {
								case statusFilter.unSubmitAccepted.key:
								case statusFilter.submitAccepted.key:
								case statusFilter.submitAcceptedAll.key:
									$(btn).parent().show();
									break;
								default:
									$(btn).parent().hide();
									break;
							}
						});
						piThis.enableSearch(true);
						piThis.resetStatus(statusFilter.unSubmitAccepted.key);
						break;
					case navBar.equReceive.key:
						$buttons.each(function (i, btn) {
							var statusKey = btn.getAttribute("key");
							switch (statusKey) {
								case statusFilter.unReceived.key:
								case statusFilter.received.key:
								case statusFilter.multReceive.key:
									$(btn).parent().show();
									break;
								default:
									$(btn).parent().hide();
									break;
							}
						});
						piThis.enableSearch(true);
						piThis.resetStatus(statusFilter.unReceived.key);
						break;
					case navBar.equAllot.key:
						$buttons.parent().hide();
						piThis.enableSearch(false);
						piThis.resetStatus(statusFilter.unknow.key);
						break;
				}
			}
		} else {
			if ($li.is(".am-active")) $li.removeClass("am-active");
		}
		
		return true;
	});
	
	//if (flag || true) {
	//	this.resetSearchCriteria();
	//	this.submitSearch();
	//}
};

EquTaskMgr.prototype.resetStatus = function (key) {
	this.setActiveStatus(key);

	var flag = true;
	var statusFilter = this.statusFilter;

	$("button[status-switch]").each(function (i, btn) {
		var $btn = $(btn);

		if ($btn.attr("key") == key) {
			if ($btn.is(".am-btn-primary")) {
				flag = false;
			} else {
				$btn.addClass("am-btn-primary");
				if (key == statusFilter.received.key) {
					$("button[status-switch][key='" + statusFilter.multReceive.key + "']").attr("disabled", true);
				} else {
					$("button[status-switch][key='" + statusFilter.multReceive.key + "']").attr("disabled", false);
				}
			}
		} else {
			if ($btn.is(".am-btn-primary")) $btn.removeClass("am-btn-primary");
		}
		return true;
	});

	if (flag || true) {
		if (key == statusFilter.multReceive.key) {
			this.multReceive();
		} else {
			this.submitSearch();
		}
	}
};

EquTaskMgr.prototype.submitSearch = function () {
	var criteria = this.getSearchCriteria();
	var piThis = this;

	showLoading();

	$.ajax({
		url: this.route + "/search",
		cache: false,
		async: false,
		data: criteria,
		dataType: 'json'
	}).then(function(data) {
		piThis.onAllDataArrival(data);
		hideLoading();
	}, function() {
		alert("请求失败！");
		hideLoading();
	});
	return true;
};

EquTaskMgr.prototype.onReceiveOk = function (data) {
	var receive = parseInt(data.receive, 10);
	var idx = parseInt(data.id, 10);
	var equipments = this.data;

	if (receive > 0) {
		equipments[idx].receive = receive;
		$("#" + this.tableId + " tr[equid=" + idx + "] button[" + this.btnReceive + "]").attr("disabled", true);
		alert("成功领用");
	}
};

EquTaskMgr.prototype.receive = function (idx) {
	var equ = this.dataItems(idx);
	if (!equ) return false;

	var piThis = this;
	var sendData = {};
	sendData.id = idx;
	sendData.asset_id = equ.id;

	$.ajax({
		url: this.route + "/receive",
		cache: false,
		async: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.onReceiveOk(data);
	}, function() {
		alert("请求失败！");
	});
};

EquTaskMgr.prototype.onMultReceiveOk = function (data	) {
	var affectCount = parseInt(data.affectCount, 10);
	if (affectCount > 0) {
		this.eachData(function(i, equipment){
			if (equipment.receive == 0) equipment.receive = 1;
		});
		$("#" + this.tableId + " button[" + this.btnReceive + "]").attr("disabled", true);
		alert("成功一键领用");
	}
};

EquTaskMgr.prototype.multReceive = function () {
	var equipmentIds = [];
	this.eachData(function(i, equipment){
		if (equipment.receive < 1) equipmentIds.push(equipment.id);
	});

	if (equipmentIds.length < 1) {
		alert("没有需要领用的设备。");
		return false;
	}

	var piThis = this;
	var sendData = {};
	sendData.equipmentIds = equipmentIds.join(",");

	$.ajax({
		url: this.route + "/multReceive",
		cache: false,
		async: false,
		data: sendData,
		dataType: 'json'
	}).then(function(data) {
		piThis.onMultReceiveOk(data);
	}, function() {
		alert("请求失败！");
	});
};

EquTaskMgr.prototype.onSubmitUploadOk = function (data) {
	var piThis = this;

	this.eachData(function(i, item){
		if (item.id == data[0].id) {
			item.scanned = data[0].scanned;
			item.upload_date = data[0].upload_date;
			item.status = data[0].status;

			$div = $("#" + this.tableId + " tr[idx='" + i + "'] td:eq(4) div");
			$div.html("扫描件已上传");
			$div.css("color", "green");
		}
	});

	alert("操作成功！");
};

EquTaskMgr.prototype.submitUpload = function (piSender, idx, piEvent) {
	$txtFilePath = $(piSender).prev();
	if ($txtFilePath.val().trim().length < 2) {
		alert("请选择一个文件上传！");
		return 0;
	}

	//var _token = $("div.search_block form input[name='_token']").val();
	var dataItem = this.dataItems(idx);
	var formData = new FormData(piSender.parentNode);
	//formData.append("_token", _token);
	formData.append("allot_id", dataItem.id);
	formData.append("id", idx);

	var piThis = this;
	$.ajax({
		url: this.route + '/submitAllot',
		type: "POST",
		data: formData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		error: function(request) {
			alert("操作失败！");
		},
		success: function(data) {
			piThis.onSubmitUploadOk(data);
		}
	});
};

EquTaskMgr.prototype.initQuickNav = function () {
	var user = this.userInfo;
	var $ul = $("ul[" + this.quickNav + "]");
	var navBar = this.navBar;

	if (!user.permissionMap["asset_accept_submit"]) {
		$ul.find("li[key='" + navBar.equSubmitAccept.key + "']").remove();
	}

	if (!user.permissionMap["asset_accept_submit_in_branch"]) {
		$ul.find("li[key='" + navBar.equSubmitAcceptBranch.key + "']").remove();
	}

	if (!user.permissionMap["asset_receive"]) {
		$ul.find("li[key='" + navBar.equReceive.key + "']").remove();
	}

	if (!user.permissionMap["asset_pool_allot_submit"]) {
		$ul.find("li[key='" + navBar.equAllot.key + "']").remove();
	}
};

EquTaskMgr.prototype.initBody = function () {
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
	
	return true;
};

EquTaskMgr.prototype.initData = function () {
	this.resetNav(this.getActiveNav().key);
	//var piThis = this;
	//$.get(this.route, this.getSearchCriteria(), function (data) {
	//	piThis.cacheData(data);
	//	piThis.onAllDataArrival();
    //
	//	hideLoading();
    //
	//	return true;
	//}, "json");
};

EquTaskMgr.prototype.enableSearch = function (enable) {
	$("ul.search_block button.search_btn").attr("disabled", !enable);
	$("ul.search_block input[name='contract_code']").attr("disabled", !enable);
	$("ul.search_block input[name='in_time_start']").attr("disabled", !enable);
	$("ul.search_block input[name='in_time_end']").attr("disabled", !enable);
};

var _taskMgr = null;
function thisMgr() {
	if (_taskMgr) return _taskMgr;
	var ret = new EquTaskMgr("task");
	ret.mdlUpdContainerId = ret.mdlAddContainerId;
	_taskMgr = ret;	
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