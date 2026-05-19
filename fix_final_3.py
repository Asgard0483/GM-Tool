import re
import os

def fix_export_page(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f: c = f.read()
    if 'useMapStore' not in c and 'import { useMapStore' not in c:
        c = c.replace("import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';", "import { useGameplayStore } from '@/features/gameplay/store/gameplayStore';\nimport { useMapStore } from '@/features/maps/store/mapStore';")
    c = c.replace('maps.forEach(m =>', 'maps.forEach((m: any) =>')
    c = c.replace('m.pins.forEach(p =>', 'm.pins.forEach((p: any) =>')
    with open(path, 'w') as f: f.write(c)

fix_export_page('src/features/export/pages/ExportPage.tsx')

def fix_gameplay_page(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f: c = f.read()
    c = c.replace('icon={Swords}', 'icon={<Swords size={48} opacity={0.2} />}')
    with open(path, 'w') as f: f.write(c)

fix_gameplay_page('src/features/gameplay/pages/GameplayPage.tsx')

def fix_dice_store(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f: c = f.read()
    if 'import { create }' not in c:
        c = "import { create } from 'zustand';\n" + c
    c = c.replace('addRoll: (data) => set((state) => ({', 'addRoll: (data: any) => set((state: any) => ({')
    with open(path, 'w') as f: f.write(c)

fix_dice_store('src/features/gameplay/store/diceStore.ts')

