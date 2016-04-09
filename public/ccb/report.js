function Report(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}
Report.prototype = new Management();
Report.prototype.parameters = ["user", "asset_kinds", "asset_brands", "storage"];
Report.prototype.queryMethod = "get";

Report.prototype.defaultQueryCriteria = {
	contract_code: "",
	organization: "",
	storage: "",
	kind: "",
	name: "",
	brand: "",
	model: "",
	in_time_start: "",
	in_time_end: ""
};

Report.prototype.dataTableOptions = function () {
	if (this._dataTableOptions) return this._dataTableOptions;
	var opt = EquipmentGridSetting();
	opt.columnDefs = [ {
			"targets": [0],
			"visible": false
		}
	];
	opt.aaSorting = [[0, "asc"]];
	this._dataTableOptions = opt;
	return opt;
};

Report.prototype.setDefaultQueryCriteria = function () {
	return true;
};

Report.prototype.initData = function () {
	var piThis = this;
	$.ajax({
		url: this.route + "/search",
		cache: false,
		async: false,
		data: this.defaultQueryCriteria,
		dataType: 'json'
	}).then(function(data) {
		piThis.cacheData(data);
		piThis.onAllDataArrival();
		return true;
	}, function() {
		alert("请求失败！")
	});
};

Report.prototype.groupData = function (data) {
	return true;
};