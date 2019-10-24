namespace sap.capire.media;

service MediaServer {
  entity Images {
    key url : URL;
    type : String enum { jpeg; png; gif; };
    content : Image;
  }
}

type ImageURL : URL;
// type ImageURL : Association to MediaServer.Images;
//> would need Assotiations targeting off service to turn into references w/ foreign keys
type Image : LargeBinary @stream;
type URL : String(222);
