function AdminMgr(instance) {
    if (!instance) instance = "admin";
    this.instance = instance;
    this.route = instance;
}

AdminMgr.prototype = new Management();

AdminMgr.prototype.initialize = function () {
    this.beforeInitialize();
    this.finishInitialize();
    this.afterInitialize();
    return true;
};