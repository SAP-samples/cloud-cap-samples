// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_capire_reviews from './../sap/capire/reviews';
import * as _ from './..';
import * as __ from './../_';





export function Review<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class ReviewAspect extends Base {
    ID: string;
    subject: _sap_capire_reviews.ReviewedSubject;
    /**
    * Canonical user ID
    */
    reviewer: _.User;
    rating: _sap_capire_reviews.Rating;
    title: string;
    text: string;
    date: Date;
    likes: __.Composition.of.many<_sap_capire_reviews.Likes>;
    liked: number;
  };
}
const ReviewXtended = Review(__.Entity)
export type Review = InstanceType<typeof ReviewXtended>

export class Reviews extends Array<Review> {
}

// action
export declare const like: (review: Reviews) => {};
// action
export declare const unlike: (review: Reviews) => {};