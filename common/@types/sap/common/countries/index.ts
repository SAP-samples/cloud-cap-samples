// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../../_';
import * as _sap_common from './..';





export function Region<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class RegionAspect extends Base {
    code: string;
    children: __.Composition.of.many<Regions>;
    cities: __.Composition.of.many<Cities>;
    _parent: string;
  };
}
const RegionXtended = _sap_common.CodeList(Region(__.Entity))
export type Region = InstanceType<typeof RegionXtended>

export class Regions extends Array<Region> {
}

export function City<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class CityAspect extends Base {
    code: string;
    region: __.Association.to<Region>;
    districts: __.Composition.of.many<Districts>;
  };
}
const CityXtended = _sap_common.CodeList(City(__.Entity))
export type City = InstanceType<typeof CityXtended>

export class Cities extends Array<City> {
}

export function District<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class DistrictAspect extends Base {
    code: string;
    city: __.Association.to<City>;
  };
}
const DistrictXtended = _sap_common.CodeList(District(__.Entity))
export type District = InstanceType<typeof DistrictXtended>

export class Districts extends Array<District> {
}

