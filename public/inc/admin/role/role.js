function RoleMgr(instance) {
    if (!instance) instance = "role";
    this.instance = instance;
    this.route = this.route + '/' + instance;
}

RoleMgr.prototype = new AdminMgr();

RoleMgr.prototype.initData = function () {
};