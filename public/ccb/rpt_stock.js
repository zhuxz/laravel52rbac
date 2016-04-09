function RptStock(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

RptStock.prototype = new Report("rpt");

Report.prototype.setDefaultQueryCriteria = function () {
	var qc = this.defaultQueryCriteria;
	qc.in_time_start = (new Date()).DateAdd("m", -3).Format("YYYY-MM-DD");
	qc.in_time_end = (new Date()).Format("YYYY-MM-DD");
	qc.qp = this.getQueryParameter();
	return true;
};

Report.prototype.initTags = function () {
	var tags = {};
	$.extend(tags, this.tags);
	tags.storage = "storage";
	tags.kind = "kind";
	tags.asset_name = "asset_name";
	tags.brand = "brand";
	tags.model = "model";
	tags.in_time_start = "in_time_start";
	tags.in_time_end = "in_time_end";
	tags.contract_code = "contract_code";
	this.tags = tags;
	return true;
};

RptStock.prototype.initBody = function () {
	var piThis = this;

	var $storage = $("#" + this.tags.storage);
	$storage.append(this.storage.getComboBoxList());

	var $kind = $("#" + this.tags.kind);
	$kind.append(this.asset_kinds.getComboBoxList());
	$kind.change(function () {
		$asset_name = $("#" + piThis.tags.asset_name);
		$asset_name.children().remove();
		$asset_name.append(piThis.asset_kinds.getComboBoxList(this.value, "<option value=''>选择设备名称</option>"));
	});

	$brand = $("#" + this.tags.brand);
	$brand.append(this.asset_brand.getComboBoxList());
	$brand.change(function () {
		$model = $("#" + piThis.tags.model);
		$model.children().remove();
		$model.append(piThis.asset_brand.getComboBoxList(this.value, "<option value=''>选择设备型号</option>"));
	});

	$("a[excel_export]").click(function() {
		var arr = piThis.getSearchCriteria();
		$("a[excel_export]").attr("href", piThis.route+"/export?"+$.param(arr));
	});
};

RptStock.prototype.beforeInitialize = function () {
	this.setDefaultQueryCriteria();
	this.initTags();
};

RptStock.prototype.getSearchCriteria = function () {
	var qc = {};
	$.extend(qc, this.defaultQueryCriteria);
	qc.storage = $("#" + this.tags.storage).val();
	qc.kind = $("#" + this.tags.kind).val();
	qc.asset_name = $("#" + this.tags.asset_name).val();
	qc.brand = $("#" + this.tags.brand).val();
	qc.model = $("#" + this.tags.model).val();
	qc.in_time_start = $("#" + this.tags.in_time_start).val();
	qc.in_time_end = $("#" + this.tags.in_time_end).val();
	qc.contract_code = $("#" + this.tags.contract_code).val();
	return qc;
};

RptStock.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "# ID"));
	ret.push(new TableHead("", "行名"));
	ret.push(new TableHead("", "合同编号"));
	ret.push(new TableHead("", "供应商"));
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "设备型号"));
	ret.push(new TableHead("", "入库时间"));
	ret.push(new TableHead("", "设备总量"));
	ret.push(new TableHead("", "现库存数量"));
	ret.push(new TableHead("", "设备单价"));
	this._heads = ret;
	return ret;
};

RptStock.prototype.buildRow = function (data, parentPath, ret) {
	var len = data.length;
	var i = 0;
	var item;
	for (i = 0; i < len; i++) {
		item = data[i];
		ret.push("<tr rid='", i, "'>");
		ret.push("<td>", i, "</td>");
		ret.push("<td>", item.storage_name, "</td>");
		ret.push("<td>", item.contract_code, "</td>");
		ret.push("<td>", item.supplier, "</td>");
		ret.push("<td>", item.kind_name, "</td>");
		ret.push("<td>", item.brand_name, "</td>");
		ret.push("<td>", item.in_time, "</td>");
		ret.push("<td>", item.totalCount, "</td>");
		ret.push("<td>", item.inCount, "</td>");
		ret.push("<td>", item.price, "</td>");
		ret.push("</tr>");
	}
	return true;
};

RptStock.prototype.setQueryParameter = function () {
	var qp = this.defaultQueryParameter();
	qp["deep"] = 0;
	qp["exceptDelete"] = 1;
	qp["groupByInCode"] = 0;
	qp["orderByUpdateAt"] = 0;
	qp["withOrganization"] = 0;
	qp["withStorage"] = 0;
	qp["withOperator"] = 0;
	qp["withUser"] = 0;
	qp["withUnit"] = 0;
	qp["withKind"] = 0;
	qp["withBrand"] = 0;
	return qp;
};

var _thisMgr = null;
function thisMgr() {
	if (_thisMgr) return _thisMgr;
	var ret = new RptStock("stock");
	_thisMgr = ret;
	return ret;
}
