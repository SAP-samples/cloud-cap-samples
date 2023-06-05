@rest
service LogService {

  @readonly
  entity Loggers : Logger {};

  entity Logger {
    key id    : String;
        level : String;
  }

  action format(timestamp : Boolean, level : Boolean, tenant : Boolean, reqid : Boolean, id : Boolean, );
  action debug(logger : String) returns Logger;
  action reset(logger : String) returns Logger;

}
