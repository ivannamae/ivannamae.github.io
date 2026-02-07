import os
import re

# 1. Rename home.html to index.html (Required for GitHub Pages)
if os.path.exists("home.html"):
    os.rename("home.html", "index.html")
    print("✓ Renamed home.html to index.html")

# The new "Gold Standard" Navigation
new_nav = """  <nav class="site-nav">
    <a href="index.html">Home</a>
    <div class="dropdown">
      <a href="works.html" class="dropbtn">Works ▾</a>
      <div class="dropdown-content">
        <a href="ceramics.html">Ceramics</a>
        <a href="digital.html">Digital Art</a>
        <a href="mixed-media.html">Mixed Media Sculpture</a>
        <a href="drawing-painting.html">Drawing & Painting</a>
        <a href="photography.html">Photography</a>
      </div>
    </div>
    <a href="about.html">About</a>
    <a href="press.html">Press</a>
    <a href="contact.html">Contact</a>
  </nav>"""

def fix_files():
    for filename in os.listdir("."):
        if filename.endswith(".html"):
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            # Fix 1: Update all links pointing to home.html
            content = content.replace('href="home.html"', 'href="index.html"')

            # Fix 2: Replace the entire <nav> block
            content = re.sub(r'<nav class="site-nav">.*?</nav>', new_nav, content, flags=re.DOTALL)

            # Fix 3: Specific repair for works.html (the double body tags)
            if filename == "works.html":
                content = content.replace('<body class="works-page" style="--page-bg-color:#ffffff;">\n\n<body style="--page-bg-color: #e8f7f3;">', 
                                          '<body class="works-page" style="--page-bg-color:#ffffff;">')

            # Fix 4: Set correct H2 titles for the category pages
            titles = {
                "digital.html": "Digital Art",
                "mixed-media.html": "Mixed Media Sculpture",
                "drawing-painting.html": "Drawing & Painting",
                "photography.html": "Photography"
            }
            if filename in titles:
                content = content.replace('<h2>Ceramics</h2>', f'<h2>{titles[filename]}</h2>')

            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed {filename}")

if __name__ == "__main__":
    fix_files()
