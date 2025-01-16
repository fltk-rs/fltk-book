// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="Home.html"><strong aria-hidden="true">1.</strong> Home</a></li><li class="chapter-item expanded "><a href="Setup.html"><strong aria-hidden="true">2.</strong> Setup</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Cross-Compiling.html"><strong aria-hidden="true">2.1.</strong> Cross Compiling</a></li><li class="chapter-item "><a href="Fluid.html"><strong aria-hidden="true">2.2.</strong> Fluid</a></li></ol></li><li class="chapter-item expanded "><a href="The-App-struct.html"><strong aria-hidden="true">3.</strong> The App struct</a></li><li class="chapter-item expanded "><a href="Windows.html"><strong aria-hidden="true">4.</strong> Windows</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="GlutWindow.html"><strong aria-hidden="true">4.1.</strong> GlutWindow</a></li></ol></li><li class="chapter-item expanded "><a href="Widgets.html"><strong aria-hidden="true">5.</strong> Widgets</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Buttons.html"><strong aria-hidden="true">5.1.</strong> Buttons</a></li><li class="chapter-item "><a href="Labels.html"><strong aria-hidden="true">5.2.</strong> Labels</a></li><li class="chapter-item "><a href="Group-widgets.html"><strong aria-hidden="true">5.3.</strong> Group widgets</a></li><li class="chapter-item "><a href="Menus.html"><strong aria-hidden="true">5.4.</strong> Menus</a></li><li class="chapter-item "><a href="Input-&-Output.html"><strong aria-hidden="true">5.5.</strong> Input &amp; Output</a></li><li class="chapter-item "><a href="Valuators.html"><strong aria-hidden="true">5.6.</strong> Valuators</a></li><li class="chapter-item "><a href="Text.html"><strong aria-hidden="true">5.7.</strong> Text</a></li><li class="chapter-item "><a href="Browsers.html"><strong aria-hidden="true">5.8.</strong> Browsers</a></li><li class="chapter-item "><a href="Trees.html"><strong aria-hidden="true">5.9.</strong> Trees</a></li><li class="chapter-item "><a href="Tables.html"><strong aria-hidden="true">5.10.</strong> Tables</a></li><li class="chapter-item "><a href="Custom-Widgets.html"><strong aria-hidden="true">5.11.</strong> Custom widgets</a></li></ol></li><li class="chapter-item expanded "><a href="Dialogs.html"><strong aria-hidden="true">6.</strong> Dialogs</a></li><li class="chapter-item expanded "><a href="Images.html"><strong aria-hidden="true">7.</strong> Images</a></li><li class="chapter-item expanded "><a href="Events.html"><strong aria-hidden="true">8.</strong> Events</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Drag-&-Drop.html"><strong aria-hidden="true">8.1.</strong> Drag &amp; Drop</a></li><li class="chapter-item "><a href="State-Management.html"><strong aria-hidden="true">8.2.</strong> State Management</a></li></ol></li><li class="chapter-item expanded "><a href="Layouts.html"><strong aria-hidden="true">9.</strong> Layouts</a></li><li class="chapter-item expanded "><a href="Style.html"><strong aria-hidden="true">10.</strong> Style</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Colors.html"><strong aria-hidden="true">10.1.</strong> Colors</a></li><li class="chapter-item "><a href="FrameTypes.html"><strong aria-hidden="true">10.2.</strong> FrameTypes</a></li><li class="chapter-item "><a href="Fonts.html"><strong aria-hidden="true">10.3.</strong> Fonts</a></li><li class="chapter-item "><a href="Drawing.html"><strong aria-hidden="true">10.4.</strong> Drawing things</a></li><li class="chapter-item "><a href="Styling.html"><strong aria-hidden="true">10.5.</strong> Styling</a></li></ol></li><li class="chapter-item expanded "><a href="Animations.html"><strong aria-hidden="true">11.</strong> Animations</a></li><li class="chapter-item expanded "><a href="Accessibility.html"><strong aria-hidden="true">12.</strong> Accessibility</a></li><li class="chapter-item expanded "><a href="FAQ.html"><strong aria-hidden="true">13.</strong> FAQ</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
