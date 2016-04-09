function InitComboBox (target, title, list) {
	var jqTarget = (typeof target == "string" ? $("#" + target) : target);
	var s = [];
	s.push("<option value='-1'>", title, "</option>");
	$.each(data, function (i, option) {
		s.push("<option value='", option.id, "'>", option.desc, "</option>");
		return true;
	});
	jqTarget.html(s.join(""));
	return true;
}

function basePaginateOption () {
	return {
        "oLanguage": {
            "sSearch": "搜索:",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有记录",
            "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
            "sInfo": "显示第  _START_ 条到第  _END_ 条记录,一共  _TOTAL_ 条记录",
            "sInfoEmpty": "显示0条记录",
            "oPaginate": {
                "sPrevious": " 上一页 ",
                "sNext":     " 下一页 ",
                }
        },
        "bAutoWidth":false,
        "bPaginate":true,
        "bRetrieve":true,
        "bSort":true,
        "bFilter":true
    };
}

function baseFormValidationOption() {
	return {
		// 是否使用 H5 原生表单验证，不支持浏览器会自动退化到 JS 验证
		H5validation: false,

		// 内置规则的 H5 input type，这些 type 无需添加 pattern
		H5inputType: ['email', 'url', 'number'],

		// 验证正则
		// key1: /^...$/，包含 `js-pattern-key1` 的域会自动应用改正则
		patterns: {},

		// 规则 class 钩子前缀
		patternClassPrefix: 'js-pattern-',

		activeClass: 'am-active',

		// 验证不通过时添加到域上的 class
		inValidClass: 'am-field-error',

		// 验证通过时添加到域上的 class
		validClass: 'am-field-valid',

		// 表单提交的时候验证
		validateOnSubmit: true,

		// 表单提交时验证的域
		// Elements to validate with allValid (only validating visible elements)
		// :input: selects all input, textarea, select and button elements.
		allFields: ':input:visible:not(:button, :disabled, .am-novalidate)',

		// 调用 validate() 方法的自定义事件
		customEvents: 'validate',

		// 下列元素触发以下事件时会调用验证程序
		keyboardFields: ':input:not(:button, :disabled,.am-novalidate)',
		keyboardEvents: 'focusout', // keyup, focusin , change

		// 标记为 `.am-active` (发生错误以后添加此 class)的元素 keyup 时验证
		activeKeyup: false,

		// textarea[maxlength] 的元素 keyup 时验证
		textareaMaxlenthKeyup: true,

		// 鼠标点击下列元素时会调用验证程序
		pointerFields: 'input[type="range"]:not(:disabled, .am-novalidate), ' +
			'input[type="radio"]:not(:disabled, .am-novalidate), ' +
			'input[type="checkbox"]:not(:disabled, .am-novalidate), ' +
			'select:not(:disabled, .am-novalidate), ' +
			'option:not(:disabled, .am-novalidate)',
		
		pointerEvents: 'click',

		// 域通过验证时回调
		onValid: function(validity) {
			//
		},

		// 验证出错时的回调， validity 对象包含相关信息，格式通 H5 表单元素的 validity 属性
		onInValid: function(validity) {
			//
		},

		// 域验证通过时添加的操作，通过该接口可定义各种验证提示
		markValid: function(validity) {
			// this is Validator instance
			var options = this.options;
			var $field  = $(validity.field);
			var $parent = $field.closest('.am-form-group');
			$field.addClass(options.validClass).
			removeClass(options.inValidClass);

			$parent.addClass('am-form-success').removeClass('am-form-error');

			options.onValid.call(this, validity);
		},

		// 域验证失败时添加的操作，通过该接口可定义各种验证提示
		markInValid: function(validity) {
			var options = this.options;
			var $field  = $(validity.field);
			var $parent = $field.closest('.am-form-group');
			$field.addClass(options.inValidClass + ' ' + options.activeClass).
			removeClass(options.validClass);

			$parent.addClass('am-form-error').removeClass('am-form-success');

			options.onInValid.call(this, validity);
		},

		// 自定义验证程序接口，详见示例
		validate: function(validity) {
			//
		},

		// 定义表单提交处理程序
		//   - 如果没有定义且 `validateOnSubmit` 为 `true` 时，提交时会验证整个表单
		//   - 如果定义了表单提交处理程序，`validateOnSubmit` 将会失效
		//        function(e) {
		//          // 通过 this.isFormValid() 获取表单验证状态
		//          // 注意： 如果自定义验证程序而且自定义验证程序中包含异步验证的话 this.isFormValid() 返回的是 Promise，不是布尔值
		//          // Do something...
		//        }
		submit: null
	};
}

function showLoading() {
	$('#mdlLoading').modal();
	return true;
}

function hideLoading() {
	$('#mdlLoading').modal("close");
	return true;
}

function EquipmentGridSetting() {
	var ret = {
        "oLanguage": {
            "sSearch": "搜索:",
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "没有记录",
            "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
            "sInfo": "显示第  _START_ 条到第  _END_ 条记录,一共  _TOTAL_ 条记录",
            "sInfoEmpty": "显示0条记录",
            "oPaginate": {
                "sPrevious": " 上一页 ",
                "sNext":     " 下一页 "
			}
		},
		"bAutoWidth":false,
		"bPaginate":true,
		"bRetrieve":true,
		"bSort":true,
		"bFilter":false,
		"bLengthChange":false,
		"iDisplayLength": 15
    };
	return ret;
}

function setTreeNodeLevel(treeNode, lev) {
	treeNode.lev = lev;
	var children = treeNode.children;
	if (children) {
		var len = children.length;
		var i;
		for (i = 0; i < len; i++) {
			setTreeNodeLevel(children[i], lev + 1);
		}
	}
}

function constructTreeData(data) {
	var ret = {};
	if (data && data.length > 0) {
		ret.list = data;
		var map = {};
		var root = null;
		var rootId = 1000000000000;
		$.each(data, function (i, item) {
			rootId = Math.min(rootId, parseInt(item.id));

			var tmp = map[item.id];
			if (tmp) {
				$.extend(tmp, item);
			} else {
				var parent = map[item.father_id];
				if (parent) {
					if (!parent.children) parent.children = [];
					parent.children.push(item);
				} else {
					parent = {children: []};
					parent.children.push(item);
					map[item.father_id] = parent;
				}
				map[item.id] = item;
			}
			return true;
		});

		root = map[rootId];

		setTreeNodeLevel(root, 0);

		ret.map = map;
		ret.root = root;
	} else {
		ret.list = [];
		ret.map = {};
		ret.root = {};
	}
	
	return ret;
}

function getTreeDataChildIds(treeDataNode, ret) {
	ret.push(treeDataNode.id);
	var children = treeDataNode.children;
	if (children) {
		var len = children.length;
		var i;
		for (i = 0; i < len; i++) {
			getTreeDataChildIds(children[i], ret);
		}
	}
	return true;
}

function treeData2zNodes(treeData, zNodes, lev) {
	var children = treeData.children;
	
	if (children.length > 0) {
		var i;
		var len = children.length;
		var tn;		
		for (i = 0; i < len; i++) {
			tn = children[i];
			zNodes.push({ id:tn.id, pId:tn.father_id, name:tn.name, open:false});
			//if (i == 0) {
			//	if (lev == 0) {
			//		zNodes.push({ id:tn.id, pId:tn.father_id, name:tn.name, open:true});
			//	} else {
			//		zNodes.push({ id:tn.id, pId:tn.father_id, name:tn.name, open:false});
			//	}
			//} else {
			//	zNodes.push({ id:tn.id, pId:tn.father_id, name:tn.name, open:false});
			//}

			if (tn.children) treeData2zNodes(tn, zNodes, lev + 1);
		}
	}
	return true;
}

var _validationToolTip = null;
function validationToolTip() {
	if (_validationToolTip) return _validationToolTip;
	
	var tooltip = document.createElement("div");
    tooltip.id = "vld-tooltip";
    tooltip.style.cssText = "z-index: 1115;";    
    document.body.appendChild(tooltip);
    _validationToolTip = tooltip;
    
	return tooltip;
}

var _action = null;
function action() {
	if (_action) return _action;
	var ret = {};
	ret.add = 1;
	ret.upd = 2;
	ret.del = 3;
	_action = ret;
	return ret;
}

var _enumAction = null;
function enumAction() {
	if (_enumAction) return _enumAction;
	var ret = {};
	ret.add = 1;
	ret.upd = 2;
	ret.del = 3;
	ret.unKnow = 0;
	_enumAction = ret;
	return ret;
}

var _EquipmentStatus = null;
function EquipmentStatus() {
	if (_EquipmentStatus) return _EquipmentStatus;
	var ret = {};
	ret.in = 1;
	ret.accept = 20;
	ret.out = 30;
	ret.allocation = 40;
	ret.borrow = 50;
	ret.scrap = 60;

	ret.isAccept = function (status) {
		return (status > this.in);
	};

	ret.isScrap = function (status) {
		return (status == this.scrap);
	}
	
	_EquipmentStatus = ret;
	return ret;
}

//系统预处理
(function(){
	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
})();