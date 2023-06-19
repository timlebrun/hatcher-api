import { IsString } from "class-validator";

export class HatcherAuthUserEntity {
	id: number;

	displayName: string;

	info: Record<string, any>;
  
	authIdentifier: string;
	authSecret: string;
  
	seenAt: Date | null;
	deletedAt: Date | null;
  
	updatedAt: Date;
	createdAt: Date;
}

export class HatcherAuthUserSigninDto {
	@IsString()
	displayName: string;

	@IsString()
	authIdentifier: string;

	@IsString()
	authPassword: string;
}
