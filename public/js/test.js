

function onPageInit() {
	alert("asdfasdfasdf");
	return true;
}

function onValid() {
	
	return true;
}

function showModal() {
	var opt = baseFormValidationOption();

	opt.submit = function () {
		var ret = this.isFormValid();
		//$(validationToolTip()).show();
		console.log("valid=" + ret);
		return false;
	};
	opt.validate = function (validity) {
		var $field = $(validity.field);
		var fieldVal = $field.val();
		
		if ($(validity.field).is('.js-ajax-validate')) {
			console.log("js-ajax-validate=" + $field.attr("id"));
		} else if ($(validity.field).is('.trimval')) {
			console.log("trimval=" + $field.attr("id"));
		} else {
			
		}
		console.log($field.attr("id") + " - " + fieldVal + " - " + validity.valid);
	};
	
	$("#modal").modal();	


	var $form = $('#form-with-tooltip');

	$form.validator(opt);

	//var validator = $form.data('amui.validator');

	//$form.on('focusin focusout', '.am-form-error input', function(e) {
	//	console.log(e.type);
	//	$tooltip = $(validationToolTip());		
	//	if (e.type === 'focusin') {
	//		var $this = $(this);
	//		var offset = $this.offset();
	//		var msg = $this.data('foolishMsg') || validator.getValidationMessage($this.data('validity'));
	//		$tooltip.text(msg).show().css({
	//			left: offset.left + 10,
	//			top: offset.top + $(this).outerHeight() + 10
	//		});
	//	} else {
	//		$tooltip.hide();
	//	}
	//});
	
	return true;
}

function base() {
}

base.prototype = {
	a: 1,
	b: 2,
	plus: function (a, b) {
		return this.a + this.b;
	}
}

function inherit() {
	//var ret = new base();
	//ret.a = 10;
	//ret.b = 20;
	//ret.plus = function () {
	//	return this.a = this.b + 10;
	//}

	//ret.minus = function () {
	//	return 1;
	//}

	//ret.submit = function () {
	//	var piThis = this;
	//	$.ajax({
	//		url: "test2"
	//	}).then(function () {
	//		alert(piThis.plus());
	//		return true;
	//	}, function (first_argument) {
	//		alert("failed.");
	//		return true;
	//	});
	//	return true;
	//}

	//ret.acc = function () {
	//	var piThis = this;
	//	$.ajax({
	//		url: "test2"
	//	}).then(function () {
	//		alert(piThis.minus());
	//		return true;
	//	}, function (first_argument) {
	//		alert("failed.");
	//		return true;
	//	});
	//	return true;
	//}
	
	//return ret;
}

inherit.prototype = new base();
inherit.prototype.a = 10;
inherit.prototype.b = 20;
inherit.prototype.submit = function () {
	var piThis = this;
	$.ajax({
		url: "test2"
	}).then(function () {
		alert(piThis.plus());
		return true;
	}, function (first_argument) {
		alert("failed.");
		return true;
	});
	return true;
};
inherit.prototype.acc = function () {
	var piThis = this;
	$.ajax({
		url: "test2"
	}).then(function () {
		alert(piThis.minus());
		return true;
	}, function (first_argument) {
		alert("failed.");
		return true;
	});
	return true;
};
inherit.prototype.minus = function () {
	return 1;
}

function inherit2() {
	var ret = new inherit();
	ret.plus = function () {
		return this.a + this.b + 100;
	}
	
	return ret;
}


//inherit.prototype = new base();
//inherit.prototype.a = 5;
//inherit.prototype.plus = function () {
//	return this.a + this.b + 1;
//}

$(document).ready( function () {
	//var $form = $('#form-with-tooltip');
	var $tooltip = $('<div id="vld-tooltip" style=\"z-index: 1115;\">提示信息！</div>');
	$tooltip.appendTo(document.body);

	var s = [];
	var o = new base();
	s.push(o.plus());

	var o2 = new inherit();
	s.push(o2.plus());

	delete o2.a;

	s.push(o.plus());
	s.push(o2.plus());
	
	$("#test").html(s.join("<br />"));
	$("#test").click(function () {
		inherit2().submit();
		return true;
	});
	

	//$form.validator();

	//var validator = $form.data('amui.validator');

	//$form.on('focusin focusout', '.am-form-error input', function(e) {
	//if (e.type === 'focusin') {
	//var $this = $(this);
	//var offset = $this.offset();
	//var msg = $this.data('foolishMsg') || validator.getValidationMessage($this.data('validity'));

	//$tooltip.text(msg).show().css({
	//left: offset.left + 10,
	//top: offset.top + $(this).outerHeight() + 10 
	//});
	//} else {
	//$tooltip.hide();
	//}
	//});

	var setting = {
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

		var zNodes =[
			{ id:1, pId:0, name:"随意勾选 1", open:true},
			{ id:11, pId:1, name:"随意勾选 1-1", open:true},
			{ id:111, pId:11, name:"随意勾选 1-1-1"},
			{ id:112, pId:11, name:"随意勾选 1-1-2"},
			{ id:12, pId:1, name:"随意勾选 1-2", open:true},
			{ id:121, pId:12, name:"随意勾选 1-2-1"},
			{ id:122, pId:12, name:"随意勾选 1-2-2"},
			{ id:2, pId:0, name:"随意勾选 2", open:true},
			{ id:21, pId:2, name:"随意勾选 2-1"},
			{ id:22, pId:2, name:"随意勾选 2-2", open:true},
			{ id:221, pId:22, name:"随意勾选 2-2-1", checked:true},
			{ id:222, pId:22, name:"随意勾选 2-2-2"},
			{ id:23, pId:2, name:"随意勾选 2-3"}
		];
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
});

function showMenu() {
	var cityObj = $("#citySel");
	var cityOffset = $("#citySel").offset();
	$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");

	$("#treeDemo").width(cityObj.width());

	$("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "citySel" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}