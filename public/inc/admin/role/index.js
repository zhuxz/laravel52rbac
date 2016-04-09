function RoleIndex(instance) {
    if (!instance) instance = "index";
    this.instance = instance;
    this.route = this.route + '/' + instance;
}

RoleIndex.prototype = new RoleMgr();

RoleIndex.prototype.afterInitialize = function () {
    var piThis = this;
    $btnDel = $("a[btndel]");
    $btnDel.unbind("click");
    $btnDel.click(function (piEvent) {
        piThis.popModalDel(this.getAttribute("url"));
        stopPropagation(piEvent);
    });
};

RoleIndex.prototype.submitModalDel = function () {
    var piThis = this;
    var url = $("#" + this.mdlDelContainerId + " input[name='id']").val();
    $.ajax({
        url: url,
        async: false,
        type: "DELETE"
    }).done(function (data) {
        $("#" + piThis.mdlDelContainerId).modal("close");
        if (data.status == 1) {
            alert("用户删除成功.");
            window.location.reload();
        } else if (data.status == -1) {
            alert("请求失败.");
        } else {
            alert("请求失败.");
        }
    }).fail(function () {
        $("#" + piThis.mdlDelContainerId).modal("close");
        alert("请求失败.");
    });
    return true;
};

var _thisMgr = null;
function thisMgr() {
    if (_thisMgr) return _thisMgr;
    var ret = new RoleIndex();
    _thisMgr = ret;
    return ret;
}