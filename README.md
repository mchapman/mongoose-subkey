Mongoose Subkey Plugin
======================

Simple plugin for [Mongoose](https://github.com/LearnBoost/mongoose) which adds the concept of a key to sub schema arrays and validates that there is no duplication.
## Installation

`npm install mongoose-subkey`

## Usage

```javascript
var subkey = require('mongoose-subkey');

var PhoneSchema = new Schema({
    type: {type:String, enum:['mobile','landline']},
    number: {type: String}
},{_id:false});

var PersonSchema = new Schema({
    name: String,
    phones: [PhoneSchema]
});

PersonSchema.plugin(subkey,{subschemas:[{list:'phones',keyList:['type']}]});

mongoose.model('Person', PersonSchema);
var Person = mongoose.model('Person', PersonSchema)

var personOne = new Person({name: 'John', phones:[{type:'mobile',number:'07876 123456'},{type:'mobile',number:'07876 999999'}]});
personOne.save(function (err) {
  if (err) {
     console.log('As expected, we get an error here, as two mobiles is excessive');
  } else {
     console.log("** Should have had an error here **");
  }
});

var personTwo = new Person({name: 'John', phones:[{type:'mobile',number:'07876 123456'},{type:'landline',number:'020 8888 7766'}]});
personTwo.save(function (err) {
  if (err) {
     console.log('** Unexpected error - it is OK to have a landline and a mobile');
  } 
});

```
## License 

(The MIT License)

Copyright (c) 2013 Mark Chapman

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
