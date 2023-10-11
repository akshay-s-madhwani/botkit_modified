/*
 * Dependencies
 */
const textUtils = require(`../../utils-module`).Text;
const objectUtils = require(`../../utils-module`).Object;

/*
 * Model
 */
const Cmshelper = function Cmshelper() {};

/*
 * Instance Methods
 */
/**
 * Cms proto sample of logging a cleaned text
 *
 * @param {string} text string
 */
Cmshelper.prototype.log = function log(text) {
  this.bio = textUtils.cleanText(text);
  // console.log("this.bio doo! : ", this.bio);
};
/**
 * Generate property array of cms script as an input in format :
 * Array of Object {prefix: "catalogue.default", value: "{{vars.mustache_variable}}"}
 * for mustache rendering using i18n auto json key generation
 * Also delete {{vars.str_xxx ( :xxdefaultvaluexxx~ ) }} before creating dialog
 *
 * @param {*} scrobj
 * @returns property array
 */
Cmshelper.prototype.m2i18n = function m2i18n(scrobj) {
  const empty = ``;
  const prop = [];
  objectUtils.cmsScriptsIterate(scrobj, empty, prop);
  // console.log(`debug pause`);
  return prop;
  // console.log("this.bio doo! : ", this.bio);
};

module.exports = Cmshelper;
