## Nugget.js

### Development

_(Make sure to install [https://nodejs.org/download/](Node.js) and run `npm install`)_

To start the development server run `grunt development`. This starts a server at [http://localhost:9000](http://localhost:9000). Files in `/lib` are watched and the library is compiled every time you save.

The Jasmine test suite can be found at: [http://localhost:9000/_SpecRunner.html](http://localhost:9000/_SpecRunner.html). **Note:** Do *not* use the Jasmine CLI.

Some basic examples can be found here: [http://localhost:9000/example/](http://localhost:9000/example/). These load the modules in `/lib` separately instead of the `/release` build for easier debugging. Make sure to turn on "Enable JavaScript source maps" in Chrome dev tools.