// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../_';





/**
* Metadata like name and columns/elements
*/
export function Entity<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class EntityAspect extends Base {
    name: string;
    columns: {
    name: string;
    type: string;
    isKey: boolean;
  };
  };
}
const EntityXtended = Entity(__.Entity)
export type Entity = InstanceType<typeof EntityXtended>

export class Entities extends Array<Entity> {
}

/**
* The actual data, organized by column name
*/
export function Data<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class DataAspect extends Base {
    record: {};
  };
}
const DataXtended = Data(__.Entity)
export type Data = InstanceType<typeof DataXtended>

export class Data_ extends Array<Data> {
}

