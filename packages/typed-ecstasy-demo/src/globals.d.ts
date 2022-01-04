interface ImportHot {
    accept: () => void;
    dispose: (cb: (data: any) => void) => void;
    data: any;
}

interface NodeModule {
    hot?: ImportHot;
}

declare module "url:*" {
    const content: string;
    export default content;
}
