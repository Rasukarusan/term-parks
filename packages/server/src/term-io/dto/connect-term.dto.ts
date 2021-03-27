import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class ConnectTermDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  pid: number
}
