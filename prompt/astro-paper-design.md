# Astro Paper Design Knowledge

Astro Paper is a minimal, responsive, accessible, and SEO-friendly Astro blog theme. 

## Key Technical Specifications
- **Framework**: Astro 
- **Styling**: TailwindCSS
- **Type Checking**: TypeScript
- **Search**: FuseJS (or Pagefind)
- **Icons**: Tabler Icons

## Project Structure
- `src/pages/`: Contains Astro or Markdown files representing routes.
- `src/components/`: Reusable UI components.
- `src/layouts/`: Astro layouts for the pages.
- `src/styles/`: Global stylesheets (including base CSS with Tailwind layers).
- `src/config.ts` & `src/constants.ts`: Contains site-wide configurations.

## Design Modification Guidelines
When implementing design changes on an Astro Paper site, we follow these principles:
1. **Leverage Tailwind CSS**: Use Tailwind utility classes for styling. Avoid writing raw CSS unless necessary for highly custom animations or complex selectors.
2. **Respect Accessibility (a11y)**: Keep semantic HTML structure intact. Ensure color contrast and structural elements align with screen-reader friendly practices (keyboard navigability, ARIA attributes when applicable).
3. **Responsive First**: Ensure that any structural design changes look good on mobile, tablet, and desktop views by using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`).
4. **Theme Variability**: Astro Paper supports built-in light and dark themes. We must utilize CSS variables defined in global styles or Tailwind's `dark:` classes to ensure any added components match both themes correctly.
5. **Minimal Diffing (Crucial)**: We must make requested changes while touching as few core Astro files as possible. This ensures that when the upstream AstroPaper theme updates, the `git rebase` experience is painless. Prefer modifying configs (`config.ts`, `constants.ts`) or isolating edits to single components instead of rewriting core page layouts.

## Iterative Process
- Before making significant layout changes, propose the design options to the user.
- Finalize the layout structure using Astro layout files and Tailwind configurations.
- Verify the responsive functionality on both themes.
