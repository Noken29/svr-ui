import React from "react";

export interface DynamicFormProps<T> {
    addingHandler: (item: T) => void
}

export interface DynamicFormState<T> {
    validationErrors: string[]
}

export abstract class DynamicForm<P extends DynamicFormProps<T>, S extends DynamicFormState<T>, T> extends React.Component<P, S> {

    protected constructor(props: P, contex: any) {
        super(props, contex);
    }

    abstract handleSubmit(e: any): void
}

export default DynamicForm