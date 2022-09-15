// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
import * as __ from './../_';
import * as _ from './..';
import * as _ReviewsService from './../ReviewsService';





/**
* For displaying lists of Books
*/
export function ListOfBook<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class ListOfBookAspect extends Base {
    ID: number;
    title: string;
    descr: string;
    author: __.Association.to<_sap_capire_bookshop.Author>;
    genre: __.Association.to<_sap_capire_bookshop.Genre>;
    stock: number;
    price: number;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
    currency: __.Association.to<_.Currency>;
    image: string;
    reviews: __.Composition.of.many<_ReviewsService.Reviews>;
    rating: number;
    numberOfReviews: number;
  };
}
const ListOfBookXtended = _.managed(ListOfBook(__.Entity))
export type ListOfBook = InstanceType<typeof ListOfBookXtended>

export class ListOfBooks extends Array<ListOfBook> {
}

/**
* For display in details pages
*/
export function Book<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class BookAspect extends Base {
    ID: number;
    title: string;
    descr: string;
    author: __.Association.to<_sap_capire_bookshop.Author>;
    genre: __.Association.to<_sap_capire_bookshop.Genre>;
    stock: number;
    price: number;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
    currency: __.Association.to<_.Currency>;
    image: string;
    reviews: __.Composition.of.many<_ReviewsService.Reviews>;
    rating: number;
    numberOfReviews: number;
  };
}
const BookXtended = _.managed(Book(__.Entity))
export type Book = InstanceType<typeof BookXtended>

export class Books extends Array<Book> {
}

// action
export declare const submitOrder: (book: Books, quantity: number) => {};