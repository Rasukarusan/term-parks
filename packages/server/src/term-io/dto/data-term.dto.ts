import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class DataTermDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  pid: number

  @ApiProperty()
  data: any
}
