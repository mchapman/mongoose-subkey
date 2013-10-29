var mocha = require('mocha');
var should = require('should');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var subkey = require('../');

mongoose.connect('mongodb://localhost/mongoose_subkey');
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application')
});

var PhoneSchema = new Schema({
    type: {type:String, enum:['mobile','landline']},
    number: {type: String}
},{_id:false});

var moreComplexSchema = new Schema({
    keyField1: String,
    keyField2: Number,
    valueField: String
},{_id:false});

var PersonSchema = new Schema({

    name: String,
    phones: [PhoneSchema],
    moreComplex: [moreComplexSchema]
});

PersonSchema.plugin(subkey,{subschemas:[{list:'phones',keyList:['type']},{list:'moreComplex',keyList:['keyField1','keyField2']}]});

mongoose.model('Person', PersonSchema);
var Person = mongoose.model('Person', PersonSchema);

after(function(done) {
  mongoose.connection.db.dropDatabase();
  done();
});

describe('subkey', function () {

    it('should prevent duplicate sub schemas being created', function (done) {
        var personOne = new Person({name: 'John', phones: [
            {type: 'mobile', number: '07876 123456'},
            {type: 'mobile', number: '07876 999999'}
        ]});
        personOne.save(function (err) {
            if (err) {
                done();
            }
        });
    });

    it('should allow non-duplicate sub schemas to be created', function (done) {
        var personTwo = new Person({name: 'John', phones: [
            {type: 'mobile', number: '07876 123456'},
            {type: 'landline', number: '020 8888 7766'}
        ]});
        personTwo.save(function (err, saved) {
            if (!err && saved.phones.length === 2) {
                done();
            }
        });
    });

    it('should prevent duplicate sub schemas being created (compound key)', function (done) {
        var personOne = new Person({name: 'John', moreComplex: [
            {keyField1: 'xxx', keyField2: 2, valueField:' Something'},
            {keyField1: 'xxx', keyField2: 2, valueField:' Something Else'}
        ]});
        personOne.save(function (err) {
            if (err) {
                done();
            }
        });
    });

    it('should allow non-duplicate sub schemas to be created (compound key)', function (done) {
        var personTwo = new Person({name: 'John', moreComplex: [
            {keyField1: 'xxx', keyField2: 2, valueField:' Something'},
            {keyField1: 'xxx', keyField2: 3, valueField:' Something Else'}
        ]});
        personTwo.save(function (err, saved) {
            if (!err && saved.moreComplex.length === 2) {
                done();
            }
        });
    })

});