/**
 * Created by Joney.y on 2016/10/19.
 */
const links = document.querySelectorAll('link[rel="import"]');

// Import and add each page to the DOM
Array.prototype.forEach.call(links, function (link) {
    var template = link.import.querySelector('.task-template');
    var clone = document.importNode(template.content, true);
    if (link.href.match('About.html')) {
        document.querySelector('body').appendChild(clone);
    } else {
        document.querySelector('.main-box').appendChild(clone);
    }
});
