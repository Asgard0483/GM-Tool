import re
import os

def fix_edit_map(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f: c = f.read()
    c = c.replace('TextArea', 'Textarea')
    c = re.sub(r'onBack=\{\(\) => navigate\([^)]+\)\}', '', c)
    c = re.sub(r'onChange=\{e => setDescription', 'onChange={(e: any) => setDescription', c)
    with open(path, 'w') as f: f.write(c)

fix_edit_map('src/features/maps/pages/EditMapPage.tsx')

def fix_dice_store(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f: c = f.read()
    c = c.replace('addHistory: (result) => set((state) => ({', 'addHistory: (result: any) => set((state: any) => ({')
    c = c.replace('addFavorite: (data) => set((state) => ({', 'addFavorite: (data: any) => set((state: any) => ({')
    c = c.replace('removeFavorite: (id) => set((state) => ({', 'removeFavorite: (id: any) => set((state: any) => ({')
    c = c.replace('state.favorites.filter(f =>', 'state.favorites.filter((f: any) =>')
    c = c.replace('clearHistory: () => set({', 'clearHistory: () => set({')
    with open(path, 'w') as f: f.write(c)

fix_dice_store('src/features/gameplay/store/diceStore.ts')

