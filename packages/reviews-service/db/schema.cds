namespace sap.capire.reviews;
using { User } from '@sap/cds/common';

// Reviewed subjects can be any entity that is uniquely identified
type ReviewedSubject : String(111);

entity Reviews {
  key ID   : String(36);
  subject  : ReviewedSubject;
  reviewer : User;
  rating   : Rating;
  title    : String(111);
  text     : String(1111);
  date     : DateTime;
  likes    : Composition of many Likes on likes.review = $self;
  liked    : Integer default 0; // counter for likes as helpful review (count of all _likes belonging to this review)
}

type Rating : Integer enum {
  Best  = 5;
  Good  = 4;
  Avg   = 3;
  Poor  = 2;
  Worst = 1;
}

entity Likes {
  key review : Association to Reviews;
  key user   : User;
}