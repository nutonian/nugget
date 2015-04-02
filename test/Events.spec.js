define(['Nugget'], function(Nugget) {

    describe('Events', function () {

        var view;

        var fns = {
            fn1: function() {},
            fn2: function() {},
            fn3: function() {}
        };

        beforeEach(function() {
            view = new Nugget.Events();

            spyOn(fns, 'fn1');
            spyOn(fns, 'fn2');
            spyOn(fns, 'fn3');
        });

        it('should execute a method when an event is fired', function() {
            view.on('foo', fns['fn1']);
            view.trigger('foo');
            expect(fns['fn1']).toHaveBeenCalled();
        });

        it('should execute all bound methods when an event is fired', function() {
            view.on('foo', fns['fn1']);
            view.on('foo', fns['fn2']);
            view.on('foo', fns['fn3']);

            view.trigger('foo');

            expect(fns['fn1']).toHaveBeenCalled();
            expect(fns['fn2']).toHaveBeenCalled();
            expect(fns['fn3']).toHaveBeenCalled();
        });

        it('should send a reference to the class target when triggered', function() {
            view.on('foo', fns['fn1']);
            view.trigger('foo');
            expect(fns['fn1']).toHaveBeenCalledWith({ target: view });
        });

        it('should send extra arguments if provided', function() {
            var extraArgs = [1, 'a', { b: 'c' }];
            view.on('foo', fns['fn1']);
            view.trigger('foo', extraArgs);
            expect(fns['fn1']).toHaveBeenCalledWith({ target: view }, extraArgs[0], extraArgs[1], extraArgs[2]);
        });

        it('shouldn\'t bind the same event/function combo more than once', function() {
            view.on('foo', fns['fn1']);
            view.on('foo', fns['fn1']);
            view.trigger('foo');
            expect(fns['fn1'].calls.count()).toBe(1);
        });

        it('should remove all events if no arguments are specified', function() {
            view.on('foo', fns['fn1']);
            view.on('bar', fns['fn2']);
            view.on('baz', fns['fn3']);

            view.off();

            view.trigger('foo');
            view.trigger('bar');
            view.trigger('baz');

            expect(fns['fn1']).not.toHaveBeenCalled();
            expect(fns['fn2']).not.toHaveBeenCalled();
            expect(fns['fn3']).not.toHaveBeenCalled();
        });

        it('should remove all events of a type if no method is specified', function() {
            view.on('foo', fns['fn1']);
            view.on('foo', fns['fn2']);
            view.on('foo', fns['fn3']);

            view.off('foo');

            view.trigger('foo');

            expect(fns['fn1']).not.toHaveBeenCalled();
            expect(fns['fn2']).not.toHaveBeenCalled();
            expect(fns['fn3']).not.toHaveBeenCalled();
        });

        it('should remove an event if a method is specified', function() {
            view.on('foo', fns['fn1']);
            view.on('foo', fns['fn2']);
            view.on('foo', fns['fn3']);

            view.off('foo', fns['fn1']);

            view.trigger('foo');

            expect(fns['fn1']).not.toHaveBeenCalled();
            expect(fns['fn2']).toHaveBeenCalled();
            expect(fns['fn3']).toHaveBeenCalled();
        });

    });
});
