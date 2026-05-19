// ============================================================
// BASE TYPES
// ============================================================

export type EntityType =
  | 'character'
  | 'relationship'
  | 'place'
  | 'region'
  | 'faction'
  | 'culture'
  | 'history'
  | 'religion'
  | 'magic_tech'
  | 'artifact'
  | 'lore'
  | 'quest'
  | 'scene'
  | 'encounter'
  | 'reward'
  | 'session_log'
  | 'mechanic'
  | 'story'
  | 'map'
  | 'calendar_event';

export interface BaseEntity {
  id: string;
  entityType: EntityType;
  tags: string[];
  status: string;
  notes: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  campaignId: string;
}

// ============================================================
// CHARACTER
// ============================================================

export type CharacterType =
  | 'pc'
  | 'nsc'
  | 'enemy'
  | 'contact'
  | 'faction_rep'
  | 'creature'
  | 'other';

export type CharacterStatus =
  | 'active'
  | 'inactive'
  | 'dead'
  | 'unknown'
  | 'draft';

export type VisibilityType = 'public' | 'gm_only' | 'secret';

export interface Character extends BaseEntity {
  entityType: 'character';
  name: string;
  type: CharacterType;
  role: string;
  species: string;
  profession_class: string;
  age: string;
  gender: string;
  origin: string;
  faction_id: string;
  location_id: string;
  status: CharacterStatus;
  short_description: string;
  personality: string;
  goals: string;
  fears: string;
  weaknesses: string;
  ideals: string;
  secrets: string;
  background: string;
  important_events: string;
  equipment: string;
  skills_stats_notes: string;
  visibility: VisibilityType;
  portraitUrl?: string;
}

// ============================================================
// RELATIONSHIP
// ============================================================

export type RelationshipType =
  | 'family'
  | 'friendship'
  | 'acquaintance'
  | 'alliance'
  | 'loyalty'
  | 'debt_obligation'
  | 'rivalry'
  | 'enmity'
  | 'mentor_student'
  | 'love_affair'
  | 'secret_connection';

export type RelationshipDirection = 'directed' | 'symmetric';
export type RelationshipAttitude = 'positive' | 'neutral' | 'negative' | 'mixed';
export type RelationshipStatus = 'active' | 'broken' | 'ended' | 'unknown';

export interface Relationship extends BaseEntity {
  entityType: 'relationship';
  source_character_id: string;
  target_character_id: string;
  relationship_type: RelationshipType;
  direction: RelationshipDirection;
  intensity: 1 | 2 | 3 | 4 | 5;
  attitude: RelationshipAttitude;
  visibility: VisibilityType;
  status: RelationshipStatus;
  description: string;
  history: string;
}

// ============================================================
// WORLD BUILDING
// ============================================================

export type WorldEntityType =
  | 'place'
  | 'region'
  | 'faction'
  | 'culture'
  | 'history'
  | 'religion'
  | 'magic_tech'
  | 'artifact'
  | 'lore';

export type WorldStatus = 'active' | 'ruined' | 'mythical' | 'draft' | 'inactive';

export interface WorldEntity extends BaseEntity {
  entityType: WorldEntityType;
  title: string;
  category: string;
  summary: string;
  description: string;
  status: WorldStatus;
  region_id: string;
  faction_id: string;
  related_character_ids: string[];
  related_gameplay_ids: string[];
  historical_references: string[];
}

// ============================================================
// GAMEPLAY
// ============================================================

export type GameplayEntityType =
  | 'quest'
  | 'scene'
  | 'encounter'
  | 'reward'
  | 'session_log'
  | 'mechanic';

export type GameplayStatus = 'open' | 'active' | 'completed' | 'failed' | 'draft';
export type DifficultyLevel = 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly';

export interface GameplayEntity extends BaseEntity {
  entityType: GameplayEntityType;
  title: string;
  summary: string;
  description: string;
  status: GameplayStatus;
  related_character_ids: string[];
  related_faction_ids: string[];
  related_place_ids: string[];
  consequences: string;
  related_reward_ids: string[];
  related_scene_ids: string[];
  // Quest
  goal?: string;
  giver?: string;
  progress?: string;
  outcome?: string;
  // Scene
  place_id?: string;
  scene_goal?: string;
  conflict_type?: string;
  participants?: string;
  possible_twist?: string;
  // Encounter
  encounter_type?: string;
  difficulty?: DifficultyLevel;
  enemies_or_participants?: string;
  possible_outcomes?: string;
  // Session Log
  session_number?: number;
  session_date?: string;
  open_threads?: string;
  new_hooks?: string;
  affected_entity_ids?: string[];
}

// ============================================================
// STORY
// ============================================================

export type StoryStatus = 'draft' | 'final' | 'archived';

export interface StoryEntity extends BaseEntity {
  entityType: 'story';
  title: string;
  content: string;
  chapter_number: number;
  status: StoryStatus;
  summary: string;
}

// ============================================================
// MAPS
// ============================================================

export interface MapPin {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  linkedEntityId?: string;
  linkedEntityType?: EntityType;
  color?: string;
}

export interface MapEntity extends BaseEntity {
  entityType: 'map';
  title: string;
  imageUrl: string;
  description: string;
  pins: MapPin[];
  scale?: number;
}

// ============================================================
// APP SETTINGS
// ============================================================

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'de' | 'en';
  defaultView: 'list' | 'grid';
  campaignName: string;
  lastVisited: string[];
}

// ============================================================
// SEARCH
// ============================================================

export interface SearchResult {
  id: string;
  entityType: EntityType;
  title: string;
  summary: string;
  tags: string[];
}

// ============================================================
// CALENDAR
// ============================================================

export interface CalendarEvent extends BaseEntity {
  entityType: 'calendar_event';
  title: string;
  description: string;
  day: number;
  month: number;
  year: number;
  color?: string;
}

export interface CalendarConfig {
  daysPerWeek: number;
  weekDays: string[];
  months: { name: string; days: number }[];
  yearOffset: number;
  yearName: string;
}
