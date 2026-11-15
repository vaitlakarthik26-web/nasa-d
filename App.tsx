/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useMemo, useState } from 'react';
import type { EquipmentItem, PageRoute, PlanetId } from './types/space';
import { EQUIPMENT_ITEMS } from './data/missionsData';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { PlanetaryArchivePage } from './components/PlanetaryArchivePage';
import { PlanetExplorationPage } from './components/PlanetExplorationPage';
import { EquipmentArchivePage } from './components/EquipmentArchivePage';
import { MissionTimelinePage } from './components/MissionTimelinePage';
import { AboutPage } from './components/AboutPage';
import { EquipmentInspectionModal } from './components/EquipmentInspectionModal';

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);
  const [route, setRoute] = useState<PageRoute>('home');
  const [startSurfaceOnOpen, setStartSurfaceOnOpen] = useState(false);
  const [focusEquipmentId, setFocusEquipmentId] = useState<string | null>(null);
  const [inspectedEquipment, setInspectedEquipment] = useState<EquipmentItem | null>(null);
  const [inspectedIds, setInspectedIds] = useState<Set<string>>(() => new Set());
  const [lowPerformance, setLowPerformance] = useState(false);

  const navigate = useCallback((nextRoute: PageRoute) => {
    setStartSurfaceOnOpen(false);
    setFocusEquipmentId(null);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectPlanet = useCallback((planet: PlanetId, startSurface = false) => {
    setStartSurfaceOnOpen(startSurface);
    setFocusEquipmentId(null);
    setRoute(planet === 'moon' ? 'moon' : 'mars');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInspectEquipment = useCallback((item: EquipmentItem) => {
    setInspectedEquipment(item);
    setInspectedIds((prev) => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
  }, []);

  const handleVisitSurfaceSite = useCallback((item: EquipmentItem) => {
    setStartSurfaceOnOpen(true);
    setFocusEquipmentId(item.id);
    setRoute(item.planet);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const moonEquipment = useMemo(
    () => EQUIPMENT_ITEMS.filter((e) => e.planet === 'moon'),
    [],
  );
  const marsEquipment = useMemo(
    () => EQUIPMENT_ITEMS.filter((e) => e.planet === 'mars'),
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#05050B] text-[#F5F7FA]">
      {!loadingDone && <LoadingScreen onComplete={() => setLoadingDone(true)} />}

      <Navbar currentRoute={route} onNavigate={navigate} />

      <main className="flex-1">
        {route === 'home' && (
          <HomePage
            onNavigate={navigate}
            onSelectPlanet={(p) => handleSelectPlanet(p, false)}
            onInspectEquipment={handleInspectEquipment}
            lowPerformance={lowPerformance}
          />
        )}

        {route === 'planetary-archive' && (
          <PlanetaryArchivePage
            onSelectPlanet={handleSelectPlanet}
            lowPerformance={lowPerformance}
          />
        )}

        {route === 'moon' && (
          <PlanetExplorationPage
            key={`moon-${startSurfaceOnOpen}-${focusEquipmentId ?? 'none'}`}
            planet="moon"
            equipmentList={moonEquipment}
            onInspectEquipment={handleInspectEquipment}
            inspectedIds={inspectedIds}
            onSwitchPlanet={(p) => handleSelectPlanet(p, false)}
            lowPerformance={lowPerformance}
            onToggleLowPerformance={() => setLowPerformance((v) => !v)}
            initialSurfaceMode={startSurfaceOnOpen}
            focusEquipmentId={focusEquipmentId}
          />
        )}

        {route === 'mars' && (
          <PlanetExplorationPage
            key={`mars-${startSurfaceOnOpen}-${focusEquipmentId ?? 'none'}`}
            planet="mars"
            equipmentList={marsEquipment}
            onInspectEquipment={handleInspectEquipment}
            inspectedIds={inspectedIds}
            onSwitchPlanet={(p) => handleSelectPlanet(p, false)}
            lowPerformance={lowPerformance}
            onToggleLowPerformance={() => setLowPerformance((v) => !v)}
            initialSurfaceMode={startSurfaceOnOpen}
            focusEquipmentId={focusEquipmentId}
          />
        )}

        {route === 'equipment' && (
          <EquipmentArchivePage
            onInspectEquipment={handleInspectEquipment}
            onVisitSurfaceSite={handleVisitSurfaceSite}
          />
        )}

        {route === 'timeline' && (
          <MissionTimelinePage onInspectEquipment={handleInspectEquipment} />
        )}

        {route === 'about' && <AboutPage onNavigate={navigate} />}
      </main>

      <Footer
        onNavigate={navigate}
        lowPerformance={lowPerformance}
        onToggleLowPerformance={() => setLowPerformance((v) => !v)}
      />

      <EquipmentInspectionModal
        equipment={inspectedEquipment}
        onClose={() => setInspectedEquipment(null)}
        onVisitSurfaceSite={handleVisitSurfaceSite}
        lowPerformance={lowPerformance}
      />
    </div>
  );
}
