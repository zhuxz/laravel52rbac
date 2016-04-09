function EquipmentMgr(instance) {
	if (typeof instance == "undefined") instance = "equipment";
	this.instance = instance;
	this.route = this.route + "/" + instance;
};

EquipmentMgr.prototype = new Management();
EquipmentMgr.prototype.parameters = ["user"];

EquipmentMgr.prototype.cacheData = function (data) {
	this.data = constructTreeData(data);
	return true;
};

EquipmentMgr.prototype.itemData = function (id) {
	return this.data.map[id];
};

EquipmentMgr.prototype.onAllDataArrival = function (data) {
	if (data) this.cacheData(data);
	
	var html = [];
	var ids = [];
	html.push("<table id='tblList' width='100%' table-layout='fixed' class='am-table am-text-nowrap zj-table'>");
	html.push("<thead>");
	this.buildHead(html);
	html.push("</thead>");
	html.push("</tbody>");
	this.buildRow(this.data.root, ids, html);
	html.push("</tbody>");
	html.push("</table>");
	
	$("#" + this.containerId).html(html.join(""));

	this.applyDataTable();
	
	return true;
};

EquipmentMgr.prototype.applyDataTable = function () {	
	var piThis = this;
	
	$("#" + this.tableId).treetable({ expandable: true });

	$("#" + this.tableId + " tbody").on("mousedown", "tr", function() {
		$(".selected").not(this).removeClass("selected");
		$(this).toggleClass("selected");
	});
	
	$("#" + this.tableId + " button[" + this.btnUpd + "]").click(function () {
		var id = $(this).attr("id");
		return piThis.popModalUpd(id);
	});

	$("#" + this.tableId + " button[" + this.btnDel + "]").click(function () {
		var id = $(this).attr("id");
		return piThis.popModalDel(id);
	});

	setTimeout(function () {
		$("#" + piThis.tableId).treetable("expandNode", "1");
		//$("#" + piThis.tableId).treetable("expandNode", "1021");
	}, 20);

	return true;
};

EquipmentMgr.prototype.buildRow = function (data, parentPath, ret) {
	var children;
	var len = 0;
	
	if (data.children && data.children.length > 0) {
		children = data.children;
		len = children.length;
	}

	if (data.id) {
		var path = parentPath.concat(data.id);
		if (parentPath.length == 0) {
			ret.push("<tr data-tt-id='", data.id, "'>");			
		} else {
			ret.push("<tr data-tt-id='", data.id, "'");
			ret.push(" data-tt-parent-id='", parentPath[parentPath.length - 1], "'");
			ret.push(">")
		}		
		ret.push("<td><span>", data.name, "</span></td>");
		ret.push("<td><div class='am-btn-toolbar'><div class='am-btn-group am-btn-group-sm'>");
		ret.push("<button ", this.btnUpd, " id='", data.id, "' class='am-btn am-btn-default am-btn-sm am-text-secondary' style=''><span class='am-icon-pencil-square-o' style='padding:0px'></span> 修改</button>");
		ret.push("<button ", this.btnDel, " id='", data.id, "' class='am-btn am-btn-default am-btn-sm am-text-danger am-hide-sm-only' style=''><span class='am-icon-trash-o' style='padding:0px'></span> 删除</button>");
		ret.push("</div></div></td>");
		ret.push("</tr>");

		for (var i = 0; i < len; i++) {
			this.buildRow(children[i], path, ret);
		}
	} else {
		parentPath = [];
		for (var i = 0; i < len; i++) {
			this.buildRow(children[i], parentPath, ret);
		}
	}
	return true;
};

EquipmentMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "设备名称"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

EquipmentMgr.prototype.getEquEditBody = function (_token, act, id, father_id) {
	var html = [];
	html.push("<form action='' class='am-form'>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", id, "'>");
	html.push("<input type='hidden' name='act' value='", act, "' />");
	html.push("<input type='hidden' name='father_id' value='", father_id, "' />");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text js-ajax-validate' type='text' name='name' placeholder='设备名称' required />");
	html.push("</div>");
	html.push("<div class='am-form-group' style='text-align: right;'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
	html.push("</div>");
	html.push("</form>");
	return html.join("");
};

EquipmentMgr.prototype.drawModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();

	var $selected_tr = this.getSelectedItem();
	var $all_tr = $("#" + this.tableId + " tbody tr");
	var father_id = 0;
	if ($all_tr.length > 0 && $selected_tr.length > 0) {
		father_id = $selected_tr.attr("data-tt-id");
		$(containerId).html(this.getEquEditBody(_token, this.act, "", father_id));
	} else if ($all_tr.length > 0 && $selected_tr.length == 0) {
		alert("请选择一个设备！");
		return false;
	} else if ($all_tr.length == 0 && $selected_tr.length == 0) {
		$(containerId).html(this.getEquEditBody(_token, this.act, "", 0));
	}

	//var $tr = this.getSelectedItem();
	//var father_id = ($tr.length == 0 ? 0 : $tr.attr("data-tt-id"));
	//$(containerId).html(this.getEquEditBody(_token, this.act, "", father_id));
	return true;
};

EquipmentMgr.prototype.drawModalUpd = function (id) {
	var containerId = "#" + this.mdlUpdContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	var father_id = this.itemData(id).father_id;
	$(containerId).html(this.getEquEditBody(_token, this.act, id, father_id));	
	return true;
};

EquipmentMgr.prototype.initModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var father_id = $(containerId + " form input[name='father_id']").val();
	var names = ["微型机", "办公用品", "耗材", "服装"];
	$(containerId + " form input[name='name']").val(names[getRandomNum(1, 4) - 1]);	
	return true;
};

EquipmentMgr.prototype.initModalUpd = function (id) {
	var item = this.itemData(id);
	var containerId = "#" + this.mdlUpdContainerId + " div.am-modal-dialog div.am-modal-bd";
	$(containerId + " form input[name='name']").val(item.name);
	return true;
};

//EquipmentMgr.prototype.sendDataForAdd = function () {
//	var frmData = new FormData($("#" + this.mdlAddContainerId + " form")[0]);
//	return frmData;
//	//var frmId = "#" + this.mdlAddContainerId + " form";
//	//var equipment = {};
//	//equipment._token = $(frmId + " input[name='_token']").val();
//	//equipment.id = $(frmId + " input[name='id']").val();
//	//equipment.act = $(frmId + " input[name='act']").val();
//	//equipment.father_id = $(frmId + " input[name='father_id']").val();
//	//equipment.name = $(frmId + " input[name='name']").val().trim();
//	//return equipment;
//};

//EquipmentMgr.prototype.sendDataForUpd = function () {
//	var frmId = "#" + this.mdlUpdContainerId + " form";
//	var equipment = {};
//	equipment._token = $(frmId + " input[name='_token']").val();
//	equipment.id = $(frmId + " input[name='id']").val();
//	equipment.act = $(frmId + " input[name='act']").val();
//	equipment.father_id = $(frmId + " input[name='father_id']").val();
//	equipment.name = $(frmId + " input[name='name']").val().trim();
//	return equipment;
//};

EquipmentMgr.prototype.sendDataForDel = function () {
	var frmId = "#" + this.mdlDelContainerId;
	var equipment = {};
	equipment.id = $(frmId + " input[name='id']").val();
	
	var item = this.itemData(equipment.id);
	var ids = [];
	if (item) {
		getTreeDataChildIds(item, ids);
	}

	equipment.idList = ids.join(",");
	
	return equipment;
};

EquipmentMgr.prototype.validOptionsForAdd = function () {
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
	}
	return opt;
};

EquipmentMgr.prototype.validOptionsForUpd = function () {
	var piThis = this;
	var opt = baseFormValidationOption();
	opt.submit = function () {
		var formValidity = this.isFormValid();
		if (typeof formValidity === "boolean") {
			if (formValidity) {
		    	piThis.submitModalUpd();
			}
		} else {
			$.when(formValidity).then(function() {
			    piThis.submitModalUpd();
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
				if ((val.length > 0)) {
					var data = {};
					data.val = val;
					data.fid = this.$element.find("input[name='father_id']").val();
					data.id = this.$element.find("input[name='id']").val();
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
	}
	return opt;
};

EquipmentMgr.prototype.initUser = function () {

};

EquipmentMgr.prototype.initBody = function () {
	var piThis = this;

	$("button[" + this.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});
};

EquipmentMgr.prototype.initData = function () {
	var piThis = this;

	$.ajax({
		url: "management-equipment/all",
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

var _equipmentMgr = null;
function thisMgr() {
	if (_equipmentMgr) return _equipmentMgr;
	var ret = new EquipmentMgr();
	_equipmentMgr = ret;	
	ret.mdlUpdContainerId = ret.mdlAddContainerId;
	return ret;
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