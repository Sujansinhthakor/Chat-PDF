import express, { Request, Response } from "express";
import multer from 'multer';
import cors from 'cors';
import { Queue } from 'bullmq';

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAI } from "openai";

import * as dotenv from 'dotenv';
dotenv.config();

const apiKey_OPENAI = process.env.OPENAI_API_KEY;
const apiKey_qdrant = process.env.QDRANT_URL;

const openClient = new OpenAI({ apiKey: apiKey_OPENAI });

const queue = new Queue('pdf-upload-queue', {
    connection: {
        host: 'localhost',
        port: 6379
    }
})

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post('/upload/pdf', upload.single('pdf'), async (req: Request, res: Response) => {
    await queue.add(
        'file-uploaded',
        JSON.stringify({
            filename: req.file?.originalname,
            path: req.file?.path
        }))
    return res.json({ message: "PDF uploaded" })
})
app.get('/chat', async (req: Request, res: Response) => {
    const userQuery: string = req.query.message!.toString();
    if (userQuery == 'undefined') { return res.json({ error: "Empty Query" }) }
    console.log(userQuery)
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: apiKey_OPENAI
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: apiKey_qdrant,
        collectionName: "langchainjs-testing",
    });
    const retriever = vectorStore.asRetriever({
        // Optional filter
        // filter: filter,
        k: 2,
    });
    const a = await retriever.invoke(userQuery);
    console.log(a);

    const prompt = `Answer the question based only on this context CONTEXT :${JSON.stringify(a[0].pageContent)}`
    const chatResponse = await openClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": userQuery },
        ],
        temperature: 0,
    })
    // console.log(res);
    return res.json({
        message: chatResponse.choices[0].message.content,
        Reference: {
            'Page Number': a[0].metadata.loc.pageNumber,
            'Lines': a[0].metadata.loc.lines
        }
    });
})

app.listen(8000, () => console.log(`Server is listing on port:${8000}`));