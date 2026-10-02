import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "../Input";

describe("<Input />", () => {
  it("renders with label", () => {
    render(<Input label="Correo" name="email" />);
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
  });

  it("shows error message and aria-invalid", () => {
    render(<Input label="Email" name="email" error="Requerido" />);

    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Requerido")).toBeInTheDocument();
  });

  it("accepts user typing", async () => {
    render(<Input label="Email" name="email" />);

    const input = screen.getByLabelText(/email/i) as HTMLInputElement;
    await userEvent.type(input, "hola@test.com");

    expect(input.value).toBe("hola@test.com");
  });
});
