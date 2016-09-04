/**
 * 
 */




function getHashObject(source, keyName) {
	var result = {};
	for (var i = 0; i < source.length; i++) {
		result[source[i][keyName]] = null;
	}
	return result;
}

function fillHashObject(obj, source, keyName, valueNames) {
	for (var i = 0; i < source.length; i++) {
		var item = {};
		for (var j = 0; j < valueNames.length; j++) {
			item[valueNames[j]] = source[i][valueNames[j]];
		}
		item["Ref_Key"] = source[i][keyName];
		obj[source[i][keyName]] = item;
	}
}

function makeLeftJoin(array, fieldOfObject, newField, hashObj) {
	for (var i = 0; i < array.length; i++) {
		array[i][newField] = hashObj[array[i][fieldOfObject]];
	}
}

