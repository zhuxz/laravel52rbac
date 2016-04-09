function CreateMgr(instance) {
    if (!instance) instance = "create";
    this.instance = instance;
    this.route = this.route + '/' + instance;
}

CreateMgr.prototype = new UserMgr();
CreateMgr.prototype.parameters = ["organizations"];

CreateMgr.prototype.initialize = function () {
    var piThis = this;

    this.beforeInitialize();

    $.ajax({
        url: "/" + this.route,
        cache: false,
        //async: false,
        data: this.getParameters(),
        dataType: 'json'
    }).then(function(data) {
        if (data.organizations) piThis.organizations = new Organization(data.organizations);

        var org = piThis.organizations.item(1);
        piThis.organizationTree().init(org);
        piThis.initData();
        piThis.finishInitialize();
        ret =  true;
    }, function() {
        alert("初始化页面失败！");
        piThis.finishInitialize();
        ret =  false;
    });

    this.afterInitialize();

    return true;
};

var _thisMgr = null;
function thisMgr() {
    if (_thisMgr) return _thisMgr;
    var ret = new CreateMgr();
    _thisMgr = ret;
    return ret;
}