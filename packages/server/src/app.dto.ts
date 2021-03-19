import { ApiProperty } from '@nestjs/swagger'

export class CreateTerminalRequestDto {
  @ApiProperty()
  cols!: number

  @ApiProperty()
  rows!: number
}

export class GetTerminalRequestDto {
  @ApiProperty()
  pid!: number
}
