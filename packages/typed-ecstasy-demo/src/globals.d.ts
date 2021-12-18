interface ImportHot {
    accept: () => void;
    dispose: (cb: (data: any) => void) => void;
    data: any;
}

interface NodeModule {
    hot?: ImportHot;
}
