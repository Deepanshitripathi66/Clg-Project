// This is a test file for the Hero component in a React application.
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "./landing_page/home/Hero";

describe("Hero Component", () => {
  test("renders hero image", () => {
    render(<Hero />);
    
    const heroImage = screen.getByAltText("Hero section banner");
    
    expect(heroImage).toBeInTheDocument();
    expect(heroImage.src).toMatch(/homeHero\.png$/);
  });
});


