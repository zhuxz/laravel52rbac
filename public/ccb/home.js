function EquipmentHome(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

EquipmentHome.prototype = new EquMgr("equ");
EquipmentHome.prototype.parameters = ["user"];
EquipmentHome.prototype.initBody = function () {
	var user = this.userInfo;
	var flag = false;

	if (!flag && user.permissionMap["account_manage"]) {
		$("div[system-management] a").attr("href", "account");
		flag = true;
	}

	if (!flag && user.permissionMap["account_group_manage"]) {
		$("div[system-management] a").attr("href", "account-group");
		flag = true;
	}

	if (!flag && user.permissionMap["organization_manage"]) {
		$("div[system-management] a").attr("href", "management-organization");
		flag = true;
	}

	if (!flag && user.permissionMap["asset_type_manage"]) {
		$("div[system-management] a").attr("href", "management-equipment");
		flag = true;
	}

	if (!flag && user.permissionMap["brand_manage"]) {
		$("div[system-management] a").attr("href", "brand");
		flag = true;
	}

	if (!flag && user.permissionMap["unit_manage"]) {
		$("div[system-management] a").attr("href", "management-unit");
		flag = true;
	}

	flag = false;

	if (!flag && user.permissionMap["asset_in"]) {
		flag = true;
	}

	if (!flag && user.permissionMap["asset_accept"]) {
		$(".admin-content-list-zj li").eq(1).children().attr("href", "equipment-accept");
		flag = true;
	}

	if (!flag && user.permissionMap["asset_out"]) {
		$("div[equipment-management] a").attr("href", "out-equipment");
		flag = true;
	}

	if (!flag && user.permissionMap["asset_pool_allot"]) {
		$("div[equipment-management] a").attr("href", "allocation-equipment");
		flag = true;
	}
};

EquipmentHome.prototype.initData = function () {

};

var _thisMgr = null;
function thisMgr() {
	if (_thisMgr) return _thisMgr;

	var ret = new EquipmentHome("home");
	_thisMgr = ret;
	return ret;
}

function onPageLoad() {
	thisMgr().initialize();
	return true;
}
