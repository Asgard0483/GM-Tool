import type { StoryEntity } from '../shared/types';
import { generateId, now } from '../shared/utils/helpers';

export const seedStories: StoryEntity[] = [
  {
    id: 'story-001',
    entityType: 'story',
    campaignId: '',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: now(),
    title: 'Kapitel 1: Schatten über Kerlothaven',
    summary: 'Die Gruppe deckt einen Schmuggelring auf, der zur Eisenhauer-Gilde und Korgan Blutfaust führt.',
    content: `
# Einleitung
Die Kampagne beginnt im verregneten Hafen von **Kerlothaven**. 
**Thorvald Grimstone** und **Serafina Lacroix** wurden von *Lady Vane* angeheuert, um das Verschwinden einer wichtigen Lieferung aus dem Silbermond-Palast zu untersuchen.

## Szene 1: Die brennende Taverne
Die Gruppe trifft sich mit der Informantin **Lila "die Nadel"**, doch das Treffen wird unterbrochen. 
Schergen der **Eisenhauer-Gilde** greifen an!

> "Wenn ihr weise seid, verlasst diese Stadt, bevor sie euch verschluckt." - Lila, kurz bevor die Tür aufbrach.

### Ziele der Begegnung:
- Überleben des Angriffs.
- Lila beschützen.
- Einen der Angreifer verhören.

## Szene 2: Hinweise im Dreck
Falls die Gruppe erfolgreich ist, finden sie bei den Angreifern eine Münze mit dem Wappen der *Eisernen Krone*. 
**Bruder Aldric** kann kontaktiert werden, um Wunden zu heilen und mehr über die Symbolik zu verraten.
    `,
    chapter_number: 1,
    status: 'final',
    tags: ['Kerlothaven', 'Lady Vane', 'Lila', 'Intro'],
    notes: 'GM-GEHEIMNIS: Der Angriff wurde nicht von Korgan befohlen, sondern vom "Phantom", um einen Krieg zwischen der Gilde und dem Adelshaus zu provozieren!',
    metadata: {}
  },
  {
    id: 'story-002',
    entityType: 'story',
    campaignId: '',
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: now(),
    title: 'Kapitel 2: Das Schwarzbuch',
    summary: 'Ein Einbruch in das Hauptquartier der Eisenhauer-Gilde, um Korgans Schwarzbuch zu stehlen.',
    content: `
# Vorbereitung auf den Heist
Nachdem die Spur zur Eisenhauer-Gilde führt, plant die Gruppe einen Einbruch. Sie benötigen die Hilfe von **Magistra Ysolde**, um die magischen *Runenschriften des Nordens* zu entschlüsseln, die Korgans Tresor sichern.

## Der Plan
1. **Ablenkung:** Thorvald provoziert eine Schlägerei in der Gilden-Taverne.
2. **Infiltration:** Serafina schleicht über die Dächer in das Büro.
3. **Extraktion:** Flucht durch die alten Abwasserkanäle von Kerlothaven.

### Herausforderungen (Skill-Checks)
| Aktion | Skill | DC |
|--------|-------|----|
| Wachen ablenken | Charisma (Deception/Intimidation) | 14 |
| Schloss knacken | Dexterity (Sleight of Hand) | 16 |
| Runen lesen | Intelligence (Arcana) | 15 |

## Der Fund
Das *Schwarzbuch Korgans* enthält nicht nur Namen von korrupten Stadträten, sondern auch Aufzeichnungen über **Das Phantom** und die Suche nach der mythischen **Eisernen Krone**.
    `,
    chapter_number: 2,
    status: 'draft',
    tags: ['Heist', 'Korgan Blutfaust', 'Ysolde', 'Artefakt'],
    notes: 'Wenn Serafina den Tresor öffnet, findet sie auch einen Brief, der an ihre Mutter adressiert ist. Dies ist ein Hook für ihre persönliche Quest.',
    metadata: {}
  },
  {
    id: 'story-003',
    entityType: 'story',
    campaignId: '',
    createdAt: '2024-01-25T09:00:00Z',
    updatedAt: now(),
    title: 'Hintergrund: Die Eiserne Krone',
    summary: 'Lore-Sammlung und Notizen zur Hauptkampagne.',
    content: `
# Legende der Eisernen Krone
Die Krone ist kein einfaches Schmuckstück. Sie wurde geschmiedet aus dem Blut und Eisen der ersten Könige.

* "Wer die Krone trägt, herrscht nicht über das Land. Das Land herrscht durch ihn." *

## Fraktionen im Konflikt
- **Das Adelhaus Silbermond:** Will die Krone, um den Thron rechtmäßig zurückzufordern.
- **Die Eisenhauer-Gilde (Korgan):** Will die Krone an den Meistbietenden verkaufen.
- **Das Phantom:** Möchte die Krone zerstören, um das Reich ins Chaos zu stürzen.
- **Der Ewige Kreis (Ysolde):** Will die Krone tief in einem magischen Verlies einsperren.

### Nächste Schritte für die Gruppe
Die Gruppe muss entscheiden, wem sie das *Schwarzbuch Korgans* übergibt. Diese Entscheidung wird die Allianzen für das gesamte nächste Drittel der Kampagne definieren!
    `,
    chapter_number: 3,
    status: 'draft',
    tags: ['Lore', 'Entscheidung', 'Eiserne Krone', 'Kampagnen-Metaplot'],
    notes: 'Die Spieler sollten hier keinen Zeitdruck haben. Lass sie die Konsequenzen ausspielen und diskutieren.',
    metadata: {}
  }
];
