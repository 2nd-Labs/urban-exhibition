## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Image options

The generated image can be saved using the browser's image context menu. URL parameters customize its appearance:

- `pattern`: `random` (default), `checkerboard`, `columns`, or `rows`
- `alpha` and `beta`: hexadecimal colors without a leading `#`
- `long=true`: use taller tiles
- `random=true`: force the random pattern

For example: `/?pattern=checkerboard&alpha=1e1e1e&beta=f5f5f5`.

## Tests

Run the frontend tests once with `npm test`, or use `npm run test:watch` while developing.
