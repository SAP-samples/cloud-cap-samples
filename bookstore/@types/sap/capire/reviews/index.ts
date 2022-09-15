// This is an automatically generated file. Please do not change its contents manually!
import * as _ from './../../..';
import * as __ from './../../../_';

export type ReviewedSubject = string;
export enum Rating {
  Best = 5,
  Good = 4,
  Avg = 3,
  Poor = 2,
  Worst = 1,
}


export function Review<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class ReviewAspect extends Base {
    ID: string;
    subject: ReviewedSubject;
    /**
    * Canonical user ID
    */
    reviewer: _.User;
    rating: Rating;
    title: string;
    text: string;
    date: Date;
    likes: __.Composition.of.many<Likes>;
    liked: number;
  };
}
const ReviewXtended = Review(__.Entity)
export type Review = InstanceType<typeof ReviewXtended>

export class Reviews extends Array<Review> {
}

export function Like<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class LikeAspect extends Base {
    review: __.Association.to<Review>;
    /**
    * Canonical user ID
    */
    user: _.User;
  };
}
const LikeXtended = Like(__.Entity)
export type Like = InstanceType<typeof LikeXtended>

export class Likes extends Array<Like> {
}

