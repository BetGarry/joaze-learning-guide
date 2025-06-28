# JOAZE Learning Guide

This directory contains an example React + WebGI project used to demonstrate how JOAZE.LT loads a 3D model and provides an interactive manual for customers.

## Project Purpose

The project combines a WebGI viewer with a step‑by‑step guide so users can explore jewellery configurations and follow instructions about the purchasing flow. The viewer loads a `.vjson` scene and, if a ShapeDiver ticket is supplied, connects to a ShapeDiver session for parameter control.

## Installation

Use **npm** to install the dependencies:

```bash
cd 00_joaze-learning-guide
npm install
```

## Starting the Dev Server

Run the Vite development server with:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

## ShapeDiver Tickets

`src/webgiInit.ts` retrieves a ticket from the query parameter `t` or from `localStorage`, falling back to a built‑in `DEFAULT_TICKET` if none is supplied. Tickets are stored in `localStorage` for reuse:

```ts
let ticket = getUrlQueryParam('t');
const modelViewUrl = getUrlQueryParam('u') || "https://sdeuc1.eu-central-1.shapediver.com";
if (!ticket) {
  ticket = localStorage.getItem('shapediver_ticket') || '';
} else {
  localStorage.setItem('shapediver_ticket', ticket);
}
if (!ticket) {
  ticket = DEFAULT_TICKET;
}
```

## Viewer and Manual

The WebGI viewer is initialised in `webgiInit.ts`, which also handles ShapeDiver session creation and moves the parameter UI into the React component. The main user manual lives in `src/App.tsx` and renders an “Interaktyvus vartotojo vadovas” header as part of the guide:

```tsx
<h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
  JOAZE.LT
</h1>
<p className="text-sm text-slate-300">Interaktyvus vartotojo vadovas</p>
```

## Environment Files

If environment variables are required, place `.env` or `.env.local` files in the `00_joaze-learning-guide` directory. Vite will automatically load them when the server starts.

