import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as GROK_PROVIDERS } from "./router-vcE2bwSF.mjs";
import { n as signIn } from "./client-BgVZtxiN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-cAsLbS1t.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-[100dvh] overflow-hidden bg-moss text-cream",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/game/title-hero.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover opacity-50"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-moss/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col justify-center px-6 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm tracking-[0.2em] text-gold uppercase",
						children: "Monnie's Flower Quest"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl font-semibold",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-cream/80",
						children: "Save your garden progress on this device. You can also play as a guest."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 space-y-3",
						children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => signIn(p.providerId, { callbackURL: "/" }),
							className: "w-full rounded-full bg-cream px-5 py-3.5 text-base font-bold text-ink shadow-[0_8px_0_#3a271c] active:translate-y-0.5 active:shadow-[0_4px_0_#3a271c]",
							children: ["Continue with ", p.label]
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mt-8 text-center text-sm font-bold text-gold underline-offset-4 hover:underline",
						children: "Back to the garden"
					})
				]
			})
		]
	});
}
//#endregion
export { Login as component };
