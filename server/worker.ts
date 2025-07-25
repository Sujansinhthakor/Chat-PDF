import { Worker } from 'bullmq';

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import type { AttributeInfo } from "langchain/chains/query_constructor";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { OpenAI } from "openai";

import * as dotenv from 'dotenv';
dotenv.config();
const apiKey_OPENAI = process.env.OPENAI_API_KEY;
const apiKey_qdrant = process.env.QDRANT_URL;


const worker = new Worker('pdf-upload-queue', async job => {
    if (job.name === 'file-uploaded') {
        const data = JSON.parse(job.data);
        console.log('reacher at job worker')
        const loader = new PDFLoader(data.path);
        const docs = await loader.load();
        console.log(docs)

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await splitter.splitDocuments(docs);
        console.log(chunks);
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
            apiKey: apiKey_OPENAI
        });

        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: apiKey_qdrant,
            collectionName: "langchainjs-testing",
        });
        await vectorStore.addDocuments(chunks);

    }
}, {
    concurrency: 100, connection: {
        host: 'localhost',
        port: 6379
    }
});
