var _DataPool = {};

var __CacheKey = null;
function cacheKey() {
	if (__CacheKey) return __CacheKey;
	__CacheKey = {
		all: "all",
		brands : "brands",
		equipments : "equipments", 
		departmentList : "departmentList"
	};
	return __CacheKey;
}

function cacheData(key, value) {
	_DataPool[key] = value;
}

function getData(key) {	
	return _DataPool[key];
}