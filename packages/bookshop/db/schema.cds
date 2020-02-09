namespace sap.capire.bookshop;

@cds.persistence.exists
entity Books {
    key ID: UUID;
        title  : String(111); 
        descr  : String(1111);
}
