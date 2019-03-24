const fs = require("fs")

exports.dataDirectory = "."
exports.changeDataDirectory = function(dir){ exports.dataDirectory = dir };

exports.dataFile = "data.dat"
exports.changeDataFile = function(fil){ exports.dataFile = fil };

async function rectifyDataType(str){
	if (str.indexOf('"') == 0 && str.indexOf('"',1) > -1){ return str.slice(1).slice(0, -1) };
	var canParseInt = parseInt(str, 10)
	var canParseBool = str == 'true' || str == 'false';
	var canParseTable = (str.indexOf('{') == 0 && str.indexOf('}',1) > -1)
	if (!canParseInt && !canParseBool && !canParseTable){ return str };
	if (canParseBool){ return (str == 'true') };
	if (canParseInt){ return parseInt(str, 10) };
	if (canParseTable){
		var locTable = [];
		var modStr = str.slice(1).slice(0, -1)
		var reps = (str.match(/,/g) || []).length + 1
		var readHeadSpot = 0;
		for (i = 1; i <= reps; i++) {
			var stringsec = modStr.slice(readHeadSpot)
			var nextstringstart = stringsec.indexOf(",");
			if (nextstringstart == -1){ nextstringstart = stringsec.length };
			readHeadSpot = readHeadSpot + nextstringstart + 1
			locTable.push( await rectifyDataType(stringsec.slice(0,nextstringstart)) )
		}
		return locTable;
	}
}

async function interpretDataStructure(){
	if (fs.existsSync(exports.dataDirectory + "/" + exports.dataFile)){
		var data = fs.readFileSync(exports.dataDirectory + "/" + exports.dataFile, "utf8").toString().replace(/\r/g, "").split(/\n/g);
		var returntable = {};
		var promz = new Promise((resolve, reject) => {
			data.forEach(async function(line, index){
				var id = line.slice(0, line.indexOf(":"))
				var val = line.slice(line.indexOf(":") + 1)
				var rect = await rectifyDataType(val)
				returntable[id] = rect;
				if (index == data.length - 1) resolve(returntable);
			})
		})
		return promz;
	} else {
		return {};
	}
}

async function changeArrayNotation(aray){
	var base = aray.toString();
	return "{" + base.slice(1).slice(0,-1) + ",}"
}

async function objectEncodeToText(arr){
	var promz = new Promise((resolve, reject) => {
		var curstring = ""
		for (var index in arr){
			var val = arr[index]
			var endstring = "\n"
			if (arr[index] == arr[Object.keys(arr)[Object.keys(arr).length - 1]]) endstring = "";
			var thisValue = index + ":"
			if (Array.isArray(val)){
				curstring = curstring + thisValue + changeArrayNotation(aray) + endstring
			} else if (typeof val == "string"){
				curstring = curstring + thisValue + '"' + val + '"' + endstring
			} else if (typeof val == "boolean" || typeof val == "number"){
				curstring = curstring + thisValue + val + endstring
			}
			if (arr[index] == arr[Object.keys(arr)[Object.keys(arr).length - 1]]) resolve(curstring);
		}
	})
	return promz;
}

exports.getValue = async function(id){
	var table = await interpretDataStructure()
	var retval = (table[id] || "undefined")
	return retval
}

exports.setValue = async function(id, val){
	var table = await interpretDataStructure()
	table[id] = val;
	var data = await objectEncodeToText(table)
	fs.writeFileSync(exports.dataDirectory + "/" + exports.dataFile, data, "utf8", (err) => {
		if (err) throw err;
	});
	return id;
}

exports.delValue = async function(id){
	var table = await interpretDataStructure()
	delete table[id];
	var data = await objectEncodeToText(table)
	fs.writeFileSync(exports.dataDirectory + "/" + exports.dataFile, data, "utf8", (err) => {
		if (err) throw err;
	});
	return id;
}

exports.clear = async function(){
	fs.writeFileSync(exports.dataDirectory + "/" + exports.dataFile, "", "utf8", (err) => {
		if (err) throw err;
	});
	return val;	
}