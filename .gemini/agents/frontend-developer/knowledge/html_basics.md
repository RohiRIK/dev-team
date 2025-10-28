# HTML Basics for Frontend Developers

HTML (HyperText Markup Language) is the foundational language for creating web pages and web applications, serving as the "skeleton" that defines the structure and content of a webpage. It works in conjunction with CSS (Cascading Style Sheets) for styling and JavaScript for interactivity to create a complete web experience.

## 1. HTML Document Structure

Every HTML document follows a fundamental structure to ensure browsers can correctly interpret and display the content.

-   **`<!DOCTYPE html>`**: This declaration informs the web browser about the HTML version being used (HTML5).
-   **`<html>`**: The root element that encloses all other HTML elements. It often includes a `lang` attribute for accessibility and SEO.
-   **`<head>`**: Contains metadata about the HTML document that is not displayed on the web page itself. This includes:
    -   **`<title>`**: Defines the title of the webpage, appearing in the browser tab.
    -   **`<meta>`**: Provides metadata like character set (`charset="UTF-8"`) and viewport settings for responsive design.
    -   **`<link>`**: Links to external resources like CSS files.
    -   **`<script>`**: Links to JavaScript files.
-   **`<body>`**: Contains all the visible content of the web page, such as headings, paragraphs, images, links, and other elements that users interact with.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Webpage Title</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a paragraph of content.</p>
    <script src="script.js"></script>
</body>
</html>
```

## 2. Common HTML Elements

HTML uses elements (or tags) to define different parts of a webpage. Elements are typically written with an opening tag (`<tag>`) and a closing tag (`</tag>`), with content in between.

-   **Headings (`<h1>` to `<h6>`)**: Used to define titles and subtitles, with `<h1>` being the most important.
-   **Paragraphs (`<p>`)**: Used for blocks of text.
-   **Links (`<a>`)**: Creates hyperlinks to other pages or sections. The `href` attribute specifies the destination URL.
-   **Images (`<img>`)**: Embeds image files. It's a self-closing tag and requires `src` (source) and `alt` (alternative text) attributes.
-   **Lists (`<ul>`, `<ol>`, `<li>`)**:
    -   `<ul>` (unordered list) for bullet points.
    -   `<ol>` (ordered list) for numbered lists.
    -   `<li>` (list item) for individual items within a list.
-   **Divisions (`<div>`) and Spans (`<span>`)**: Generic container elements. `<div>` is a block-level element, often used for grouping larger sections, while `<span>` is an inline element for smaller text selections. They have no semantic meaning on their own.

## 3. HTML Attributes

Attributes provide additional information about HTML elements, placed within the element's opening tag. They consist of a name and a value (e.g., `attribute="value"`).

-   **`id`**: Assigns a unique identifier to an element.
-   **`class`**: Assigns one or more class names to an element, primarily for applying CSS styles.
-   **`src`**: Specifies the source (URL) for embedded content like images or scripts.
-   **`href`**: Specifies the URL for hyperlinks or external stylesheets.
-   **`alt`**: Provides alternative text for images, crucial for accessibility.
-   **`style`**: Allows for inline CSS styling directly on an element.
-   **`lang`**: Declares the language of the element's content.
-   **`title`**: Provides extra information about an element, often displayed as a tooltip on hover.

## 4. HTML Forms

Forms are used to collect user input.

-   **`<form>`**: The container element for all form controls.
-   **`<input>`**: The most used form element, displayed in various ways depending on its `type` attribute (e.g., `text`, `password`, `email`, `submit`).
-   **`<label>`**: Provides a caption for a form element, improving accessibility.
-   **`<textarea>`**: For multi-line text input.
-   **`<button>`**: A clickable button, often used for submitting forms.
-   **`<select>`, `<option>`, `<optgroup>`**: Used to create dropdown lists.

## 5. HTML5 Semantic Elements

HTML5 introduced semantic elements that provide meaning to the structure of web content, making it more understandable for both developers and browsers (including search engines and assistive technologies).

-   **`<header>`**: Represents introductory content.
-   **`<nav>`**: Defines a section containing navigation links.
-   **`<main>`**: Represents the dominant content of the `<body>` of a document.
-   **`<article>`**: Represents self-contained content (e.g., a blog post).
-   **`<section>`**: A thematic grouping of content.
-   **`<aside>`**: Represents content that is tangentially related (e.g., a sidebar).
-   **`<footer>`**: Represents a footer for its nearest sectioning content or sectioning root.

## 6. Accessibility (A11y)

Building accessible websites is crucial for ensuring all users, including those with disabilities, can perceive, understand, navigate, and interact with the web. Key HTML accessibility practices include:

-   **Using Semantic HTML:** Provides meaningful context to assistive technologies like screen readers.
-   **Providing `alt` text for images:** Describes the image content for visually impaired users.
-   **Proper Heading Structure:** Ensures a logical flow for screen readers.
-   **Accessible Forms:** Using `<label>` elements correctly and ensuring all interactive elements are keyboard accessible.
-   **ARIA Attributes:** Used to enhance accessibility for dynamic content or custom widgets when semantic HTML isn't sufficient.

## 7. Relationship with CSS and JavaScript

HTML, CSS, and JavaScript are the core technologies of frontend development, working together to build interactive and visually appealing websites.

-   **HTML (Structure):** Provides the fundamental structure and content of the webpage.
-   **CSS (Presentation):** Styles the visual appearance of HTML elements, controlling layout, colors, fonts, and overall aesthetic.
-   **JavaScript (Interactivity):** Adds dynamic behavior and client-side functionality, making the website responsive to user interactions.
