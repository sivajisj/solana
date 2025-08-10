import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Votingdapp } from "@/../anchor/target/types/votingdapp";
import { BN, Program } from "@coral-xyz/anchor";


export const OPTIONS = GET;
const IDL = require('@/../anchor/target/idl/votingdapp.json');


export async function GET(request: Request) {
    const actionMetaData: ActionGetResponse = {
        icon: "https://zestfulkitchen.com/wp-content/uploads/2021/09/Peanut-butter_hero_for-web-2.jpg",
        title: "Vote for your favorite type of peanut butter!",
        description: "Vote between crunchy and smooth butter.",
        label: "Vote",
        links: {
            actions: [
                {
                    type: "transaction",
                    label: "Vote for walter.",
                    href: "api/vote?candidate=walter",
                },
                {
                    type: "transaction",
                    label: "Vote for jessy.",
                    href: "api/vote?candidate=jessy",
                },
            ]
        }

    }
    return Response.json(actionMetaData, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
    const url = new URL(request.url)
    const candidate = url.searchParams.get("candidate")

    if (candidate != "walter" && candidate != "jessy") {
        return new Response("Invalid Candidate", { status: 404, headers: ACTIONS_CORS_HEADERS })
    }

    const connection = new Connection("https://silver-rotary-phone-jw6rq647jw52pggq-8899.app.github.dev", "confirmed");
    const program: Program<Votingdapp> = new Program(IDL, { connection });

    const body: ActionPostRequest = await request.json();
    let voter;

    try {
        voter = new PublicKey(body.account)

    } catch (error) {
        return new Response("Invalid Candidate", { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
    const instruction = await program.methods
        .vote(candidate, new BN(1))
        .accounts({
            signer: voter,
        })
        .instruction();

    const blockhash = await connection.getLatestBlockhash();




    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(instruction);

    const response = await createPostResponse({
        
        fields: {
            type: "transaction",
            transaction: transaction
        }
    });

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });

}

