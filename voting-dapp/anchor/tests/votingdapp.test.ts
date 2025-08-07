import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { BankrunProvider, startAnchor } from "anchor-bankrun";

import { Keypair, PublicKey } from '@solana/web3.js';
import { describe, it } from 'node:test';
import { Votingdapp } from "../target/types/votingdapp";
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';

const IDL = require("../target/idl/votingdapp.json");

const votingAddress = new PublicKey("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

describe("votingdapp", () => {
    it("Intialize Poll", async () => {

        const context = await startAnchor("", [{ name: "votingda", programId: votingAddress }], []);

        const provider = new BankrunProvider(context);


        const votingDappProgram = new Program<Votingdapp>(
            IDL,
            provider,
        );
        await votingDappProgram.methods.initializePoll(
            new anchor.BN(1),
            'this is voting dapp',
            new anchor.BN(0),
            new anchor.BN(1854495613)
        ).rpc();
        // const puppetKeypair = Keypair.generate();


    })
})