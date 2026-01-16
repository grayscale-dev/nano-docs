# Apryse WebViewer (Next.js + TailwindCSS)

This scaffold wires Apryse WebViewer into a Next.js App Router project with Tailwind styling.

## Quick start
```bash
npm install
```

Install the Apryse WebViewer package and copy its static assets:
```bash
npm install @pdftron/webviewer
mkdir -p public/webviewer
cp -R node_modules/@pdftron/webviewer/public/* public/webviewer/
```

Add a sample document:
```bash
cp path/to/your.pdf public/sample.pdf
```

Add your Apryse key in `.env.local`:
```bash
NEXT_PUBLIC_APRYSE_KEY=YOUR_KEY_HERE
```

Run the app:
```bash
npm run dev
```

## Files to know
- `app/page.tsx` renders the viewer and marketing shell.
- `components/ApryseViewer.tsx` initializes WebViewer in a client component.
- `app/globals.css` defines Tailwind baseline styles.
