# Website with Express

This project is a basic template for using the Express framework to create a dynamic website.

A _static_ web site loads the same HTML and JS files for every user, every time, and its content is completely set by those files. In contrast, _dynamic_ web sites provide content that can change each time the page is loaded. Dynamic sites are often used to load content from databases or APIs where the content can be customized for the situation.

Dynamic web sites have a set of static files, called the client-side or front-end content. In this template, they are in the "public" directory. They also have code the generate the dynamic content, called the server-side or back-end content. In this template, the only back-end file is server.js.

Express is a *web framework* - a collection of pre-written code the makes it easy to create a dynamic website. 

## Project Files
The project files are all accessed from the navigation bar on the left of your screen.
The `assets` folder is used to store images or other static data files.

### Client-Side
Client-side files are in the `public` folder.
- `index.html` is the typical static web page.
- `style.css` is the stylesheet linked by `index.html`
- `client.js` is the script linked by `index.html`

### Server-Side
- `server.js` holds the code that runs to start your application
- `package.json` is used for storing configuration settings
- `.env` holds confidential data like private API keys

## More about Express
[Serving static content](https://expressjs.com/en/starter/static-files.html)\
[Serving dynamic content](https://expressjs.com/en/starter/basic-routing.html)