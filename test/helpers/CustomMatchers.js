/*
 * This file has some custom matchers for use within Nugget tests
 *
 **/

beforeEach(function() {

    function isObjectCloseTo(actualObj, expectedObj, delta, util, customEqualityTesters) {
        if (actualObj instanceof Object && expectedObj instanceof Object) {
            var actualKeys = Object.keys(actualObj);
            var expectedKeys = Object.keys(expectedObj);

            if (!util.equals(actualKeys, expectedKeys, customEqualityTesters)) {
                return { pass: false };
            }

            for (var i = 0; i< actualKeys.length; i++) {
                var key = actualKeys[i];
                var actualValue = Number(actualObj[key]);
                var expectedValue = Number(expectedObj[key]);

                if (actualValue < expectedValue - delta || actualValue > expectedValue + delta) {
                    return { pass: false };
                }
            }
            return { pass: true };
        } else {
            return { pass: false };
        }
    }

    var matchers = {
        toBeWithinRange: function(util, customEqualityTesters) {

            return {
                compare: function(actual, min, max) {

                    return {
                        pass: actual >= min && actual <= max
                    };
                }
            };
        },

        toBeCloseToObject: function(util, customEqualityTesters) {

            return {
                compare: function(actualObj, expectedObj, delta) {
                    return isObjectCloseTo(actualObj, expectedObj, delta, util, customEqualityTesters);
                }
            };
        },

        toBeCloseToArray: function(util, customEqualityTesters) {
            return {
                compare: function(actualArray, expectedArray, delta) {
                    if (actualArray instanceof Array && expectedArray instanceof Array) {
                        if (actualArray.length !== expectedArray.length) {
                            return { pass: false };
                        }
                        // check each object in array for closeness, if any
                        // fail, return fail
                        for (var i=0; i < actualArray.length; i++) {
                            var actualObj = actualArray[i];
                            var expectedObj = expectedArray[i];

                            var result = isObjectCloseTo(actualObj, expectedObj, delta, util, customEqualityTesters);
                            if (!result.pass) {
                                return { pass: false };
                            }
                        }
                        return { pass: true };

                    } else {
                        return { pass: false };
                    }
                }
            };
        }
    };

    jasmine.addMatchers(matchers);
});
