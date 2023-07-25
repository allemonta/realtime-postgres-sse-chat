
export enum OPERATION {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

export type RealtimeEvent<T extends string, I> = {
    table: T
} & ({
    operation: OPERATION.INSERT,
    data: {
        new: I,
        old: null
    }
} | {
    operation: OPERATION.UPDATE,
    data: {
        new: I,
        old: I
    }
} | {
    operation: OPERATION.DELETE,
    data: {
        new: null,
        old: I
    }
})

export type Item = {
    id: number,
    value: string,
    creationTimestamp: string,
    storingTimestamp: string,
    sseReceivingTimestamp: string | null
}

export type ItemRealtimeEvent = RealtimeEvent<"items", Item>