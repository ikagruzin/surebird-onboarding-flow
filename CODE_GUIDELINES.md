# Code guidelines

## 📁 Folder structure

### Frontend

A typical React or React Native project at Reversed will have the following folder structure:

```jsx
- components
  - ui -> reusable ui components
  - auth -> components for the auth domain (example)
  - navigation -> components for the navigation domain (example)
- app (web or native) -> only routes or screens
- graphql (optional) -> *.graphql files
- lib -> util functions
- hooks -> hooks
- tools -> internal tools (generate-rapport.ts for example)
```

### Backend

A typical backend project at Reversed will have the following structure

```jsx
- providers -> internal & external providers (for example adyen or resend)
- trpc (optional) -> trpc producer
- graphql (optional) -> graphql schema
- webhooks (optional) -> webhook routes
- routes (optional) -> public api routes
- lib -> util functions
- tools -> internal tools (generate-rapport.ts for example)
```

> In both projects, prefer a flat structure. So add a helper to the root of the lib folder until it makes sense to move it to a domain-specific subfolder.

## 🔌 tRPC Procedures

- One procedure per file. File name must match procedure name in kebab-case.
- Define input and output schemas as separate constants above procedure definitions (not inline).
- Define dummy/mock data as static UPPER_CASE constants above procedure definitions.
- Use shared utility functions for common operations (e.g., pagination).

## 💬 File names

We always use `kebab-case` for file- and folder names. If a file exports a single React component or function make sure the filename is the same as the export: `my-component` -> `export function MyComponent() {}`

- For tRPC procedures: `get-summary-statistics.ts` -> `export const getSummaryStatistics = ...`

⚛️ ## React Components

Use named exports, destructure props and export a function

```
// ✅  Use this
export function Component ({title, subtitle}: ComponentProps) { return ... }
```

```
// ❌ Instead of this
const Component:FC<ComponentProps> = () => null
export default Component
```

Components that are not re-used can be in the same file as the component where they are used.

```
// ✅ This is ok
// components/navigation.tsx
export function Navigation() {

  return <nav>
    <NavLink href="/">Home</NavLink>
    <NavLink href="/settings">Settings</NavLink>
  </nav>
}

function NavLink({href, children}: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return <Link href={href} cn={{isActive && "text-primary"}}>{children}<Link>
}
```

> Split the file into chunks in case the file gets to big or parts of the component need to be a client component

➡️ **Exception for pages or screens**

## 🧱 Composition vs props

Be considerate of when to use children and allow composition vs when to restrict via props.

For example:

```
// ✅ This can be a good pattern because we restrict children and only allow an array of image URLs
<Carousel images={['image1.jpg', 'image2.jpg']} />

// ❌ But this can be limiting in the long run
<ActionBar actions={[{type: "button", label: "Delete"}, {type:"button", label:"Edit"}]} />

// 💡 Because we want to do this in the future
<ActionBar actions={[<Button />,<EditDialog />]} />
```

### Use functions

Prefer **_function_** over const

```
// ❌ Don't do this
export function Button (props: ButtonProps) {
  const handleClick = () => {
		alert('click')
  }

  return (
		<button onClick={handleClick} />
	)
}
```

```
// ✅ Do this
export function Button (props: ButtonProps) {
	function handleClick() {
		alert('click')
	}

  return (
		<button onClick={handleClick} />
	)
}
```

**Move pure functions outside the component**

```
// ❌ Don't do this
export function Button (props: ButtonProps) {
  return (
		<button
			style={getButtonStyle(arg)}
			onClick={handleClick} />
	)
  function getButtonStyle(arg) {}
}
```

```
// ✅ Do this
export function Button (props: ButtonProps) {
  return (
		<button
			style={getButtonStyle(arg)}
			onClick={handleClick} />
	)
}
function getButtonStyle(arg) {}
```

_In this example_ `getButtonStyle` is a pure function that should always return the same output if `arg` is the same, hence a pure function. There's no need to have it inside the component itself as that would mean it's redefined on every render.

### Avoid helper-function sprawl

Do not extract tiny one-off helpers just to name a line or two of obvious logic. AI-generated code often creates many small helpers like `getX`, `buildY`, or `formatZ` that are only used once and force the reader to jump around the file. This quickly turns a straightforward component into spaghetti.

Prefer keeping simple logic inline when it is only used once and easy to read at the callsite.

- Inline simple guards, short conditionals, small object literals, and straightforward `map`/`filter` transforms.
- Do not extract a helper if the helper name is not more meaningful than the code itself.
- Do not create chains of helpers that only call other helpers.
- Avoid pass-through wrappers around library APIs unless they add real domain meaning.

Extract a helper when it clearly improves the code:

- The logic is reused in multiple places.
- The logic has domain meaning and a well-named function makes the code easier to understand.
- The logic is complex enough that inlining would hurt readability.
- The logic is pure business logic that should be tested independently from the component.

Rule of thumb: if a helper is used once, is only a few lines long, and is easy to understand in place, keep it inline.

```tsx
// ❌ Avoid: one-off helper with no extra meaning
export function ListingCard({ listing }: ListingCardProps) {
  return <Badge>{getStatusLabel(listing.isPublished)}</Badge>
}

function getStatusLabel(isPublished: boolean) {
  return isPublished ? "Published" : "Draft"
}
```

```tsx
// ✅ Prefer: inline simple one-off logic
export function ListingCard({ listing }: ListingCardProps) {
  return <Badge>{listing.isPublished ? "Published" : "Draft"}</Badge>
}
```

### Extend the elements props

In most cases it makes sense to allow the default properties of HTML or native elements on your main exported element. For example:

```
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant: "primary" | "secondary"
}
export function Button ({variant, ...rest}: ButtonProps) {
	return (
		<button data-variant={variant} onChange={onChangeHandler} {...rest} />
	)
}
```

### Prefer string literals over boolean props

String literals ensure a single source of truth and prevent race conditions, for example:

```
// ✅ Do this
interface ButtonProps = {
  variant: "primary" | "secondary"
  status: "disabled" | "idle" | "loading"
}
// ❌ Don't do this
interface ButtonProps = {
  isPrimary: boolean
  isSecondary: boolean
  isDisabled: boolean
}
```

### Prefer interface over type

```
// ✅ Do this
interface ComponentProps = {
  children?: React.ReactNode
}

// ❌ Don't do this
interface ComponentProps = {
  children?: React.ReactNode
}

💡 This is fine
interface TextVariantProps = {
  variant: "text"
}

interface IconVariantProps = {
  variant: "icon"
}

type ComponentProps = TextVariantProps | IconVariantProps

💡 And this too
type Variant = "variant-1" | "variant-2"

```

## ⚠️ Use `useEffect` sparingly

We follow React's [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) guidance: `useEffect` is an escape hatch, not a default tool.

`useEffect` is for synchronizing React with external systems. It should be rare in feature code. In practice, unnecessary effects tend to introduce hidden coupling, race conditions, infinite loops, unnecessary renders, and dependency-array bugs. This matters even more with AI-assisted code generation, where `useEffect` is often added "just in case".

Use these rules instead:

- Derive state during render. If a value can be calculated from props or other state, do not mirror it into state.
- Use `useMemo` only for expensive pure calculations, and only when there is a measured performance reason.
- Keep user-driven actions in event handlers. Do not set a flag and wait for an effect to do the real work.
- Use the app's data-fetching abstractions instead of effect-based fetching. In this repo, prefer Server Components on the server and TanStack Query + tRPC query hooks on the client.
- Reset state with `key` when component identity changes instead of writing reset effects tied to props or ids.
- Lift state up or use controlled components instead of keeping parent and child state in sync through an effect.
- Do not chain effects to compute the next state. Compute what you can during render and update related state together in the event handler that caused the change.
- Use `useEffect` when you truly need to synchronize with an external system such as the DOM, a browser API, subscriptions, timers, or a third-party widget lifecycle.
- If a mount-only effect is reused or deserves a clearer name, consider isolating it in a narrowly scoped custom hook such as `useMountEffect`.
- If something must run once per app load, prefer the application entry point or root module over a component effect.

Before writing an effect, ask:

- Is there an external system involved?
- Can this be derived during render instead?
- Can this happen directly in the event handler that caused it?
- Should this be handled by TanStack Query, tRPC, or a Server Component instead?
- Would a `key`-based remount express the reset more clearly?

Smell tests:

- You are about to write `useEffect(() => setX(deriveFromY(y)), [y])`
- State is being used as a flag so an effect can do the real action
- An effect does `fetch(...)` and then `setState(...)`
- An effect only exists to reset local state when an id or prop changes
- Two pieces of state need to stay in sync

```tsx
// ❌ Avoid: redundant derived state
const [visibleListings, setVisibleListings] = useState<Listing[]>([])

useEffect(() => {
  setVisibleListings(listings.filter((listing) => listing.isActive))
}, [listings])

// ✅ Prefer: derive during render
const visibleListings = listings.filter((listing) => listing.isActive)
```

```tsx
// ❌ Avoid: effect as an action relay
const [shouldSubmit, setShouldSubmit] = useState(false)

useEffect(() => {
  if (shouldSubmit) {
    submitForm()
    setShouldSubmit(false)
  }
}, [shouldSubmit])

// ✅ Prefer: do the work in the handler
function handleSubmit() {
  submitForm()
}
```

# Hooks, helpers & tests

Having hooks and (pure) helper functions makes testing easier. We store hooks in the hooks folder and helpers in the lib folder. Tests are suffixed with `.test.ts(x)` and put alongside the file it’s testing.

Example for a signup component:

```bash
components/auth/signup-form.tsx -> SignupForm component
hooks/use-signup-form.ts -> useSignupForm hook
hooks/use-signup-form.test.ts -> useSignupForm hook test
helpers/verify-password-strength.ts -> verifyPasswordStrength helper
helpers/verify-password-strength.spec.ts -> verify-password-strength helper test
```

For tests, prefer a flat structure:

```
// ❌ Don’t
describe(('Description') => {
  it("should do X", () => {})
  it("should do Y", () => {})
})

// ✅ Do this
it("should do X", () => {})
it("should do Y", () => {})
```

> Helpers, hooks and reducers should always be accompanied with a unit test

## 📦 Shared Types & Schemas

- Define types as Zod schemas in `packages/shared/schemas/`.
- Export all schemas and types from `packages/shared/schemas/index.ts`.
- Use `z.enum()` for string literal union types.
- Paginated results use `PaginatedResult<T>` with `total` and `items` properties.

## 💪 Offensive programming

Avoid overly defensive programming. Instead, type as strict as possible and throw errors often.

```ts
// ❌ Don’t
function capitalize(str?: string | null) {
  if (typeof str !== "string") {
    return "";
  }

  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}

const name = capitalize(user?.profile?.name || "Anonymous");

// ✅ Do
function capitalize(str: string) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}

invariant(user, "User is not logged in");
invariant(user.profile, "User is logged in, but doesn't have a profile");
const name = capitalize(user.profile.name);
```

```tsx
// ❌ Don't
function getUserName(user) {
  if (!user?.name) {
    // Is user undefined or is user.name undefined? Unclear!
    return "Anonymous";
  }
  return user.name;
}

function getCity(user) {
  if (!user?.address?.city) {
    // What exactly is undefined here? What happened??
    return "";
  }
  return user.address.city;
}

const user = users.find((possibleMatch) => possibleMatch.id === userId);
const userName = getUserName(user);
const userCity = getCity(user);

// ✅ Do
const user = users.find((possibleMatch) => possibleMatch.id === userId);
invariant(user, `Cannot find a user with id ${userId}`);

// We know for a fact that the user was found!
const userName = user.name;

invariant(user.address, `User with id ${userId} has no address`);

// We know for a fact that the user was found and has an address
const userCity = user.address.city;
```

## 📄 README

Including a well-written README.md file is considered a best practice in software development. It helps collaborators understand the project quickly, encourages contributions, and provides a starting point for discussions and issue tracking. It’s like a project’s manual.

It provides essential information about what the project does, how to set it up, and how to use it, typically formatted with Markdown.

Common sections to include are:

1. **Project description**: An overview of what the project aims to achieve and its main features.
2. **Installation**: Instructions on how to install and set up the project on the user's local machine. This also includes how to set-up the environment variables for the project.
3. **Release:** Instructions on how to release the project to different environments (preview/staging/production)
4. **URLs** to the production and preview environments and to the used tools and services.

## ⤴︎ Pull requests & commits

### Avoid feature & release branches

In general we want to avoid long opened pull request and/or release branches. Group your work so that you can merge to `main` often in smaller pr’s. This means splitting up larger features into smaller chunks, that can be merged and release to production at any given point.

### **Prefer small pr’s**

Prefer splitting your work into smaller chunks. More than 20 file changes in a PR makes it harder to get the full context and review. Make sure pr’s are connected to a linear issue and give as much context as possible, so a clear description of the changes, instructions on how to test and if applicable a screenshot or screenrecordings.

### **Work that needs approval**

Work that needs approval can be hidden by using a feature flag.

**API**

- Make sure API schema's keep working in a backwards compatible fashion until you are sure that there are no clients using deprecated fields. Take into account that users can be on older versions or deployments of the frontend can fail while deployments of the api succeed and vice versa.

**WWW**

- Develop the new functionality in a PR (or PRs) directly branched from `main`
- Make sure the PR can be merged and released as soon as it’s ready
- If we need approval, hide new functionality with a feature flag, for example:

```jsx
// app/new-feature-x.tsx
import { features } from "@/lib/features";

export default async function NewFeatureXPage() {
  // 🚩 Feature flag for feature X
  if (!features.NEW_FEATURE_X_ENABLE) {
    return notFound();
  }

  // The new feature
}
```

- This allows the client (or internal QA) to view the new feature on new-feature-x and this code to be merged to main.
- After approval, the feature flag can be removed

## Various

- Always favor absolute imports over relative imports when making changes in `/apps/`.
- When making changes to a Prisma schema file, don't manually create a migration file. Always create migration files by running prisma migrate dev.
- When naming things in English, use American English.
