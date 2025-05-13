# Animation Assets

This directory is intended for storing Lottie JSON files and other animation assets.

## Lottie Animations

For the best experience, please add the following Lottie animations:

1. **Hero Animation**: A productivity or digital tools themed animation for the hero section
   - Suggested filename: `hero-animation.json`
   - Recommended dimensions: 400x400px

2. **Loading Animation**: A branded loading animation using the site's colors
   - Suggested filename: `loading-animation.json`
   - Recommended dimensions: 200x200px

3. **Feature Animations**: Small animations for each tool category
   - Suggested filenames: `text-tools.json`, `file-tools.json`, etc.
   - Recommended dimensions: 100x100px

## How to Create Lottie Animations

1. Use Adobe After Effects with the Bodymovin plugin
2. Use online tools like [LottieFiles](https://lottiefiles.com/editor) or [Rive](https://rive.app/)
3. Download pre-made animations from [LottieFiles Marketplace](https://lottiefiles.com/marketplace)

## Implementation

The animations are loaded in the `main.js` file using the Lottie Web library. To add a new animation:

```javascript
lottie.loadAnimation({
    container: document.getElementById('animation-container-id'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/animations/your-animation.json'
});
```

## Optimization Tips

1. Keep animations under 100KB when possible
2. Use simple shapes and minimal anchor points
3. Limit the number of layers and effects
4. Use the Lottie Web library's built-in quality settings for performance
