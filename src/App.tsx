import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSettingsStore } from '@/store/settingsStore';
import AppShell from '@/shared/components/layout/AppShell';
import GlobalSearch from '@/shared/components/GlobalSearch';
import { runLaunchMigration } from '@/shared/utils/migration';
import { runDatabaseMigration } from '@/shared/utils/dbMigration';

// Pages
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Characters
import CharactersPage from '@/features/characters/pages/CharactersPage';
import CharacterDetailPage from '@/features/characters/pages/CharacterDetailPage';
import NewCharacterPage from '@/features/characters/pages/NewCharacterPage';
import EditCharacterPage from '@/features/characters/pages/EditCharacterPage';

// Relationships & Network
import RelationshipsPage from '@/features/relationships/pages/RelationshipsPage';
import NetworkPage from '@/features/relationships/pages/NetworkPage';

// Worldbuilding
import WorldBuildingPage from '@/features/worldbuilding/pages/WorldBuildingPage';
import WorldEntityDetailPage from '@/features/worldbuilding/pages/WorldEntityDetailPage';
import NewWorldEntityPage from '@/features/worldbuilding/pages/NewWorldEntityPage';
import EditWorldEntityPage from '@/features/worldbuilding/pages/EditWorldEntityPage';

// Gameplay
import GameplayPage from '@/features/gameplay/pages/GameplayPage';
import GameplayDetailPage from '@/features/gameplay/pages/GameplayDetailPage';
import NewGameplayEntityPage from '@/features/gameplay/pages/NewGameplayEntityPage';
import EditGameplayEntityPage from '@/features/gameplay/pages/EditGameplayEntityPage';

// Export
import ExportPage from '@/features/export/pages/ExportPage';

// Maps
import MapsPage from '@/features/maps/pages/MapsPage';
import MapDetailPage from '@/features/maps/pages/MapDetailPage';
import NewMapPage from '@/features/maps/pages/NewMapPage';
import EditMapPage from '@/features/maps/pages/EditMapPage';

// Calendar
import CalendarPage from '@/features/calendar/pages/CalendarPage';

// Story
import StoryPage from '@/features/story/pages/StoryPage';
import StoryDetailPage from '@/features/story/pages/StoryDetailPage';
import ItemsPage from './features/items/pages/ItemsPage';
import NewItemPage from './features/items/pages/NewItemPage';
import EditItemPage from './features/items/pages/EditItemPage';
import ItemDetailPage from './features/items/pages/ItemDetailPage';
import NewStoryPage from '@/features/story/pages/NewStoryPage';
import EditStoryPage from '@/features/story/pages/EditStoryPage';

// Changelog
import ChangelogPage from '@/features/changelog/pages/ChangelogPage';

export default function App() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    runDatabaseMigration().then(() => {
      runLaunchMigration();
      document.documentElement.setAttribute('data-theme', settings.theme);
    });
  }, [settings.theme]);

  return (
    <>
      <GlobalSearch />
      <AppShell>
        <Routes>
          {/* Dashboard & Settings */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Items */}
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/new" element={<NewItemPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/items/:id/edit" element={<EditItemPage />} />

          {/* Characters */}
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/new" element={<NewCharacterPage />} />
          <Route path="/characters/relationships" element={<RelationshipsPage />} />
          <Route path="/characters/network" element={<NetworkPage />} />
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
          <Route path="/characters/:id/edit" element={<EditCharacterPage />} />

          {/* Worldbuilding */}
          <Route path="/worldbuilding" element={<WorldBuildingPage />} />
          <Route path="/worldbuilding/new" element={<NewWorldEntityPage />} />
          <Route path="/worldbuilding/:id/edit" element={<EditWorldEntityPage />} />
          <Route path="/worldbuilding/:id" element={<WorldEntityDetailPage />} />

          {/* Gameplay */}
          <Route path="/gameplay" element={<GameplayPage />} />
          <Route path="/gameplay/new" element={<NewGameplayEntityPage />} />
          <Route path="/gameplay/:id/edit" element={<EditGameplayEntityPage />} />
          <Route path="/gameplay/:id" element={<GameplayDetailPage />} />

          {/* Story */}
          <Route path="/story" element={<StoryPage />} />
          <Route path="/story/new" element={<NewStoryPage />} />
          <Route path="/story/:id" element={<StoryDetailPage />} />
          <Route path="/story/:id/edit" element={<EditStoryPage />} />
          
          <Route path="/calendar" element={<CalendarPage />} />
          
          {/* Export */}
          <Route path="/export" element={<ExportPage />} />

          {/* Maps */}
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/maps/new" element={<NewMapPage />} />
          <Route path="/maps/:id" element={<MapDetailPage />} />
          <Route path="/maps/:id/edit" element={<EditMapPage />} />

          {/* Changelog */}
          <Route path="/changelog" element={<ChangelogPage />} />

          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </>
  );
}
