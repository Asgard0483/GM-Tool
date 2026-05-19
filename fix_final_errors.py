import os
import glob
import re

def process_file(path, func):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = func(content)
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {path}")

# Fix GlobalSearch.tsx
def fix_global_search(c):
    return c.replace("import { Search,", "import { Search, BookOpen,")

process_file("src/shared/components/GlobalSearch.tsx", fix_global_search)

# Add campaignId: '' to form states in New... and Edit... pages
def fix_form_data(c):
    # Just add campaignId: '' where we define the useState for form, if we see title:
    c = re.sub(r'metadata: ([^,\n]+)(,?)', r"metadata: \1,\n    campaignId: ''\2", c)
    return c

for file in glob.glob("src/features/**/*.tsx", recursive=True):
    if "New" in file or "Edit" in file:
        process_file(file, fix_form_data)

