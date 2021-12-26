export const PostConstruct = Symbol("Post Construct Callback");
export const PreDestroy = Symbol("Pre Destroy Callback");

export interface ServiceInstance {
    [PostConstruct]?: () => void;
    [PreDestroy]?: () => void;
}
