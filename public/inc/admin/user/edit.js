function EditMgr(instance) {
    if (!instance) instance = "edit";
    this.instance = instance;
    this.route = this.route + '/' + instance;
}

EditMgr.prototype = new UserMgr();
EditMgr.prototype.parameters = ["organizations"];

EditMgr.prototype.initialize = function () {
    var piThis = this;

    this.beforeInitialize();

    $.ajax({
        url: window.location.pathname,
        cache: false,
        //async: false,
        data: this.getParameters(),
        dataType: 'json'
    }).then(function(data) {
        if (data.organizations) piThis.organizations = new Organization(data.organizations);

        var org = piThis.organizations.root;
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
    var ret = new EditMgr();
    _thisMgr = ret;
    return ret;
}