function RoleCreate(instance) {
    if (!instance) instance = "create";
    this.instance = instance;
    this.route = this.route + '/' + instance;
}

RoleCreate.prototype = new RoleMgr();

var _thisMgr = null;
function thisMgr() {
    if (_thisMgr) return _thisMgr;
    var ret = new RoleCreate();
    _thisMgr = ret;
    return ret;
}