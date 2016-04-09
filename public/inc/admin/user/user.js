function UserMgr(instance) {
    if (!instance) instance = "user";
    this.instance = instance;
    this.route = this.route + '/' + instance;
}

UserMgr.prototype = new AdminMgr();

UserMgr.prototype.organizationTree = function () {
    if (this._organizationTree) return this._organizationTree;
    var retVal = new OrganizationMenueTree("divOrgTree", "orgTree", "user-organization", "organization_id");
    this._organizationTree = retVal;
    return retVal;
};

UserMgr.prototype.initData = function () {
    var piThis = this;

    var $input = $("#user-organization");
    if ($input.length > 0) {
        $input.unbind("click");
        $input.click(function () {
            piThis.organizationTree().show();
        });
    }
};