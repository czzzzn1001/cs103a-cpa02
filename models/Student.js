'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

var studentSchema = Schema( {
    id: Number,
    lastName:String,
    firstName:String,
    city:String,
    state:String,
    major:String,
    country:String,
    age:Number,
    sat:Number,
    grade:Number,
    height:Number
} );

module.exports = mongoose.model( 'Student', studentSchema );
