import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTerminalRequestDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  cols: number

  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  rows: number
}
