import { Post } from "./PostEvent"
export interface Topic {
    id: number,
    name: string,
    posts: [Post]
}
