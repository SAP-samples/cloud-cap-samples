// This is an automatically generated file. Please do not change its contents manually!
import * as __ from './../../../../_';





export function Media<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class MediaAspect extends Base {
    id: number;
    content: string;
    mediaType: string;
    fileName: string;
    applicationName: string;
  };
}
const MediaXtended = Media(__.Entity)
export type Media = InstanceType<typeof MediaXtended>

export class Media_ extends Array<Media> {
}

