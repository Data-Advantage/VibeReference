# Unstructured

Unstructured is a data processing library and API for extracting content from documents like PDFs, Word files, HTML pages, images, and more. It converts unstructured documents into clean, structured data that can be used in AI applications, RAG pipelines, and search systems.

## Why Unstructured?

- **Document parsing**: Extract text, tables, and metadata from PDFs, DOCX, PPTX, and more
- **Multiple formats**: Supports 20+ file types including images with OCR
- **Chunking**: Automatically splits documents into semantically meaningful chunks
- **RAG-ready**: Output is optimized for embedding and retrieval in AI applications
- **API and library**: Use as a Python library or hosted API service

## Use Cases

- **RAG pipelines**: Process documents for retrieval-augmented generation
- **Document search**: Index documents for semantic search
- **Data extraction**: Pull structured data from invoices, reports, and forms
- **Knowledge bases**: Build searchable knowledge bases from document collections
- **Compliance**: Extract and analyze content from legal and regulatory documents

## Getting Started (API)

```typescript
const response = await fetch('https://api.unstructured.io/general/v0/general', {
  method: 'POST',
  headers: {
    'unstructured-api-key': process.env.UNSTRUCTURED_API_KEY!,
  },
  body: formData, // FormData with the file
});

const elements = await response.json();
// elements is an array of extracted content blocks
```

## Integration with AI

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// After extracting document content with Unstructured:
const documentText = elements.map(el => el.text).join('\n');

const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: `Summarize this document:\n\n${documentText}`,
});
```

## Resources

- [Unstructured Documentation](https://docs.unstructured.io)
- [Unstructured API](https://unstructured.io)
- [Unstructured GitHub](https://github.com/Unstructured-IO/unstructured)
