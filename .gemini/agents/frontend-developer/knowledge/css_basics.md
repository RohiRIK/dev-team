# CSS Basics for Frontend Developers

CSS (Cascading Style Sheets) is a stylesheet language fundamental to frontend development, used to describe the presentation and styling of a document written in a markup language like HTML. It dictates how HTML elements are displayed on screen, paper, or other media, controlling aspects such as colors, fonts, layout, and variations for different devices and screen sizes.

The primary purpose of CSS is to separate the content (HTML) from its visual presentation, which simplifies web development, improves reusability and maintainability, and enhances site performance.

## How CSS Works: Basic Syntax

CSS uses a rule-based approach where developers select HTML elements and assign style properties to them. A basic CSS rule consists of:

-   **Selector**: Targets the HTML element(s) to be styled (e.g., `p` for paragraphs, `.class-name` for elements with a specific class, `#id-name` for an element with a specific ID).
-   **Declaration Block**: Contains one or more declarations, each ending with a semicolon.
-   **Declaration**: A pair of a **property** and its **value**, separated by a colon (e.g., `color: blue;`, `font-size: 16px;`).

```css
p {
  color: blue;
  font-size: 16px;
}

.my-class {
  background-color: lightgray;
}

#my-id {
  border: 1px solid black;
}
```

## Key CSS Concepts for Frontend Developers

1.  **The Box Model**: Every HTML element is treated as a rectangular box. Understanding the box model is crucial for layout and spacing. It comprises four parts:
    -   **Content**: The actual content (text, images).
    -   **Padding**: Space between the content and the border.
    -   **Border**: A line around the padding and content.
    -   **Margin**: Space outside the border, separating the element from others.
2.  **The Cascade**: When multiple CSS rules apply to the same element, the cascade determines which style takes precedence. This involves factors like:
    -   **Specificity**: A calculation of how specific a selector is. More specific selectors override less specific ones.
    -   **Inheritance**: Properties can be inherited from parent elements to child elements.
    -   **Rule Order**: The order in which rules are declared; later rules generally override earlier ones if specificity is equal.
3.  **Selectors**: Various types of selectors allow precise targeting of HTML elements:
    -   **Type selectors**: Target elements by their HTML tag (e.g., `h1`, `p`).
    -   **Class selectors**: Target elements with a specific `class` attribute (e.g., `.my-class`).
    -   **ID selectors**: Target a unique element with a specific `id` attribute (e.g., `#my-id`).
    -   **Attribute selectors**: Target elements based on their attributes.
    -   **Pseudo-classes and Pseudo-elements**: Target elements based on their state (e.g., `:hover`) or specific parts of an element (e.g., `::before`).
4.  **Layout Techniques**:
    -   **Display Property**: Controls how an element is rendered and interacts with other elements (e.g., `block`, `inline`, `inline-block`, `flex`, `grid`, `none`).
    -   **Flexbox (Flexible Box Layout)**: A one-dimensional layout system for arranging items in a container, particularly useful for distributing space among items and aligning them.
    -   **CSS Grid Layout**: A two-dimensional layout system that allows for more complex and precise layouts by dividing a page into rows and columns.
    -   **Positioning**: Controls the exact placement of elements on a page using properties like `static`, `relative`, `absolute`, `fixed`, and `sticky`.
5.  **Responsive Design**: Ensures websites look good and function well across various devices and screen sizes. Key tools include:
    -   **Media Queries**: CSS techniques to apply styles based on device characteristics like screen width, height, and orientation.
    -   **Flexible Grids and Images**: Using percentages or other relative units instead of fixed pixels for widths and heights.

## Ways to Include CSS

CSS can be applied to HTML documents in three main ways:

1.  **Inline CSS**: Styles applied directly to an HTML element using the `style` attribute.
2.  **Internal CSS**: Styles defined within a `<style>` tag in the `<head>` section of an HTML document.
3.  **External CSS**: The most common and recommended method, where styles are written in a separate `.css` file and linked to the HTML document. This allows for consistent styling across multiple web pages.
