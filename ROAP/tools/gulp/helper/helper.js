exports.copyright = copyright;
exports.getBasePath = getBasePath;
exports.getDeployPath = getDeployPath;
exports.getBaseRoot = getBaseRoot;

function getBasePath (){
	/*Do not add last slash*/
	return "./../../project/gui/source";
}
function getBaseRoot (){
	/*Do not add last slash*/
	return "./../..";
}
function getDeployPath (){
	/*Do not add last slash*/
	return "./../../project/gui/static/gui";
}

/**
 *  Generate the copyright information.
 * @param {string} _version - The actual version
 * @returns {string}
 */
function copyright(_version) {
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
		+ (currentdate.getMonth() + 1) + "/"
		+ currentdate.getFullYear() + " @ "
		+ currentdate.getHours() + ":"
		+ currentdate.getMinutes() + ":"
		+ currentdate.getSeconds();
	var copyrightStr = "/**\n" +
		"# Copyright (C) " + currentdate.getFullYear() + " QuantumBytes inc. All rights reserved.\n" +
		"#\n" +
		"# version " + _version + "\n" +
		"# author    Lars Saalbach <lars.saalbach@quantum-bytes.com>\n" +
		"# build time  " + datetime + "\n" +
		"**/\n";
	return copyrightStr;

}
