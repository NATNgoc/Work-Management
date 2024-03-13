
import { Session } from "./authentication/entities/session.entity";
import { RefreshToken } from "./authentication/entities/refresh-token.entity";
import { User } from "./users/entities/users.entity";

export const entities=[User, RefreshToken, Session]