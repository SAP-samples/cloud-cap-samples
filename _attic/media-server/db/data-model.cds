namespace sap.capire.media;

entity Media {

   key id:Integer;
   @Core.MediaType: mediaType
   content : LargeBinary ;

   @Core.IsMediaType: true
   mediaType : String;
   fileName : String;
   applicationName:String;
}