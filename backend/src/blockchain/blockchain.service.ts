import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from "axios";
import { PrismaService } from 'src/prisma/prisma.service';

import { mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV4, TonClient, internal, fromNano, Address } from '@ton/ton';

@Injectable()
export class BlockchainService 
{
    constructor(
        private prisma: PrismaService,
      ) {}

    async getTransactions(address: string): Promise<any> {
        const url = "https://toncenter.com/api/v2/getTransactions";
        const params = {
            address: address,
            limit: 3,
            to_lt: 0,
            archival: true,
        };

        const headers = {
            "X-API-Key": process.env.TON_CENTER_API_KEY
        };

        try {
            const response = await axios.get(url, { headers, params });
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении транзакций:", error);
            throw error;
        }
    }

    decodeComment(msg_data: any): string {
        if (!msg_data) return "";

        const msgType = msg_data["@type"] || "";
        if (msgType === "msg.dataText") {
            const textB64: string = msg_data["text"] || "";
            try {
                return Buffer.from(textB64, "base64").toString("utf-8");
            } catch (error) {
                return textB64;
            }
        } else {
            return "";
        }
    }

    extractTransactionInfo(tx: any): { time_str: string; sender: string; value: string; comment: string } {
        const utime = tx["utime"];
        let time_str = "неизвестно";
        if (utime) {
            time_str = new Date(utime * 1000).toISOString().replace("T", " ").split(".")[0];
        }

        const in_msg = tx["in_msg"] || {};
        const sender = in_msg["source"] || "неизвестно";
        const value = in_msg["value"] || "0";
        const msg_data = in_msg["msg_data"] || {};
        const comment = this.decodeComment(msg_data);

        return { time_str, sender, value, comment };
    }

    async checkTransaction(telegramId: bigint): Promise<any> {
        try {
            const transactions = await this.getTransactions(process.env.TON_CENTER_WALLET);
            if (transactions.ok && transactions.result) {
                for (const tx of transactions.result) {
                    const { time_str, sender, value, comment } = this.extractTransactionInfo(tx);

                    if (
                        comment &&
                        comment == String(telegramId))
                    {
                        await this.prisma.user.update({
                            where: { telegramId: telegramId },
                            data: {
                              balance: { increment: Number(value) / 1e9 },
                            },
                        });

                        return {
                            message: `TON TRANSACTION ${time_str} -> ${sender} for ${telegramId} | AMOUNT: ${value}`
                        };
                    }

                    continue;
                }
            } else {
                throw new ForbiddenException("Ошибка получения транзакций или пустой результат");
            }
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    async convertSecretWordsToTonCredentials(mnemonic: string) {
        try {
            const keyPair = await mnemonicToPrivateKey(mnemonic.split(' '));
            const wallet = WalletContractV4.create({
                workchain: 0,
                publicKey: keyPair.publicKey
            });
            
            return {
                address: wallet.address.toString({ bounceable: false, urlSafe: true }),
                privateKey: keyPair.secretKey.toString('hex'),
                publicKey: keyPair.publicKey.toString('hex')
            };
        } catch (error) {
            throw new Error(`Failed to convert secret words: ${error instanceof Error ? error.message : error}`);
        }
    }
    
    async sendTon(fromPrivateKeyHex: string, toAddress: string, amount: number) {
        try {
            const client = new TonClient({
                endpoint: 'https://toncenter.com/api/v2/jsonRPC',
                apiKey: process.env.TON_CENTER_API_KEY
            });
    
    
            // Validate and prepare private key
            const secretKeyBuffer = Buffer.from(fromPrivateKeyHex.slice(0, 128), 'hex');
            const publicKey = secretKeyBuffer.subarray(32); // Extract public key from secret
            
            const wallet = WalletContractV4.create({
                workchain: 0,
                publicKey: publicKey
            });
    
            const contract = client.open(wallet);
            const seqno = await contract.getSeqno();
            
            const transfer = contract.createTransfer({
                seqno,
                secretKey: secretKeyBuffer,
                messages: [internal({
                    to: Address.parse(toAddress),
                    value: fromNano(amount),
                    bounce: false
                })]
            });
    
            await contract.send(transfer);
            return { success: true, seqno };
        } catch (error) {
            throw new Error(`Failed to send TON: ${error instanceof Error ? error.message : error}`);
        }
    }
    
    async withDrawFunds(telegramId: bigint, amount: number, tonAddress: string) {
        try {
            const mnemonic = process.env.TON_CENTER_WALLET_WORDS;
    
            const credentials = await this.convertSecretWordsToTonCredentials(mnemonic);
            console.log('------TON NETWORK-------')
            console.log('Address:', credentials.address);
            console.log('Private Key:', credentials.privateKey);
    
            const user = await this.prisma.user.findUnique({
                where: {
                    telegramId: telegramId
                }
            });

            if (
                user.balance != 0 &&
                user.balance >= amount)
            {
                await this.sendTon(
                    credentials.privateKey,
                    tonAddress,
                    amount * 1e9
                );

                await this.prisma.user.update({
                    where: {
                        telegramId: telegramId
                    },
                    data: {
                        balance: { decrement: amount },
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
}