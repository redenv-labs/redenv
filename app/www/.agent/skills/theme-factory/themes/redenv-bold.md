---
name: redenv-bold
description: A high-contrast, developer-centric dark theme inspired by Vercel, Supabase, and Upstash. Features deep blacks, vibrant red accents, and subtle glassmorphism.
colors:
  primary: "#FF3333"
  primary-foreground: "#FFFFFF"
  secondary: "#1A1A1A"
  secondary-foreground: "#FFFFFF"
  background: "#000000"
  foreground: "#EDEDED"
  success: "#00E054"
  warning: "#FFB020"
  error: "#FF3333"
  muted: "#111111"
  muted-foreground: "#888888"
  border: "#333333"
fonts:
  heading: "Geist Sans"
  body: "Geist Sans"
  code: "Geist Mono"
---

# Redenv Bold Theme

## Color Palette

| Color          | Hex       | Usage                               |
| -------------- | --------- | ----------------------------------- |
| **Background** | `#000000` | Main background (True Void)         |
| **Foreground** | `#EDEDED` | Main text color                     |
| **Primary**    | `#FF3333` | Brand accent (Redenv Red)           |
| **Secondary**  | `#1A1A1A` | Card backgrounds, secondary actions |
| **Border**     | `#333333` | Subtle dividers and outlines        |
| **Muted**      | `#111111` | Secondary backgrounds               |
| **Success**    | `#00E054` | Success states                      |

## Typography

- **Headings**: `Geist Sans` (Bold, Tight Tracking)
- **Body**: `Geist Sans` (Regular, Relaxed Line Height)
- **Code**: `Geist Mono` (For terminal/secrets)

## Visual Style

- **Glassmorphism**: High usage of `backdrop-blur-md` with `bg-white/5`.
- **Glows**: Gradient meshes using Primary Red (`#FF3333`) at low opacity (`opacity-20` blur-3xl).
- **Grids**: Subtle background grids (`bg-grid-white/[0.05]`).
