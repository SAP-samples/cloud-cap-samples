namespace sap.capire.bookshop;

@cds.persistence.exists
entity Books {
    key ID: Integer;
        title  : String(111); 
        descr  : String(1111);
        author : String(50);
        rating : Integer;
}

@cds.persistence.exists
entity BooksDescr {
  key id : Integer;
  book_descr : String(2000);
}

@cds.persistence.exists
entity BooksInfo (REQ_RATING : Integer) {
  key id : Integer;
  rating : Integer;
  book_author_info : String;
}
