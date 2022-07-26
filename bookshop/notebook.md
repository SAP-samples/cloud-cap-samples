```swift
using { Currency, managed, sap } from '@sap/cds/common';
namespace sap.capire.bookshop;

/*
    Annotations available: 
    
    Entity level
      @expression.constraint : [{if: 'expression evaluates to bool'}, on: ['INSERT, UPDATE, DELETE'], error: 'Transaction Rollback and error message', warning: 'Transaction proceeds and warning message']
      @expression.computed : [{expression: 'ability to access request payload and modify it', on: ['INSERT, UPDATE']}]
      @event : [{if: 'expression evaluates to bool', on: ['INSERT, UPDATE, DELETE, READ'], when: 'before or after, default before', emit: 'Event Name', to: 'Messaging target, optional'}]
      @expresion.code :[{file: 'file name', on:['insert', 'update'], when: 'before or after, default before'},
                        {source: 'each => { if (each.stock > 111) {each.title += ` -- 11% discount!`; each.price= each.price*0.9}', on:['insert', 'update'], when: 'before or after'}]  
    Atribute Level
      @assert.constraint : {if: 'stock>=0 OR stock <1000', error: 'i18n/error102'};
      @event : {if: 'expression evaluates to bool', on: ['INSERT, UPDATE, DELETE, READ'], when: 'before or after', emit: 'Event Name', to: 'Messaging target, optional' }

    Functions available:
      EXISTS(association target)
      COUNT,AVG,MIN,MAX,SUM: Composition items, arrays etc
      OLD:  before image
      EACH: loop over composition items

    Events covered:
    CRUD --> Longhand and Shorthand supported?
    Upsert as one event?
    Before and after:
      Before can change change request payload and stop transaction
      After should trigger only asynchronous messages
    Specific Events for status changes? I think expression based event emitter suffices

*/



//Entity level annotations
@expression.constraint : [{if: 'stock>100 AND price>15)', on: ['INSERT', 'UPDATE'], error: 'No Book over price 15 should have more than 100 stock' }, // error, rollback transactions
                          {if: 'stock>90 AND price>15)', on: ['I', 'U'], warning: 'No Book over price 15 should have more than 100 stock' }] //warning, proceed with transaction but report warning back to UI
@expression.computed : {expression: 'if(stock>100) then price=price*0.9', on: ['INSERT']}  //ability to modify the payload of the request, but nothing beyond it 
@expresion.code :[{file: 'sap.capire.bookshop-Books-beforeInsert', on:['insert', 'update'], when: 'before'},  //naming can be arbitrary?
                  {source: 'each => { if (each.stock > 111) {each.title += ` -- 11% discount!`; each.price= each.price*0.9}', on:['insert', 'update'], when: 'before'}]  //alternative
@event : { if:'price>200', emit: 'Expensive Book', to: 'RulesEngine'}
entity Books : managed {
  key ID : Integer;
  title  : localized String(111); @event : {if: 'old.title="Hello"', emit: 'Hello changed' }  //old refers to before Image. No "to" clause means message is emitted to any subscriber interested
  descr  : localized String(1111);
  author : Association to Authors @assert.constraint: 'exists(author)';  //function calls need to evaluate to bool
  genre  : Association to Genres;
  stock  : Integer @assert.constraint : {if: 'stock>=0 OR stock <1000', error: 'Stock not within permitted parameters'}; //when operand is used, no auto-insert
  price  : Decimal(9,2) @assert.constraint : '>0'; //insert operand on left side by default
  currency : Currency;
  image : LargeBinary @Core.MediaType : 'image/png';
  stockWorth: Decimal(9,2) @expression.computed : 'stock*price'; //persisted on write. Overhead in runtime, but performance benefit on read. Payload ignored?
  // stockWorth2 = stock*price;  -- long term goal from compiler team, not persisted on write, but calculated on read
  stockWorth3 : Decimal @expression.computed: 'if (stock*price>1000) then stockWorth3=stock.price else stockworth3=1000';  //which altenative?
  stockWorth4 : Decimal @expression.computed: {if: '(stock*price>1000)', then: 'stockWorth3=stock.price', else: 'stockworth3=1000'};
}
//@assert.expression: 'dateOfBirth<dateOfDeath'
entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date ;
  dateOfDeath  : Date @expression.constraint: '>dateOfBirth';
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}
 
```