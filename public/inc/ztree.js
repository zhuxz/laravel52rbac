function PopMenuTreeOptions() {
	return {
		check: {
			enable: true,
			chkStyle: "radio",
			radioType: "all"
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		view: {
			showIcon: false
		}
	};
}

function PopMenuTree(id) {	
	return this;
}

PopMenuTree.prototype = {
	targetId: "menuTarget",
	containerId: "menuContent",	
	treeId: "menuTree",
	zNodes: [],
	setting: PopMenuTreeOptions(),

	beforeShow: function () {
		return true;
	},
	show: function () {
		if (!this.beforeShow()) return false;
		
		var piThis = this;
		var $target = $("#" + this.targetId);
		var offSet = $target.offset();
		var $container = $("#" + this.containerId);	
		$container.css({left:offSet.left + "px", top:offSet.top + $target.outerHeight() + "px"}).slideDown("fast");
		$container.css({width: $target.outerWidth() + "px"});

		$("body").bind("mousedown", function (piEvent) {
			piThis.onBodyDown.call(piThis, piEvent);
			return true;
		});
		
		return true;
	},
	hide: function () {
		var piThis = this;
		$("#" + this.containerId).fadeOut("fast");
		$("body").unbind("mousedown", function (piEvent) {
			piThis.onBodyDown.call(piThis, piEvent);
			return true;
		});
		
		return true;
	},
	onBodyDown: function (piEvent) {
		if (!(piEvent.target.id == this.targetId || piEvent.target.id == this.containerId || $(piEvent.target).parents("#" + this.containerId).length>0)) {
			this.hide();
		}
		return true;
	},
	setDefault: function (id) {
		var zNodes = this.zNodes;
		for (var i = 0; i < zNodes.length; i++) {
			if (zNodes[i].id == id) {
				zNodes[i].checked = true;
				break;
			}
		}
		return true;
	},
	export: function (e, treeId, treeNode) {
		var $target = $("#" + this.targetId);
		if (treeNode) {
			$target.val(treeNode.name);
			if (this.dest) {
				$("#" + this.dest).val(treeNode.id);
			} else {
				$target.attr("releasevalue", treeNode.id);
			}
		} else {
			$target.val("");
			if (this.dest) {
				$("#" + this.dest).val("");
			} else {
				$target.attr("releasevalue", "");
			}
		}		
		$target.trigger("blur");
		return true;
	}
};