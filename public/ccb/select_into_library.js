function SelectMgr(instance) {
	if (typeof instance == "undefined") instance = "select";
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

SelectMgr.prototype = new EquMgr();
SelectMgr.prototype.parameters = ["user", "organizations", "asset_kinds", "asset_brands", "storage"];

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
		html.push("<input type='hidden' name='_token' value='", _token, "'>");
		html.push("<input type='hidden' name='id' value='", (equ ? equ.in_code_id : "0"), "'>");
		html.push("<input type='hidden' name='act' value='", act, "' />");
		
		html.push("<div class='am-form-group'>");
			//合同编号
			html.push("<div class='am-u-sm-4'>");
			html.push("<input class='modal-text' type='text' name='contract_code' placeholder='合同编号' title='合同编号' />");
			html.push("</div>");

			//入库日期
			html.push("<div class='am-u-sm-4'>");
			html.push("<input class='modal-text' type='text' name='in_time_start' class='am-form-field' placeholder='设备入库起始日期' title='设备入库起始日期' data-am-datepicker readonly />");
			html.push("</div>");

			html.push("<div class='am-u-sm-4'>");
			html.push("<input class='modal-text' type='text' name='in_time_end' class='am-form-field' placeholder='设备入库结束日期' title='设备入库结束日期' data-am-datepicker readonly />");
			html.push("</div>");
		html.push("</div>");


		
		html.push("<div class='am-form-group'>");
			
			//分库选择
			html.push("<div class='am-u-sm-4'>");
				html.push("<select name='storage_id' title='选择分库'>");
					html.push("<option value=''>选择分库</option>");
					if (this.storage) {
						$.each(this.storage, function (i, item) {
							html.push("<option value='", item.id, "'>", item.name, "</option>");
							return true;
						});
					}
				html.push("</select>");
			html.push("</div>");

			//设备大类
			var ids = (equ ? this.asset_kinds.getFullPath(equ.kind_id) : []);
			html.push("<div class='am-u-sm-4'>");
				html.push("<select name='root_kind_id' onchange='on_kind_change(this);' title='设备大类'>");
					html.push("<option value=''>设备大类</option>");
					html.push(this.asset_kinds.getFirstChildComboBoxList());
				html.push("</select>");
			html.push("</div>");

			//设备名称
			html.push("<div class='am-u-sm-4'>");
				html.push("<select name='kind_id' title='设备名称'>");
					html.push("<option value=''>设备名称</option>");
					html.push(equ ? this.asset_kinds.getComboBoxList(ids[1]) : "");
				html.push("</select>");
			html.push("</div>");
	
		html.push("</div>");
		
		html.push("<div class='am-form-group'>");	
			
			//设备品牌
			ids = (equ ? this.asset_brand.getFullPath(equ.brand_id) : []);
			html.push("<div class='am-u-sm-4'>");
				html.push("<select name='root_brand_id' onchange='on_brand_change(this);' title='设备品牌'>");
					html.push("<option value=''>设备品牌</option>");
					html.push(this.asset_brand.getFirstChildComboBoxList());
				html.push("</select>");
			html.push("</div>");
			
			//设备规格型号
			html.push("<div class='am-u-sm-4'>");
				html.push("<select name='brand_id' title='设备规格型号'>");
					html.push("<option value=''>设备规格型号</option>");
					html.push(equ ? this.asset_brand.getComboBoxList(ids[1]) : "");
					html.push("</select>");
		html.push("</div>");

		//确定
		html.push("<div class='am-u-sm-4'>");
			html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
		html.push("</div>");

		html.push("</div>");
					
	html.push("</form>");

	return html.join("");
};



SelectMgr.prototype.initModalAdd = function () {
	var frmId = "#" + this.mdlAddContainerId + " form";
		
	$(frmId + " input[name='in_time_start']").val((new Date).DateAdd("y",-1).Format("yyyy-MM-dd"));
	$(frmId + " input[name='in_time_start']").datepicker({format: 'yyyy-mm-dd'});
	
	$(frmId + " input[name='in_time_end']").val((new Date).DateAdd("y",0).Format("yyyy-MM-dd"));
	$(frmId + " input[name='in_time_end']").datepicker({format: 'yyyy-mm-dd'});
	
	return true;
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



SelectMgr.prototype.getHeads = function () {
	var ret = [];
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "供应商"));
	ret.push(new TableHead("", "仓库名称"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "入库时间"));
	ret.push(new TableHead("", "入库总数"));
	ret.push(new TableHead("", "库存"));
	ret.push(new TableHead("", "单价"));
	ret.push(new TableHead("", "经办人"));
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
			ret.push("<td>", item.contract_code, "</td>");
			ret.push("<td>",item.supplier,"</td>");
			ret.push("<td>",item.storage_name,"</td>");
			ret.push("<td>", item.kind_name, "</td>");
			ret.push("<td>", item.brand_name, "</td>");
			ret.push("<td>", (new Date(item.in_time)).Format("yyyy-MM-dd"), "</td>");
			ret.push("<td>", item.equipment_total, "</td>");
			ret.push("<td>", item.stock, "</td>");
			ret.push("<td>", item.price, "</td>");
			ret.push("<td>", item.real_name, "</td>");
		ret.push("</tr>");
	}
	
	return true;
};

SelectMgr.prototype.sendDataForAdd = function () {
	var frmData = new FormData($("#" + this.mdlAddContainerId + " form")[0]);
	frmData.append("qp", this.getQueryParameter());
	return frmData;
};

SelectMgr.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["deep"] = 0;
	qp["withStock"] = 1;
	return qp;
};

SelectMgr.prototype.getQueryParameter = function () {
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

SelectMgr.prototype.defaultQueryParameter = function () {
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
	defaultQP["withStock"] = 1;
	return defaultQP;
};

function on_kind_change(pSender) {
	var mgr = accountMgr();
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
	var mgr = accountMgr();
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

SelectMgr.prototype.initBody = function () {
	var piThis = this;

	$("a[" + piThis.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});

	$("a[excel_export]").click(function() {
		var arr = $('#searchForm').serialize();		
		arr += "&qp=" + piThis.getQueryParameter();
		$("a[excel_export]").attr("href", "select/into-library/export?"+arr);
	});
};

SelectMgr.prototype.initData = function () {
	var piThis = this;
	$.get("select/into-library/all", this.getSearchCriteria(), function (data) {
		piThis.cacheData(data);
		piThis.onAllDataArrival.call(piThis);
		return true;
	});

};

SelectMgr.prototype.submitSearch = function () {
	var piThis = this;
	var sendData = this.sendDataForAdd();
	
	$.ajax({
		url: 'select/into-library/search',
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
	ret["withStock"] = 36;
	_EquQueryParameter = ret;
	return ret;
}