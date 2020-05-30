declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.json' {
    const content: string;
    export default content;
}

declare module 'react-redux' {
    export const connect;
}

declare module 'svg-react-loader*' {
    import React from 'react';
    const value: React.ComponentType;
    export default value;
}


type ComponentPropsWithDefaults<C> = JSX.LibraryManagedAttributes<C, React.ComponentProps<C>>;

type ObjectValues<T> = T[keyof T];
