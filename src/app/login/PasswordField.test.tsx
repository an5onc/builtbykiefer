import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PasswordField, { getPasswordVisibilityState } from "./PasswordField";

describe("PasswordField", () => {
  it("renders a hidden password input with a reveal control", () => {
    const markup = renderToStaticMarkup(<PasswordField />);

    expect(markup).toContain('name="password"');
    expect(markup).toContain('type="password"');
    expect(markup).toContain('aria-label="Show password"');
  });

  it("switches copy and input type based on visibility state", () => {
    expect(getPasswordVisibilityState(false)).toEqual({
      buttonLabel: "Show password",
      inputType: "password",
    });
    expect(getPasswordVisibilityState(true)).toEqual({
      buttonLabel: "Hide password",
      inputType: "text",
    });
  });
});
