import { Role } from "src/common/enums/role.enum";

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};
