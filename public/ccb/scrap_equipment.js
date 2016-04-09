function EquScrapMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

EquScrapMgr.prototype = new EquMgr("equ");

EquScrapMgr.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;

	var piThis = this;
	
	var opt = EquipmentGridSetting();
	opt.bProcessing = true;		
	opt.fnDrawCallback = function () {
		$(this).addClass("am-table-striped am-table-hover");
		
		$("#" + piThis.tableId + " tbody td a[" + piThis.btnUpd + "]").unbind("click");
		$("#" + piThis.tableId + " tbody td a[" + piThis.btnUpd + "]").click(function () {
			var equId = this.getAttribute("eqid");
			piThis.scrapEquipment(equId);
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

EquScrapMgr.prototype.getHeads = function () {
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
	ret.push(new TableHead("", "部门"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

EquScrapMgr.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr eqid='", item.in_code, "'>");
		ret.push("<td>", item.updated_at, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.name, "</td>");
		ret.push("<td>", item.model, "</td>");
		ret.push("<td>", item.totalCount, "</td>");
		ret.push("<td>", item.inCount, "</td>");
		ret.push("<td>", item.price, "</td>");
		ret.push("<td>", item.operate_user_id, "</td>");
		ret.push("<td>", item.organization_name, "</td>");
		ret.push("<td>");
		if (EquipmentStatus().isScrap(item.status)) {
			ret.push("<a href='javascript:void(0)'>已报废设备</a>");
		} else {
			ret.push("<a href='javascript:void(0)' ", this.btnUpd, " eqid='", item.in_code, "'>设备报废</a>");
		}		
		ret.push("</td>");
		ret.push("</tr>");
	}
	
	return true;
};

EquScrapMgr.prototype.scrapEquipment = function (id) {
	var piThis = this;
	showLoading();
	$.ajax({
		url: this.route + '/upd/' + id,
		cache: false
    }).then(function(data) {
	    hideLoading();
	    $lnk = $("#" + piThis.tableId + " tbody tr[eqid='" + id + "'] td a[" + piThis.btnUpd + "]");
	    $lnk.unbind("click");
		$lnk.html("已报废设备");
    }, function() {
      	alert("请求失败.");
      	hideLoading();
    });
	return true;
};

var _scrapEquipmentsMgr = null;
function scrapEquipmentsMgr() {
	if (_scrapEquipmentsMgr) return _scrapEquipmentsMgr;
	var ret = new EquScrapMgr("scrap");
	_scrapEquipmentsMgr = ret;
	return ret;
}

function on_scrap_equipment_load() {
	var mgr = scrapEquipmentsMgr();
	
	showLoading();
	$.get("/equipment/all", {}, function (data) {
		mgr.cacheData(data);
		mgr.onAllDataArrival();
		hideLoading();
		return true;
	}, "json");

	$("#" + mgr.btnSearch).click(function () {
		mgr.submitSearch();
		return true;
	});
	
	return true;
}