// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../_';
import * as _sap_common_countries from './countries';

export type Locale = string;


// the following represents the CDS aspect 'CodeList'
export function CodeList<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class CodeListAspect extends Base {
    name: string;
    descr: string;
  };
}
const CodeListXtended = CodeList(__.Entity)
export type CodeList = InstanceType<typeof CodeListXtended>

/**
* Code list for languages
* 
* See https://cap.cloud.sap/docs/cds/common#entity-sapcommonlanguages
*/
export function Language<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class LanguageAspect extends Base {
    /**
    * Type for a language code
    */
    code: Locale;
  };
}
const LanguageXtended = CodeList(Language(__.Entity))
export type Language = InstanceType<typeof LanguageXtended>

export class Languages extends Array<Language> {
}

/**
* Code list for countries
* 
* See https://cap.cloud.sap/docs/cds/common#entity-sapcommoncountries
*/
export function Country<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class CountryAspect extends Base {
    code: string;
    regions: __.Composition.of.many<_sap_common_countries.Regions>;
  };
}
const CountryXtended = CodeList(Country(__.Entity))
export type Country = InstanceType<typeof CountryXtended>

export class Countries extends Array<Country> {
}

/**
* Code list for currencies
* 
* See https://cap.cloud.sap/docs/cds/common#entity-sapcommoncurrencies
*/
export function Currency<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class CurrencyAspect extends Base {
    code: string;
    symbol: string;
    numcode: number;
    exponent: number;
    minor: string;
  };
}
const CurrencyXtended = CodeList(Currency(__.Entity))
export type Currency = InstanceType<typeof CurrencyXtended>

export class Currencies extends Array<Currency> {
}

