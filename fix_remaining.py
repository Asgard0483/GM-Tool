import subprocess
import re
import os

def run_tsc():
    result = subprocess.run(["npx", "tsc", "-b"], capture_output=True, text=True)
    return result.stdout

def fix_errors():
    output = run_tsc()
    errors_fixed = 0
    lines = output.split('\n')
    for i, line in enumerate(lines):
        match = re.match(r'^([^:]+):(\d+):\d+ - error TS(\d+): (.*)$', line)
        if match:
            file_path = match.group(1)
            line_num = int(match.group(2))
            error_code = match.group(3)
            msg = match.group(4)

            if not os.path.exists(file_path):
                continue
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content_lines = f.readlines()
            
            changed = False
            
            # Missing campaignId in form
            if "Property 'campaignId' is missing" in msg:
                # We need to find the object literal and add campaignId: '', notes: ''
                for j in range(line_num - 1, len(content_lines)):
                    if 'metadata:' in content_lines[j] and 'campaignId' not in content_lines[j]:
                        content_lines[j] = content_lines[j].replace('metadata:', 'campaignId: \'\', notes: \'\', metadata:')
                        changed = True
                        break
            
            # Missing notes in form
            elif "Property 'notes' is missing" in msg:
                for j in range(line_num - 1, len(content_lines)):
                    if 'metadata:' in content_lines[j] and 'notes:' not in content_lines[j]:
                        content_lines[j] = content_lines[j].replace('metadata:', 'notes: \'\', metadata:')
                        changed = True
                        break

            # TextArea instead of Textarea
            elif "named 'TextArea'. Did you mean 'Textarea'?" in msg:
                content_lines[line_num - 1] = content_lines[line_num - 1].replace('TextArea', 'Textarea')
                changed = True

            # onBack does not exist on PageHeaderProps
            elif "Property 'onBack' does not exist" in msg:
                content_lines[line_num - 1] = '' # Just remove onBack
                changed = True
                
            # implicitly has an 'any' type
            elif "implicitly has an 'any' type" in msg:
                content_lines[line_num - 1] = re.sub(r'([a-zA-Z0-9_]+) =>', r'(\1: any) =>', content_lines[line_num - 1])
                changed = True
                
            if changed:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(content_lines)
                errors_fixed += 1
                
    return errors_fixed

while fix_errors() > 0:
    print("Fixed some errors, running again...")

print("Done fixing automatic errors.")
