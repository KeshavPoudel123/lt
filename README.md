# Latest Online Tools Landing Page

A fully responsive, visually captivating, and uniquely animated landing page for latestonlinetools.com.

## Project Overview

This landing page showcases a diverse range of online tools with modern animations and interactive features to enhance user engagement. The design prominently features the brand colors #5B4CC4 and #C12E61, utilizing their gradient for backgrounds and key elements.

## Project Structure

```
Root Directory:
├── index.html – Main landing page
├── assets/
│   ├── css/ – Contains styles.css for all styling
│   ├── js/ – Contains main.js for interactivity
│   ├── images/ – Stores all image assets
│   └── animations/ – Stores Lottie JSON files and other animation assets
├── data/
│   └── tools.json – JSON file listing all available tools with details
└── README.md – Instructions for setup and customization
```

## Setup Instructions

1. Clone this repository to your local machine
2. Open `index.html` in your web browser to view the landing page
3. Customize the content in `tools.json` to add or modify tools
4. Add your own Lottie animations to the `assets/animations` directory

## Customization

### Adding New Tools

Edit the `data/tools.json` file to add new tools or modify existing ones. Each tool should have the following properties:

- `id`: Unique identifier for the tool
- `name`: Display name of the tool
- `description`: Brief description of what the tool does
- `icon`: Icon name (using Material Icons)
- `isNew`: Boolean indicating if the tool should be marked as new
- `url`: URL or anchor link to the tool

### Changing Colors

The primary brand colors are defined as CSS variables in `assets/css/styles.css`:

- `--primary-color`: #5B4CC4
- `--secondary-color`: #C12E61

Modify these values to change the color scheme throughout the site.

## Dependencies

- Google Fonts (Poppins, Open Sans)
- Material Icons
- Lottie Web (for animations)

## Browser Compatibility

This landing page is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[MIT License](LICENSE)
