import { IsString } from "class-validator";
// dto >> data transfear object
export class CreateMessageDto {
  @IsString()
  content: string;
}
