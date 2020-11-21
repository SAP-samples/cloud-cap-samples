using { sap.capire.reviews as my } from '../db/schema';

service ReviewsService {

  // Sync API
  entity Reviews as projection on my.Reviews excluding { likes }
  action like (review: type of Reviews:ID);
  action unlike (review: type of Reviews:ID);

  // Async API
   event reviewed : {
     subject: type of Reviews:subject;
     rating: Decimal(2,1)
   }

  // Input validation
  annotate Reviews with {
    subject  @mandatory;
    title    @mandatory;
    rating   @assert.enum;
  }

}


// Access control restrictions
annotate ReviewsService.Reviews with @restrict:[
  { grant:'READ',   to:'any' },                 // everybody can read reviews
  { grant:'CREATE', to:'authenticated-user' },  // users must login to add reviews
  { grant:'UPDATE', to:'authenticated-user', where:'reviewer=$user' },
  { grant:'DELETE', to:'admin' },
];

annotate ReviewsService with @restrict:[
  { grant:'like', to:'identified-user' },
  { grant:'unlike', to:'identified-user', where:'user=$user' },
];
