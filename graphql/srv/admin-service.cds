using {sap.capire.graphql} from '../db/schema';

extend service AdminService with {
  entity Chapters as projection on graphql.Chapters;
}
