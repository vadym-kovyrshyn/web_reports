/**
 * 
 */

;
(function() {

	var dm1c = function() {
	}
	window.dm1c = dm1c;

	var oDataPath = "/web_reports/odata/standard.odata/";
	var balanceRequest = oDataPath
			+ "AccumulationRegister_ТоварыНаСкладах/Balance()?$format=json&$select=Номенклатура_Key,ВНаличииBalance";

	var nomenklaturaFields = "Description,ЕдиницаИзмерения_Key";
	var nomenklaturaRequest = oDataPath
			+ "Catalog_Номенклатура?$format=json&$select=Ref_Key,"
			+ nomenklaturaFields + "&$filter=not(IsFolder)";

	var edinicyFields = "Description";
	var edinicyRequest = oDataPath
			+ "Catalog_ЕдиницыИзмерения?$format=json&$select=Ref_Key,"
			+ edinicyFields;

	dm1c.getDataModel = function(func) {
		return (function() {
			var balanceData, nomenklaturaData, edinicyData;

			return $.when($.getJSON(balanceRequest, function(data) {
				balanceData = data.value;
			}), $.getJSON(nomenklaturaRequest, function(data) {
				nomenklaturaData = data.value;
			}), $.getJSON(edinicyRequest, function(data) {
				edinicyData = data.value;
			})).then(function() {
				processData(balanceData, nomenklaturaData, edinicyData, func);
			}, function() {
				alert("Что-то пошло не так...")
			});
		})();

	}

	function processData(balanceData, nomenklaturaData, edinicyData, callback) {
		var edinicyHash = getHashObject(edinicyData, "Ref_Key");

		fillHashObject(edinicyHash, edinicyData, "Ref_Key", edinicyFields
				.split(","));

		makeLeftJoin(nomenklaturaData, "ЕдиницаИзмерения_Key",
				"ЕдиницаИзмерения", edinicyHash);

		var nomenklaturaHash = getHashObject(nomenklaturaData, "Ref_Key");

		fillHashObject(nomenklaturaHash, nomenklaturaData, "Ref_Key",
				(nomenklaturaFields + ",ЕдиницаИзмерения").split(","));

		makeLeftJoin(balanceData, "Номенклатура_Key", "Номенклатура",
				nomenklaturaHash);

		callback(balanceData);
	}

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
})();
