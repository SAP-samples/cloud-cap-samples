// This is an automatically generated file. Please do not change its contents manually!


export namespace Association {
    export type to <T> = T & ((fn:(a:T)=>any) => T)
    export namespace to {
        // type many <T> = T[] & (T extends (infer R)[] ? R[] & ((fn:(a:R)=>any) => R[]) : T[]);
        export type many <T extends readonly unknown[]> = T & ((fn:(a:T[number])=>any) => T[number]);
    }
}

export namespace Composition {
    export type of <T> = T & ((fn:(a:T)=>any) => T)
    export namespace of {
        //type many <T> = T[] & (T extends (infer R)[] ? R[] & ((fn:(a:R)=>any) => R[]) : T[]);
        export type many <T extends readonly unknown[]> = T & ((fn:(a:T[number])=>any) => T[number]);
    }
}

export class Entity {
    static data<T extends Entity> (this:T, input:Object) : T { 
        return {} as T // mock
    } 
}
  
export type EntitySet<T> = T[] & {
    data (input:object[]) : T[]
    data (input:object) : T
}






