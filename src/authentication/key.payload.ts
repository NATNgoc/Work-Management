import { User } from "src/users/entities/users.entity"

export class TokenPayload {
    user_id: string
    session_id: string
}

export default TokenPayload