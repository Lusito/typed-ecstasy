export function getName(object: any): string {
    return "name" in object ? object.name : String(object);
}
