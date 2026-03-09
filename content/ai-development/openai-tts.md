# OpenAI Text-to-Speech (TTS)

OpenAI's Text-to-Speech API converts text into natural-sounding spoken audio. It offers multiple voice options, two quality tiers, and supports various output formats. TTS is useful for building voice assistants, accessibility features, audio content, and narration tools.

## Available Models

- **tts-1**: Optimized for low latency, suitable for real-time applications
- **tts-1-hd**: Higher quality audio, best for pre-generated content

## Voices

OpenAI provides six built-in voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, and `shimmer`. Each has a distinct tone and character.

## Getting Started

```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI();

const response = await openai.audio.speech.create({
  model: 'tts-1',
  voice: 'alloy',
  input: 'Hello! Welcome to our application.',
});

// Save to file
const buffer = Buffer.from(await response.arrayBuffer());
fs.writeFileSync('output.mp3', buffer);
```

## Streaming Audio in a Next.js API Route

```typescript
// app/api/tts/route.ts
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { text, voice = 'alloy' } = await req.json();

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
    response_format: 'mp3',
  });

  return new Response(response.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });
}
```

## Output Formats

| Format | Use Case |
|--------|----------|
| `mp3` | Default, widely compatible |
| `opus` | Low latency streaming |
| `aac` | iOS/Android native playback |
| `flac` | Lossless audio |
| `wav` | Uncompressed audio |
| `pcm` | Raw audio for real-time processing |

## Use Cases

- **Accessibility**: Read content aloud for visually impaired users
- **Voice assistants**: Speak AI responses in chat applications
- **Audio content**: Generate podcasts, audiobooks, or narration
- **Language learning**: Pronounce words and phrases for learners
- **Notifications**: Audio alerts and announcements

## Best Practices

- Use `tts-1` for real-time applications where speed matters
- Use `tts-1-hd` for pre-generated content where quality is the priority
- Test all six voices to find the best match for your application's tone
- Cache generated audio for frequently used phrases to reduce API calls

## Resources

- [OpenAI TTS Guide](https://platform.openai.com/docs/guides/text-to-speech)
- [TTS API Reference](https://platform.openai.com/docs/api-reference/audio/createSpeech)
