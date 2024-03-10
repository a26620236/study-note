# metaData
 While everything in the `<head>`, including the `<title>`, `<link>`, `<script>`, `<style>`, and the lesser used `<base>` is actually "meta data", there is a `<meta>` tag for metadata that cannot be represented by these other elements.

 ### Officially defined meta tags
 pragma directives and named meta types

 ----

 ### Pragma directives 
 The http-equiv attribute has as its value a pragma directive. These directives describe how the page should be parsed
 ```html
 <meta http-equiv="refresh" content="60; https://machinelearningworkshop.com/regTimeout" />

 <meta http-equiv="content-security-policy" content="default-src https:" />
 ```

 ----

 ### Named meta tags
Include the name attribute and the content attribute.

different types of name attribute value:

- description

    Several browsers, like Firefox and Opera, use this as the default description of bookmarked pages. The description should be a short and accurate summary of the page's content.useful for SEO
    ```html
    <meta name="description"
    content="Register for a machine learning workshop" />
    ```

- Robots

    If you don't want your site to be indexed by search engines, you can let them know. `<meta name="robots" content="noindex, nofollow" />` tells the bots to not index the site and not to follow any links.You don't need to include `<meta name="robots" content="index, follow" />` to request indexing the site and following links, as that is the default, unless HTTP headers say otherwise.

- Theme color

    The theme-color value lets you define a color to customize the browser interface.

    especially useful for progressive web apps. But, if you're including a manifest file, which a PWA requires, you can include the theme color there instead.

    Defining it in the HTML, however, ensures that the color will be found immediately, before rendering, which may be faster on first load than waiting for the manifest.

---

### Open Graph
Open Graph and similar meta tag protocols can be used to control how social media sites, like Twitter, LinkedIn, and Facebook, display links to your content.

Open Graph meta tags have two attributes each: the property attribute instead of the name attribute, and the content or value for that property.

```html
<meta property="og:title" content="Machine Learning Workshop" />
<meta property="og:description" content="School for Machines Who Can't Learn Good and Want to Do Other Stuff Good Too" />
<meta property="og:image" content="http://www.machinelearningworkshop.com/image/all.png" />
<meta property="og:image:alt" content="Black and white img" />
```
![alt text](images/image-3.png)

You can have different card images, titles, and descriptions for different social media sites or for different link parameters. For example, https://perfmattersconf.com sets different values for og:image, og:title, and og:description based on the parameter of the URL.

----

### Other useful meta information
You can use the `<link>` tag to link to the startup images to provide application icons for the mobile device's home screen
```html
<link rel="apple-touch-startup-image" href="icons/ios-portrait.png" media="orientation: portrait" />
<link rel="apple-touch-startup-image" href="icons/ios-landscape.png" media="orientation: landscape" />
```

If someone is going to save your icon to their tiny device's home screen, you want to provide the operating system with a short name that doesn't take up much room on a small device's home screen.
```html
<meta name="apple-mobile-web-app-title" content="MLW" />
<meta name="application-name" content="MLW" />
```

you can more simply and succinctly include short_name: MLW in a webmanifest file.
```html
<link rel="manifest" href="/mlw.webmanifest" />
```
 