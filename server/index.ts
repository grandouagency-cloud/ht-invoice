import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pdfRouter from './routes/pdf';
import emailRouter from './routes/email';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_, res) => res.json({ ok: true, service: 'ht-invoice-api' }));
app.use('/api/pdf', pdfRouter);
app.use('/api/email', emailRouter);

app.listen(PORT, () => console.log(`ht-invoice API running on :${PORT}`));
