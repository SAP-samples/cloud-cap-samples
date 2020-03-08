using { sap.capire.reviews as my } from '../db/schema';

service ReviewsService {
  // Sync API
  entity Reviews as projection on my.Reviews excluding { likes }
  action like (review:Reviews.ID);     // TODO: can be a bound action in OData
  action unlike (review:Reviews.ID);   // TODO: can be a bound action in OData

  // Async API
  event reviewed : { subject: Reviews.subject; rating: Decimal(2,1) };

  // Input validation
  annotate Reviews with {
    subject  @mandatory;
    title    @mandatory;
    rating   @mandatory @assert.enum;
  }

  // Auto-fill reviewers and review dates
  annotate Reviews with {
    reviewer @cds.on.insert:$user;
    date     @cds.on.insert:$now;
    date     @cds.on.update:$now;
  }

}


// Access control restrictions
annotate ReviewsService.Reviews with @restrict_:[
  { grant:'READ',   to:'any' },                 // everybody can read reviews
  { grant:'CREATE', to:'authenticated-user' },  // users must login to add reviews
  { grant:'UPDATE', to:'authenticated-user', where:'reviewer=$user' },
  { grant:'DELETE', to:'admin' },
];

annotate ReviewsService with @restrict_:[
  { grant:'like', to:'identified-user' },
  { grant:'unlike', to:'identified-user', where:'user=$user' },
];
