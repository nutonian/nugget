define([
    'Nugget'
],
function (
    Nugget
) {
    describe('Things we can\'t do cuz IE', function () {

        it('should not use innerHTML = "" or html("") to empty elements', function(done) {
            $.get('/build/Nugget.js').done(function(script) {
                // FYI, babel changes single quotes to double quotes which is why we're searching for double here
                expect(script.indexOf('.html("")')).toBe(-1);
                expect(script.indexOf('.innerHTML = ""')).toBe(-1);
                done();
            });
        });

    });
});
