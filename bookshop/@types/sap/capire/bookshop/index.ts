// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../../_';
import * as _ from './../../..';
import * as _sap_common from './../../common';





export function Book<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class BookAspect extends Base {
    ID: number;
    title: string;
    descr: string;
    author: __.Association.to<Author>;
    genre: __.Association.to<Genre>;
    stock: number;
    price: number;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
    currency: __.Association.to<_.Currency>;
    image: string;
  };
}
const BookXtended = _.managed(Book(__.Entity))
export type Book = InstanceType<typeof BookXtended>

export class Books extends Array<Book> {
}

export function Author<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class AuthorAspect extends Base {
    ID: number;
    name: string;
    dateOfBirth: Date;
    dateOfDeath: Date;
    placeOfBirth: string;
    placeOfDeath: string;
    books: __.Association.to.many<Books>;
  };
}
const AuthorXtended = _.managed(Author(__.Entity))
export type Author = InstanceType<typeof AuthorXtended>

export class Authors extends Array<Author> {
}

/**
* Hierarchically organized Code List for Genres
*/
export function Genre<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class GenreAspect extends Base {
    ID: number;
    parent: __.Association.to<Genre>;
    children: __.Composition.of.many<Genres>;
  };
}
const GenreXtended = _sap_common.CodeList(Genre(__.Entity))
export type Genre = InstanceType<typeof GenreXtended>

export class Genres extends Array<Genre> {
}

