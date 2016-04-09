function UserMgr(instance) {
	this.instance = instance;
	this.route = this.route + "/" + instance;
}

UserMgr.prototype = new Management("equ");
UserMgr.prototype.parameters = ["user"];
UserMgr.prototype.initialize = function () {
	this.beforeInitialize();
	this.finishInitialize();
	this.afterInitialize();
	return true;
};
UserMgr.prototype.initData = function () {

};

var _thisMgr = null;
function thisMgr() {
	if (_thisMgr) return _thisMgr;

	var ret = new UserMgr("home");
	_thisMgr = ret;
	return ret;
}

function onPageLoad() {
	thisMgr().initialize();
	return true;
}
