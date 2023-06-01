import { Member } from "./Member"

export interface GroupMembers{
    id: number,
    memberId: number,
    groupId: number
    members: {
        id: number,
        name: string,
        email: string
    }
}
