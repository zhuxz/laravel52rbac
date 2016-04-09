function OrganizationMgr(instance) {
	if (typeof instance == "undefined") instance = "organization";
	this.instance = instance;
	this.route = this.route + "/" + instance;
};

OrganizationMgr.prototype = new Management();
OrganizationMgr.prototype.parameters = ["user"];

OrganizationMgr.prototype.cacheData = function (data) {
	this.data = constructTreeData(data);
	return true;
};

OrganizationMgr.prototype.itemData = function (id) {
	return this.data.map[id];
};

OrganizationMgr.prototype.onAllDataArrival = function (data) {
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

Management.prototype.applyDataTable = function () {	
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

OrganizationMgr.prototype.buildRow = function (data, parentPath, ret) {
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
		ret.push("<td><span class='", (len > 0 ? "" : ""), "'>", data.name, "</span></td>");
		ret.push("<td>", data.code, "</td>");
		ret.push("<td>", data.director, "</td>");
		ret.push("<td>", data.mobile, "</td>");
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

OrganizationMgr.prototype.getHeads = function () {
	if (this._heads) return this._heads;
	var ret = [];
	ret.push(new TableHead("", "分行名称"));
	ret.push(new TableHead("", "机构代码"));
	ret.push(new TableHead("", "联系人"));
	ret.push(new TableHead("", "联系方式"));
	ret.push(new TableHead("", "操作"));
	this._heads = ret;	
	return ret;
};

OrganizationMgr.prototype.getEquEditBody = function (_token, act, id, father_id) {
	var html = [];
	html.push("<form action='' class='am-form'>");
	html.push("<input type='hidden' name='_token' value='", _token, "'>");
	html.push("<input type='hidden' name='id' value='", id, "'>");
	html.push("<input type='hidden' name='act' value='", act, "' />");
	html.push("<input type='hidden' name='father_id' value='", father_id, "' />");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text js-ajax-validate' type='text' name='org_name' placeholder='分行名称' required />");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text' type='text' name='org_code' placeholder='机构代码' required />");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text' type='text' name='director' placeholder='联系人' required />");
	html.push("</div>");
	html.push("<div class='am-form-group'>");
	html.push("<input class='modal-text' type='text' name='mobile' placeholder='联系方式' required />");
	html.push("</div>");
	html.push("<div class='am-form-group' style='text-align: right;'>");
	html.push("<button type='submit' class='am-btn am-btn-default search_btn'>确定</button>");
	html.push("</div>");
	html.push("</form>");
	return html.join("");
};

OrganizationMgr.prototype.drawModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	var $selected_tr = this.getSelectedItem();
	var $all_tr = $("#" + this.tableId + " tbody tr");
	var father_id = 0;
	if ($all_tr.length > 0 && $selected_tr.length > 0) {
		father_id = $selected_tr.attr("data-tt-id");
		$(containerId).html(this.getEquEditBody(_token, this.act, "", father_id));
	} else if ($all_tr.length > 0 && $selected_tr.length == 0) {
		alert("请选择一个机构！");
		return false;
	} else if ($all_tr.length == 0 && $selected_tr.length == 0) {
		$(containerId).html(this.getEquEditBody(_token, this.act, "", 0));
	}

	return true;
};

OrganizationMgr.prototype.drawModalUpd = function (id) {
	var containerId = "#" + this.mdlUpdContainerId + " div.am-modal-dialog div.am-modal-bd";
	var _token = $(containerId + " form input[name='_token']").val();
	var father_id = this.itemData(id).father_id;
	$(containerId).html(this.getEquEditBody(_token, this.act, id, father_id));	
	return true;
};

OrganizationMgr.prototype.initModalAdd = function () {
	var containerId = "#" + this.mdlAddContainerId + " div.am-modal-dialog div.am-modal-bd";
	var father_id = $(containerId + " form input[name='father_id']").val();
	
	var names = ["高新支行", "蜀山支行", "肥西支行", "肥东支行"];
	var directors = ["张三三", "李四", "王二", "Messi"];
	var departments = ["营销部", "人事部", "后勤部", "安保部"];
	if (father_id == 0) {
		$(containerId + " form input[name='org_name']").attr("placeholder", "分行名称");
		$(containerId + " form input[name='org_name']").val(names[getRandomNum(1, 4) - 1]);
	} else {
		$(containerId + " form input[name='org_name']").val(departments[getRandomNum(1, 4) - 1]);
		$(containerId + " form input[name='org_name']").attr("placeholder", "部门名称");
	}
	$(containerId + " form input[name='org_code']").val("JGDM-" + generateMixed(4));
	$(containerId + " form input[name='director']").val(directors[getRandomNum(1, 4) - 1]);
	$(containerId + " form input[name='mobile']").val(getRandomNum(12000000000, 19000000000));
	
	return true;
};

OrganizationMgr.prototype.initModalUpd = function (id) {
	var item = this.itemData(id);
	var containerId = "#" + this.mdlUpdContainerId + " div.am-modal-dialog div.am-modal-bd";
	
	if (item.father_id == 0) {
		$(containerId + " form input[name='org_name']").attr("placeholder", "分行名称");
		$(containerId + " form input[name='org_name']").val(item.name);
	} else {
		$(containerId + " form input[name='org_name']").attr("placeholder", "部门名称");
		$(containerId + " form input[name='org_name']").val(item.name);
	}
	$(containerId + " form input[name='org_code']").val(item.code);
	$(containerId + " form input[name='director']").val(item.director);
	$(containerId + " form input[name='mobile']").val(item.mobile);
	
	return true;
};

//OrganizationMgr.prototype.sendDataForAdd = function () {
//	var frmData = new FormData($("#" + this.mdlAddContainerId + " form")[0]);
//	return frmData;
//	//var frmId = "#" + this.mdlAddContainerId + " form";
//	//var org = {};
//	//org._token = $(frmId + " input[name='_token']").val();
//	//org.id = $(frmId + " input[name='id']").val();
//	//org.act = $(frmId + " input[name='act']").val();
//	//org.father_id = $(frmId + " input[name='father_id']").val();
//	//org.org_name = $(frmId + " input[name='org_name']").val().trim();
//	//org.director = $(frmId + " input[name='director']").val().trim();
//	//org.mobile = $(frmId + " input[name='mobile']").val().trim();
//	//org.org_code = $(frmId + " input[name='org_code']").val().trim();
//	//return org;
//};

//OrganizationMgr.prototype.sendDataForUpd = function () {
//	var frmId = "#" + this.mdlUpdContainerId + " form";
//	var org = {};
//	org._token = $(frmId + " input[name='_token']").val();
//	org.id = $(frmId + " input[name='id']").val();
//	org.act = $(frmId + " input[name='act']").val();
//	org.father_id = $(frmId + " input[name='father_id']").val();
//	org.org_name = $(frmId + " input[name='org_name']").val().trim();
//	org.director = $(frmId + " input[name='director']").val().trim();
//	org.mobile = $(frmId + " input[name='mobile']").val().trim();
//	org.org_code = $(frmId + " input[name='org_code']").val().trim();
//	return org;
//};

OrganizationMgr.prototype.sendDataForDel = function () {
	var frmId = "#" + this.mdlDelContainerId;
	var org = {};
	org.id = $(frmId + " input[name='id']").val();
	
	var item = this.data.map[org.id];
	var ids = [];
	if (item) {
		getTreeDataChildIds(item, ids);
	}

	org.idList = ids.join(",");
	
	return org;
};

OrganizationMgr.prototype.validOptionsForAdd = function () {
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
				if (isRequired) validity.valid = (val.length > 0);
			}
		}
	}
	return opt;
};

OrganizationMgr.prototype.validOptionsForUpd = function () {
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
				if (isRequired) validity.valid = (val.length > 0);
			}
		}
	};
	return opt;
};

OrganizationMgr.prototype.initBody = function () {
	var piThis = this;

	$("button[" + this.btnAdd + "]").click(function () {
		piThis.popModalAdd();
		return true;
	});
};

OrganizationMgr.prototype.initData = function () {
	var piThis = this;

	$.ajax({
		url: "management-organization/all",
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

var _organizationMgr = null;
function thisMgr() {
	if (_organizationMgr) return _organizationMgr;
	var ret = new OrganizationMgr("organization");
	_organizationMgr = ret;
	return ret;
}