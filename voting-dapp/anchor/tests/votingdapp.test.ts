import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { BankrunProvider, startAnchor } from "anchor-bankrun";

import { Keypair, PublicKey } from '@solana/web3.js';

import { Votingdapp } from "../target/types/votingdapp";
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';
import { log } from 'console';

const IDL = require("../target/idl/votingdapp.json");

const votingAddress = new PublicKey("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

describe("votingdapp", () => {
    let context;
    let provider;
    let votingDappProgram;

    beforeAll(async () => {

        context = await startAnchor("", [{ name: "votingdapp", programId: votingAddress }], []);

        provider = new BankrunProvider(context);


        votingDappProgram = new Program<Votingdapp>(
            IDL,
            provider,
        );
    })
    it("Intialize Poll", async () => {

        await votingDappProgram.methods.initializePoll(
            new anchor.BN(1),
            'this is voting dapp',
            new anchor.BN(0),
            new anchor.BN(1854495613)
        ).rpc();
        
        const [pollAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)], votingAddress
        )

        const poll = await votingDappProgram.account.poll.fetch(pollAddress);
        console.log(poll);



        expect(poll.pollId.toNumber()).toEqual(1);
        expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());
        expect(poll.description.toString()).toEqual('this is voting dapp');


    })

    it("Intialize Candidate", async () => {
        await votingDappProgram.methods.initializeCandidate(
            'Walter',
            new anchor.BN(1),
        ).rpc();
          await votingDappProgram.methods.initializeCandidate(
            'Jessy',
            new anchor.BN(1),
        ).rpc();
      const [walterAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Walter")], votingAddress
        )
        const walterCandidate = await votingDappProgram.account.candidate.fetch(walterAddress)
        // console.log("walter : ",walterCandidate);
         const [jessyAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Jessy")], votingAddress
        )
        const jessyCandidate = await votingDappProgram.account.candidate.fetch(jessyAddress)
        // console.log("jessy : ",jessyCandidate);

        expect(walterCandidate.candidateName.toString()).toEqual('Walter');
        expect(walterCandidate.candidateVotes.toNumber()).toEqual(0);

        expect(jessyCandidate.candidateName.toString()).toEqual('Jessy');
        expect(jessyCandidate.candidateVotes.toNumber()).toEqual(0);
        

    })

    it("vote", async () => {

         await votingDappProgram.methods.vote(
            'Walter',
            new anchor.BN(1),
        ).rpc();

         const [walterAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Walter")], votingAddress
        )
         const walterCandidate = await votingDappProgram.account.candidate.fetch(walterAddress)
        console.log("walter : ",walterCandidate);
             expect(walterCandidate.candidateName.toString()).toEqual('Walter');
        expect(walterCandidate.candidateVotes.toNumber()).toEqual(1);





    })
})