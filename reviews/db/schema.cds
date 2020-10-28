namespace sap.capire.reviews;
using { User } from '@sap/cds/common';

// Reviewed subjects can be any entity that is uniquely identified
// by a single key element such as a UUID
type ReviewedSubject : String(111);

entity Reviews {
  key ID   : UUID;
  subject  : ReviewedSubject;
  reviewer : User;
  rating   : Rating;
  title    : String(111);
  text     : String(1111);
  date     : DateTime;
  likes    : Composition of many Likes on likes.review = $self;
  liked    : Integer default 0; // counter for likes as helpful review (count of all _likes belonging to this review)
}

type Rating : Decimal(3,2) @assert.range: [ 1, 5 ];

entity Likes {
  key review : Association to Reviews;
  key user   : User;
}

// Auto-fill reviewers and review dates
annotate Reviews with {
  reviewer @cds.on.insert:$user;
  date     @cds.on.insert:$now;
  date     @cds.on.update:$now;
}
