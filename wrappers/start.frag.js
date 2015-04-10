/**
* @license Nugget.js by Nutonian, Inc. http://www.nutonian.com
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Nugget = factory();
    }
}(this, function () {
