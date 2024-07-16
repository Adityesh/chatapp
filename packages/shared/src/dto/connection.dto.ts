import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional } from "class-validator";
import ConnectionStatusEnum from "../enums/connection.enum";

export class GetConnectionsDto {
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Type(() => Number)
  page: number;


  @IsOptional()
  @IsEnum(ConnectionStatusEnum)
  status? : ConnectionStatusEnum


  @IsOptional()
  type? : "requested" | "sent"

}
