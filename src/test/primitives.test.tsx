import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";

describe("Primitive Components Behavioral Tests", () => {
  describe("Button", () => {
    it("renders the button correctly", () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
    });

    it("handles click events", async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole("button", { name: "Click Me" }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("is disabled when disabled prop is passed", () => {
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Disabled Button</Button>);
      const button = screen.getByRole("button", { name: "Disabled Button" });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("Input", () => {
    it("handles value changes correctly", () => {
      const onChange = vi.fn();
      render(<Input placeholder="Type here" onChange={onChange} />);
      const input = screen.getByPlaceholderText("Type here");
      fireEvent.change(input, { target: { value: "Hello" } });
      expect(input).toHaveValue("Hello");
    });

    it("is disabled when disabled prop is passed", () => {
      render(<Input disabled placeholder="Disabled input" />);
      expect(screen.getByPlaceholderText("Disabled input")).toBeDisabled();
    });

    it("associates correctly with label", () => {
      render(
        <>
          <label htmlFor="test-input">Test Label</label>
          <Input id="test-input" />
        </>
      );
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });
  });

  describe("Dialog", () => {
    it("opens and closes correctly", async () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <p>Dialog content</p>
          </DialogContent>
        </Dialog>
      );

      // Initially closed
      expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();

      // Open dialog
      fireEvent.click(screen.getByRole("button", { name: "Open Dialog" }));
      
      // Wait for the dialog content to appear
      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      });

      // Close dialog (the X button)
      const closeButton = screen.getByRole("button", { name: "Close" });
      fireEvent.click(closeButton);

      // Wait for it to disappear
      await waitFor(() => {
        expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
      });
    });
  });
});
