import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Post {
    id: bigint;
    title: string;
    externalLink?: string;
    description: string;
    author: Principal;
    timestamp: bigint;
}
export interface PostInput {
    title: string;
    externalLink?: string;
    description: string;
}
export interface backendInterface {
    ageGate(ageConfirmed: boolean): Promise<void>;
    createPost(input: PostInput): Promise<void>;
    deletePost(id: bigint): Promise<void>;
    getPost(id: bigint): Promise<Post>;
    listPosts(limit: bigint): Promise<Array<Post>>;
}
