import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BlockchainService } from './blockchain.service';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('blockchain')
export class BlockchainController {

    constructor(private blockchainService: BlockchainService) {}

    @Get("transaction")
    handleTransaction(@GetUser() user: User) {
        return this.blockchainService.checkTransaction(user.telegramId);
    }

    @Post("withdraw")
    handleWithdraw(@Body() body: { amount: number, address: string }, @GetUser() user: User) {
        return this.blockchainService.withDrawFunds(user.telegramId, body.amount, body.address);
    }
}
