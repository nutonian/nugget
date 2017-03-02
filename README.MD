## Nugget.js

### Development

_(Make sure to install [Node.js](https://nodejs.org) and run `npm install`)_

To start the development server run `npm start`. This starts a server at http://localhost:9000.
Files in `/lib` are watched and the library is rebuilt every time you save.

The Jasmine test suite can be found at http://localhost:9000/_SpecRunner.html. **Note:** Do *not* use the Jasmine CLI.

Some basic examples can be found at http://localhost:9000/example/. Make sure to turn on "Enable JavaScript source maps" in Chrome dev tools.

To build a minified version for release, run `npm build:dist`. This outputs a file to `build/Nugget.js`.
