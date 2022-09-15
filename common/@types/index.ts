// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_common from './sap/common';
import * as __ from './_';

export type Language = __.Association.to<_sap_common.Language>;
export type Currency = __.Association.to<_sap_common.Currency>;
export type Country = __.Association.to<_sap_common.Country>;
export type User = string;


// the following represents the CDS aspect 'cuid'
export function cuid<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class cuidAspect extends Base {
    ID: string;
  };
}
const cuidXtended = cuid(__.Entity)
export type cuid = InstanceType<typeof cuidXtended>

// the following represents the CDS aspect 'managed'
export function managed<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class managedAspect extends Base {
    createdAt: Date;
    /**
    * Canonical user ID
    */
    createdBy: User;
    modifiedAt: Date;
    /**
    * Canonical user ID
    */
    modifiedBy: User;
  };
}
const managedXtended = managed(__.Entity)
export type managed = InstanceType<typeof managedXtended>

// the following represents the CDS aspect 'temporal'
export function temporal<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class temporalAspect extends Base {
    validFrom: Date;
    validTo: Date;
  };
}
const temporalXtended = temporal(__.Entity)
export type temporal = InstanceType<typeof temporalXtended>

// the following represents the CDS aspect 'extensible'
export function extensible<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class extensibleAspect extends Base {
    extensions__: string;
  };
}
const extensibleXtended = extensible(__.Entity)
export type extensible = InstanceType<typeof extensibleXtended>


