// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../../_';
import * as _ from './../../..';
import * as _sap_common from './../../common';
export function _BookAspect<TBase extends new (...args: any[]) => any>(Base: TBase) {
  return class Book extends Base {
        ID ?: number;
        title ?: string;
        descr ?: string;
        author ?: __.Association.to<Author>;
        genre ?: __.Association.to<Genre>;
        stock ?: number;
        price ?: number;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
        currency ?: _.Currency;
        image ?: string;
  };
}
export class Book extends _._managedAspect(_BookAspect(__.Entity)) {}
export class Books extends Array<Book> {}

export function _AuthorAspect<TBase extends new (...args: any[]) => any>(Base: TBase) {
  return class Author extends Base {
        ID ?: number;
        name ?: string;
        dateOfBirth ?: Date;
        dateOfDeath ?: Date;
        placeOfBirth ?: string;
        placeOfDeath ?: string;
        books ?: __.Association.to.many<Books>;
  };
}
export class Author extends _._managedAspect(_AuthorAspect(__.Entity)) {}
export class Authors extends Array<Author> {}

/**
* Hierarchically organized Code List for Genres
*/
export function _GenreAspect<TBase extends new (...args: any[]) => any>(Base: TBase) {
  return class Genre extends Base {
        ID ?: number;
        parent ?: __.Association.to<this>;
        children ?: __.Composition.of.many<Genres>;
  };
}
export class Genre extends _sap_common._CodeListAspect(_GenreAspect(__.Entity)) {}
export class Genres extends Array<Genre> {}
