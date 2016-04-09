function UnitMgr(instance) {
	if (typeof instance == "undefined") instance = "unit";
	this.instance = instance;
	this.route = this.route + "/" + instance;
};

UnitMgr.prototype = new Management();
UnitMgr.prototype.parameters = ["user"];

UnitMgr.prototype.cacheData = function (data) {
	this.data = data;
	return true;
};

UnitMgr.prototype.itemData = function (id) {
	return this.data.map[id];
};

//UnitMgr.prototype.onAllDataArrival = function (data) {
//	if (data) this.cacheData(data);
	
//	var html = [];
//	var ids = [];
//	html.push("<table id='tblList' class='treetable datagrid-htable'>");
//	html.push("<thead>");
//	this.buildHead(html);
//	html.push("</thead>");
//	html.push("</tbody>");
//	this.buildRow(this.data, ids, html);
//	html.push("</tbody>");
//	html.push("</table>");
	
//	$("#" + this.containerId).html(html.join(""));

//	this.applyDataTable();
	
//	return true;
//};

UnitMgr.prototype.applyDataTable = function () {	
	var piThis = this;
	$("#" + this.tableId + " a[" + this.btnDel + "]").click(function () {
		var id = $(this).attr("id");
		return piThis.popModalDel(id);
	});
	return true;
};

UnitMgr.prototype.buildRow = function (data, parentPath, ret) {
	for (var i = 0; i < data.length; i++) {
		ret.push("<tr>");
		ret.push("<td>#</td>");
		ret.push("<td>", data[i].name, "</td>");
		ret.push("<td>");
		ret.push("<a id='", data[i].id, "' ", this.btnDel, " href='javascript:void(0)'><img alt='' src='../assets/images/delete.png'></a>");
		ret.push("</td>");
		ret.push("</tr>");
	}
	return true;
};

UnitMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "序号"));
	ret.push(new TableHead("", "计量单位名称"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

UnitMgr.prototype.getEquEditBody = function (_token, act, id, father_id) {
	var html = [];
	html.push("<form action='' class='am-form'>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", id, "'>");
	html.push("<input type='hidden' name='act' value='", act, "' />");
	html.push("<input type='hidden' name='father_id' value='", father_id, "' />");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text js-ajax-validate' type='text' name='name' placeholder='品牌名称' required />");
	html.push("</div>");
	html.push("<div class='am-form-group' style='text-align: right;'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
	html.push("</div>");
	html.push("</form>");
	return html.join("");
};

UnitMgr.prototype.drawModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	var $tr = this.getSelectedItem();
	var father_id = ($tr.length == 0 ? 0 : $tr.attr("data-tt-id"));
	$(containerId).html(this.getEquEditBody(_token, this.act, "", father_id));	
	return true;
};

UnitMgr.prototype.initModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var father_id = $(containerId + " form input[name='father_id']").val();
	var names = ["台", "个", "只", "件"];
	$(containerId + " form input[name='name']").val(names[getRandomNum(1, 4) - 1]);	
	return true;
};

UnitMgr.prototype.sendDataForAdd = function () {
	var frmData = new FormData($("#" + this.mdlAddContainerId + " form")[0]);
	return frmData;
};

UnitMgr.prototype.sendDataForDel = function () {
	var frmId = "#" + this.mdlDelContainerId;
	var unit = {};
	unit.id = $(frmId + " input[name='id']").val();
	return unit;
};

UnitMgr.prototype.validOptionsForAdd = function () {
	var piThis = this;
	var opt = baseFormValidationOption();
	opt.submit = function () {
		var formValidity = this.isFormValid();
		if (typeof formValidity === "boolean") {
			if (formValidity) {
		    	piThis.submitModalAdd();
			}
		} else {
			$.when(formValidity).then(function() {
			    piThis.submitModalAdd();
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
					var data = {};
					data.val = val;
					data.id = 0;
					data.fid = this.$element.find("input[name='father_id']").val();
					var thisOpt = this;
					return $.ajax({
						url: piThis.route + '/valid',
						cache: false,
						data: data,
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
	};
	return opt;
};

UnitMgr.prototype.initBody = function () {
	var piThis = this;

	$("a[btnaddunit]").click(function () {
		piThis.popModalAdd();
		return true;
	});
};

UnitMgr.prototype.initData = function () {
	var piThis = this;

	$.ajax({
		url: "management-unit/all",
		cache: false,
		async: false,
		dataType: 'json'
	}).then(function(data) {
		piThis.cacheData(data);
		piThis.onAllDataArrival();
		return true;
	}, function() {
		alert("请求失败！")
	});
};

var _unitMgr = null;
function thisMgr() {
	if (_unitMgr) return _unitMgr;
	var ret = new UnitMgr("unit");
	_unitMgr = ret;
	return ret;

	ret.action = action();
	ret.tableId = "tblUnits";
	ret.containerId = "divUnitsContainer";
	ret.modalId = "mdlUnitMgr";
	ret.delModalId = "mdlRemoveUnit";
	
	ret.validOptions = {
		submit: function () {
			return this.isFormValid();
		},
		validate: function (validity) {
			var val = $(validity.field).val().trim();
			if ($(validity.field).is('.js-ajax-validate')) {
		        validity.valid = (val.length > 0);
		        if (validity.valid) {
			    	return $.ajax({
						url: 'management/unit/valid?val=' + val,
						cache: false, //实际使用中请禁用缓存
						dataType: 'json'
			        }).then(function(data) {
				        validity.valid = (parseInt(data, 10) == 0);
			          	return validity;
			        }, function() {
				        validity.valid = false;
			          	return validity;
			        });   
		        }
	      	} else {
		      	validity.valid = (val.length > 0);
	      	}
		}
	};

	ret.updValidOptions = {
		submit: function () {
			return this.isFormValid();
		},
		validate: function (validity) {
			var val = $(validity.field).val().trim();
		    validity.valid = (val.length > 0);
		}
	};

	ret.buildRow = function (data, parentPath, ret) {
		for (var i = 0; i < data.length; i++) {
			ret.push("<tr>");
			ret.push("<td>#</td>");
			ret.push("<td>", data[i].name, "</td>");
			ret.push("<td>");
			ret.push("<a id='", data[i].id, "' btndeleteunit href='javascript:void(0)'><img alt='' src='../assets/images/delete.png'></a>");
			ret.push("</td>");
			ret.push("</tr>");
		}
	};

	ret.initModal = function (act) {
		var mdlId = "#" + this.modalId;
		var names = ["台", "个", "只", "件"];
		$(mdlId + " form input[name='name']").val(names[getRandomNum(1, 4) - 1]);
		return true;
	};

	ret.onAllDataArrival = function (data) {
		//$("#" + this.containerId).html("");
		this.data = data;
		$("#" + this.tableId + " tbody tr").remove();

		var html = [];
		var ids = [];

		this.buildRow(data, ids, html);

		$("#" + this.tableId + " tbody").append(html.join(""));

		$("#" + this.tableId + " tbody td a[btndeleteunit]").unbind("click");
		$("#" + this.tableId + " tbody td a[btndeleteunit]").click(onDeleteClick);
		
		return true;
	};
	
	_unitMgr = ret;
	
	return ret;
}

//var _action = null;
//function action() {
//	if (_action) return _action;
//	var ret = {};
//	ret.add = 1;
//	ret.upd = 2;
//	ret.del = 3;
//	_action = ret;
//	return ret;
//}

//function on_management_unit_load() {
//	var mgr = thisMgr();
	
//	$.get("management-unit/all", {}, function (data) {
//		mgr.onAllDataArrival.call(mgr, data)
//		return true;
//	});

//	$("a[btnaddunit]").click(onAddClick);
	
//	return true;
//}

function onAddClick() {
	var mgr = thisMgr();
	var jqTR = mgr.getSelectedItem();
	var act = action().add;
	if (jqTR.length > 0) {
		mgr.popModal(act, false, jqTR.attr("data-tt-id"));
	} else {
		mgr.popModal(act, true);
	}
	return true;
}

function onEditClick() {
	var mgr = thisMgr();
	var id = $(this).attr("id");
	var org = mgr.data.map[id];
	var parentId  = org.father_id;
	var act = action().upd;
	if (parentId == 0) {
		mgr.popModal(act, true, parentId, id);
	} else {
		mgr.popModal(act, false, parentId, id);
	}
	return true;
}

function onDeleteClick() {
	var mgr = thisMgr();
	var winId = "#" + mgr.delModalId;
	$(winId).modal({
		relatedTarget: this,
		onConfirm: function(options) {
			var id = $(this.relatedTarget).attr('id');	
			$.get("management/unit/del", {idList: id}, cbDelUnit, "json");
		},
		closeOnConfirm: false
	});
	//alert("del");
	return true;
}

function cbDelUnit(data) {
	var mgr = thisMgr();
	mgr.onAllDataArrival(data);
	$('#' + mgr.delModalId).modal("close");
	return true;
}