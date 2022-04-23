'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

var studentSchema = Schema( {
    ID: Number,
    LastName:String,
    FirstName:String,
    City:String,
    State:String,
    Major:String,
    Country:String,
    Age:Number,
    SAT:Number,
    Grade:Number,
    Height:Number
} );

module.exports = mongoose.model( 'Student', studentSchema );
